import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { createSession, deleteSession } from "../lib/auth";
import { LoginInput } from "../types";
import { prisma } from "../lib/db";
import { z } from "zod";
import { handleValidationError } from "../lib/helpers";
import { RabbitMQService } from "../services/queue.service";
import logger from "../services/logs.service";


const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn(`Login validation failed for email: ${req.body.email}`);
      res.status(400).json(handleValidationError(result));
      return;
    }

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

      await RabbitMQService.getInstance().publishUserCreated(user.id);
      logger.info(`New user created with email: ${email}`);
    } else {
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        logger.warn(`Invalid login attempt for email: ${email}`);
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
    }

    const token = await createSession(user.id);

    res.cookie("bofrot", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    logger.info(`User logged in with email: ${email}`);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error(`Login error for email: ${req.body.email} - ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (_req: Request, res: Response) => {
  deleteSession(res);
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { team: true }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        team: user.team
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};