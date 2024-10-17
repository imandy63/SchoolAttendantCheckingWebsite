import express from "express";
import authRouter from "./access";
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "OK",
  });
});

router.use("/v1/api/auth", authRouter);

export default router;
