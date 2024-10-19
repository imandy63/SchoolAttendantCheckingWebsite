import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index";
import dotenv from "dotenv";
import { MongoConnection } from "./dbs/mongoose.init";
import { Obj } from "./interfaces";
import { redisInstance } from "./dbs/redis.init";
dotenv.config();

MongoConnection();
redisInstance.initRedis();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use("", router);

app.use((req, res, next) => {
  const error: Obj = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error: Obj, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status ?? 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

export default app;
