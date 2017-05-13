import { Component } from 'nest.js';
import Poll from '../../models/Poll';

@Component()
export class PollService {
  public async getUsersPolls(username: string) {
    const allPolls = await Poll.find({ owner: username }).sort({ createdAt: -1 });
    console.log(allPolls);
  }

  public async getPollById(id: string) {
    const poll: any = await Poll.findOne({ _id: id });
    return {
      _id: poll._id,
      options: poll.options,
      owner: poll.owner,
      question: poll.question,
      responses: poll.responses,
      visibility: poll.visibility,
    } as IPoll;
  }

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
