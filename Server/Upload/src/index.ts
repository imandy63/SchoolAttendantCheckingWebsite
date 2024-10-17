import express, { Response, Request, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import { Obj } from "./interface";
import compression from "compression";
import * as dotenv from "dotenv";
import Router from "./route";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

app.use("", Router);

app.use((req, res, next) => {
  const error: Obj = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error: Obj, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status ?? 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

export default app;
