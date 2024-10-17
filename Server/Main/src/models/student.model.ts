import { InferSchemaType, model, Schema, Types } from "mongoose"; // Erase if already required

const DOCUMENT_NAME = "Student";
const COLLECTION_NAME = "Students";
const studentSchema = new Schema(
  {
    student_id: {
      type: String,
      required: true,
      unique: true,
    },
    student_name: {
      type: String,
      required: true,
    },
    student_avatar_url: {
      type: String,
      required: true,
    },
    student_address: {
      type: String,
      required: true,
    },
    student_class: {
      type: String,
      required: true,
    },
    student_activity_point: {
      type: Number,
      required: true,
      default: 0,
    },
    student_participated_activities: {
      type: Array,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["", "ADMIN"],
      default: "student",
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

export const student = model(DOCUMENT_NAME, studentSchema);
export type StudentPayload = InferSchemaType<typeof studentSchema>;
