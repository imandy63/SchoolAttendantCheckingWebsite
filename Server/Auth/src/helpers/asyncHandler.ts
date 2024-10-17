import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../interfaces";

export const asyncHandler = (
  fn: (
    req: Request | CustomRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request | CustomRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
