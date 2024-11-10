import { activityTrackings } from "../models/activityTracking.model";
import { activities, IActivityParticipant } from "../models/activity.model";
import { convertToObjectIdMongoose } from "../utils";
import { Activity_status } from "../enum/activity.enum";
import { startOfDay, endOfDay } from "date-fns";
import { students } from "../models/student.model";
import { ActivityTracking_status } from "../enum/activityTracking.enum";
import { ActivityService } from "./activity.service";
import { StudentService } from "./student.service";
import { NotFoundError } from "../core/error.response";

export class ActivityTrackingService {
  static async getStudentActivityTracking({
    activity_id,
  }: {
    activity_id: string;
  }) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const existingTracking = await activityTrackings
      .find({ activity_id: convertToObjectIdMongoose(activity_id) })
      .lean();

    if (existingTracking.length > 0) {
      const studentIds = existingTracking.map((tracking) => tracking.user_id);

      const studentsData = await students
        .find(
          { _id: { $in: studentIds } },
          { student_id: 1, student_class: 1, student_name: 1 }
        )
        .lean();

      const trackingWithStudentData = existingTracking.map((tracking) => {
        const student = studentsData.find(
          (s) => s._id.toString() === tracking.user_id.toString()
        );
        return {
          ...tracking,
          student_id: student?.student_id,
          student_class: student?.student_class,
          student_name: student?.student_name,
        };
      });

      return trackingWithStudentData;
    }

    const foundActivity = await activities.findOne(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: {
          $not: {
            $in: [Activity_status.REMOVED, Activity_status.CLOSED],
          },
        },
        activity_start_date: {
          $gte: todayStart,
          $lt: todayEnd,
        },
      },
      { activity_participants: 1, _id: 0 }
    );

    if (
      foundActivity != null &&
      foundActivity.activity_participants.length > 0
    ) {
      const participantIds = foundActivity.activity_participants.map(
        (participant) => participant.student_id
      );

      const studentsData = await students
        .find(
          { student_id: { $in: participantIds } },
          { student_id: 1, student_class: 1, student_name: 1 }
        )
        .lean();

      const bashInsert = studentsData.map((student) => ({
        activity_id,
        user_id: student._id,
        student_id: student.student_id,
        student_class: student.student_class,
        status: ActivityTracking_status.PENDING,
        student_name: student.student_name,
        participation_date: new Date().toUTCString(),
      }));
      if (bashInsert.length > 0) {
        await activityTrackings.insertMany(bashInsert);
        return bashInsert;
      }
    }

    return null;
  }

  static async getTracking({ activity_id }: { activity_id: string }) {
    const result = await activityTrackings.aggregate([
      {
        $match: {
          activity_id: convertToObjectIdMongoose(activity_id),
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "user_id",
          foreignField: "_id",
          as: "student_details",
        },
      },
      {
        $unwind: {
          path: "$student_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          student_id: "$student_details.student_id",
          student_name: "$student_details.student_name",
          activity_status: "$status",
          _id: 0,
        },
      },
    ]);
    console.log(result);
    return result;
  }

  static async updateTracking({
    student_ids,
    activity_id,
  }: {
    student_ids: string[];
    activity_id: string;
  }) {
    const foundActivity = await activities.findOne(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: {
          $not: {
            $in: [Activity_status.REMOVED, Activity_status.CLOSED],
          },
        },
      },
      { activity_participants: 1, _id: 0, activity_point: 1 }
    );
    if (!foundActivity) {
      throw new NotFoundError("Activity not found");
    }
    const foundStudents = await students.aggregate([
      {
        $match: {
          student_id: { $in: student_ids },
        },
      },
      {
        $group: {
          _id: 1,
          ids: { $push: "$_id" },
        },
      },
      {
        $project: {
          ids: 1,
        },
      },
    ]);
    if (foundStudents.length == 0) {
      throw new NotFoundError("Students not found");
    }

    // update student participated activities

    await activityTrackings.updateMany(
      {
        activity_id: convertToObjectIdMongoose(activity_id),
        user_id: { $in: foundStudents[0].ids },
      },
      {
        $set: {
          status: ActivityTracking_status.PARTICIPATED,
        },
      }
    );

    await activityTrackings.updateMany(
      {
        activity_id: convertToObjectIdMongoose(activity_id),
        user_id: { $nin: foundStudents[0].ids },
      },
      {
        $set: {
          status: ActivityTracking_status.ABSENT,
        },
      }
    );

    // update student point

    await StudentService.studentAddActivityPoint({
      student_ids,
      activity_id,
      point: foundActivity.activity_point,
    });
    await ActivityService.closeActivity({ activity_id });
    return { status: "success" };
  }
}
