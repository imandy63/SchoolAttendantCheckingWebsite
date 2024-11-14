import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Obj } from "./interfaces";
import { MongooseDB } from "./dbs/mongoose.init";
import { router } from "./router";
import * as dotenv from "dotenv";
import cors from "cors";
import { RabbitMQ } from "./rabbitmq";
dotenv.config();
MongooseDB.getInstance();
RabbitMQ.getInstance().connect();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);

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

export { app };
