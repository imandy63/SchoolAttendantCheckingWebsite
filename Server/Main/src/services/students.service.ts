import { BadRequestError, NotFoundError } from "../core/error.response";
import { Participation_Status } from "../enum/role.enum";
import { StudentParticipatedActivity } from "../interface/activity.interface";
import { students, StudentPayload } from "../models/student.model";

export class StudentService {
  static getStudent = async ({ student_id }: StudentPayload) => {
    return await students.find({ student_id }).lean();
  };

  static getStudents = async ({
    page = 1,
    limit = 10,
    sort = "student_id",
    search = "",
  }) => {
    return await students
      .find({ student_name: { $regex: search, $options: "i" } })
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
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

  static studentJoinActivity = async (
    student_id: string,
    activity: StudentParticipatedActivity
  ) => {
    return await students.findByIdAndUpdate(
      {
        student_id: student_id,
        $and: [
          {
            "student_participated_activities.name": { $ne: activity.name },
          },
          {
            "student_participated_activities.status":
              Participation_Status.REGISTERED,
          },
        ],
      },
      { $addToSet: { student_participated_activities: activity } },
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
