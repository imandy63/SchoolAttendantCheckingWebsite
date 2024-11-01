import mongoose, { Schema, Document, model } from "mongoose";

const COLLECTION_NAME = "Posts";
const DOCUMENT_NAME = "Post";

export interface Post extends Document {
  post_title: string;
  post_author: string;
  post_contents: string[];
  post_thumb?: string;
}

const PostSchema: Schema = new Schema(
  {
    post_title: { type: String, required: true },
    post_author: { type: String, required: true },
    post_contents: { type: String, required: true },
    post_thumb: { type: String },
    post_date: { type: Date, default: new Date().toUTCString() },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);

export const post = model(DOCUMENT_NAME, PostSchema);
