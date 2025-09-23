"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

import CreatePost from '@/components/community/CreatePost';
import PostCard from '@/components/community/PostCard';

export default function CommunityPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const response = await api.get('/api/community/posts');
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoadingPosts(false);
        }
    };
    
    useEffect(() => {
        // If auth is done loading and user is not authenticated, redirect
        if (!authLoading && !isAuthenticated) {
            router.push('/signin');
        } else if (isAuthenticated) {
            // Fetch posts only if authenticated
            fetchPosts();
        }
    }, [isAuthenticated, authLoading, router]);

    // Render a loading state until authentication check is complete
    if (authLoading) {
        return <div className="text-center p-10 text-white">Loading session...</div>;
    }
    
    // If not authenticated, the redirect will happen, but we can show a message
    if (!isAuthenticated) {
        return <div className="text-center p-10 text-white">Redirecting to login...</div>;
    }
    
    // Main content for authenticated users
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-4xl font-bold mb-6">Community Feed</h1>
                <CreatePost onPostCreated={fetchPosts} />
                <div className="mt-8 space-y-6">
                    {loadingPosts ? (
                        <p>Loading posts...</p>
                    ) : (
                        posts.map((post: any) => (
                           <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
