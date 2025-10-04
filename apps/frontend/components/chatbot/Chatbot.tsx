"use client"

import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/api"

interface Message {
    role: "user" | "bot"
    content: string
}

interface ForecastData {
    [key: string]: unknown // generic safe type instead of 'any'
}

// interface ForecastData {
//     current?: {
//         aqi?: number
//         level?: string
//         pollutant?: string
//         weather?: Record<string, unknown>
//         city_name?: string
//     }
//     hourly_forecast?: Array<{ hour: string; aqi: number }>
//     [key: string]: unknown
// }

const PROMPT_STARTERS = [
    "What is the current air quality?",
    "Is it safe for me to exercise outside now?",
    "How will the air quality change in the next few hours?",
    "What pollutants should I be concerned about?",
]

export default function Chatbot({ forecastData }: { forecastData: ForecastData | null  }) {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Hello! I'm VAYUU, your intelligent air quality assistant. How can I help you breathe easier today?",
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
    useEffect(() => {
        const id = "chatbot-root"
        let root = document.getElementById(id)
        if (!root) {
            root = document.createElement("div")
            root.id = id
            document.body.appendChild(root)
        }
        setPortalRoot(root)
        return () => { }
    }, [])

    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            if (!isOpen) return
            const target = e.target as Node | null
            if (panelRef.current && target && !panelRef.current.contains(target)) {
                setIsOpen(false)
            }
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("mousedown", handleDocClick)
        document.addEventListener("keydown", handleEsc)
        return () => {
            document.removeEventListener("mousedown", handleDocClick)
            document.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen])

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputValue
        if (!textToSend.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: textToSend }
        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await api.post("/api/chat", {
                message: textToSend,
                forecastData: forecastData,
                user: { username: user?.username || "Guest" },
            })

            const botMessage: Message = { role: "bot", content: response.data.reply }
            setMessages((prev) => [...prev, botMessage])
        } catch {
            const errorMessage: Message = {
                role: "bot",
                content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handlePromptClick = (prompt: string) => {
        handleSendMessage(prompt)
    }

    const showPromptStarters = messages.length === 1 && !isLoading

    if (!user) return null

    const chatWindow = (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.34, 1.56, 0.64, 1], // Bounce easing
                            opacity: { duration: 0.3 },
                        }}
                        className="fixed bottom-24 right-5 w-[90vw] md:w-[400px] h-[85vh] md:h-[600px] bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-[9999] border border-white/20 overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="VAYUU chat assistant"
                        ref={panelRef}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-teal-50/30 to-green-100/40 animate-gradient-slow -z-10" />

                        <div className="p-4 border-b border-white/30 flex items-center gap-3 bg-white/40 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                V
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">VAYUU</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                    <span className="text-xs text-gray-600">Online</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "bot" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 flex-shrink-0 shadow-md flex items-center justify-center text-white font-bold text-sm">
                                            V
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md ${msg.role === "user"
                                                ? "bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-tr-sm"
                                                : "bg-white/90 text-gray-900 rounded-tl-sm border border-gray-200/50"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 flex-shrink-0 shadow-md flex items-center justify-center text-white font-bold text-sm">
                                        V
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/90 border border-gray-200/50 shadow-md flex items-center gap-1">
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {showPromptStarters && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="px-4 pb-3 flex flex-wrap gap-2"
                            >
                                {PROMPT_STARTERS.map((prompt, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handlePromptClick(prompt)}
                                        className="px-3 py-2 text-xs bg-white/70 hover:bg-white/90 text-gray-700 rounded-full border border-gray-300/50 shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                        {prompt}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSendMessage()
                            }}
                            className="p-4 border-t border-white/30 bg-white/40 backdrop-blur-sm"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about air quality..."
                                    className="flex-1 px-4 py-3 text-sm bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-gray-900 placeholder-gray-500 border border-gray-200/50 transition-all duration-200 shadow-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="px-5 py-3 bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-xl hover:from-sky-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    Send
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    scale: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    },
                }}
                onClick={() => setIsOpen((s) => !s)}
                aria-label={isOpen ? "Close chat" : "Open chat with VAYUU"}
                title="Chat with VAYUU"
                className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-tr from-sky-500 to-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center z-[9999] ring-4 ring-white/50 hover:ring-white/70 transition-all duration-300"
                style={{
                    boxShadow: "0 10px 40px rgba(14, 165, 233, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.svg
                            key="chat"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    )

    if (portalRoot) {
        return ReactDOM.createPortal(chatWindow, portalRoot)
    }

    return chatWindow
}
