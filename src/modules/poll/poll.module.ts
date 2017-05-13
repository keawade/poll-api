import { Module } from 'nest.js';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  components: [PollService],
  controllers: [PollController],
})
export class PollModule { }
