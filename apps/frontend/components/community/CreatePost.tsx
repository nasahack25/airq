"use client";

import { useState } from 'react';
import api from '@/lib/api';

interface CreatePostProps {
    onPostCreated: () => void; // Callback to refresh the post list
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Post content cannot be empty.');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            await api.post('/api/community/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setContent('');
            setImage(null);
            onPostCreated(); // Refresh the feed
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 bg-gray-700 rounded-md text-white border-gray-600 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                />
                <div className="flex justify-between items-center mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold transition-colors disabled:bg-blue-800">
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
}
