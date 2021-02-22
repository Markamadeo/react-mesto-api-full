/* eslint-disable import/extensions */
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
  const { email, password, name, about, avatar } = req.body;
  User.create({ email, password, name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (checkRequestToNull(req.body)) {
        res.status(NOT_FOUND_ERR).send(errMessage(NOT_FOUND_ERR));
        return;
      }
      res.status(BAD_REQUEST_ERR).send(errMessage(BAD_REQUEST_ERR, err));
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
