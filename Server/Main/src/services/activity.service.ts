import { Activity_status } from "../enum/activity.enum";
import {
  activities,
  IActivity,
  IActivityParticipant,
} from "../models/activity.model";
import { convertToObjectIdMongoose } from "../utils";

class ActivityService {
  static async getActivities({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page: number;
    limit: number;
    search: string;
  }) {
    const result = await activities
      .find({ activity_name: { $regex: search, $options: "i" } })
      .sort({ start_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await activities.countDocuments({
      activity_name: { $regex: search, $options: "i" },
    });
    return { data: result, total, page, limit };
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
    activity_thumb_url,
    activity_duration,
    created_by,
    activity_categories,
    activity_host,
  }: IActivity) {
    return await activities.create({
      activity_name,
      activity_start_date,
      activity_max_participants,
      activity_point,
      activity_thumb_url,
      activity_duration,
      created_by,
      activity_categories,
      activity_host,
    });
  }

  static async updateActivity({
    activity_id,
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_thumb_url,
    activity_duration,
    activity_categories,
    activity_host,
  }: IActivity & { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { activity_id },
      {
        activity_name,
        activity_start_date,
        activity_max_participants,
        activity_point,
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

  static async participate({
    activity_id,
    student_id,
    student_name,
  }: IActivityParticipant & { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { activity_id, activity_status: Activity_status.OPEN },
      { $push: { activity_participants: { student_id, student_name } } }
    );
  }

  static async leave({
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
}

export { ActivityService };
