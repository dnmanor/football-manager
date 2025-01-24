import { Request, Response, NextFunction } from 'express';
import { verifySession } from '../lib/auth';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  req.userId = session.userId;
  next();
} 