import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string().min(6),
  PORT: z.string().transform(Number).optional().default("8000"),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Missing or error with env vars:", result.error.format());
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
  return result.data;
} 