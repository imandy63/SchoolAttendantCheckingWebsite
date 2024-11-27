import { BadRequestError, NotFoundError } from "../core/error.response";
import { Participation_Status, Role } from "../enum/role.enum";
import { StudentParticipatedActivity } from "../interfaces/activity.interface";
import { activities } from "../models/activity.model";
import { students, StudentPayload } from "../models/student.model";
import { convertToObjectIdMongoose } from "../utils";
import { ActivityService } from "./activity.service";
import { RedisService } from "./redis.service";
export class StudentService {
  static redisService = RedisService.getInstance();

  static getStudent = async ({ student_id }: { student_id: string }) => {
    return await students.find({ student_id }).lean();
  };

  static getStudentParticipatedActivities = async ({
    student_id,
  }: {
    student_id: string;
  }) => {
    return await students.findOne(
      {
        student_id: student_id,
      },
      { student_participated_activities: 1 }
    );
  };

  static getStudents = async ({
    page = 1,
    limit = 10,
    sort = "student_id",
    search = "",
  }) => {
    const result = await students.aggregate([
      {
        $match: {
          student_name: { $regex: search, $options: "i" },
          role: Role.STUDENT,
        },
      },
      {
        $sort: { [sort]: 1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          activity_participants_total: {
            $size: "$student_participated_activities",
          },
        },
      },
      {
        $project: {
          activity_participants_total: 1,
          student_name: 1,
          student_id: 1,
          student_activity_point: 1,
          student_class: 1,
        },
      },
    ]);

    const total = await students.countDocuments({
      student_name: { $regex: search, $options: "i" },
      role: Role.STUDENT,
    });
    return { data: result, total, page, limit };
  };

  static updateStudentsDetails = async ({
    student_id,
    student_name,
    student_activity_point,
    student_class,
    student_address,
    student_avatar_url,
  }: StudentPayload) => {
    if (!student_id) {
      throw new BadRequestError("Student id is required");
    }

    const updatedStudent = await students.findOneAndUpdate(
      { student_id },
      {
        student_name,
        student_activity_point,
        student_class,
        student_address,
        student_avatar_url,
      },
      { new: true }
    );

    if (!updatedStudent) {
      throw new NotFoundError("Student not found");
    }

    return updatedStudent;
  };

  static studentLeaveActivity = async (
    student_id: string,
    activity_name: string
  ) => {
    return await students
      .findOneAndUpdate(
        { student_id: student_id },
        { $pull: { "student_participated_activities.name": activity_name } },
        { new: true }
      )
      .lean();
  };

  static studentAddActivityPoint = async ({
    student_ids,
    point,
    activity_id,
  }: {
    student_ids: string[];
    point: Number;
    activity_id: string;
  }) => {
    await students.updateMany(
      {
        student_id: { $nin: student_ids },
        "student_participated_activities._id":
          convertToObjectIdMongoose(activity_id),
      },
      {
        $set: {
          "student_participated_activities.$.status":
            Participation_Status.REJECTED,
          "student_participated_activities.$.point": 0,
        },
      },
      { new: true }
    );

    return await students.updateMany(
      {
        student_id: { $in: student_ids },
        "student_participated_activities._id":
          convertToObjectIdMongoose(activity_id),
      },
      {
        $inc: { student_activity_point: point },
        $set: {
          "student_participated_activities.$.status":
            Participation_Status.PARTICIPATED,
          "student_participated_activities.$.point": point,
        },
      },
      { new: true }
    );
  };

  static changeSubscribeCategories = async ({
    userId,
    categories,
  }: {
    userId: string;
    categories: string[];
  }) => {
    return await students.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(userId) },
      { $set: { subscribed_categories: categories } },
      { new: true }
    );
  };

  static enableWorker = async (id: string) => {
    return await students.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(id), role: Role.UNION_WORKER },
      { $set: { is_active: true } },
      { new: true }
    );
  };

  static disableWorker = async (id: string) => {
    return await students.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(id), role: Role.UNION_WORKER },
      { $set: { is_active: false } },
      { new: true }
    );
  };

  static getUnionWorkers = async ({ page = 1, limit = 10, search = "" }) => {
    const result = await students
      .find(
        {
          role: Role.UNION_WORKER,
          student_name: { $regex: search, $options: "i" },
        },
        { student_name: 1, student_id: 1, is_active: 1 }
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await students.countDocuments({
      student_name: { $regex: search, $options: "i" },
      role: Role.UNION_WORKER,
    });
    return { data: result, total, page, limit };
  };

  static getUnionWorkerAssignedActivities = async ({ id }: { id: string }) => {
    const foundUnionWorker = await students
      .findOne({ _id: convertToObjectIdMongoose(id), role: Role.UNION_WORKER })
      .lean();

    if (!foundUnionWorker) {
      throw new NotFoundError("Union worker not found");
    }

    return await activities
      .find({ assigned_to: convertToObjectIdMongoose(id) })
      .lean();
  };
}
