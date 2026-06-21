import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  ARCJET_ENV,
  ARCJET_KEY,
  COMPANY_NAME,
  FOUNDER,
  CO_FOUNDER,
  FRONTEND_URL,
  CLOUD_NAME,
CLOUD_API_KEY,
CLOUD_API_SECRET,
  ENCODE_PASS,
} = process.env;
