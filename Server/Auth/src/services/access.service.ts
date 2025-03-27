import { students } from "../models/auth.model";
import bcrypt from "bcryptjs";
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { convertToObjectIdMongoose, getInfoData } from "../utils";
import {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
} from "../core/error.response";
import XLSX from "xlsx";
import { StringObj } from "../interfaces";
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
      console.log("Starting XLSX import");
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      console.log("XLSX read complete");

      const sheetName = workbook.SheetNames[0];
      console.log("Sheet name:", sheetName);
      
      const sheetData: StudentExcelRow[] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );
      
      console.log("Sheet data parsed, rows:", sheetData.length);
      console.log("Sample data:", JSON.stringify(sheetData[0]));

      // Kiểm tra kết nối MongoDB trước khi thực hiện import
      try {
        const count = await students.countDocuments();
        console.log(`Current students count in database: ${count}`);
      } catch (dbError) {
        console.error("Error connecting to MongoDB:", dbError);
        throw new BadRequestError("Database connection error. Please try again.");
      }

      let created = 0;
      let skipped = 0;

      for (const row of sheetData) {
        console.log("Processing row:", JSON.stringify(row));
        
        // Validate required fields
        if (!row["student_id"] || !row["student_name"]) {
          console.error("Missing required fields:", JSON.stringify(row));
          continue;
        }

        const foundStudent = await students
          .findOne({
            student_id: row["student_id"].toString(),
          })
          .lean();

        if (!!foundStudent) {
          console.log(`Student ${row["student_id"]} already exists, skipping`);
          skipped++;
          continue;
        }

        // Set default password to 123456
        const hashedPassword = await bcrypt.hash("123456", 10);
        
        try {
          const newStudent = {
            student_id: row["student_id"].toString(),
            student_name: row["student_name"],
            student_avatar_url: row["student_avatar_url"] || "",
            student_address: row["student_address"] || "",
            student_class: {
              class_name: row["class_name"] || "",
              faculty: row["faculty"] || "",
            },
            password: hashedPassword,
            role: "STUDENT",  // Default role
            student_activity_point: 70,
            subscribed_categories: [],
          };
          
          console.log(`Creating new student:`, JSON.stringify(newStudent));
          const result = await students.create(newStudent);
          
          console.log(`Created student ${row["student_id"]}, ID: ${result._id}`);
          created++;
        } catch (err) {
          console.error(`Error creating student ${row["student_id"]}:`, err);
        }
      }

      // Xác nhận số lượng records trong database sau khi import
      try {
        const countAfter = await students.countDocuments();
        console.log(`Students count after import: ${countAfter}`);
      } catch (dbError) {
        console.error("Error checking database count:", dbError);
      }

      console.log(`Import completed: ${created} created, ${skipped} skipped`);
      return { 
        success: true, 
        message: `Data imported successfully! Created: ${created}, Skipped: ${skipped}`,
        stats: { created, skipped }
      };
    } catch (error: any) {
      console.error("Error importing XLSX data:", error);
      throw new BadRequestError(`Failed to import XLSX data: ${error.message}`);
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

    return { status: foundUser.role === Role.UNION_WORKER };
  };

  static handleRefreshToken = async ({
    refreshToken,
    userId,
  }: IHandleRefreshToken) => {
    const foundRefreshToken = await redisInstance.get(
      `refreshToken::${userId}`
    );

    if (!foundRefreshToken) {
      throw new BadRequestError("Token is not created!");
    }

    if (foundRefreshToken !== refreshToken) {
      throw new AuthFailureError("Invalid Refresh Token!");
    }

    const { studentId } = verifyJWT(refreshToken);

    // check UserId
    const foundUser = await findByStudentId({ student_id: studentId });
    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    const tokens = await createTokenPair({
      userId: userId,
      studentId,
    });

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await redisInstance.set(`refreshToken::${userId}`, tokens.refreshToken);
    await redisInstance.set(`keyToken::${userId}`, tokens.accessToken, 1800);

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
    console.log('Login attempt:', { studentId });
    
    const foundUser = await findByStudentId({ student_id: studentId });
    if (!foundUser) {
      throw new AuthFailureError("User is not registered!");
    }

    const match = await bcrypt.compare(password, foundUser.password);
    console.log('Password match:', match);
    
    if (!match) {
      throw new AuthFailureError("Authentication failed!");
    }

    const tokens = await createTokenPair({
      userId: foundUser._id.toString(),
      studentId,
    });

    if (!tokens) {
      throw new BadRequestError("Token is not created!");
    }

    await redisInstance.set(`refreshToken::${foundUser._id}`, tokens.refreshToken);
    await redisInstance.set(`keyToken::${foundUser._id}`, tokens.accessToken, 1800);

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

    try {
      const decodeUser = verifyJWT(accessToken);
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
