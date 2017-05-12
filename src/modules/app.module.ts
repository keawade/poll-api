import { Module } from 'nest.js';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';

@Module({
  modules: [AuthModule, PollModule],
})
export class ApplicationModule { }
