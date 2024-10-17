import express from "express";
import UploadRouter from "./upload";

const router = express.Router();

router.use("/v1/api/upload", UploadRouter);

export default router;
