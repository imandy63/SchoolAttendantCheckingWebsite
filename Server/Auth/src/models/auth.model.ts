import { Schema, model, InferSchemaType } from "mongoose";
import { Participation_Status, Role } from "../enum/role.enum";

const DOCUMENT_NAME = "Student";
const COLLECTION_NAME = "Students";

const studentSchema = new Schema(
  {
    student_id: { type: String, required: true, unique: true }, // For auth and student info
    password: { type: String, required: true }, // For auth
    role: { type: String, default: Role.STUDENT, enum: Role }, // For auth

    student_name: { type: String, required: true },
    student_avatar_url: { type: String, default: "" },
    student_address: { type: String, required: true },
    student_class: {
      class_name: { type: String, required: true },
      faculty: { type: String, required: true },
    },
    student_activity_point: { type: Number, default: 0 },
    student_participated_activities: {
      type: [
        {
          name: { type: String },
          status: {
            type: String,
            default: Participation_Status.REGISTERED,
            enum: Participation_Status,
          },
          point: { type: Number },
        },
      ],
      default: [],
    },
    subscribed_categories: { type: [{ type: String }], default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
  }
);

export const students = model(DOCUMENT_NAME, studentSchema);
export type StudentPayload = InferSchemaType<typeof studentSchema>;
