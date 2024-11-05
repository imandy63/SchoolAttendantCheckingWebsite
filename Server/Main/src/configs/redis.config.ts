import * as dotenv from "dotenv";
dotenv.config();

export const RedisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};
