/* eslint-disable import/extensions */
import express from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers, getUser, editProfile, editAvatar, getUserInfo,
} from '../controllers/users.js';
import { linkRegExp } from '../utils/utils.js';

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
      avatar: Joi.string().custom((value, helpers) => {
        if (!linkRegExp.test(value)) {
          return helpers.message('Ссылка не прошла валидацию');
        }
        return value;
      }),
    }),
  }),
  editAvatar,
);

export default users;
