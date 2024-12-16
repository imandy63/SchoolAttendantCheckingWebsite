import { Schema, model, InferSchemaType } from "mongoose";
import { Participation_Status, Role } from "../enum/role.enum";
import { text } from "express";

const DOCUMENT_NAME = "Student";
const COLLECTION_NAME = "Students";

const studentSchema = new Schema(
  {
    student_id: { type: String, required: true, unique: true }, // For auth and student info
    password: { type: String, required: true }, // For auth
    role: { type: String, default: Role.STUDENT, enum: Role }, // For auth

    student_name: { type: String, required: true },
    student_avatar_url: { type: String, default: "" },
    student_address: { type: String },
    student_class: {
      class_name: { type: String },
      faculty: { type: String },
    },
    student_activity_point: { type: Number, default: 0 },
    student_participated_activities: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
          },
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

studentSchema.index({ student_name: "text" });
studentSchema.index({ student_id: "text" });

export interface StudentPayload extends Document {
  student_id: string;
  password: string;
  role: string;
  student_name: string;
  student_avatar_url: string;
  student_address: string;
  student_class: {
    class_name: string;
    faculty: string;
  };
  student_activity_point: number;
  student_participated_activities: {
    name: string;
    status: string;
    point: number;
  }[];
  subscribed_categories: string[];
}

export const students = model(DOCUMENT_NAME, studentSchema);
