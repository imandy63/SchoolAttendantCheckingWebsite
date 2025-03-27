import express, { Request, Response, Router, NextFunction } from "express";
import authRouter from "./auth";

const router: Router = express.Router();

router.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    message: "OK",
  });
});

router.use("/api/auth", authRouter);

export default router;
