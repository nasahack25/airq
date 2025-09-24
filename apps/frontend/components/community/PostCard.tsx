"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import api from "@/lib/api"

interface PostCardProps {
    post: {
        id: string
        content: string
        imageUrl?: string
        createdAt: string
        author: {
            id: string
            username: string
            avatar?: string
        }
        _count: {
            likes: number
            comments: number
        }
    }
    isLink?: boolean // Prop to disable the link behavior on the detail page itself
}

export default function PostCard({ post, isLink = true }: PostCardProps) {
    const avatarSrc = post.author.avatar ? post.author.avatar : "/placeholder-user.jpg"
    const cardRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // State for optimistic UI updates
    const [likeCount, setLikeCount] = useState(post._count.likes)
    const [isLiked, setIsLiked] = useState(false) // In a real app, you'd get this from the API
    const [isAnimating, setIsAnimating] = useState(false)

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.1, rootMargin: "50px" },
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent navigation when clicking the button
        e.preventDefault()

        // Trigger heartbeat animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)

        // Optimistic update
        const newIsLiked = !isLiked
        setIsLiked(newIsLiked)
        setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1))

        try {
            await api.post(`/api/community/posts/${post.id}/like`)
            // The optimistic state is likely correct.
        } catch (error) {
            console.error("Failed to toggle like:", error)
            // Revert the state if the API call fails
            setIsLiked(!newIsLiked)
            setLikeCount(post._count.likes)
        }
    }

    const postContent = (
        <div
            ref={cardRef}
            className={`bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
                } hover:-translate-y-2 hover:shadow-sky-200/50`}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <Image
                            src={avatarSrc || "/placeholder.svg"}
                            alt={post.author.username}
                            width={48}
                            height={48}
                            className="rounded-full ring-2 ring-slate-100 group-hover:ring-sky-200 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors duration-300">
                                {post.author.username}
                            </p>
                            <span className="text-slate-400">·</span>
                            <p className="text-slate-500 text-sm">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-pretty">{post.content}</p>

                        {post.imageUrl && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 group-hover:border-sky-200 transition-all duration-300">
                                <Image
                                    src={post.imageUrl || "/placeholder.svg"}
                                    alt="Post image"
                                    width={500}
                                    height={300}
                                    className={`w-full h-auto object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                                        }`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-6 mt-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition-all duration-300 group/like ${isLiked ? "text-pink-500" : "text-slate-500 hover:text-pink-500"
                                    }`}
                            >
                                <div className={`relative ${isAnimating ? "animate-heartbeat" : ""}`}>
                                    <svg
                                        className="w-5 h-5 transition-all duration-300 group-hover/like:scale-110"
                                        fill={isLiked ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    {isLiked && <div className="absolute inset-0 bg-pink-400 rounded-full opacity-30 animate-ping" />}
                                </div>
                                <span className="font-medium">{likeCount}</span>
                            </button>

                            <div className="flex items-center gap-2 text-slate-500 hover:text-teal-500 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <span className="font-medium">{post._count.comments}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    )

    // If isLink is true, wrap the content in a Link component
    if (isLink) {
        return (
            <Link href={`/community/post/${post.id}`} className="block no-underline">
                {postContent}
            </Link>
        )
    }

    // Otherwise, just return the content
    return postContent
}
