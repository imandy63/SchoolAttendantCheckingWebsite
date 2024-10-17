import { BadRequestError, NotFoundError } from "../core/error.response";
import { student, StudentPayload } from "../models/student.model";

export class StudentService {
  static getStudent = async ({ student_id }: StudentPayload) => {
    return await student.find({ student_id }).lean();
  };

  static getStudents = async ({ page = 1, limit = 10 }) => {
    return await student
      .find()
      .sort({ student_id: 1 })
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

    const updatedStudent = await student.findOneAndUpdate(
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

  static studentJoinActivity = async (student_id: string, activity: {}) => {
    return await student.findByIdAndUpdate(
      { student_id: student_id },
      { $addToSet: { student_participated_activities: activity } },
      { new: true }
    );
  };

  static studentLeaveActivity = async (
    student_id: string,
    activity_bame: string
  ) => {
    return await student
      .findOneAndUpdate(
        { student_id: student_id },
        { $pull: { "student_participated_activities.name": activity_bame } },
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
    return await student.findOneAndUpdate(
      { student_id: student_id },
      { $inc: { student_activity_point: point } },
      { new: true }
    );
  };
}
