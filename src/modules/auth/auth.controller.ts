import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
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
        throw new HttpException('Incomplete parameters', HttpStatus.BAD_REQUEST);
      }

      if (!username.match(/^[\w-]{3,}$/)) {
        throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
      }

      if (await this.authService.getUser(username)) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      if (
        !(password.length > 8) ||
        !password.match(new RegExp(/[a-z]/, 'g')) ||
        !password.match(new RegExp(/[A-Z]/, 'g')) ||
        !password.match(new RegExp(/[0-9]/, 'g'))
      ) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }

      // Encrypt password
      password = bcrypt.hashSync(password, 10);

      const createdUser = await this.authService.createUser({
        displayname,
        password,
        username,
      });

      const token = await this.authService.createToken(createdUser);

      return res.status(HttpStatus.CREATED).json({
        displayname: createdUser.displayname,
        username: createdUser.username,
        token,
      });

    } catch (err) {
      console.error('[auth] register - internal error', err);
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
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
        throw new HttpException('Incomplete parameters', HttpStatus.BAD_REQUEST);
      }

      const user = await this.authService.getUser(username, true);
      if (!user) {
        console.error(`[auth] failed to login`);
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      if (bcrypt.compareSync(password, user.password)) {
        console.info(`[auth] user '${user.username}' logged in`);

        const token = await this.authService.createToken(user);
        if (!token) {
          throw new Error('Failed to generate token');
        }

        return res.status(HttpStatus.OK).json({
          displayname: user.displayname,
          username: user.username,
          token,
        });
      }
      console.warn(`[auth] user '${user.username}' failed to authenticate`);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } catch (err) {
      console.error('[auth] login - internal error', err);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
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
    throw new HttpException('Not yet implemented', HttpStatus.METHOD_NOT_ALLOWED);
  }
}
