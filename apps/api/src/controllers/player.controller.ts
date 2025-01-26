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
