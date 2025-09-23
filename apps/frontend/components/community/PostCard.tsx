"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

interface PostCardProps {
    post: {
        id: string;
        content: string;
        imageUrl?: string;
        createdAt: string;
        author: {
            id: string;
            username: string;
            avatar?: string;
        };
        _count: {
            likes: number;
            comments: number;
        };
    };
    isLink?: boolean; // Prop to disable the link behavior on the detail page itself
}

export default function PostCard({ post, isLink = true }: PostCardProps) {
    const avatarSrc = post.author.avatar ? post.author.avatar : '/default-avatar.png';

    // State for optimistic UI updates
    const [likeCount, setLikeCount] = useState(post._count.likes);
    const [isLiked, setIsLiked] = useState(false); // In a real app, you'd get this from the API

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        e.preventDefault();

        // Optimistic update
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await api.post(`/api/community/posts/${post.id}/like`);
            // The optimistic state is likely correct.
            // For a more robust app, you might refetch the post data here on failure.
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Revert the state if the API call fails
            setIsLiked(isLiked);
            setLikeCount(post._count.likes);
        }
    };

    const postContent = (
        <div className="bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700 hover:border-blue-500 transition-colors duration-300 cursor-pointer">
            <div className="flex items-start gap-4">
                <Image
                    src={avatarSrc}
                    alt={post.author.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                />
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{post.author.username}</p>
                        <p className="text-gray-400 text-sm">· {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2 text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    {post.imageUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-600">
                            <Image src={post.imageUrl} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" />
                        </div>
                    )}
                    <div className="flex items-center gap-6 mt-4 text-gray-400">
                        <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            {likeCount}
                        </button>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            {post._count.comments}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // If isLink is true, wrap the content in a Link component
    if (isLink) {
        return (
            <Link href={`/community/post/${post.id}`} className="no-underline">
                {postContent}
            </Link>
        );
    }

    // Otherwise, just return the content
    return postContent;
}

