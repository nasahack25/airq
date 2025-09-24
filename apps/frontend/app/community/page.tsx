"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

import CreatePost from "@/components/community/CreatePost"
import PostCard from "@/components/community/PostCard"
import { PostSkeleton } from "@/components/community/SkeletonLoader"

export default function CommunityPage() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)

    const fetchPosts = async () => {
        setLoadingPosts(true)
        try {
            const response = await api.get("/api/community/posts")
            setPosts(response.data)
        } catch (error) {
            console.error("Failed to fetch posts:", error)
        } finally {
            setLoadingPosts(false)
        }
    }

    useEffect(() => {
        // If auth is done loading and user is not authenticated, redirect
        if (!authLoading && !isAuthenticated) {
            router.push("/signin")
        } else if (isAuthenticated) {
            // Fetch posts only if authenticated
            fetchPosts()
        }
    }, [isAuthenticated, authLoading, router])

    // Render a loading state until authentication check is complete
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-600 font-medium">Loading session...</p>
                </div>
            </div>
        )
    }

    // If not authenticated, the redirect will happen, but we can show a message
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-600 font-medium">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Main content for authenticated users
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/30 via-transparent to-teal-100/30 animate-gradient" />

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-teal-200/20 rounded-full blur-xl animate-float" />
                <div
                    className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-sky-200/20 rounded-full blur-xl animate-float"
                    style={{ animationDelay: "2s" }}
                />
                <div
                    className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-sky-100/30 to-teal-100/30 rounded-full blur-2xl animate-float"
                    style={{ animationDelay: "4s" }}
                />
                <div
                    className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-teal-100/30 to-sky-100/30 rounded-full blur-xl animate-float"
                    style={{ animationDelay: "1s" }}
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto py-8 px-4 mt-20">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-4 text-balance">
                        Community Feed
                    </h1>
                    <p className="text-slate-600 text-lg font-medium">
                        Share updates, ask questions, and connect with the community
                    </p>
                </div>

                <div className="mb-8">
                    <CreatePost onPostCreated={fetchPosts} />
                </div>

                <div className="space-y-6">
                    {loadingPosts ? (
                        // Elegant skeleton loaders
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : posts.length > 0 ? (
                        posts.map((post: any, index) => (
                            <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No posts yet</h3>
                            <p className="text-slate-500">Be the first to share something with the community!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
