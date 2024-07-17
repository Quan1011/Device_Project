import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Access denied, no token provided.'));
  }

  try {
    const verified = jwt.verify(token, process.env.MONGO);
    req.user = verified;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      next(errorHandler(403, 'Access denied, admin only.'));
    }
  });
};
