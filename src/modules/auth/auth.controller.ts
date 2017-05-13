import { Controller, Get, Post, Response, Request, Body, Headers, Param, HttpStatus } from 'nest.js';
import { AuthService } from './auth.service';
import User from '../../models/User';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public registerUser( @Response() res, @Request() req, @Body('username') username, @Body('displayname') displayname, @Body('password') password) {
    try {
      if (!username || !displayname || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User object not valid.' });
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
              .json({ error: 'User already exists' })
          }
          console.error(`[auth] failed to create user, '${username}'`, err);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to create user' })
        }
        console.log(`[auth] successfully created user, '${savedUser.username}'`);
        const token = jwt.sign({ username: savedUser.username, _id: savedUser._id }, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
        return res
          .status(HttpStatus.CREATED)
          .json({
            username: savedUser.username,
            displayname: savedUser.displayname,
            token
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
  public authUser( @Response() res, @Body('username') username, @Body('password') password) {
    try {
      if (!username || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'User object not valid' });
      }

      User.findOne({ username: username }, (err, user: IUser) => {
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
          const token = jwt.sign({ username: user.username, _id: user._id }, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
          return res
            .status(HttpStatus.OK)
            .json({
              username: user.username,
              displayname: user.displayname,
              token
            });
        } else {
          console.warn(`[auth] user '${user.username}' failed to authenticate`);
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ error: 'Unauthorized' });
        }
      })
    } catch (err) {
      console.error('[auth] login - internal error', err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to login' });
    }
  }

  @Post(':user')
  public updateUser( @Response() res, @Headers('token') token, @Param('user') user, @Body() body) {
    // This will update user's modifiable properties
    return res
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      .json({ error: 'Not yet implemented' });
  }
}
