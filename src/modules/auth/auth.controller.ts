import { Controller, Get, Post, Response, Request, Body, Param, HttpStatus } from 'nest.js';
import { AuthService } from './auth.service';
import User from '../../models/User';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public registerUser( @Response() res, @Request() req, @Body('user') user) {
    try {
      if (!user || !user.userName || !user.displayName) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User object not valid.' });
      }

      const newUser = new User({
        userName: user.userName,
        displayName: user.displayName,
      });
      newUser.save((err, savedUser: any) => {
        if (err) {
          if (err.message == 'user exists') {
            console.error(`[auth] failed to create user, '${user.userName}' already exists`);
            return res.status(HttpStatus.CONFLICT).json({ error: 'User already exists' })
          }
          console.error(`[auth] failed to create user, '${user.userName}'`);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create user' })
        }
        console.log(`[auth] successfully created user, '${savedUser.userName}'`);
        const token = jwt.sign({ userName: savedUser.userName, _id: user._id }, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
        return res.status(HttpStatus.CREATED).json({ userName: savedUser.userName, displayName: savedUser.displayName, token });
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create user' })
    }
  }
}
