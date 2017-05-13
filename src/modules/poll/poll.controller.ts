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
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
  constructor(private pollService: PollService) { }

  @Get()
  public testResponse( @Response() res) {
    try {
      res.status(HttpStatus.OK).json('It worked!');
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    }
  }
}
