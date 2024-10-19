import { Request, Response, NextFunction } from "express";
import { Obj } from "../interfaces";

export const errorHandler = (
  error: Obj,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status ?? 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
};
