import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError, AuthRequest } from '../types';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();

  } catch (error) {
    
    next(new AppError(401, 'Invalid or expired token'));
  }
};