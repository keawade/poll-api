import * as jwt from 'jsonwebtoken';
import { Component, HttpException, HttpStatus } from 'nest.js';
import User from '../../models/User';

@Component()
export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb';

  public async getUser(username: string, password: boolean = false) {
    try {
      const user: any = await User.findOne({ username }, `username displayname${password ? ' password' : ''}`);
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }
      return user as IUser;
    } catch (err) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
  }

  public async createUser(user: IUser) {
    try {
      await new User(user).save();
      return await this.getUser(user.username);
    } catch (err) {
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createToken(user: IUser) {
    try {
      return jwt.sign({
        id: user._id,
        username: user.username,
      }, this.jwtSecret, { expiresIn: '2 days' });
    } catch (err) {
      throw new HttpException('Failed to create token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async validateToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { maxAge: '2 days' });
      const user = await this.getUser(decoded.username);
      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.FORBIDDEN);
      }
      return user;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
