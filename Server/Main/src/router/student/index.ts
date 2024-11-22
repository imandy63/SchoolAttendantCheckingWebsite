import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import StudentController from "../../controllers/student.controller";
import { authentication } from "../../auth/authentication";

const router = express.Router();

router.use(asyncHandler(authentication));

router.get("/:id", asyncHandler(StudentController.getStudent));

router.get(
  "/activity/:id",
  asyncHandler(StudentController.getStudentParticipatedActivities)
);

router.put(
  "/categories",
  asyncHandler(StudentController.changeSubscribeCategories)
);

router.get("/", asyncHandler(StudentController.getStudents));

router.post("/", asyncHandler(StudentController.updateStudentsDetails));

export default router;
