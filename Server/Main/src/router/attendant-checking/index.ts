import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import ActivityController from "../../controllers/activity.controller";
import {
  authentication,
  unionWorkerPriviledge,
} from "../../auth/authentication";

const router = express.Router();

router.use(asyncHandler(authentication));
router.use(asyncHandler(unionWorkerPriviledge));

router.get(
  "/available-checking",
  asyncHandler(ActivityController.getAvailableAttendantChecking)
);

router.get("/past-checking", asyncHandler(ActivityController.getPastCheckings));

export default router;
