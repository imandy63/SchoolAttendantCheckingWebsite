import * as dotenv from "dotenv";
dotenv.config();

export const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI,
  HOST: process.env.MONGODB_HOST,
  PORT: process.env.MONGODB_PORT,
  DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
};
