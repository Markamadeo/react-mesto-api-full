import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(avatar) {
        // eslint-disable-next-line no-useless-escape
        return /^(https?:\/\/)([\w\-\.]+)\.([a-z]{2,6}\.?)(\/[\w\W]*)*\/?$/.test(avatar);
      },
      message: 'С вашей ссылкой что-то не так...',
    },
  },
});

const User = mongoose.model('user', userSchema);
export default User;
