import PostController from "../../controllers/post.controller";
import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = express.Router();

router.get("/", asyncHandler(PostController.getPosts));

router.get("/:id", asyncHandler(PostController.getPostDetails));

router.post("/", asyncHandler(PostController.createPost));

router.put("/:id", asyncHandler(PostController.updatePost));

router.delete("/:id", asyncHandler(PostController.deletePost));

export default router;
