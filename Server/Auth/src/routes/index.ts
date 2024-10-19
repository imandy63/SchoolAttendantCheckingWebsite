import express from "express";
import authRouter from "./auth";
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "OK",
  });
});

router.use("/api/auth", authRouter);

export default router;
