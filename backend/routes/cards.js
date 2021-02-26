/* eslint-disable import/extensions */
import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards.js';
import { linkRegExp } from '../utils/utils.js';

export const cards = express.Router();

cards.get('/cards', getCards);
cards.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().custom((value, helpers) => {
        if (!linkRegExp.test(value)) {
          return helpers.message('Ссылка не прошла валидацию');
        }
        return value;
      }),
    }),
  }),
  postCard,
);
cards.delete(
  '/cards/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);
cards.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);
cards.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard,
);

export default cards;
