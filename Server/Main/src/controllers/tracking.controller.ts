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

  async getTracking(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get tracking successfully",
      metadata: await ActivityTrackingService.getTracking({
        activity_id: req.params.id as string,
      }),
    }).send(res);
  }

  async updateTracking(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Update tracking successfully",
      metadata: await ActivityTrackingService.updateTracking({
        activity_id: req.params.id as string,
        student_ids: req.body.student_ids as string[],
      }),
    }).send(res);
  }

  async exportPdf(req: Request, res: Response, next: NextFunction) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=activityTracking.pdf"
    );
    res.send(
      await ActivityTrackingService.exportPdf(
        {
          id: req.params.id as string,
        },
        res
      )
    );
  }
}

export default new ActivityTrackingController();
