import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index";
import dotenv from "dotenv";
import { MongoConnection } from "./dbs/mongoose.init";
import { Obj } from "./interfaces";
import { redisInstance } from "./dbs/redis.init";
import cors from "cors";
dotenv.config();
// MongoConnection();
// redisInstance.initRedis();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FE_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Routes
app.use("", router);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    code: 500,
    message: err.message || 'Internal Server Error'
  });
});

// Database connection
MongoConnection();
redisInstance.initRedis();

export default app;
