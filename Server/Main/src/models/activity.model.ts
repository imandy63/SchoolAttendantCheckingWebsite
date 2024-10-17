import { InferSchemaType, model, Schema, Types } from "mongoose"; // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";
const userSchema = new Schema(
  {
    activity_name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    activity_thumb: {
      type: String,
      required: true,
    },
    activity_start_date: {
      type: String,
      required: true,
    },
    activity_end_date: {
      type: Date,
      required: true,
    },
    activity_participants: {
      type: Array,
      default: [],
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

export const user = model(DOCUMENT_NAME, userSchema);
export type UserPayload = InferSchemaType<typeof userSchema>;
