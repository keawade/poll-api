import * as mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    owner: {
      required: true,
      type: String,
    },
    question: {
      required: true,
      type: String,
    },
    responseOptions: {
      required: true,
      type: [String],
    },
    responses: [{
      response: {
        required: true,
        type: String,
      },
      username: {
        required: true,
        type: String,
      },
    }],
    visibility: {
      enum: ['private', 'public'],
      lowercase: true,
      required: true,
      type: String,
    },
  }, {
    timestamps: true,
  },
);

const Poll = mongoose.model('poll', pollSchema);

export default Poll;
