import { Module } from 'nest.js';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  components: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
