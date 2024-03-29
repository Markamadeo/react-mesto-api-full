import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-named-as-default
// eslint-disable-next-line import/extensions
import UnauthorizedError from '../utils/errors/unauthorized-error.js';

export const auth = (req, res, next) => {
  const token = req.cookies.jwt;
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
