import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import StudentController from "../../controllers/student.controller";

const router = express.Router();

router.get("/:id", asyncHandler(StudentController.getStudent));

router.get(
  "/activity/:id",
  asyncHandler(StudentController.getStudentParticipatedActivities)
);

router.get("/", asyncHandler(StudentController.getStudents));

router.post("/", asyncHandler(StudentController.updateStudentsDetails));

export default router;
