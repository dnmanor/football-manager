import { Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY!;
if (!secretKey) {
  throw new Error("JWT_SECRET_KEY is not set");
}

export async function createSession(userId: string): Promise<string> {
  return jwt.sign({ userId }, secretKey, { expiresIn: "24h" });
}

export function verifySession(token: string) {
  try {
    return jwt.verify(token, secretKey) as { userId: string };
  } catch (err) {
    return null;
  }
}

export function deleteSession(res: Response) {
  res.clearCookie("bofrot");
}
