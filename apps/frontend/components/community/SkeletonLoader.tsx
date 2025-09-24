"use client"

export function PostSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-24 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-16 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-3/4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-slate-200 to-slate-300 rounded relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                            </div>
                            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-slate-200 to-slate-300 rounded relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                            </div>
                            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CommentSkeleton() {
    return (
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-md p-4 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                    </div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-2/3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    )
}
