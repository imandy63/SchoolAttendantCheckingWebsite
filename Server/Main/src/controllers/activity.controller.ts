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

  async getActivityParticipants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Get activity participants successfully",
      metadata: await ActivityService.getActivityParticipants({
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async getUpcomingActivitiesGroupByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page = 1, limit = 10, search = "" } = req.query;
    new SuccessResponse({
      message: "Get activities group by date successfully",
      metadata: await ActivityService.getUpcomingActivitiesGroupByDate({
        page: page as number,
        limit: limit as number,
        search: search as string,
        userId: req.body.userId,
      }),
    }).send(res);
  }

  async getActivitiesByDate(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get activities by date successfully",
      metadata: await ActivityService.getActivitiesByDate({
        date: req.query.date as string,
        userId: req.body.userId,
      }),
    }).send(res);
  }

  async updateActivity(req: Request, res: Response, next: NextFunction) {
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

  async userGetActivity(req: Request, res: Response) {
    const { id } = req.params;

    new SuccessResponse({
      message: "Get activity successfully",
      metadata: await ActivityService.userGetActivity({
        activity_id: id,
        userId: req.body.userId,
      }),
    }).send(res);
  }

  async createActivity(req: Request, res: Response) {
    new CREATED({
      message: "Create activity successfully",
      metadata: await ActivityService.createActivity({ ...req.body }),
    }).send(res);
  }

  async participate(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Participate activity successfully",
      metadata: await ActivityService.participateInActivity({
        ...req.body,
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async getActivityCategories(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Get activity categories successfully",
      metadata: await ActivityService.getActivityCategories(),
    }).send(res);
  }

  async assignAttendantChecking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Assign attendant checking successfully",
      metadata: await ActivityService.assignAttendantChecking({
        ...req.body,
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async removeCheckingAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Remove checking assignment successfully",
      metadata: await ActivityService.removeCheckingAssignment({
        ...req.body,
        activity_id: req.params.id,
      }),
    }).send(res);
  }

  async getAssignableActivities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Get assignable attendants successfully",
      metadata: await ActivityService.getAssignableActivities({
        id: req.query.id as string,
      }),
    }).send(res);
  }

  async getAssignedActivitiesByWorker(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new SuccessResponse({
      message: "Get assigned activities by worker successfully",
      metadata: await ActivityService.getAssignedActivitiesByWorker({
        id: req.query.id as string,
      }),
    }).send(res);
  }
}

export default new ActivityController();
