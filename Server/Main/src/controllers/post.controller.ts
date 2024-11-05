import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/post.service";
import { NO_CONTENT, SuccessResponse } from "../core/success.response";

class PostController {
  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get posts successfully",
      metadata: await PostService.getPosts({ ...req.query }),
    }).send(res);
  };

  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get all posts successfully",
      metadata: await PostService.getAllPosts({ ...req.query }),
    }).send(res);
  };

  restorePost = async (req: Request, res: Response, next: NextFunction) => {
    await PostService.restorePost({ id: req.params.id });
    new NO_CONTENT({
      message: "Redo delete post successfully",
    }).send(res);
  };

  getPostDetails = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Get post details successfully",
      metadata: await PostService.getPostDetails({ id: req.params.id }),
    }).send(res);
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create post successfully",
      metadata: await PostService.createPost({ ...req.body }),
    }).send(res);
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Update post successfully",
      metadata: await PostService.updatePost({
        id: req.params.id,
        post: { ...req.body },
      }),
    }).send(res);
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    await PostService.deletePost({ id: req.params.id });
    new NO_CONTENT({
      message: "Delete post successfully",
    }).send(res);
  };
}

export default new PostController();
