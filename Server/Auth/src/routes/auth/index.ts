import { asyncHandler } from "../../helpers/asyncHandler";
import AccessController from "../../controllers/access.controller";
import express from "express";
import { uploadMemory } from "../../configs/multer.config";

const router = express.Router();

router.post(
  "/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);
router.get("/authenticate", asyncHandler(AccessController.authentication));

router.post("/login", asyncHandler(AccessController.login));

router.post(
  "/import-xlsx",
  uploadMemory.single("file"),
  asyncHandler(AccessController.importXLSX)
);

export default router;
