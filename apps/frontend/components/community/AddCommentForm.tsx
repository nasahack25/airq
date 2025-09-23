"use client";
import { useState } from 'react';
import api from '@/lib/api';

interface AddCommentFormProps {
    postId: string;
    onCommentAdded: (newComment: any) => void;
}

export default function AddCommentForm({ postId, onCommentAdded }: AddCommentFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');
        try {
            const response = await api.post(`/api/community/posts/${postId}/comments`, { content });
            onCommentAdded(response.data); // Pass the new comment back to the parent page
            setContent(''); // Clear the input
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to post comment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add your comment..."
                className="w-full p-3 bg-gray-700 rounded-md text-white border-gray-600 focus:ring-blue-500 focus:outline-none"
                rows={3}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <div className="flex justify-end mt-2">
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold transition-colors disabled:bg-blue-800">
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}
