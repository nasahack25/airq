"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

import PostCard from "@/components/community/PostCard"
import CommentCard from "@/components/community/CommentCard"
import AddCommentForm from "@/components/community/AddCommentForm"
import { PostSkeleton, CommentSkeleton } from "@/components/community/SkeletonLoader"

export default function PostDetailPage() {
    const { postId } = useParams()
    const { isAuthenticated, loading: authLoading } = useAuth()

    const [post, setPost] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPostDetails = async () => {
        if (!postId) return
        setLoading(true)
        try {
            const response = await api.get(`/api/community/posts/${postId}`)
            setPost(response.data)
            setComments(response.data.comments || [])
        } catch (err) {
            setError("Failed to load post. It may have been deleted or the link is incorrect.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPostDetails()
    }, [postId])

    const handleCommentAdded = (newComment: any) => {
        setComments((prevComments) => [...prevComments, newComment])
        // Also update the comment count on the post object
        if (post) {
            setPost({ ...post, _count: { ...post._count, comments: post._count.comments + 1 } })
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/30 via-transparent to-teal-100/30 animate-gradient" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto py-8 px-4">
                    <PostSkeleton />
                    <div className="mt-8 space-y-4">
                        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-32 animate-pulse" />
                        <CommentSkeleton />
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-4 p-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Post Not Found</h2>
                        <p className="text-slate-600">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
                        <p className="text-slate-600 font-medium">Post not found</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/30 via-transparent to-teal-100/30 animate-gradient" />

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-teal-200/20 rounded-full blur-xl animate-float" />
                <div
                    className="absolute bottom-40 right-20 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-sky-200/20 rounded-full blur-xl animate-float"
                    style={{ animationDelay: "3s" }}
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto py-8 px-4 mt-20">
                {/* We can reuse the PostCard component to display the main post */}
                <PostCard post={post} isLink={false} />

                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                            Comments
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{comments.length}</span>
                    </div>

                    {isAuthenticated && (
                        <div className="mb-6">
                            <AddCommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
                        </div>
                    )}

                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={comment.id} style={{ animationDelay: `${index * 100}ms` }}>
                                    <CommentCard comment={comment} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700 mb-2">Be the first to comment!</h3>
                                <p className="text-slate-500">Share your thoughts on this post</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
