import { activityTrackings } from "../models/activityTracking.model";
import { activities } from "../models/activity.model";
import { convertToObjectIdMongoose } from "../utils";
import { Activity_status } from "../enum/activity.enum";

export class ActivityTrackingService {
  static async generateTracking(activity_id: string) {
    const foundActivity = await activities.findOne(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: {
          $not: {
            $in: [Activity_status.REMOVED, Activity_status.CLOSED],
          },
        },
      },
      { activity_participants: 1, _id: 0 }
    );
    if (
      foundActivity != null &&
      foundActivity.activity_participants.length > 0
    ) {
      const bashInsert = foundActivity.activity_participants.map(
        (participant) => {
          return {
            activity_id,
            user_id: participant.student_id,
          };
        }
      );

      if (bashInsert.length > 0) {
        return await activityTrackings.insertMany(bashInsert);
      }
    }
    return null;
  }

  static async getStudentActivityTracking({
    activity_id,
  }: {
    activity_id: string;
  }) {
    const foundTracking = await activityTrackings
      .find({ activity_id: convertToObjectIdMongoose(activity_id) })
      .lean();
    if (foundTracking.length > 0) {
      return foundTracking;
    } else {
      return await ActivityTrackingService.generateTracking(activity_id);
    }
  }

  static async updateTracking() {
    return await activityTrackings.updateMany();
  }
}
