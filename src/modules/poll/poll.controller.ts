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
import { AuthService } from '../auth/auth.service';
import { PollService } from './poll.service';

import * as jwt from 'jsonwebtoken';
import Poll from '../../models/Poll';

@Controller('poll')
export class PollController {
  constructor(private pollService: PollService, private authService: AuthService) { }

  @Get()
  public async getAllPolls(
    @Headers('token') token: string,
    @Response() res,
  ) {
    return res
      .status(HttpStatus.OK)
      .json('stuff');
  }

  @Post()
  public async createPoll(
    @Body('question') question: string,
    @Body('options') options: string[],
    @Body('visibility') visibility: 'private' | 'public' = 'public',
    @Headers('token') token: string,
    @Response() res,
  ) {
    try {
      let decoded;
      try {
        decoded = jwt.verify(token, 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb');
      } catch (err) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }

      const user = await this.authService.getUser(decoded.username);
      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }

      const pollData = {
        owner: decoded.username,
        question,
        options,
        responses: [],
        visibility,
      };

      const poll = await this.pollService.createPoll(pollData);

      if (!poll) {
        throw new Error('Failed to create poll');
      }

      return res
        .status(HttpStatus.CREATED)
        .json(poll);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err });
    }
  }
}
