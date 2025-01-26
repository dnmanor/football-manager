import { Request, Response, NextFunction } from "express";
import { verifySession } from "../lib/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.bofrot;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  req.userId = session.userId;
  next();
}
