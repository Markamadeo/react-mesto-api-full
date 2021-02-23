/* eslint-disable import/extensions */
import express from 'express';

import {
  getUsers, getUser, editProfile, editAvatar, getUserInfo
} from '../controllers/users.js';

export const users = express.Router();

users.get('/users', getUsers);
users.get('/users/me/', getUserInfo);
users.get('/users/:id', getUser);
users.patch('/users/me', editProfile);
users.patch('/users/me/avatar', editAvatar);

export default users;
