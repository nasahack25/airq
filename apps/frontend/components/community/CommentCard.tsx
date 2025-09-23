"use client";
import Image from 'next/image';

interface CommentCardProps {
    comment: {
        id: string;
        content: string;
        createdAt: string;
        author: {
            id: string;
            username: string;
            avatar?: string;
        };
    };
}

export default function CommentCard({ comment }: CommentCardProps) {
    const avatarSrc = comment.author.avatar ? comment.author.avatar : '/default-avatar.png';

    return (
        <div className="flex items-start gap-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <Image
                src={avatarSrc}
                alt={comment.author.username}
                width={40}
                height={40}
                className="rounded-full"
            />
            <div className="w-full">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{comment.author.username}</p>
                    <p className="text-gray-400 text-sm">· {new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="mt-1 text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
        </div>
    );
}
