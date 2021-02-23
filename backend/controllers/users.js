/* eslint-disable import/extensions */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  BAD_REQUEST_ERR, NOT_FOUND_ERR, INTERNAL_SERVER_ERR, checkRequestToNull, errMessage,
} from '../utils/utils.js';

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERR).send(errMessage(INTERNAL_SERVER_ERR, err)));
};

export const createUser = (req, res) => {
  User.init()
    .then(() => {
      if (checkRequestToNull(req.body)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR));
        return;
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
          })
            .then((user) => {
              res.send({ data: user });
            })
            .catch((error) => res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, error)));
        })
        .catch((error) => res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, error)));
    });
};

export const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (checkRequestToNull(user)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR));
        return;
      }
      res.send({ data: user });
    })
    .catch(() => res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR)));
};

export const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err)));
};

export const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(INTERNAL_SERVER_ERR).send(errMessage(INTERNAL_SERVER_ERR, err)));
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
