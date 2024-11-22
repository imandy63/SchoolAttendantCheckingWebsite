import { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/student.service";
import { CREATED, SuccessResponse } from "../core/success.response";

class UnionWorkerController {
  createUnionWorker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new CREATED({
      message: "Create union worker successfully",
      metadata: await StudentService.createUnionWorker({ ...req.body }),
    }).send(res);
  };

  enableUnionWorker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Enable union worker successfully",
      metadata: await StudentService.enableWorker(req.params.id as string),
    }).send(res);
  };

  disableUnionWorker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Disable union worker successfully",
      metadata: await StudentService.disableWorker(req.params.id as string),
    }).send(res);
  };

  getUnionWorkers = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get union workers successfully",
      metadata: await StudentService.getUnionWorkers({ ...req.query }),
    }).send(res);
  };

  resetUnionWorkerPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Reset union worker password successfully",
      metadata: await StudentService.resetUnionWorkerPassword({
        id: req.params.id as string,
        ...req.body,
      }),
    }).send(res);
  };
}

export default new UnionWorkerController();
