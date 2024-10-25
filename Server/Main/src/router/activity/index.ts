import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import ActivityController from "../../controllers/activity.controller";

const router = express.Router();

router.get("/:id", asyncHandler(ActivityController.getActivity));

router.get(
  "/participants/:id",
  asyncHandler(ActivityController.getActivityParticipants)
);

router.get("/", asyncHandler(ActivityController.getActivities));

router.post("/", asyncHandler(ActivityController.createActivity));

export default router;
