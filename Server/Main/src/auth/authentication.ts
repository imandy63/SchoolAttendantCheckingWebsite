import { NextFunction, Request, Response } from "express";
import { AuthFailureError, BadRequestError } from "../core/error.response";
import axios from "axios";
import { URL_CONFIG } from "../configs/url.config";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};
export const authentication = async (
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
    const { data } = await axios.get(
      `${URL_CONFIG.AUTH}/api/auth/authenticate`,
      {
        headers: { Authorization: accessToken, "x-client-id": userId },
      }
    );

    if (!data || !data.metadata || !data.metadata.status) {
      throw new AuthFailureError("Invalid authentication response");
    }

    req.body.userId = userId;

    next();
  } catch (err) {
    throw new AuthFailureError("Unauthorized");
  }
};

export const adminPriviledge = async (
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
    const { data } = await axios.get(
      `${URL_CONFIG.AUTH}/api/auth/authenticate`,
      {
        headers: { Authorization: accessToken, "x-client-id": userId },
      }
    );

    if (!data || !data.metadata || !data.metadata.status) {
      throw new AuthFailureError("Invalid authentication response");
    }

    req.body.userId = userId;

    next();
  } catch (err) {
    console.log(err);
    throw new AuthFailureError("Un authorized");
  }
};

export const unionWorkerPriviledge = async (
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
    const { data } = await axios.get(
      `${URL_CONFIG.AUTH}/api/auth/is-union-worker`,
      {
        headers: { Authorization: accessToken, "x-client-id": userId },
      }
    );

    if (!data || !data.metadata || !data.metadata.status) {
      throw new AuthFailureError("Invalid authentication response");
    }

    req.body.userId = userId;

    next();
  } catch (err) {
    console.log(err);
    throw new AuthFailureError("Unauthorized");
  }
};
