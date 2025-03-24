import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import ActivityController from "../../controllers/activity.controller";
import { authentication } from "../../auth/authentication";

const router = express.Router();

router.get("/excel", asyncHandler(ActivityController.exportExcel));

router.use(asyncHandler(authentication));

router.get(
  "/participants/:id",
  asyncHandler(ActivityController.getActivityParticipants)
);

router.get("/time-range", asyncHandler(ActivityController.getTimeRange));

router.get("/student", asyncHandler(ActivityController.getActivitiesByDate));

router.get("/statistic", asyncHandler(ActivityController.getStatistics));

router.get(
  "/year-statistic",
  asyncHandler(ActivityController.getYearStatistics)
);

router.get("/overall", asyncHandler(ActivityController.getOverallStatistics));

router.get(
  "/upcoming",
  asyncHandler(ActivityController.getUpcomingActivitiesGroupByDate)
);

router.get("/total", asyncHandler(ActivityController.getTotal));

router.get("/", asyncHandler(ActivityController.getActivities));

router.get(
  "/assigned",
  asyncHandler(ActivityController.getAssignedActivitiesByWorker)
);

router.put("/remove/:id", asyncHandler(ActivityController.removeActivity));

router.put(
  "/remove-assignment/:id",
  asyncHandler(ActivityController.removeCheckingAssignment)
);

router.get(
  "/assignable",
  asyncHandler(ActivityController.getAssignableActivities)
);

router.put(
  "/assign/:id",
  asyncHandler(ActivityController.assignAttendantChecking)
);

router.get("/category", asyncHandler(ActivityController.getActivityCategories));

router.post("/", asyncHandler(ActivityController.createActivity));

router.post("/participate/:id", asyncHandler(ActivityController.participate));

router.post("/leave/:id", asyncHandler(ActivityController.leaveActivity));

router.get("/student/:id", asyncHandler(ActivityController.userGetActivity));

router.get("/:id", asyncHandler(ActivityController.getActivity));

router.put("/:id", asyncHandler(ActivityController.updateActivity));

export default router;
