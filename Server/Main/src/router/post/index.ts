import PostController from "../../controllers/post.controller";
import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authentication";

const router = express.Router();

router.get("/", asyncHandler(PostController.getPosts));

router.get("/top-5-latest", asyncHandler(PostController.getTop5LatestPosts));

router.get("/all", asyncHandler(PostController.getAllPosts));

router.get("/:id", asyncHandler(PostController.getPostDetails));

router.use(asyncHandler(authentication));

router.post("/", asyncHandler(PostController.createPost));

router.put("/:id", asyncHandler(PostController.updatePost));

router.put("/restore/:id", asyncHandler(PostController.restorePost));

router.delete("/:id", asyncHandler(PostController.deletePost));

export default router;
