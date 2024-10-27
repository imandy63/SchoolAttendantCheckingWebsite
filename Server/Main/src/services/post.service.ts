import { posts, Post } from "../models/post.model";
import { convertToObjectIdMongoose } from "../utils";

class PostService {
  static async getPosts({ page = 1, limit = 10, search = "" }) {
    const postsList = await posts
      .find({
        post_title: { $regex: search, $options: "i" },
        post_deleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await posts.countDocuments({
      post_deleted: false,
    });

    return {
      data: postsList,
      total,
      page,
      limit,
    };
  }

  static async getPostDetails({ id }: { id: string }) {
    const foundPost = await posts.findOne({
      _id: convertToObjectIdMongoose(id),
      post_deleted: false,
    });
    return foundPost;
  }

  static async createPost(post: Post) {
    const createdPost = await posts.create(post);
    return createdPost;
  }

  static async updatePost({ id, post }: { id: string; post: Post }) {
    const updatedPost = await posts.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(id), post_deleted: false },
      post,
      { new: true }
    );
    return updatedPost;
  }

  static async deletePost({ id }: { id: string }) {
    await posts.findOneAndUpdate(
      {
        _id: convertToObjectIdMongoose(id),
        post_deleted: false,
      },
      { post_deleted: true },
      { new: true }
    );
  }
}

export { PostService };
