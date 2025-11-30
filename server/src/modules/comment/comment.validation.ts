import z from "zod";

export const createCommentSchema = z.object({
    body: z.object({
        content: z.string()
            .min(1, "Post content cannot be empty")
            .max(280, "Post content cannot exceed 280 characters"),
    }),
    params: z.object({
        postId: z.string().length(24, "Invalid post ID")
    })
});

export const postIdSchema = z.object({
    params: z.object({
        postId: z.string().length(24, "Invalid post ID")
    })
});

export const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, 'Comment ID is required'),
    }),
});
