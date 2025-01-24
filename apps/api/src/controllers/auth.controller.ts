import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { createSession, deleteSession } from "../lib/auth";
import { LoginInput } from "../types";
import prisma from "../client";

export async function login(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body as LoginInput;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const hashedPassword = await hash(password, 12);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
        },
      });
    } else {
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }

    const token = await createSession(user.id);


    res.cookie("bofrot", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function logout(_req: Request, res: Response) {
  deleteSession(res);
  return res.json({ message: "Logged out successfully" });
}
