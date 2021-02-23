/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { cards } from './routes/cards.js';
import { pageNotFound } from './routes/pageNotFound.js';
import { users } from './routes/users.js';
import { login, createUser } from './controllers/users.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6021555add1b183ce8df82ae',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', users);
app.use('/', cards);
app.use('/', pageNotFound);

app.listen(PORT, () => { // eslint-disable-next-line no-console
  console.log(`Server has been started on port ${PORT}...`);
});
