import mongoose, { Schema, Document, model } from "mongoose";

const COLLECTION_NAME = "Posts";
const DOCUMENT_NAME = "Post";

export interface Post extends Document {
  post_title: string;
  post_author: string;
  post_contents: string[];
  post_date: Date;
}

const PostSchema: Schema = new Schema(
  {
    post_title: { type: String, required: true },
    post_author: { type: String, required: true },
    post_contents: { type: [String], required: true },
    post_date: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);
