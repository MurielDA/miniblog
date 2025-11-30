import { ApiResponse, AuthRequest } from "@/types";
import { NextFunction, Response } from "express";
import { commentService } from "./comment.service"

class CommentController {
    async createComment (req: AuthRequest, res: Response, next: NextFunction){
        try{
            const userId = req.user?.userId ?? "";
            const postId = req.params.postId;
            const comment = await commentService.createComment(userId, postId, req.body);
            const response: ApiResponse = {
                success: true,
                message: "Comment created successfully",
                data: comment
            }
            res.status(201).json(response);
        }catch(error){
            next(error);
        }
    }

    async getCommentsByPostId(req: AuthRequest, res: Response, next: NextFunction){
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await commentService.getPostComments(
                req.params.postId,
                page,
                limit
            );

            const response: ApiResponse = {
                success: true,
                message: 'Comments retrieved successfully',
                data: result,
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

      async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                });
            }

            const result = await commentService.deleteComment(
                req.params.commentId,
                userId
            );

            const response: ApiResponse = {
                success: true,
                message: result.message,
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}

export const commentController = new CommentController();