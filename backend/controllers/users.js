/* eslint-disable import/extensions */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import BadRequestError from '../utils/errors/bad-request-error.js';
import ConflictError from '../utils/errors/conflict-error.js';
import NotFoundError from '../utils/errors/not-found-error.js';

import checkRequestToNull from '../utils/utils.js';

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

export const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const createUser = (req, res, next) => {
  User.init()
    .then(() => {
      if (checkRequestToNull(req.body)) {
        throw new BadRequestError('Тело запроса не может быть пустым');
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          if (!hash) {
            throw new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя');
          }
          User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
          })
            .then((user) => {
              if (!user) {
                throw new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя');
              }
              res.send({
                data: {
                  email: user.email,
                  name: user.name,
                  about: user.about,
                  avatar: user.avatar,
                },
              });
            })
            .catch((err) => {
              if (err.code === '11000') {
                throw new ConflictError('Такой email уже используеться');
              }
              next(err);
            });
        })
        .catch(next);
    })
    .catch(next);
};

export const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (checkRequestToNull(user)) {
        throw new NotFoundError('Карточка или пользователь не найдены');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const editProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (!name && !about) {
    next(new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя'));
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

export const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        domain: 'markamadeo.students.nomoreparties.space',
        sameSite: 'none',
        secure: true,
      }).send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

export const logout = (req, res) => {
  res.cookie('jwt', 'deleted', {
    maxAge: 100,
    httpOnly: true,
    domain: 'markamadeo.students.nomoreparties.space',
    sameSite: 'none',
    secure: true,
  }).send({ message: 'Выход успешно выполнен' });
};
