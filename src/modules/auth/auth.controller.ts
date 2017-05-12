import { Controller, Get, Post, Response, Param, HttpStatus } from 'nest.js';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get()
  public testResponse( @Response() res) {
    try {
      res.status(HttpStatus.OK).json('It worked!');
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err })
    }
  }
}
