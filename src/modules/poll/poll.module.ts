import { Module } from 'nest.js';

import { AuthService } from '../auth/auth.service';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  components: [PollService, AuthService],
  controllers: [PollController],
})
export class PollModule { }
