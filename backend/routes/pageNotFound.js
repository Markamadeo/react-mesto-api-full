import express from 'express';

export const pageNotFound = express.Router();

pageNotFound.get('/', (req, res) => {
  res.status(200).send({ message: 'главная страница' });
});

pageNotFound.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

export default pageNotFound;
