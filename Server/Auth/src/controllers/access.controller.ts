import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../services/access.service";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../core/error.response";

class AccessController {
  importXLSX = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("Missing file");
    }
    new SuccessResponse({
      message: "Upload successfully",
      metadata: await AccessService.importXlsxData(file.buffer),
    }).send(res);
  };

  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.headers["x-rtoken-id"] as string,
        userId: req.headers["x-client-id"] as string,
      }),
    }).send(res);
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-client-id"]?.toString() as string;

    new SuccessResponse({
      message: "Log out successfully",
      metadata: await AccessService.logout(userId),
    }).send(res);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  authentication = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]
      ?.toString()
      .split(" ")[1] as string;
    const userId = req.headers["x-client-id"]?.toString() as string;
    console.log(accessToken, userId);
    new SuccessResponse({
      message: "Validated",
      metadata: await AccessService.verification({
        userId: userId,
        accessToken: accessToken,
      }),
    }).send(res);
  };

  isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-client-id"]?.toString() as string;
    new SuccessResponse({
      message: "Is admin",
      metadata: await AccessService.isAdmin({ userId }),
    }).send(res);
  };

  isUnionWorker = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-client-id"]?.toString() as string;
    new SuccessResponse({
      message: "Is union worker",
      metadata: await AccessService.isUnionWorker({ userId }),
    }).send(res);
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-client-id"]?.toString() as string;
    new SuccessResponse({
      message: "Get me successfully",
      metadata: await AccessService.getMe({ userId }),
    }).send(res);
  };

  toStudent = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "To student successfully",
      metadata: await AccessService.toStudent({ id: req.params.id as string }),
    }).send(res);
  };

  toUnionWorker = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "To union worker successfully",
      metadata: await AccessService.toUnionWorker({
        id: req.params.id as string,
      }),
    }).send(res);
  };
}

export default new AccessController();
