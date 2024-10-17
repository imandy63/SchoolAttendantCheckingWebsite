import { NextFunction, Request, Response } from "express";
import { validateTokenGRPC } from "../grpc/auth.grpc";
import { AuthFailureError, BadRequestError } from "../core/error.response";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const authenticationGRPC = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request!");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request!");
  }
  try {
    const validation = await validateTokenGRPC(
      accessToken as string,
      userId as string
    );

    if (validation.status) {
      req.body.userId = userId;
      return next();
    } else {
      throw new BadRequestError(validation.message);
    }
  } catch (err) {
    throw new BadRequestError(err?.toString());
  }
};

export { authenticationGRPC };
