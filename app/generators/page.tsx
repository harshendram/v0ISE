"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Brain, BookOpen, Zap, Sparkles, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const generators = [
  {
    id: "quiz",
    title: "Quiz Generator",
    description: "Create interactive quizzes with AI",
    icon: Brain,
    color: "from-gray-600 to-gray-500",
    features: ["Multiple Choice", "True/False", "Fill in Blanks", "Essay Questions"],
  },
  {
    id: "course",
    title: "Course Generator",
    description: "Build comprehensive courses",
    icon: BookOpen,
    color: "from-gray-600 to-gray-500",
    features: ["Structured Lessons", "Progress Tracking", "Assignments", "Assessments"],
  },
  {
    id: "mindmap",
    title: "Mindmap Generator",
    description: "Generate visual learning maps",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    features: ["Auto Layout", "Smart Connections", "Interactive Nodes", "Export Options"],
  },
]

export default function GeneratorsPage() {
  const [selectedGenerator, setSelectedGenerator] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'intermediate',
    questionCount: '10',
    description: ''
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setIsComplete(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setSelectedGenerator(null)
    setIsComplete(false)
    setFormData({
      topic: '',
      difficulty: 'intermediate',
      questionCount: '10',
      description: ''
    })
  }

  const currentGenerator = generators.find(g => g.id === selectedGenerator)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            AI Generators
          </h1>
          <p className="text-xl text-white/70">
            Create educational content with the power of artificial intelligence
          </p>
        </motion.div>

        {!selectedGenerator ? (
          /* Generator Selection */
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {generators.map((generator, index) => (
              <motion.div
                key={generator.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedGenerator(generator.id)}
              >
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${generator.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <generator.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors">
                    {generator.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6">
                    {generator.description}
                  </p>

                  <div className="space-y-2">
                    {generator.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/60">
                        <Sparkles className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-white hover:bg-gray-200 text-black">
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Generator Interface */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentGenerator.color} p-3`}>
                      <currentGenerator.icon className="w-full h-full text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentGenerator.title}
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Topic Input */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Topic *
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="Enter the main topic or subject"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner" className="bg-slate-800">Beginner</option>
                      <option value="intermediate" className="bg-slate-800">Intermediate</option>
                      <option value="advanced" className="bg-slate-800">Advanced</option>
                    </select>
                  </div>

                  {/* Question Count (for quiz) */}
                  {selectedGenerator === 'quiz' && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Number of Questions
                      </label>
                      <select
                        value={formData.questionCount}
                        onChange={(e) => handleInputChange('questionCount', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="5" className="bg-slate-800">5 Questions</option>
                        <option value="10" className="bg-slate-800">10 Questions</option>
                        <option value="15" className="bg-slate-800">15 Questions</option>
                        <option value="20" className="bg-slate-800">20 Questions</option>
                      </select>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Additional Details
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Any specific requirements, focus areas, or additional context..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!formData.topic || isGenerating}
                    className={`w-full py-3 text-lg font-semibold bg-gradient-to-r ${currentGenerator.color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate {currentGenerator.title.split(' ')[0]}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Preview/Result */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
                
                {isComplete ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {currentGenerator.title.split(' ')[0]} Generated!
                    </h4>
                    <p className="text-white/70 mb-6">
                      Your {selectedGenerator} has been successfully created.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        View {currentGenerator.title.split(' ')[0]}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={resetForm}
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Create Another
                      </Button>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Loader2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                    <h4 className="text-xl font-bold text-white mb-2">
                      Generating Your {currentGenerator.title.split(' ')[0]}
                    </h4>
                    <p className="text-white/70">
                      Please wait while AI creates your content...
                    </p>
                    <div className="mt-6 bg-white/10 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Progress</span>
                        <span>Processing...</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${currentGenerator.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-white/60">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentGenerator.color} p-5 mx-auto mb-4 opacity-50`}>
                      <currentGenerator.icon className="w-full h-full text-white" />
                    </div>
                    <p>Fill out the form and click generate to see your {selectedGenerator} preview here.</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}