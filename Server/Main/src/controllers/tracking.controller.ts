import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { ActivityTrackingService } from "../services/tracking.service";

class ActivityTrackingController {
  async getStudentActivityTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Get student activity tracking successfully",
      metadata: await ActivityTrackingService.getStudentActivityTracking({
        activity_id: req.params.id as string,
      }),
    }).send(res);
  }
}

export default new ActivityTrackingController();
