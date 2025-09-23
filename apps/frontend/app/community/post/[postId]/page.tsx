"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

import PostCard from '@/components/community/PostCard';
import CommentCard from '@/components/community/CommentCard';
import AddCommentForm from '@/components/community/AddCommentForm';

export default function PostDetailPage() {
    const { postId } = useParams();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPostDetails = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/community/posts/${postId}`);
            setPost(response.data);
            setComments(response.data.comments || []);
        } catch (err) {
            setError("Failed to load post. It may have been deleted or the link is incorrect.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    const handleCommentAdded = (newComment: any) => {
        setComments(prevComments => [...prevComments, newComment]);
        // Also update the comment count on the post object
        if (post) {
            setPost({ ...post, _count: { ...post._count, comments: post._count.comments + 1 } });
        }
    };

    if (authLoading || loading) {
        return <div className="text-center p-10 text-white">Loading post...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-400">{error}</div>;
    }

    if (!post) {
        return <div className="text-center p-10 text-white">Post not found.</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-3xl mx-auto py-8 px-4">
                {/* We can reuse the PostCard component to display the main post */}
                <PostCard post={post} isLink={false} />

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    {isAuthenticated && <AddCommentForm postId={post.id} onCommentAdded={handleCommentAdded} />}

                    <div className="mt-6 space-y-4">
                        {comments.length > 0 ? (
                            comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
                        ) : (
                            <p className="text-gray-400">Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
