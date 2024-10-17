import { InferSchemaType, model, Schema, Types } from "mongoose"; // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

export const NOTIFICATION_TYPE = {
  WARNING: "warning",
  SUCCESS: "success",
  ANNOUNCEMENT: "announcement",
};

const notificationSchema = new Schema(
  {
    notification_email: {
      type: String,
      trim: true,
      required: true,
    },
    notification_type: {
      type: String,
      enum: ["warning", "success", "announcement"],
      required: true,
    },
    notification_status: {
      type: String,
      enum: ["sent", "read", "error"],
      default: "sent",
    },
    notification_message: {
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

export const notification = model(DOCUMENT_NAME, notificationSchema);
export type NotificationPayload = InferSchemaType<typeof notificationSchema>;
