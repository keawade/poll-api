import { Component } from 'nest.js';

@Component()
export class AuthService {
  public getUser(user) {
    return `stuff ${user}`;
  }
}
