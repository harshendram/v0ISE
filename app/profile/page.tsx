"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Mail, Calendar, Award, BookOpen, Brain, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PageTransition from "@/components/ui/page-transition"

const achievements = [
  {
    icon: Brain,
    title: "AI Mentor Expert",
    description: "Completed 50+ AI mentoring sessions",
    color: "from-gray-600 to-gray-500",
  },
  {
    icon: BookOpen,
    title: "Learning Explorer",
    description: "Explored 25+ mindmaps",
    color: "from-gray-600 to-gray-500",
  },
  {
    icon: Zap,
    title: "Content Creator",
    description: "Generated 10+ quizzes and courses",
    color: "from-gray-600 to-gray-500",
  },
]

const stats = [
  { label: "Learning Hours", value: "127", icon: BookOpen },
  { label: "Courses Completed", value: "8", icon: Award },
  { label: "Quizzes Taken", value: "45", icon: Brain },
  { label: "Mindmaps Created", value: "12", icon: Zap },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Profile
            </h1>
            <p className="text-xl text-white/70 dark:text-white/70 light:text-slate-600">
              Manage your account and track your learning progress
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-sm border border-white/20">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-white text-black text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-2">
                    {user.name}
                  </h2>

                  <div className="flex items-center justify-center gap-2 text-white/70 dark:text-white/70 light:text-slate-600 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-white/70 dark:text-white/70 light:text-slate-600 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>Joined December 2024</span>
                  </div>

                  <Button className="w-full bg-white hover:bg-gray-200 text-black">
                    Edit Profile
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Stats and Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Stats */}
              <Card className="p-6 bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-sm border border-white/20">
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
                  Learning Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-center p-4 rounded-lg bg-white/5 dark:bg-white/5 light:bg-white/50"
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/70 dark:text-white/70 light:text-slate-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6 bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-sm border border-white/20">
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
                  Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 dark:bg-white/5 light:bg-white/50"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${achievement.color} p-3`}>
                        <achievement.icon className="w-full h-full text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white dark:text-white light:text-slate-900">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-white/70 dark:text-white/70 light:text-slate-600">
                          {achievement.description}
                        </p>
                      </div>
                      <Award className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
