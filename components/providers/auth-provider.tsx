"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "doctor" | "patient"
  specialty?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "doctor" | "patient") => Promise<void>
  signup: (name: string, email: string, password: string, role: "doctor" | "patient", specialty?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("arogya-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "doctor" | "patient") => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === "doctor" ? "Dr. Sarah Smith" : "Alex Johnson",
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
      role: role,
      specialty: role === "doctor" ? "General Medicine" : undefined,
    }

    setUser(mockUser)
    localStorage.setItem("arogya-user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const signup = async (name: string, email: string, password: string, role: "doctor" | "patient", specialty?: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
      role: role,
      specialty: role === "doctor" ? specialty : undefined,
    }

    setUser(mockUser)
    localStorage.setItem("arogya-user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("arogya-user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
