import mongoose from "mongoose";

const COLLECTION_NAME = "Posts";
const DOCUMENT_NAME = "Post";

const PostSchema = new mongoose.Schema(
  {
    post_title: { type: String, required: true },
    post_author: { type: String, required: true },
    post_contents: [{ type: Object, required: true }],
    post_date: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
    collection: COLLECTION_NAME,
  }
);

export interface Post {
  post_title: string;
  post_author: string;
  post_contents: string[];
}

module.exports = mongoose.model(DOCUMENT_NAME, PostSchema);
