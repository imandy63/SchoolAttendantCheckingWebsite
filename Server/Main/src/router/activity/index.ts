import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import ActivityController from "../../controllers/activity.controller";
import { authentication } from "../../auth/authentication";

const router = express.Router();

router.use(asyncHandler(authentication));

router.get(
  "/participants/:id",
  asyncHandler(ActivityController.getActivityParticipants)
);

router.get("/student", asyncHandler(ActivityController.getActivitiesByDate));

router.get(
  "/upcoming",
  asyncHandler(ActivityController.getUpcomingActivitiesGroupByDate)
);

router.get("/", asyncHandler(ActivityController.getActivities));

router.post("/", asyncHandler(ActivityController.createActivity));

router.get("/:id", asyncHandler(ActivityController.getActivity));

router.put("/:id", asyncHandler(ActivityController.updateActivity));

export default router;
