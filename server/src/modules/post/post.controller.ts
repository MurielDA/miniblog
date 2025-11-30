import { Response, NextFunction} from "express";
import { postService } from "./post.service";
import { AuthRequest, ApiResponse } from "@/types/index";

class PostController {

    async createPost(req: AuthRequest, res: Response, next: NextFunction) {
        
        try {
            const userId = req.user!.userId;
            const post = await postService.createPost(userId, req.body);
            const response: ApiResponse = {
                success: true,
                message: "Post created successfully",
                data: post
            }
            res.status(201).json(response);

        }catch (error) {
            next(error);
        }
    }

    async getPostById(req: AuthRequest, res: Response, next: NextFunction) {
        
        try {
            const postId = req.params.postId;
            const post = await postService.getPostById(postId);
            const response: ApiResponse = {
                success: true,
                message: "Post fetched successfully",
                data: post
            }
            res.status(200).json(response);
        }catch (error) {
            next(error);
        }
    }

    async getPostsByUserId(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const posts = await postService.getPostsByUserId(userId, page, limit);
            const response: ApiResponse = {
                success: true,
                message: "Posts fetched successfully",
                data: posts
            }
            res.status(200).json(response);
        }catch (error) {
            next(error);
        }

    }

    async getAllPosts(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const posts = await postService.getAllPosts(page, limit);
            const response: ApiResponse = {
                success: true,
                message: "Posts fetched syccessfully",
                data: posts
            }
            res.status(200).json(response);

        }catch(error){
            next(error);
        }
    }

    async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const postId = req.params.postId;

            const result = await postService.deletePost(postId, userId);
            const response: ApiResponse = {
                success: true,
                message: result.message
            }
            res.status(200).json(response);
        }catch (error) {
            next(error);
        }
    }

    async updatePost(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const userId = req.user!.userId;
            const postId = req.params.postId;

            const post = await postService.updatePost(postId, userId, req.body);
            const response: ApiResponse = {
                success: true,
                message: "Post updated successfully",
                data: post
            }

            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }

    async likePost(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const userId = req.user!.userId;
            const postId = req.params.postId;

            const post = await postService.likePost(postId, userId);
            const response: ApiResponse = {
                success: true,
                message: "Post liked successfully",
                data: post
            }

            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }
    async unlikePost(req: AuthRequest, res: Response, next: NextFunction) {
        try{
            const userId = req.user!.userId;
            const postId = req.params.postId;

            const post = await postService.unlikePost(postId, userId);
            const response: ApiResponse = {
                success: true,
                message: "Post liked successfully",
                data: post
            }

            res.status(200).json(response);
        }catch(error){
            next(error);
        }
    }


};

export const postController = new PostController();