import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
    NODE_ENV : z.enum(["development", "production", "test"]).default("development"),
    PORT : z.string().default("3000"),
    MONGODB_URI : z.string(),
    JWT_SECRET : z.string().min(32, "JWT_SECRET must be at least 10 characters long"),
    JWT_EXPIRES_IN : z.string().default("7d"),
});  

// Parse and validate the environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        console.error("❌ Invalid environment variables:", error);
        process.exit(1);
    }
};

export const env: {
  NODE_ENV: string;
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
} = parseEnv();