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
import { AuthService } from '../auth/auth.service';
import { PollService } from './poll.service';

import * as jwt from 'jsonwebtoken';
import Poll from '../../models/Poll';

@Controller('poll')
export class PollController {
  constructor(private pollService: PollService, private authService: AuthService) { }

  @Get()
  public async getAllPolls(
    @Request() req,
    @Response() res,
  ) {
    const polls = await this.pollService.getUsersPolls(req.user.username);
    return res
      .status(HttpStatus.OK)
      .json(polls);
  }

  @Get(':id')
  public async getPollById(
    @Param('id') id,
    @Response() res,
  ) {
    const poll = await this.pollService.getPollById(id);
    return res
      .status(HttpStatus.OK)
      .json(poll);
  }

  @Post()
  public async createPoll(
    @Body('question') question: string,
    @Body('options') options: string[],
    @Body('visibility') visibility: 'private' | 'public' = 'public',
    @Request() req,
    @Response() res,
  ) {
    if (!question || !options || options.length < 2) {
      throw new HttpException('Incomplete parameters', HttpStatus.BAD_REQUEST);
    }

    const pollData = {
      owner: req.user.username,
      question,
      options,
      responses: [],
      visibility,
    };

    const poll = await this.pollService.createPoll(pollData);

    return res
      .status(HttpStatus.CREATED)
      .json(poll);
  }
}
