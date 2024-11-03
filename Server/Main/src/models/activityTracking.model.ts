import { model, Schema } from "mongoose";
import { ActivityTracking_status } from "../enum/activityTracking.enum";

const COLLECTION_NAME = "ActivityTrackings";
const DOCUMENT_NAME = "ActivityTracking";

const ActivityTrackingSchema = new Schema(
  {
    activity_id: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    participation_date: { type: Date, default: new Date().toUTCString() },
    status: {
      type: String,
      enum: ActivityTracking_status,
      default: ActivityTracking_status.PENDING,
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);

export interface ActivityTracking extends Document {
  activity_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  status: ActivityTracking_status;
  participation_date: Date;
  notes: string;
}

export const activityTrackings = model(DOCUMENT_NAME, ActivityTrackingSchema);
