/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi, errors } from 'celebrate';
import { cards } from './routes/cards.js';
import { pageNotFound } from './routes/pageNotFound.js';
import { users } from './routes/users.js';
import { login, createUser } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://markamadeo.students.nomoreparties.space');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(express.json());
app.use(requestLogger);
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

app.use(
  '/',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  auth,
  users,
);
app.use(
  '/',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  auth,
  cards,
);
app.use(
  '/',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  auth,
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
