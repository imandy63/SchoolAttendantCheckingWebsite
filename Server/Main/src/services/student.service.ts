import { BadRequestError, NotFoundError } from "../core/error.response";
import { Participation_Status, Role } from "../enum/role.enum";
import { StudentParticipatedActivity } from "../interfaces/activity.interface";
import { students, StudentPayload } from "../models/student.model";
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

  static studentJoinActivity = async ({
    student_id,
    activity_id,
  }: {
    student_id: string;
    activity_id: string;
  }) => {
    const foundActivity = await ActivityService.getParticipatableActivity({
      activity_id,
    });

    if (!foundActivity) {
      throw new NotFoundError("Activity not found");
    }

    const participated = this.redisService.acquireLock({
      id: activity_id,
      callback: async () => {
        return await ActivityService.participateInActivity({
          activity_id,
          student_id,
          student_name: foundActivity.activity_name,
        });
      },
    });

    if (participated === null) {
      throw new BadRequestError(
        "Can't participated in the activity at the moment"
      );
    }

    return await students.findByIdAndUpdate(
      {
        student_id: student_id,
        $and: [
          {
            "student_participated_activities.name": {
              $ne: foundActivity.activity_name,
            },
          },
          {
            "student_participated_activities.status":
              Participation_Status.REGISTERED,
          },
        ],
      },
      {
        $addToSet: {
          student_participated_activities: {
            name: foundActivity.activity_name,
            status: Participation_Status.REGISTERED,
          },
        },
      },
      { new: true }
    );
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
    student_id,
    point,
  }: {
    student_id: string;
    point: Number;
  }) => {
    return await students.findOneAndUpdate(
      { student_id: student_id },
      { $inc: { student_activity_point: point } },
      { new: true }
    );
  };
}
