import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import playerRoutes from "./routes/player.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();
const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
      ? process.env.CLIENT_URL 
      : "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };


const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/user", userRoutes);

export default app;
