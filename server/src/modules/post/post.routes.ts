import { Router } from "express";
import { postController } from "./post.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { createPostSchema, postIdSchema, getPostsByUserIdSchema, deletePostSchema, updatePostSchema } from "./post.validation";
import { validate } from "@/middleware/validate.middleware";

const postRouter = Router();


// get post by id
postRouter.get("/:postId", validate(postIdSchema), postController.getPostById);
// get posts by user id
postRouter.get("/user/:userId", validate(getPostsByUserIdSchema), postController.getPostsByUserId);
// get all posts
postRouter.get("/", postController.getAllPosts);

// Create a new post
postRouter.post("/", authenticate, validate(createPostSchema), postController.createPost);
// delete a post
postRouter.delete("/:postId", authenticate, validate(deletePostSchema), postController.deletePost);
// update a post
postRouter.put("/:postId", authenticate, validate(updatePostSchema), postController.updatePost);
// like a post
postRouter.post("/:postId/like", authenticate, validate(postIdSchema), postController.likePost);
// unlike a post
postRouter.delete("/:postId/like", authenticate, validate(postIdSchema), postController.unlikePost);

export default postRouter;
