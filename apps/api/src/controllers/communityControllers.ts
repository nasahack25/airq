import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { uploadToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

// --- Validation Schemas ---
const postSchema = z.object({
    content: z.string().min(1, "Content cannot be empty.").max(280, "Content cannot exceed 280 characters."),
});

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty.").max(200, "Comment cannot exceed 200 characters."),
});

// --- Controllers ---
export const createPost = async (req: Request, res: Response) => {
    try {
        const result = postSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }

        const { content } = result.data;
        const userId = (req as any).user.id;
        let imageUrl: string | undefined = undefined;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const newPost = await prisma.post.create({
            data: {
                content,
                imageUrl,
                authorId: userId,
            },
            include: { author: { select: { username: true, avatar: true } } },
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, avatar: true } },
                _count: { select: { likes: true, comments: true } }
            },
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Get All Posts Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: { select: { id: true, username: true, avatar: true } },
                comments: {
                    include: { author: { select: { id: true, username: true, avatar: true } } },
                    orderBy: { createdAt: 'asc' },
                },
                _count: { select: { likes: true } }
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Get Post By ID Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = (req as any).user.id;

        const result = commentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors });
        }
        const { content } = result.data;

        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId: userId,
                postId,
            },
            include: { author: { select: { username: true, avatar: true } } },
        });

        // Increment comment count on the post
        await prisma.post.update({
            where: { id: postId },
            data: { commentCount: { increment: 1 } },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Create Comment Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = (req as any).user.id;

        const existingLike = await prisma.like.findUnique({
            where: { userId_postId: { userId, postId } },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({ where: { id: existingLike.id } });
            await prisma.post.update({
                where: { id: postId },
                data: { likeCount: { decrement: 1 } },
            });
            res.status(200).json({ message: "Post unliked." });
        } else {
            // Like
            await prisma.like.create({ data: { userId, postId } });
            await prisma.post.update({
                where: { id: postId },
                data: { likeCount: { increment: 1 } },
            });
            res.status(200).json({ message: "Post liked." });
        }
    } catch (error) {
        console.error("Toggle Like Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

