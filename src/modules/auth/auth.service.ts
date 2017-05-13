import * as jwt from 'jsonwebtoken';
import { Component } from 'nest.js';
import User from '../../models/User';

@Component()
export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'asldfkjasldfjaslkdjfalksgjhoiuqfbhdnvijknb';

  public async getUser(username: string) {
    try {
      const doc: any = await User.findOne({ username });
      if (!doc) {
        throw new Error('User does not exist');
      }
      return {
        displayname: doc.displayname,
        password: doc.password,
        username: doc.username,
      } as IUser;
    } catch (err) {
      return null;
    }
  }

  public async createUser(user: IUser) {
    try {
      console.log('create');
      const newUser: any = await new User(user).save();
      return {
        displayname: newUser.displayname,
        password: newUser.password,
        username: newUser.username,
      } as IUser;
    } catch (err) {
      return null;
    }
  }

  public async createToken(user: IUser) {
    try {
      return jwt.sign({
        id: user._id,
        username: user.username,
      }, this.jwtSecret, { expiresIn: '2 days' });
    } catch (err) {
      return null;
    }
  }

  public async validateToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { maxAge: '2 days' });
      const user = await this.getUser(decoded.username);
      if (!user) {
        throw new Error('User does not exist');
      }
      return user;
    } catch (err) {
      return null;
    }
  }
}
