import express from 'express';
// eslint-disable-next-line import/extensions
import NotFoundError from '../utils/errors/not-found-error.js';

export const pageNotFound = express.Router();

// pageNotFound.get('/', (req, res) => {
//   res.status(200).send({ message: 'главная страница' });
// });

pageNotFound.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default pageNotFound;
