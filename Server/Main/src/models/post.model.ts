import mongoose from "mongoose";

const COLLECTION_NAME = "Posts";
const DOCUMENT_NAME = "Post";

const PostSchema = new mongoose.Schema(
  {
    post_title: { type: String, required: true },
    post_author: { type: String, required: true },
    post_contents: { type: String, required: true },
    post_date: {
      type: Date,
      default: new Date().toUTCString(),
    },
    post_deleted: {
      type: Boolean,
      default: false,
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

PostSchema.index({ post_title: "text" });

export interface Post {
  post_title: string;
  post_author: string;
  post_contents: string;
}

export const posts = mongoose.model(DOCUMENT_NAME, PostSchema);
