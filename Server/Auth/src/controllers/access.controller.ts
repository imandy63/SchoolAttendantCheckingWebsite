import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../services/access.service";
import { findByEmail } from "../models/repositories/shop.repo";
import { NextFunction, Request, Response } from "express";
import { IPayload } from "../interfaces/auth";
import { IKeyStore } from "../models/keyToken.model";

interface CustomRequest extends Request {
  refreshToken: string;
  user: IPayload;
  keyStore: IKeyStore;
}

class AccessController {
  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.headers["x-rtoken-id"] as string,
        user: req.headers["x-client-id"] as string,
        email: req.body.email,
      }),
    }).send(res);
  };

  logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Log out successfully",
      metadata: await AccessService.logout(req.body.user),
    }).send(res);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signup = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Registered successfully!",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };

  authentication = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Validated",
      metadata: await AccessService.verification({
        userId: req.body.user,
        accessToken: req.body.accessToken,
      }),
    }).send(res);
  };
}

export default new AccessController();
