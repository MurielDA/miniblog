import { z } from 'zod';

export const createPostSchema = z.object({
    body: z.object({
        content: z.string()
            .min(1, "Post content cannot be empty")
            .max(280, "Post content cannot exceed 280 characters"),
        images: z.array(z.string().url("Each image must be a valid URL")).optional()
    }),
});

export const postIdSchema = z.object({
    params: z.object({
        postId: z.string().length(24, "Invalid post ID")
    })
});

export const paginationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .pipe(z.number().int().min(1, "Page must be a number >= 1")),

    limit: z
        .string()
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .pipe(z.number().int().min(1, "Limit must be >= 1").max(100, "Limit too large")),
});

export const getPostsByUserIdSchema = z.object({
    params: z.object({
        userId: z.string().length(24, "Invalid user ID")
    }),
    query: paginationQuerySchema
});

export const deletePostSchema = z.object({
    params: z.object({
        postId: z.string().length(24, "Invalid post ID")
    })
});

export const updatePostSchema = z.object({
    params: z.object({
        postId: z.string().length(24, "Invalid user ID")
    }),
    body: z.object({
        content: z.string()
            .min(1, "Post content cannot be empty")
            .max(280, "Post content cannot exceed 280 characters"),
        images: z.array(z.string().url("Each image must be a valid URL")).optional()
    }),

});