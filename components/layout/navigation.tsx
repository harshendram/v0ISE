"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Brain, BookOpen, Zap, User, Menu, X, Sparkles, Sun, Moon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/theme-provider"
import { useAuth } from "@/components/providers/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ai-mentor", label: "AI Mentor", icon: Brain },
  { href: "/learning-hub", label: "Learning Hub", icon: BookOpen },
  { href: "/generators", label: "Generators", icon: Zap },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-black to-gray-700 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-100 bg-clip-text text-transparent">
                ArogyaSetu
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 text-white/80 hover:text-white transition-colors ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white/10 rounded-md border border-white/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white/80 hover:text-white"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-black to-gray-700 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-black/90 backdrop-blur-md border-white/10"
                    align="end"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none text-white">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-white/70">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <Link href="/profile">
                      <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="text-white hover:bg-red-600/30 cursor-pointer" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        Sign Up
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden text-white/80" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </div>
                  </Link>
                )
              })}

              {!user && (
                <div className="pt-4 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}
