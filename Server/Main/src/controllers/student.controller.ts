import { CREATED, SuccessResponse } from "../core/success.response";
import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/students.service";

class StudentController {
  async getStudents(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get students successfully",
      metadata: await StudentService.getStudents(req.query),
    }).send(res);
  }
}
