import { asyncHandler } from "../../helpers/asyncHandler";
import AccessController from "../../controllers/access.controller";
import express from "express";
import { uploadMemory } from "../../configs/multer.config";

const router = express.Router();

router.post(
  "/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);

router.get("/me", asyncHandler(AccessController.getMe));

router.get("/authenticate", asyncHandler(AccessController.authentication));

router.post("/login", asyncHandler(AccessController.login));

router.post("/logout", asyncHandler(AccessController.logout));

router.post(
  "/import-xlsx",
  uploadMemory.single("file"),
  asyncHandler(AccessController.importXLSX)
);

router.get("/is-admin", asyncHandler(AccessController.isAdmin));

router.get("/is-union-worker", asyncHandler(AccessController.isUnionWorker));

export default router;
