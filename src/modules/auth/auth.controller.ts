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
import * as jwt from 'jsonwebtoken';
import User from '../../models/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public registerUser(
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

      const newUser = new User({ username, displayname, password });
      newUser.save((err, savedUser: IUser) => {
        if (err) {
          if (err.message === 'user exists') {
            console.error(`[auth] failed to create user, '${username}' already exists`);
            return res
              .status(HttpStatus.CONFLICT)
              .json({ error: 'User already exists' });
          }
          console.error(`[auth] failed to create user, '${username}'`, err);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to create user' });
        }
        console.log(`[auth] successfully created user, '${savedUser.username}'`);
        const token = jwt.sign({
          _id: savedUser._id,
          username: savedUser.username,
        }, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
        return res
          .status(HttpStatus.CREATED)
          .json({
            displayname: savedUser.displayname,
            username: savedUser.username,
            token,
          });
      });
    } catch (err) {
      console.error('[auth] register - internal error', err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create user' });
    }
  }

  @Post('login')
  public authUser(
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

      User.findOne({ username }, (err, user: IUser) => {
        if (err) {
          console.error(`[auth] failed to login`, err);
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ error: 'Unauthorized' });
        }

        if (!user) {
          console.error(`[auth] failed to login, user does not exist`);
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ error: 'Unauthorized' });
        }

        if (bcrypt.compareSync(password, user.password)) {
          console.info(`[auth] user '${user.username}' logged in`);
          const token = jwt.sign({
            _id: user._id,
            username: user.username,
          }, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
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
      });
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
