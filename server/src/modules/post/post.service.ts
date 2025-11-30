import { Post } from '@/models/post.model';
import { User } from '@/models/user.model';
import { AppError, PaginatedResult } from '@/types';
import mongoose from 'mongoose';
import { commentService } from '../comment/comment.service';

interface PostData {
    content: string;
    images?: string[];
}

class PostService {

    async createPost(userId: string, data: PostData) {

        const post = await Post.create({
            author: userId,
            content: data.content,
            images: data.images || []
        });

        post.populate("author", "username avatarUrl");

        return post;
    }

    async getPostById(postId: string) {
        if(!mongoose.Types.ObjectId.isValid(postId)){
            throw new AppError(400, "Invalid post ID");
        }

        const post = await Post.findById(postId).populate("author", "username avatarUrl");
        if(!post){
            throw new AppError(404, "Post not found")
        }
        const commentsCount = await commentService.getCommentCount(postId);
        return {
            ...post.toObject(),
            commentsCount,
        };
    }

    async getPostsByUserId(userId: string, page = 1, limit = 10) {
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new AppError(400, "Invalid user ID");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError(404, "User not found");
        }

        const skip = (page - 1) * limit;

        const [posts, totalItems] = await Promise.all([
            Post.find({ author: userId })
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .populate("author", "username avatarUrl"),
            Post.countDocuments({ author: userId }),
        ]);
        const postsWithCommentCount = await Promise.all(
            posts.map(async (post) => ({
                ...post.toObject(),
                commentsCount: await commentService.getCommentCount(post._id.toString()),
            }))
        );

        const result: PaginatedResult<typeof postsWithCommentCount[0]> = {
            data: postsWithCommentCount,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),   
            }
        };
        return result;
    }

    async getAllPosts(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [posts, totalItems] = await Promise.all([
            Post.find()
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .populate("author", "username avatarUrl"),
            Post.countDocuments(),
        ]);
        const postsWithCommentCount = await Promise.all(
            posts.map(async (post) => ({
                ...post.toObject(),
                commentsCount: await commentService.getCommentCount(post._id.toString()),
            }))
        );

        const result: PaginatedResult<typeof postsWithCommentCount[0]> = {
            data: postsWithCommentCount,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),   
            }
        };
        return result;

    }

    async deletePost(postId: string, userId: string) {
        if(!mongoose.Types.ObjectId.isValid(postId)){
            throw new AppError(400, "Invalid post ID");
        }
        const post =  await Post.findById(postId);
        if(!post){
            throw new AppError(404, "Post not found");
        }

        if(post.author.toString() !== userId){
            throw new AppError(403, "You are not authorized to delete this post");
        }

        await post.deleteOne();
        return { message: "Post deleted successfully" };

    }

    async updatePost(postId: string, userId: string, data: PostData) {
        if(!mongoose.Types.ObjectId.isValid(postId)){
            throw new AppError(400, "Invalid post ID");
        }

        const post =  await Post.findById(postId);
        if(!post){
            throw new AppError(404, "Post not found");
        }

        if(post.author.toString() !== userId){
            throw new AppError(403, "You are not authorized to update this post");
        }

        post.content = data.content;
        if(data.images){
            post.images = data.images;
        }

        await post.save();
        await post.populate("author", "username avatarUrl");

        const commentsCount = await commentService.getCommentCount(postId);
        return {
            ...post.toObject(),
            commentsCount,
        };
    }

    async likePost(postId: string, userId: string ) {
        if(!mongoose.Types.ObjectId.isValid(postId)){
            throw new AppError(400, "Invalid post ID");
        }
        const post =  await Post.findById(postId);
        if(!post){
            throw new AppError(404, "Post not found");  
        }

        const isLiked = post.likes.some((id) => id.equals(userId));
        if(isLiked){
            throw new AppError(400, "You have already liked the post");
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId, 
            {$addToSet: {likes: userId},},
            {new: true}
        );

        if (!updatedPost) {
           throw new AppError(500, "Failed to update post");
        }

        const commentsCount = await commentService.getCommentCount(postId);
        return {
            ...updatedPost.toObject(),
            commentsCount,
        };
    
    }

    async unlikePost(postId: string, userId: string){
        
        if(!mongoose.Types.ObjectId.isValid(postId)){
            throw new AppError(400, "Invalid post ID");
        }
        const post =  await Post.findById(postId);
        if(!post){
            throw new AppError(404, "Post not found");  
        }

        const isLiked = post.likes.some((id) => id.equals(userId));
        if(!isLiked){
            return post;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId, 
            {$pull: {likes: userId},},
            {new: true}
        );

        if (!updatedPost) {
           throw new AppError(500, "Failed to update post");
        }

        const commentsCount = await commentService.getCommentCount(postId);
        return {
            ...updatedPost.toObject(),
            commentsCount,
        };
    }

    async retweetPost() {

    }

    async unretweetPost() {

    }


}

export const postService = new PostService();