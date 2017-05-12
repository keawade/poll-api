import { Module } from 'nest.js';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  controllers: [PollController],
  components: [PollService],
})
export class PollModule { }
