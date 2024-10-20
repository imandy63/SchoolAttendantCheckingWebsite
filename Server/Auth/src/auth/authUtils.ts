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

const createTokenPair = async (
  payload: IPayload,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "30 minutes",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify:", err);
      } else {
        console.log("Decode verify:", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (e) {}
};

const createTokenPairV2 = async (
  payload: IPayload,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "1 hour",
      algorithm: "RS256",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "3 days",
      algorithm: "RS256",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify:", err);
      } else {
        console.log("Decode verify:", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (e) {}
};

const verifyJWT = (token: string, key: string) => {
  const decodeUser = JWT.verify(token, key);
  return decodeUser as IPayload;
};

export { createTokenPair, createTokenPairV2, verifyJWT };
