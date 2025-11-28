"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"
import PageTransition from "@/components/ui/page-transition"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>(
    {},
  )
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}

    if (!name) {
      newErrors.name = "Name is required"
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await signup(name, email, password)
      router.push("/")
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-white flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-8 bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-600 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Join ArogyaSetu
              </h1>
              <p className="text-white/70 dark:text-white/70 light:text-slate-600">
                Create your account and get medical consultation
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white dark:text-white light:text-slate-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 dark:text-white/50 light:text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/10 dark:bg-white/10 light:bg-white/50 border-white/20 text-white dark:text-white light:text-slate-900 placeholder-white/50 dark:placeholder-white/50 light:placeholder-slate-400 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dark:text-white light:text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 dark:text-white/50 light:text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 dark:bg-white/10 light:bg-white/50 border-white/20 text-white dark:text-white light:text-slate-900 placeholder-white/50 dark:placeholder-white/50 light:placeholder-slate-400 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white dark:text-white light:text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 dark:text-white/50 light:text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 dark:bg-white/10 light:bg-white/50 border-white/20 text-white dark:text-white light:text-slate-900 placeholder-white/50 dark:placeholder-white/50 light:placeholder-slate-400 focus:ring-purple-500"
                    placeholder="Create a password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white dark:text-white light:text-slate-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 dark:text-white/50 light:text-slate-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 dark:bg-white/10 light:bg-white/50 border-white/20 text-white dark:text-white light:text-slate-900 placeholder-white/50 dark:placeholder-white/50 light:placeholder-slate-400 focus:ring-purple-500"
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-200 text-black py-3 text-lg font-semibold shadow-lg hover:shadow-gray-500/25 transition-all duration-300 group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white/70 dark:text-white/70 light:text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="text-gray-300 hover:text-white font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}
