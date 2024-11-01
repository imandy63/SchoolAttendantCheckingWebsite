import { NextFunction, Request, Response } from "express";
import { CREATED, SuccessResponse } from "../core/success.response";
import { ActivityService } from "../services/activity.service";

class ActivityController {
  async getActivities(req: Request, res: Response, next: NextFunction) {
    const { page = 1, limit = 10, search = "" } = req.query;
    new SuccessResponse({
      message: "Get activities successfully",
      metadata: await ActivityService.getActivities({
        page: page as number,
        limit: limit as number,
        search: search as string,
      }),
    }).send(res);
  }

  async getActivityParticipants(req: Request, res: Response) {
    new SuccessResponse({
      message: "Get activity participants successfully",
      metadata: await ActivityService.getActivityParticipants({
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async updateActivity(req: Request, res: Response) {
    new SuccessResponse({
      message: "Update activity successfully",
      metadata: await ActivityService.updateActivity({
        ...req.body,
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async getActivity(req: Request, res: Response) {
    const { id } = req.params;

    new SuccessResponse({
      message: "Get activity successfully",
      metadata: await ActivityService.getActivity({
        activity_id: id,
      }),
    }).send(res);
  }

  async createActivity(req: Request, res: Response) {
    new CREATED({
      message: "Create activity successfully",
      metadata: await ActivityService.createActivity({ ...req.body }),
    }).send(res);
  }
}

export default new ActivityController();
