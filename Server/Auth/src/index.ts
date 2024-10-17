import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index";
import dotenv from "dotenv";
import { MongoConnection } from "./dbs/mongoose.init";
import { errorHandler } from "./helpers/errorMiddleware";
import { Obj } from "./interfaces";
import { startGRPCAuthService } from "./grpc/server";
dotenv.config();

MongoConnection();
startGRPCAuthService();

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

app.use(errorHandler);

export default app;
