import { Module } from 'nest.js';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  components: [AuthService],
})
export class AuthModule { }
