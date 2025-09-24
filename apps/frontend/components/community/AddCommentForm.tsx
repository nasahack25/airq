"use client"
import { useState } from "react"
import type React from "react"

import api from "@/lib/api"

interface AddCommentFormProps {
    postId: string
    onCommentAdded: (newComment: { id: string; content: string; createdAt: string; author: { id: string; username: string; avatar?: string } }) => void
}

export default function AddCommentForm({ postId, onCommentAdded }: AddCommentFormProps) {
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        setError("")
        try {
            const response = await api.post(`/api/community/posts/${postId}/comments`, { content })
            onCommentAdded(response.data) // Pass the new comment back to the parent page
            setContent("") // Clear the input
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } }
            setError(anyErr.response?.data?.message || "Failed to post comment.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 p-4 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Add your comment..."
                        className={`w-full p-3 bg-slate-50/50 border-2 rounded-lg text-slate-700 placeholder:text-slate-400 resize-none transition-all duration-300 focus:bg-white focus:shadow-md focus:outline-none ${isFocused ? "border-teal-400 shadow-md shadow-teal-100" : "border-slate-200 hover:border-slate-300"
                            }`}
                        rows={3}
                    />
                    {isFocused && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/20 to-sky-400/20 -z-10 blur-lg transition-opacity duration-300" />
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Posting...
                            </div>
                        ) : (
                            "Post Comment"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
