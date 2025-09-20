"use client"

import type React from "react"

import { useState } from "react"

interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function InteractiveButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 overflow-hidden group"

  const variantClasses = {
    primary:
      "text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/25 hover:scale-105",
    secondary:
      "text-secondary-foreground bg-gradient-to-r from-secondary/80 to-secondary hover:shadow-lg hover:shadow-secondary/20 hover:scale-105",
    outline:
      "text-foreground bg-transparent border-2 border-border hover:border-primary hover:bg-primary/5 hover:scale-105",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
  }
  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)

  const buttonContent = (
    <>
      {/* Ripple effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
      </div>

      {/* Glow effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"></div>
      )}

      {/* Content */}
      <span className={`relative z-10 transition-transform duration-200 ${isPressed ? "scale-95" : "scale-100"}`}>
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {buttonContent}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {buttonContent}
    </button>
  )
}
