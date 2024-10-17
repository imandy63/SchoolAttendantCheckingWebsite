import { keyTokenModel } from "../models/keyToken.model";
import { Types } from "mongoose";
import { convertToObjectIdMongoose } from "../utils";

interface IKeyTokenCreate {
  userId: Types.ObjectId;
  publicKey: string;
  refreshToken: string | null;
}

class KeyTokenService {
  static removeKeyById = async (keyId: Types.ObjectId) => {
    return await keyTokenModel.deleteOne(keyId);
  };

  static removeKeyByUser = async (userId: string) => {
    return await keyTokenModel.deleteOne({
      user: convertToObjectIdMongoose(userId),
    });
  };

  static createKeyToken = async ({
    userId,
    publicKey,
    refreshToken = null,
  }: IKeyTokenCreate) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };

  static findByUserId = async ({ userId }: { userId: string }) => {
    return await keyTokenModel.findOne({
      user: convertToObjectIdMongoose(userId),
    });
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static deleteKeyById = async (userId: string) => {
    return await keyTokenModel.deleteOne({
      user: convertToObjectIdMongoose(userId),
    });
  };

  static findByRefreshToken = async (refreshToken: string) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken });
  };
}

export default KeyTokenService;
