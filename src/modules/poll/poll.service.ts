import { Component, HttpException, HttpStatus } from 'nest.js';
import Poll from '../../models/Poll';

@Component()
export class PollService {
  public async getUsersPolls(username: string) {
    const allPolls: any[] = await Poll.find(
      { owner: username },
      '_id responseOptions owner question responses visiblity createdAt',
    ).sort({ createdAt: -1 });
    if (!allPolls) {
      return [];
    }
    return allPolls as IPoll[];
  }

  public async getPollById(id: string, username?: string) {
    const poll: any = await Poll.findOne(
      { _id: id },
      `_id responseOptions owner question responses visiblity createdAt`,
    );
    if (!poll) {
      throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);
    }

    // if (username !== poll.owner) {
    //   poll.responses = [];
    // }

    return poll as IPoll;
  }

  public async createPoll(poll: IPoll) {
    try {
      const newPoll = await new Poll(poll).save();
      return await this.getPollById(newPoll._id, poll.owner);
    } catch (err) {
      throw new HttpException('Failed to create poll', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async respondToPoll(id: string, response: string, username: string) {
    try {
      console.info(`[poll] user '${username}' responding to poll '${id}' with '${response}'`);
      const poll = await this.getPollById(id, username);

      if (!poll) {
        throw new HttpException('Poll not found', HttpStatus.NOT_FOUND);
      }

      if (poll.responseOptions.indexOf(response) === -1) {
        throw new HttpException('Invalid parameter', HttpStatus.BAD_REQUEST);
      }

      const position = poll.responses.map((res) => (res.username)).indexOf(username);
      if (position > -1) {
        poll.responses.splice(position, 1);
      }

      poll.responses.push({
        response,
        username,
      });

      await Poll.findOneAndUpdate({ _id: poll._id }, poll);
      return;
    } catch (err) {
      console.error('respondToPoll failed', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
