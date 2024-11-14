import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { uploadDisk, uploadMemory } from "../../configs/config.multer";
import UploadController from "../../controller/upload.controller";
import { adminPriviledge, authentication } from "../../auth/authentication";

const router = express.Router();

router.use(asyncHandler(authentication));
// router.use(asyncHandler(adminPriviledge));

router.post(
  "",
  uploadMemory.single("file"),
  asyncHandler(UploadController.uploadThumb)
);

export default router;
