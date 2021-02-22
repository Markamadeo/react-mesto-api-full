import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(avatar) {
        // eslint-disable-next-line no-useless-escape
        return /^(https?:\/\/)([\w\-\.]+)\.([a-z]{2,6}\.?)(\/[\w\W]*)*\/?$/.test(
          avatar,
        );
      },
      message: 'С вашей ссылкой что-то не так...',
    },
  },
});

const User = mongoose.model('user', userSchema);
export default User;
