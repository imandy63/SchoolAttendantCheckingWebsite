import mongoose from "mongoose";

const COLLECTION_NAME = "ActivityTrackings";
const DOCUMENT_NAME = "ActivityTracking";

const ActivityTrackingSchema = new mongoose.Schema(
  {
    activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: { type: String, enum: ["JOINED", "ABSENT"], required: true },
    participation_date: { type: Date, default: Date.now },
    activity_score: { type: Number },
    notes: { type: String },
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
  activity_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  status: "JOINED" | "ABSENT";
  participation_date: Date;
  activity_score: number;
  notes: string;
}
export const activityTrackings = mongoose.model(
  DOCUMENT_NAME,
  ActivityTrackingSchema
);
