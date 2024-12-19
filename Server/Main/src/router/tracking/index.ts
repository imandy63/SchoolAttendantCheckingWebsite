import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import {
  authentication,
  unionWorkerPriviledge,
} from "../../auth/authentication";
import TrackingController from "../../controllers/tracking.controller";

const router = express.Router();

router.get("/pdf/:id", asyncHandler(TrackingController.exportPdf));

router.use(asyncHandler(authentication));

router.get("/detail/:id", asyncHandler(TrackingController.getTracking));

router.get("/:id", asyncHandler(TrackingController.getStudentActivityTracking));

router.use(asyncHandler(unionWorkerPriviledge));

router.put("/:id", asyncHandler(TrackingController.updateTracking));

export default router;
