import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { createCommentSchema, postIdSchema, deleteCommentSchema } from "./comment.validation";
import { commentController } from "./comment.controller";

const commentRouter = Router();

// create a comment
commentRouter.post('/post/:postId', authenticate, validate(createCommentSchema), commentController.createComment);

// get comments by postId
commentRouter.get('/post/:postId', validate(postIdSchema), commentController.getCommentsByPostId);

// delete a comment by commentId
commentRouter.delete('/:commentId', authenticate, validate(deleteCommentSchema), commentController.deleteComment);

export default commentRouter;