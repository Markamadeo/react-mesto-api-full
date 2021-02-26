/* eslint-disable import/extensions */
import express from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers, getUser, editProfile, editAvatar, getUserInfo,
} from '../controllers/users.js';

export const users = express.Router();

users.get('/users', getUsers);
users.get('/users/me/', getUserInfo);
users.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);
users.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  editProfile,
);
users.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  editAvatar,
);

export default users;
