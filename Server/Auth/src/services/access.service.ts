import { students } from "../models/auth.model";
import bcrypt from "bcryptjs";
import { createTokenPairV2, verifyJWT } from "../auth/authUtils";
import { convertToObjectIdMongoose, getInfoData } from "../utils";
import {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
} from "../core/error.response";
import XLSX from "xlsx";
import { StringObj } from "../interfaces";
import { generateKeyRSA } from "../utils/generateKey";
import { findByStudentId } from "../models/repositories/auth.repo";
import { redisInstance } from "../dbs/redis.init";
import { StudentExcelRow } from "../interfaces/auth";
import { Role } from "../enum/role.enum";

type IHandleRefreshToken = {
  refreshToken: string;
  userId: string;
};

class AccessService {
  static async importXlsxData(fileBuffer: Buffer) {
    try {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const sheetData: StudentExcelRow[] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

      for (const row of sheetData) {
        const foundStudent = await students
          .findOne({
            student_id: row["student_id"].toString(),
          })
          .lean();

        if (!!foundStudent) {
          continue;
        }

        const hashedPassword = await bcrypt.hash(
          row["password"].toString(),
          10
        );
        await students.create({
          student_id: row["student_id"].toString(),
          student_name: row["student_name"],
          student_avatar_url: row["student_avatar_url"] || "",
          student_address: row["student_address"],
          student_class: {
            class_name: row["class_name"],
            faculty: row["faculty"],
          },
          password: hashedPassword,
          student_activity_point: 70,
          subscribed_categories: [],
        });
      }

      return { success: true, message: "Data imported successfully!" };
    } catch (error) {
      console.error("Error importing XLSX data:");
      throw new BadRequestError("Failed to import XLSX data");
    }
  }

  static async getMe({ userId }: { userId: string }) {
    const foundUser = await students.findOne(
      { _id: convertToObjectIdMongoose(userId) },
      {
        is_active: 0,
        password: 0,
        role: 0,
        student_participated_activities: 0,
      }
    );

    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    return foundUser;
  }

  static isAdmin = async ({ userId }: { userId: string }) => {
    const foundUser = await students.findById(
      convertToObjectIdMongoose(userId)
    );

    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    return { status: foundUser.role === Role.ADMIN };
  };

  static isUnionWorker = async ({ userId }: { userId: string }) => {
    const foundUser = await students.findById(
      convertToObjectIdMongoose(userId)
    );

    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    return { status: !(foundUser.role === Role.STUDENT) };
  };

  static handleRefreshToken = async ({
    refreshToken,
    userId,
  }: IHandleRefreshToken) => {
    const publicKeyFound = await redisInstance.get(`publicKey::${userId}`);
    if (!publicKeyFound) {
      throw new NotFoundError("Not found Key Store!");
    }

    const { studentId } = verifyJWT(refreshToken, publicKeyFound);

    if (!studentId) {
      throw new BadRequestError("Invalid Refresh Token!");
    }

    // check UserId
    const foundUser = await findByStudentId({ student_id: studentId });
    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    const foundRefreshToken = await redisInstance.get(
      `refreshToken::${userId}`
    );

    if (!foundRefreshToken) {
      throw new BadRequestError("Token is not created!");
    }

    if (foundRefreshToken !== refreshToken) {
      throw new AuthFailureError("Invalid Refresh Token!");
    }

    const { privateKey, publicKey } = generateKeyRSA();

    const tokens = await createTokenPairV2(
      { userId: userId, studentId },
      publicKey,
      privateKey
    );

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await redisInstance.set(`refreshToken::${userId}`, tokens.refreshToken);
    await redisInstance.set(`keyToken::${userId}`, tokens.accessToken, 1800);
    await redisInstance.set(`publicKey::${userId}`, publicKey);

    return {
      user: getInfoData({
        fields: ["_id", "student_name", "student_id"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static logout = async (userId: string) => {
    await redisInstance.delete(`refreshToken::${userId}`);
    await redisInstance.delete(`publicKey::${userId}`);
    await redisInstance.delete(`keyToken::${userId}`);
    return { status: true };
  };

  static login = async ({ studentId, password }: StringObj) => {
    //1
    const foundUser = await findByStudentId({ student_id: studentId });
    if (!foundUser) {
      throw new BadRequestError("User is not registered!");
    }

    //2
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error!");
    }

    //3
    const { privateKey, publicKey } = generateKeyRSA();

    //4
    const { _id: userId } = foundUser;
    const tokens = await createTokenPairV2(
      {
        userId: userId.toString(),
        studentId,
      },
      publicKey,
      privateKey
    );

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await redisInstance.set(`refreshToken::${userId}`, tokens.refreshToken);
    await redisInstance.set(`keyToken::${userId}`, tokens.accessToken, 1800);
    await redisInstance.set(`publicKey::${userId}`, publicKey);

    return {
      user: getInfoData({
        fields: ["_id", "student_name", "student_id"],
        object: foundUser,
      }),
      tokens,
    };
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
    const publicKey = await redisInstance.get(`publicKey::${userId}`);
    if (!publicKey) {
      throw new NotFoundError("Not found Key Store!");
    }

    try {
      const decodeUser = verifyJWT(accessToken, publicKey);
      if (decodeUser.userId != userId) {
        throw new AuthFailureError("Invalid User Id!");
      }
      return {
        status: true,
      };
    } catch (error) {
      throw new AuthFailureError("Auth error");
    }
  };

  static toUnionWorker = async ({ id }: { id: string }) => {
    return await students.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(id), role: Role.STUDENT },
      { $set: { role: Role.UNION_WORKER } },
      { new: true }
    );
  };

  static toStudent = async ({ id }: { id: string }) => {
    return await students.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(id), role: Role.UNION_WORKER },
      { $set: { role: Role.STUDENT } },
      { new: true }
    );
  };
}

export default AccessService;
