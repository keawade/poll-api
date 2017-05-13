import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    displayname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }, {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  User.find({ username: this.username }, (err, docs) => {
    if (!docs.length) {
      next();
    } else {
      next(new Error('user exists'));
    }
  })
})

const User = mongoose.model('user', userSchema);

export default User;
