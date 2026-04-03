import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

type AuthRequest = Request & { user?: any };

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default auth;