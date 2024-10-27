import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { uploadDisk, uploadMemory } from "../../config/config.multer";
import UploadController from "../../controller/upload.controller";
import { authenticationGRPC } from "../../auth/authentication";

const router = express.Router();

router.use(asyncHandler(authenticationGRPC));

router.use(
  "/thumb",
  uploadMemory.single("file"),
  asyncHandler(UploadController.uploadThumb)
);
router.use(
  "/multiple",
  uploadDisk.array("files", 10),
  asyncHandler(UploadController.uploadFiles)
);

export default router;
