import { InferSchemaType, model, Schema, Types } from "mongoose"; // Erase if already required
import { Activity_status } from "../enum/activity.enum";

const ActivityParticipantSchema = new Schema({
  student_id: {
    type: String,
    required: true,
  },
  student_name: {
    type: String,
    required: true,
  },
});

const DOCUMENT_NAME = "Activity";
const COLLECTION_NAME = "Activities";
const ActivitySchema = new Schema(
  {
    activity_name: {
      type: String,
      required: true,
    },
    activity_participants: {
      type: [ActivityParticipantSchema],
      default: [],
    },
    activity_max_participants: {
      type: Number,
      required: true,
    },
    activity_total_participants: {
      type: Number,
      default: 0,
    },
    activity_point: {
      type: Number,
      required: true,
    },
    activity_thumb_url: {
      type: String,
      default: null,
    },
    activity_duration: {
      type: Number,
      required: true,
    },
    activity_start_date: {
      type: Date,
      required: true,
    },
    created_by: {
      type: String,
      default: "",
      required: false,
    },
    activity_categories: {
      type: [String],
      required: true,
    },
    activity_status: {
      type: String,
      enum: Activity_status,
      required: true,
      default: Activity_status.OPEN,
    },
    activity_host: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);

ActivitySchema.index(
  { activity_name: 1, activity_start_date: 1 },
  { unique: true }
);
ActivitySchema.index({ activity_name: "text" });

export interface IActivity extends Document {
  activity_name: Types.ObjectId;
  activity_start_date: Date;
  activity_participants: IActivityParticipant[];
  activity_max_participants: number;
  activity_point: number;
  activity_thumb_url?: string;
  activity_duration: number;
  created_by?: string | null;
  activity_categories: string[];
  activity_status: string;
  activity_host: string;
}

export interface IActivityParticipant {
  student_id: string;
  student_name: string;
}

export const activities = model(DOCUMENT_NAME, ActivitySchema);
