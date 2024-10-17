import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler";
import { AuthFailureError, NotFoundError } from "../core/error.response";
import { IPayload } from "../interfaces/auth";
import KeyTokenService from "../services/keyToken.service";

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
      expiresIn: "7 days",
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
      expiresIn: "30 minutes",
      algorithm: "RS256",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
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

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId 
    2 - Get AccessToken
    3 - Verify Token
    4 - Check user in db
    5 - Return next
  */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request!");
  }

  //2
  const keyStore = await KeyTokenService.findByUserId({
    userId: userId.toString(),
  });
  if (!keyStore || !keyStore.publicKey) {
    throw new NotFoundError("Not found Key Store!");
  }
  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request!");
  }

  try {
    const decodeUser = JWT.verify(
      accessToken.toString(),
      keyStore.publicKey
    ) as IPayload;
    if (decodeUser.userId != userId) {
      throw new AuthFailureError("Invalid User Id!");
    }

    return "Authenticated";
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (token: string, key: string) => {
  const decodeUser = JWT.verify(token, key);
  return decodeUser as IPayload;
};

export { createTokenPair, createTokenPairV2, authentication, verifyJWT };
