"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Plus, Search, BookOpen, Brain, Target, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PageTransition from "@/components/ui/page-transition"
import MindmapCanvas from "@/components/mindmap/mindmap-canvas"

const mindmaps = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    description: "Core concepts of ML algorithms and applications",
    nodes: 24,
    connections: 18,
    category: "AI/ML",
    difficulty: "Intermediate",
    rating: 4.8,
    color: "from-gray-600 to-gray-500",
  },
  {
    id: 2,
    title: "React Ecosystem",
    description: "Complete guide to React and its ecosystem",
    nodes: 32,
    connections: 28,
    category: "Web Development",
    difficulty: "Advanced",
    rating: 4.9,
    color: "from-gray-600 to-gray-500",
  },
  {
    id: 3,
    title: "Data Structures",
    description: "Essential data structures and algorithms",
    nodes: 18,
    connections: 15,
    category: "Computer Science",
    difficulty: "Beginner",
    rating: 4.7,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    description: "Modern marketing techniques and tools",
    nodes: 21,
    connections: 19,
    category: "Marketing",
    difficulty: "Intermediate",
    rating: 4.6,
    color: "from-orange-500 to-red-500",
  },
]

const categories = ["All", "AI/ML", "Web Development", "Computer Science", "Marketing", "Design"]

export default function LearningHubPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMindmap, setSelectedMindmap] = useState<number | null>(null)

  const filteredMindmaps = mindmaps.filter((mindmap) => {
    const matchesCategory = selectedCategory === "All" || mindmap.category === selectedCategory
    const matchesSearch =
      mindmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mindmap.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
              Learning Hub
            </h1>
            <p className="text-xl text-white/70">Explore interactive mindmaps and discover new knowledge paths</p>
          </motion.div>

          {selectedMindmap ? (
            /* Mindmap View */
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {mindmaps.find((m) => m.id === selectedMindmap)?.title}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMindmap(null)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back to Hub
                </Button>
              </div>
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <MindmapCanvas mindmapId={selectedMindmap} />
              </Card>
            </motion.div>
          ) : (
            /* Hub View */
            <>
              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <Input
                      placeholder="Search mindmaps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-purple-500"
                    />
                  </div>
                  <Button className="bg-white hover:bg-gray-200 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Mindmap
                  </Button>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-white text-black"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Mindmap Grid */}
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {filteredMindmaps.map((mindmap, index) => (
                  <motion.div
                    key={mindmap.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedMindmap(mindmap.id)}
                  >
                    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mindmap.color} p-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Brain className="w-full h-full text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{mindmap.rating}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                        {mindmap.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{mindmap.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-white/60">
                          <Target className="w-4 h-4" />
                          <span className="text-sm">{mindmap.nodes} nodes</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm">{mindmap.connections} links</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                          {mindmap.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            mindmap.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-300"
                              : mindmap.difficulty === "Intermediate"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {mindmap.difficulty}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {filteredMindmaps.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white/70 mb-2">No mindmaps found</h3>
                  <p className="text-white/50 mb-6">Try adjusting your search or filters</p>
                  <Button className="bg-white hover:bg-gray-200 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Mindmap
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
