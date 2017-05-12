import { Module } from 'nest.js';
import { AuthModule } from './auth/auth.module';

@Module({
  modules: [AuthModule],
})
export class ApplicationModule { }
