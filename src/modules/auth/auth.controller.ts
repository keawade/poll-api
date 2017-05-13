import { Controller, Get, Post, Response, Request, Body, Param, HttpStatus } from 'nest.js';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public registerUser( @Response() res, @Request() req, @Body('user') user) {
    try {
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'No user provided.' });
      }
      console.log(`[auth.controller] POST /auth/register`, user);
      return res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err })
    }
  }
}
