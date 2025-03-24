import { CREATED, SuccessResponse } from "../core/success.response";
import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/student.service";

class StudentController {
  async getStudents(req: Request, res: Response, next: NextFunction) {
    console.log(req.query);
    new SuccessResponse({
      message: "Get students successfully",
      metadata: await StudentService.getStudents({ ...req.query }),
    }).send(res);
  }

  async getStudent(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get student successfully",
      metadata: await StudentService.getStudent({
        student_id: req.params.id as string,
      }),
    }).send(res);
  }

  async getStudentParticipatedActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Get student participated activities successfully",
      metadata: await StudentService.getStudentParticipatedActivities({
        student_id: req.params.id as string,
      }),
    }).send(res);
  }

  async getPastActivities(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get past activities successfully",
      metadata: await StudentService.getPastActivities({
        id: req.body.userId,
      }),
    }).send(res);
  }

  async updateStudentsDetails(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Update student details successfully",
      metadata: await StudentService.updateStudentsDetails({ ...req.body }),
    }).send(res);
  }

  async changeSubscribeCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Change subscribe categories successfully",
      metadata: await StudentService.changeSubscribeCategories({
        ...req.body,
      }),
    }).send(res);
  }
}

export default new StudentController();
