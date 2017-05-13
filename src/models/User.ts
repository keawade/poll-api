import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    displayname: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    username: {
      index: {
        unique: true,
      },
      match: /^[a-zA-Z0-9-_]{3,}$/,
      required: true,
      type: String,
    },
  }, {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  User.find({ username: this.username }, (err, docs) => {
    if (!docs.length) {
      next();
    } else {
      next(new Error('user exists'));
    }
  });
});

const User = mongoose.model('user', userSchema);

export default User;
