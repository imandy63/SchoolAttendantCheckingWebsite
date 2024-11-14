import { ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { redisInstance } from "../dbs/redis.init";
import { Activity_status } from "../enum/activity.enum";
import { Notification_type } from "../enum/notificationType.enum";
import {
  activities,
  IActivity,
  IActivityParticipant,
} from "../models/activity.model";
import {
  findStudentById,
  participateInActivity,
} from "../models/repositories/student.repo";
import { students } from "../models/student.model";
import { convertToObjectIdMongoose } from "../utils";
import { NotificationService } from "./notification.service";
import { RedisService } from "./redis.service";

class ActivityService {
  static redisService = RedisService.getInstance();
  static redis = redisInstance.getRedis();
  static async getActivities({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page: number;
    limit: number;
    search: string;
  }) {
    const result = await activities.aggregate([
      { $match: { activity_name: { $regex: search, $options: "i" } } },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          activity_participants_total: { $size: "$activity_participants" },
        },
      },
      {
        $project: {
          activity_participants_total: 1,
          activity_name: 1,
          activity_start_date: 1,
          activity_max_participants: 1,
          activity_point: 1,
          activity_thumb_url: 1,
          activity_duration: 1,
          activity_categories: 1,
          activity_status: 1,
          activity_host: 1,
        },
      },
    ]);
    const total = await activities.countDocuments({
      activity_name: { $regex: search, $options: "i" },
    });
    return { data: result, total, page, limit };
  }

  static async getActivitiesByDate({
    date,
    userId,
  }: {
    date: string;
    userId: string;
  }) {
    let parsedDate: Date;

    if (typeof date === "string") {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;

      if (!dateRegex.test(date)) {
        throw new BadRequestError(
          "Invalid date format. Please use dd-mm-yyyy."
        );
      }

      const [day, month, year] = date.split("-").map(Number);
      parsedDate = new Date(year, month - 1, day);
    } else {
      throw new BadRequestError(
        "Invalid date input. Must be a string or Date."
      );
    }

    const foundStudent = await students.findById(userId);
    if (!foundStudent) throw new NotFoundError("Student not found");

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);
    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $addFields: {
          participation_status: {
            $cond: {
              if: { $in: [foundStudent?.student_id, "$activity_participants"] },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
    return result;
  }

  static async userGetActivity({
    activity_id,
    userId,
  }: {
    activity_id: string;
    userId: string;
  }) {
    const foundStudent = await students.findById(userId).lean();
    if (!foundStudent) throw new NotFoundError("Student not found");
    const foundActivity = await activities.aggregate([
      { $match: { _id: convertToObjectIdMongoose(activity_id) } },
      {
        $addFields: {
          participatable: {
            $not: {
              $in: [
                foundStudent.student_id,
                {
                  $map: {
                    input: "$activity_participants",
                    as: "participant",
                    in: "$$participant.student_id",
                  },
                },
              ],
            },
          },
        },
      },
    ]);
    if (foundActivity.length > 0) {
      return foundActivity[0];
    }
    throw new NotFoundError("Activity not found");
  }

  static async getParticipatableActivity({
    activity_id,
  }: {
    activity_id: string;
  }) {
    const foundActivity = await activities.findOne({
      _id: convertToObjectIdMongoose(activity_id),
      activity_status: Activity_status.OPEN,
    });
    return foundActivity;
  }

  static async getUpcomingActivitiesGroupByDate({
    page = 1,
    limit = 10,
    search = "",
    userId,
  }: {
    page: number;
    limit: number;
    search: string;
    userId: string;
  }) {
    const foundStudent = await findStudentById(userId);

    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: { $gte: new Date() },
          activity_name: { $regex: search, $options: "i" },
        },
      },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $addFields: {
          participation_status: {
            $cond: {
              if: { $in: [foundStudent?.student_id, "$activity_participants"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$activity_start_date",
            },
          },
          activities: { $push: "$$ROOT" },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $sort: { "activities.activity_start_date": -1 },
      },
    ]);
    return result;
  }

  static async getActivityParticipants({
    activity_id,
  }: {
    activity_id: string;
  }) {
    return activities.findOne(
      { _id: convertToObjectIdMongoose(activity_id) },
      { activity_participants: 1 }
    );
  }

  static async getActivity({ activity_id }: { activity_id: string }) {
    return await activities
      .findOne({ _id: convertToObjectIdMongoose(activity_id) })
      .lean();
  }

  static async createActivity({
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_duration,
    activity_thumb_url,
    created_by,
    activity_categories,
    activity_location,
    activity_host,
  }: IActivity) {
    const result = await activities.create({
      activity_name,
      activity_start_date,
      activity_max_participants,
      activity_point,
      activity_duration,
      activity_thumb_url,
      created_by,
      activity_location,
      activity_categories,
      activity_host,
    });

    const users = await students.aggregate([
      {
        $match: {
          subscribed_categories: { $in: activity_categories },
        },
      },
      {
        $group: {
          _id: 1,
          userIds: { $addToSet: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const userIds = users[0].userIds.map((oid: ObjectId) => oid.toString());

    if (users.length > 0) {
      await NotificationService.sendNotification({
        userIds: userIds,
        title: `Hoạt động mới: ${activity_name}`,
        message: `Có hoạt động mới trùng với danh mục bạn đăng ký`,
        type: Notification_type.ANNOUNCEMENT,
      });
    }

    return result;
  }

  static async updateActivity({
    activity_id,
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_thumb_url,
    activity_location,
    activity_duration,
    activity_categories,
    activity_host,
  }: IActivity & { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(activity_id) },
      {
        activity_name,
        activity_start_date,
        activity_max_participants,
        activity_point,
        activity_location,
        activity_thumb_url,
        activity_duration,
        activity_categories,
        activity_host,
      }
    );
  }

  static async removeActivity({ activity_id }: { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { activity_id },
      { activity_status: Activity_status.REMOVED }
    );
  }

  static async participateInActivity({
    activity_id,
    userId,
  }: {
    activity_id: string;
    userId: string;
  }) {
    const foundStudent = await findStudentById(userId);
    if (!foundStudent) {
      throw new NotFoundError("Student not found");
    }
    const foundActivity = await ActivityService.getParticipatableActivity({
      activity_id,
    });

    if (!foundActivity) {
      throw new NotFoundError("Activity not found");
    }

    const participated = await this.redisService.acquireLock({
      id: activity_id,
      callback: async () => {
        return await activities.updateOne(
          { _id: convertToObjectIdMongoose(activity_id) },
          {
            $inc: { activity_total_participants: 1 },
            $push: {
              activity_participants: {
                student_id: foundStudent.student_id,
                student_name: foundStudent.student_name,
              },
            },
            $set: {
              status: {
                $cond: {
                  if: {
                    $eq: [
                      "$activity_total_participants",
                      "$activity_max_participants",
                    ],
                  },
                  then: Activity_status.FULL,
                  else: "$status",
                },
              },
            },
          }
        );
      },
    });

    if (!participated || participated == 0) {
      throw new BadRequestError("Failed to participate in activity");
    }

    return {
      activity_id,
      student: await participateInActivity({
        activity_id: foundActivity._id.toString(),
        student_id: foundStudent.student_id,
        activity_name: foundActivity.activity_name,
      }),
    };
  }

  static async leaveActivity({
    activity_id,
    student_id,
  }: {
    activity_id: string;
    student_id: string;
  }) {
    const result = await activities.findOneAndUpdate(
      { activity_id, activity_status: Activity_status.OPEN },
      {
        $pull: { activity_participants: { student_id } },
        $inc: { activity_total_participants: -1 },
      },
      { new: true }
    );

    if (
      result &&
      result.activity_total_participants >= result.activity_max_participants
    ) {
      return await activities.findOneAndUpdate(
        { activity_id },
        { activity_status: Activity_status.FULL },
        { new: true }
      );
    }
    return result;
  }

  static async closeActivity({ activity_id }: { activity_id: string }) {
    return await activities.findOneAndUpdate(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: { $ne: Activity_status.CLOSED },
      },
      { activity_status: Activity_status.CLOSED }
    );
  }
}

export { ActivityService };
