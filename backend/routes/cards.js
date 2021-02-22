/* eslint-disable import/extensions */
import express from 'express';
import {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards.js';

export const cards = express.Router();

cards.get('/cards', getCards);
cards.post('/cards', postCard);
cards.delete('/cards/:id', deleteCard);
cards.put('/cards/:cardId/likes', likeCard);
cards.delete('/cards/:cardId/likes', dislikeCard);

export default cards;
