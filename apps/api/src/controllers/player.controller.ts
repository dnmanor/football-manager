import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { z } from "zod";
import { handleValidationError } from "../lib/helpers";

const updatePlayerSchema = z
  .object({
    available_for_transfer: z.boolean().optional(),
    name: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    position: z
      .enum(["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"])
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const updatePlayerRecord = async (req: Request, res: Response) => {
  try {
    const playerId = req.params.id;
    if (!playerId) {
      res.status(400).json({ error: "Invalid player ID" });
      return;
    }

    const result = updatePlayerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json(handleValidationError(result));
      return;
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: result.data,
    });

    res.status(200).json(updatedPlayer);
    return;
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const purchasePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = req.params.id;
    if (!playerId) {
      res.status(400).json({ error: "Invalid player ID" });
      return;
    }

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { team: true },
    });

    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    if (!player.available_for_transfer) {
      res.status(400).json({ error: "Player is not available for transfer" });
      return;
    }

    if (player.teamId) {
      const sellerTeam = await prisma.team.findUnique({
        where: { id: player.teamId },
        include: { players: true },
      });

      if (sellerTeam && sellerTeam.players.length <= 15) {
        res
          .status(400)
          .json({ error: "Selling team cannot have less than 15 players" });
        return;
      }
    }

    const buyerTeam = await prisma.team.findFirst({
      where: { userId: req.userId },
      include: { players: true },
    });

    if (!buyerTeam) {
      res.status(404).json({ error: "Buyer team not found" });
      return;
    }

    if (buyerTeam.players.length >= 25) {
      res
        .status(400)
        .json({ error: "Team already has maximum number of players" });
      return;
    }

    const purchasePrice = player.price * 0.95;

    if (buyerTeam.budget < purchasePrice) {
      res.status(400).json({ error: "Insufficient funds" });
      return;
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Update player ownership
      const updatedPlayer = await tx.player.update({
        where: { id: playerId },
        data: {
          teamId: buyerTeam.id,
          available_for_transfer: false,
        },
      });

      // Update buyer's team budget
      await tx.team.update({
        where: { id: buyerTeam.id },
        data: {
          budget: { decrement: purchasePrice },
        },
      });

      // Update seller's team budget
      if (player.teamId) {
        await tx.team.update({
          where: { id: player.teamId },
          data: {
            budget: { increment: purchasePrice },
          },
        });
      }

      await tx.transaction.create({
        data: {
          type: "BUY",
          amount: purchasePrice,
          userId: req.userId!,
          teamId: buyerTeam.id,
          playerId: playerId,
        },
      });

      return updatedPlayer;
    });

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error purchasing player:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
