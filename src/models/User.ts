import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: String,
  displayName: String,
})

userSchema.pre('save', function (next) {
  User.find({ userName: this.userName }, (err, docs) => {
    if (!docs.length) {
      next();
    } else {
      console.error(`[UserModel] user '${this.userName}' already exists`);
      next (new Error('user exists'));
    }
  })
})

const User = mongoose.model('user', userSchema);

export default User;
