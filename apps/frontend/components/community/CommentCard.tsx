"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface CommentCardProps {
    comment: {
        id: string
        content: string
        createdAt: string
        author: {
            id: string
            username: string
            avatar?: string
        }
    }
}

export default function CommentCard({ comment }: CommentCardProps) {
    const avatarSrc = comment.author.avatar ? comment.author.avatar : "/placeholder-user.jpg"
    const cardRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.1, rootMargin: "30px" },
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={cardRef}
            className={`bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 p-4 group ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-4"
                } hover:-translate-y-1`}
        >
            <div className="flex items-start gap-3">
                <div className="relative">
                    <Image
                        src={avatarSrc || "/placeholder.svg"}
                        alt={comment.author.username}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-slate-100 group-hover:ring-teal-200 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/20 to-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors duration-300">
                            {comment.author.username}
                        </p>
                        <span className="text-slate-400">·</span>
                        <p className="text-slate-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-pretty">{comment.content}</p>
                </div>
            </div>

            {/* Subtle hover glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400/5 to-sky-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    )
}
