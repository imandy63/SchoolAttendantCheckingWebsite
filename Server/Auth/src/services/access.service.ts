import { ShopPayload, shop } from "../models/shop.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service";
import { keyTokenModel } from "../models/keyToken.model";
import { createTokenPairV2, verifyJWT } from "../auth/authUtils";
import { convertToObjectIdMongoose, getInfoData } from "../utils";
import {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
  NotFoundError,
} from "../core/error.response";
import { Obj, StringObj } from "../interfaces";
import { generateKey, generateKeyRSA } from "../utils/generateKey";
import { findByEmail } from "../models/repositories/shop.repo";

const Roles = {
  SHOP: "188",
  WRITER: "189",
  EDITER: "190",
  ADMIN: "191",
};

type IHandleRefreshToken = {
  refreshToken: string;
  user: string;
  email: string;
};

class AccessService {
  static handleRefreshToken = async ({
    refreshToken,
    user,
    email,
  }: IHandleRefreshToken) => {
    const keyStore = await KeyTokenService.findByUserId({
      userId: user,
    });

    if (!keyStore || !keyStore.publicKey) {
      throw new NotFoundError("Not found Key Store!");
    }

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(user);
      throw new ForbiddenError("Access denied!");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop is not registered!");
    }

    // check UserId
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop is not registered!");
    }

    const { privateKey, publicKey } = generateKeyRSA();

    const tokens = await createTokenPairV2(
      { userId: user, email },
      publicKey,
      privateKey
    );

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await keyTokenModel.updateOne(
      { _id: keyStore._id },
      {
        $set: {
          publicKey: publicKey,
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return {
      user,
      tokens,
    };
  };

  static logout = async (userId: string) => {
    const delKey = await KeyTokenService.removeKeyByUser(userId);
    return delKey;
  };

  static login = async ({ email, password, refreshToken }: StringObj) => {
    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop is not registered!");
    }

    //2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error!");
    }

    //3
    const { privateKey, publicKey } = generateKeyRSA();

    //4
    const { _id: userId } = foundShop;
    const tokens = await createTokenPairV2(
      {
        userId: userId.toString(),
        email,
      },
      publicKey,
      privateKey
    );

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }: ShopPayload) => {
    const holderShop = await shop.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop has been registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shop.create({
      name,
      email,
      password: passwordHash,
      roles: [Roles.SHOP],
    });

    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const { privateKey, publicKey } = generateKeyRSA();

      const tokens = await createTokenPairV2(
        {
          userId: newShop._id.toString(),
          email: email as string,
        },
        publicKey,
        privateKey
      );

      if (!tokens) {
        throw new BadRequestError("Token is not created!");
      }

      const keystore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        refreshToken: tokens.refreshToken,
      });
      if (!keystore) {
        return {
          code: "xxxx",
          message: "publicKeyString error",
        };
      }

      return { tokens: tokens };
    } else {
      throw new BadRequestError("Error: Shop has not been registered");
    }
  };

  static verification = async ({
    userId,
    accessToken,
  }: {
    userId: string;
    accessToken: string;
  }) => {
    //1
    if (!userId || !accessToken) {
      throw new AuthFailureError("Invalid Request!");
    }

    //2
    const keyStore = await KeyTokenService.findByUserId({
      userId: userId.toString(),
    });
    if (!keyStore || !keyStore.publicKey) {
      throw new NotFoundError("Not found Key Store!");
    }

    try {
      const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
      if (decodeUser.userId != userId) {
        throw new AuthFailureError("Invalid User Id!");
      }
      return {
        status: "Authenticated",
        user: userId,
      };
    } catch (error) {
      throw new AuthFailureError("Auth error");
    }
  };

  static grpcVerification = async ({
    userId,
    accessToken,
  }: {
    userId: string;
    accessToken: string;
  }) => {
    //1
    if (!userId || !accessToken) {
      return { message: "Invalid Request!", isValid: false };
    }

    //2
    const keyStore = await KeyTokenService.findByUserId({
      userId: userId.toString(),
    });
    if (!keyStore || !keyStore.publicKey) {
      return { message: "Not found Key Store!", isValid: false };
    }

    try {
      const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
      if (decodeUser.userId != userId) {
        return { message: "Invalid User Id!", isValid: false };
      }
      return { message: "Valid!", isValid: true };
    } catch (error) {
      return { message: "Auth error!", isValid: false };
    }
  };
}

export default AccessService;
