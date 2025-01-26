import { Request, Response } from "express";
import * as dotenv from "dotenv";
import app from "./app";
import { validateEnv } from "./lib/validateEnv";
import { connectDB } from "./lib/db";

dotenv.config();

validateEnv();

const port = process.env.PORT || 8000;

async function startServer() {
  await connectDB();

  app.get("/health", (req: Request, res: Response) => {
    res.send({ system: "OK" });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
