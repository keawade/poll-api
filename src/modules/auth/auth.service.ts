import * as jwt from 'jsonwebtoken';
import { Component, HttpException } from 'nest.js';
import User from '../../models/User';

@Component()
export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb';

  public async getUser(username: string, password: boolean = false) {
    try {
      const user: any = await User.findOne({ username }, `username displayname${password ? ' password' : ''}`);
      if (!user) {
        throw new HttpException('User does not exist', 404);
      }
      return user as IUser;
    } catch (err) {
      throw new HttpException('User does not exist', 404);
    }
  }

  public async createUser(user: IUser) {
    try {
      await new User(user).save();
      return await this.getUser(user.username);
    } catch (err) {
      throw new HttpException('Failed to create user', 500);
    }
  }

  public async createToken(user: IUser) {
    try {
      return jwt.sign({
        id: user._id,
        username: user.username,
      }, this.jwtSecret, { expiresIn: '2 days' });
    } catch (err) {
      throw new HttpException('Failed to create token', 500);
    }
  }

  public async validateToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { maxAge: '2 days' });
      const user = await this.getUser(decoded.username);
      if (!user) {
        throw new HttpException('User does not exist', 403);
      }
      return user;
    } catch (err) {
      throw new HttpException('Unauthorized', 401);
    }
  }
}
