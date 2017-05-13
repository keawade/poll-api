import { Component } from 'nest.js';
import Poll from '../../models/Poll';

@Component()
export class PollService {
  public async createPoll(poll: IPoll) {
    try {
      const newPoll: any = await new Poll(poll).save();
      return {
        options: newPoll.options,
        owner: newPoll.owner,
        question: newPoll.question,
        visibility: newPoll.visibility,
      } as IPoll;
    } catch (err) {
      return null;
    }
  }
}
