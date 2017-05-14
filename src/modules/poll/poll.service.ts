import { Component, HttpException } from 'nest.js';
import Poll from '../../models/Poll';

@Component()
export class PollService {
  public async getUsersPolls(username: string) {
    const allPolls: any[] = await Poll.find(
      { owner: username },
      '_id options owner question responses visiblity createdAt',
    ).sort({ createdAt: -1 });
    if (!allPolls) {
      return [];
    }
    return allPolls as IPoll[];
  }

  public async getPollById(id: string) {
    const poll: any = await Poll.findOne({ _id: id }, '_id options owner question responses visiblity createdAt');
    if (!poll) {
      throw new HttpException('Poll not found', 404);
    }
    return poll as IPoll;
  }

  public async createPoll(poll: IPoll) {
    try {
      const newPoll = await new Poll(poll).save();
      return await this.getPollById(newPoll._id);
    } catch (err) {
      throw new HttpException('Failed to create poll', 500);
    }
  }
}
