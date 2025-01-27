import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const getUserTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const team = await prisma.team.findUnique({
      where: { userId },
      include: {
        players: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    res.status(200).json(team.players);
  } catch (error) {
    console.error("Error fetching user team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
