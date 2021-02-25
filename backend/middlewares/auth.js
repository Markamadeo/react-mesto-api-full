import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-named-as-default
// eslint-disable-next-line import/extensions
import UnauthorizedError from '../utils/errors/unauthorized-error.js';

export const auth = (req, res, next) => {
  // const { authorization } = req.headers;
  console.log(req.cookie);
  const { authorization } = req.cookie.jwt;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  if (!authorization) {
    const err = new UnauthorizedError('Необходима авторизация');
    next(err);
    return;
  }

  // const token = authorization.replace('Bearer ', '');
  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  next();
};

export default auth;
