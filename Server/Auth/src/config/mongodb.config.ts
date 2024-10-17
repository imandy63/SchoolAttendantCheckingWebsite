import * as dotenv from "dotenv";
dotenv.config();

export const MONGODB_CONFIG = {
  URI: process.env.MONGODB_URI,
};
