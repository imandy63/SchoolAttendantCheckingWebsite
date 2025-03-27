import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler";
import { AuthFailureError, NotFoundError } from "../core/error.response";
import { IPayload } from "../interfaces/auth";

export const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const JWT_SECRET = "your-super-secret-key";

const createTokenPair = async (payload: IPayload) => {
  try {
    const accessToken = await JWT.sign(payload, JWT_SECRET, {
      expiresIn: "1 hour",
    });
    const refreshToken = await JWT.sign(payload, JWT_SECRET, {
      expiresIn: "3 days",
    });

    return { accessToken, refreshToken };
  } catch (e) {
    console.error("Error creating token pair:", e);
    throw new AuthFailureError("Failed to create token pair");
  }
};

const verifyJWT = (token: string) => {
  try {
    const decodeUser = JWT.verify(token, JWT_SECRET);
    return decodeUser as IPayload;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw new AuthFailureError("Invalid token");
  }
};

export { createTokenPair, verifyJWT };
