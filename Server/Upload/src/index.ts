import express, { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import morgan from "morgan";
import helmet from "helmet";
import { Obj } from "./interfaces";
import * as dotenv from "dotenv";
import Router from "./route";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
  })
);

app.use("", Router);

app.use((req, res, next) => {
  const error: Obj = new Error("Not found");
  error.status = 404;
  next(error);
});

const errorHandler: ErrorRequestHandler = (error: Obj, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = error.status ?? 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};

app.use(errorHandler);

export default app;
