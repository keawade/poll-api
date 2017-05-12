import { Component } from 'nest.js';

@Component()
export class AuthService {
  public handleAuth() {
    return 'auth happens here';
  }
}
