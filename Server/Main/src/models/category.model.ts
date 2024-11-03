import { Schema, Document, model } from "mongoose";

const COLLECTION_NAME = "Categories";
const DOCUMENT_NAME = "Category";

export interface Post extends Document {
  category_name: string;
}

const PostSchema: Schema = new Schema(
  {
    category_name: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);

export const categories = model(DOCUMENT_NAME, PostSchema);
