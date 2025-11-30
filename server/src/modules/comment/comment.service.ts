import { Comment } from "@/models/comment.model";
import { Post } from "@/models/post.model";
import { AppError, PaginatedResult } from "@/types";
import mongoose from "mongoose";

interface CommentData{
    content: string;
    images?: string[];
}

class CommentService {
    async createComment(userId: string, postId: string, data: CommentData) {

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new AppError(400, 'Invalid post ID');
        }

        const post = await Post.findById(postId);
        if (!post) {
            throw new AppError(404, 'Post not found');
        }

        const comment = await Comment.create({
            content: data.content,
            author: userId,
            post:postId
        });

        comment.populate("author", "username avatarUrl");
        return comment;
    }

    async getPostComments(postId: string, page: number = 1, limit: number = 20) {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new AppError(400, 'Invalid post ID');
        }

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
        throw new AppError(404, 'Post not found');
        }

        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ post: postId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'username avatar')
                ,
            Comment.countDocuments({ post: postId }),
        ]);

        const result: PaginatedResult<typeof comments[0]> = {
            data: comments,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        };

        return result;
    }

    async deleteComment(commentId: string, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new AppError(400, 'Invalid comment ID');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new AppError(404, 'Comment not found');
        }

        // Check if the user is the author
        if (comment.author.toString() !== userId) {
            throw new AppError(403, 'You are not authorized to delete this comment');
        }

        await comment.deleteOne();

        return { message: 'Comment deleted successfully' };
    }
    async getCommentCount(postId: string): Promise<number> {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return 0;
        }

        return Comment.countDocuments({ post: postId });
    }
}

export const commentService = new CommentService();