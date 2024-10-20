import express, { NextFunction, Request, Response, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Obj } from "./interface";
import { MongooseDB } from "./dbs/mongoose.init";

MongooseDB.getInstance();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(helmet());

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
