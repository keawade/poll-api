import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Request,
  Response,
} from 'nest.js';
import { AuthService } from './auth.service';

import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public async registerUser(
    @Response() res,
    @Request() req,
    @Body('username') username: string,
    @Body('displayname') displayname: string,
    @Body('password') password: string,
  ) {
    try {
      if (!username || !displayname || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'User object not valid' });
      }

      if (!username.match(/^[\w-]{3,}$/)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Username invalid' });
      }

      if (await this.authService.getUser(username)) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ error: 'User already exists' });
      }

      if (
        !(password.length > 8) ||
        !password.match(new RegExp(/[a-z]/, 'g')) ||
        !password.match(new RegExp(/[A-Z]/, 'g')) ||
        !password.match(new RegExp(/[0-9]/, 'g'))
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Password to simple' });
      }

      // Encrypt password
      password = bcrypt.hashSync(password, 10);

      const createdUser = await this.authService.createUser({
        displayname,
        password,
        username,
      });

      if (!createdUser) {
        throw new Error();
      }

      const token = await this.authService.createToken(createdUser);

      return res
        .status(HttpStatus.CREATED)
        .json({
          displayname: createdUser.displayname,
          username: createdUser.username,
          token,
        });

    } catch (err) {
      console.error('[auth] register - internal error', err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create user' });
    }
  }

  @Post('login')
  public async authUser(
    @Response() res,
    @Body('username') username,
    @Body('password') password,
  ) {
    try {
      if (!username || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'User object not valid' });
      }

      const user = await this.authService.getUser(username);
      if (!user) {
        console.error(`[auth] failed to login`);
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        console.info(`[auth] user '${user.username}' logged in`);

        const token = await this.authService.createToken(user);
        if (!token) {
          throw new Error('Failed to generate token');
        }

        return res
          .status(HttpStatus.OK)
          .json({
            displayname: user.displayname,
            username: user.username,
            token,
          });
      } else {
        console.warn(`[auth] user '${user.username}' failed to authenticate`);
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }
    } catch (err) {
      console.error('[auth] login - internal error', err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to login' });
    }
  }

  @Post(':user')
  public updateUser(
    @Response() res,
    @Headers('token') token,
    @Param('user') user,
    @Body() body,
  ) {
    // This will update user's modifiable properties
    return res
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      .json({ error: 'Not yet implemented' });
  }
}
