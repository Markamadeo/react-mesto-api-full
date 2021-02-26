/* eslint-disable import/extensions */
import Card from '../models/card.js';
import BadRequestError from '../utils/errors/bad-request-error.js';
import ForbiddenError from '../utils/errors/forbidden-error.js';
import NotFoundError from '../utils/errors/not-found-error.js';
import checkRequestToNull from '../utils/utils.js';

export const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!name && !link && owner) {
    next(new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя'));
    return;
  }

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (checkRequestToNull(card)) {
        throw new NotFoundError('Карточка или пользователь не найден');
      }

      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Не хватает прав для удаления чужой карточки');
      }
      Card.findByIdAndRemove(req.params.id)
        .then((deletedCard) => {
          res.send({ data: deletedCard });
        })
        .catch(next);
    })
    .catch(next);
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (checkRequestToNull(card)) {
        throw new NotFoundError('Карточка или пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (checkRequestToNull(card)) {
        throw new NotFoundError('Карточка или пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch(next);
};
