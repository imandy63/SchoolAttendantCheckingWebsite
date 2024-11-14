import express from "express";
import UploadRouter from "./upload";

const router = express.Router();

router.use("/api/upload", UploadRouter);

export default router;
