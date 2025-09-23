import { Router } from 'express';
import {
    createPost,
    getAllPosts,
    getPostById,
    createComment,
    toggleLike
} from '../controllers/communityControllers';
import { UserAuth } from '../middlewares/userAuthentication';
import { upload } from '../middlewares/multer';

export const communityRouter = Router();

// --- Post Routes ---
// Get all posts (publicly accessible)
communityRouter.get('/posts', getAllPosts);

// Create a new post (protected, requires login, handles image upload)
communityRouter.post('/posts', UserAuth, upload.single('image'), createPost);

// Get a single post by its ID (publicly accessible)
communityRouter.get('/posts/:postId', getPostById);

// --- Comment Routes ---
// Add a comment to a post (protected, requires login)
communityRouter.post('/posts/:postId/comments', UserAuth, createComment);

// --- Like Routes ---
// Like or unlike a post (protected, requires login)
communityRouter.post('/posts/:postId/like', UserAuth, toggleLike);

