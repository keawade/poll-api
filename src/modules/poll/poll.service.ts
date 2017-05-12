import { Component } from 'nest.js';

@Component()
export class PollService {
  public handlePoll() {
    return 'poll happens here';
  }
}
