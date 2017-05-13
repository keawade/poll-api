import { MiddlewaresConsumer, Module } from 'nest.js';

import {AuthMiddleware} from '../auth/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  components: [PollService, AuthService],
  controllers: [PollController],
})
export class PollModule {
  private configure(consumer: MiddlewaresConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PollController);
  }
}
