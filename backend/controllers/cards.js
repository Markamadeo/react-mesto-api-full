/* eslint-disable import/extensions */
import Card from '../models/card.js';
import {
  BAD_REQUEST_ERR, NOT_FOUND_ERR, INTERNAL_SERVER_ERR, checkResponseToNull, errMessage,
} from '../utils/utils.js';

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER_ERR).send(errMessage(INTERNAL_SERVER_ERR, err)));
};

export const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (checkResponseToNull(req.body)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR));
        return;
      }
      res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err));
    });
};

export const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (checkResponseToNull(card)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR, card));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err));
    });
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (checkResponseToNull(card)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR, card));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err)));
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (checkResponseToNull(card)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR, card));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err)));
};
