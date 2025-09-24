"use client"

import type React from "react"
import { useState } from "react"
import api from "@/lib/api"

interface CreatePostProps {
    onPostCreated: () => void // Callback to refresh the post list
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) {
            setError("Post content cannot be empty.")
            return
        }
        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("content", content)
        if (image) {
            formData.append("image", image)
        }

        try {
            await api.post("/api/community/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setContent("")
            setImage(null)
            onPostCreated() // Refresh the feed
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } }
            setError(anyErr.response?.data?.message || "Failed to create post.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Share an update or ask a question..."
                        className={`w-full p-4 bg-slate-50/50 border-2 rounded-xl text-slate-700 placeholder:text-slate-400 resize-none transition-all duration-300 focus:bg-white focus:shadow-lg focus:outline-none ${isFocused ? "border-sky-400 shadow-lg shadow-sky-100" : "border-slate-200 hover:border-slate-300"
                            }`}
                        rows={3}
                    />
                    {isFocused && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/20 to-teal-400/20 -z-10 blur-xl transition-opacity duration-300" />
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-full text-sm font-medium cursor-pointer hover:from-teal-600 hover:to-sky-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Add Image
                        </label>
                        {image && (
                            <span className="ml-3 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{image.name}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="px-8 py-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Posting...
                            </div>
                        ) : (
                            "Post"
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
            </form>
        </div>
    )
}
