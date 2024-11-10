import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authentication";
import TrackingController from "../../controllers/tracking.controller";

const router = express.Router();

router.use(asyncHandler(authentication));

router.get("/detail/:id", asyncHandler(TrackingController.getTracking));

router.get("/:id", asyncHandler(TrackingController.getStudentActivityTracking));

router.put("/:id", asyncHandler(TrackingController.updateTracking));

export default router;
