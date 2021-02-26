/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { celebrate, Joi, errors } from 'celebrate';
import { cards } from './routes/cards.js';
import { pageNotFound } from './routes/pageNotFound.js';
import { users } from './routes/users.js';
import { login, createUser, logout } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const options = {
  origin: [
    'http://localhost:3000',
    'https://markamadeo.students.nomoreparties.space',
    'https://www.markamadeo.students.nomoreparties.space',
  ],
  methods: [
    'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('*', cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.get(
  '/logout',
  logout,
);

app.use(
  '/',
  auth,
  users,
  cards,
  pageNotFound,
);

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${message}`
        : message,
    });
});

app.listen(PORT, () => { // eslint-disable-next-line no-console
  console.log(`Server has been started on port ${PORT}...`);
});
