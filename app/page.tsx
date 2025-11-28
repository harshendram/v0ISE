"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense } from "react"
import { Brain, Sparkles, ArrowRight, BookOpen, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import BrainModel from "@/components/3d/brain-model"
import ParticleSystem from "@/components/3d/particle-system"
import AnimatedCounter from "@/components/ui/animated-counter"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const features = [
  {
    icon: Brain,
    title: "AI Doctor Consultation",
    description: "Get instant medical guidance from our AI doctor",
    color: "from-gray-600 to-gray-500",
  },
  {
    icon: BookOpen,
    title: "Health Reports",
    description: "Automatic medical report generation from consultations",
    color: "from-gray-600 to-gray-500",
  },
  {
    icon: Zap,
    title: "Smart Health Insights",
    description: "AI-powered health analysis and recommendations",
    color: "from-gray-600 to-gray-500",
  },
]

const stats = [
  { label: "Patient Consultations", value: 50000, suffix: "+" },
  { label: "Reports Generated", value: 12000, suffix: "+" },
  { label: "Success Rate", value: 95, suffix: "%" },
  { label: "AI Interactions", value: 1000000, suffix: "+" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <Environment preset="night" />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                <BrainModel />
              </Float>
              <ParticleSystem />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/90">AI-Powered Medical Consultation</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight"
          >
            Your AI
            <br />
            Medical Guide
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Get instant medical consultation from our AI doctor. Get health reports, medical guidance, and stay informed about your health with ArogyaSetu - your trusted digital health companion.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/ai-mentor">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 group"
              >
                Start Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/doctor-dashboard">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-full text-lg font-semibold"
              >
                Doctor Portal
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-500/20 backdrop-blur-sm"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-500/20 backdrop-blur-sm"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Our Medical Features
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Advanced AI-powered tools designed to provide comprehensive medical consultation and health guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group"
              >
                <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/20 to-gray-800/20 backdrop-blur-sm">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of patients already using ArogyaSetu for their medical consultation needs
          </p>
          <Link href="/ai-mentor">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-200 text-black px-12 py-6 rounded-full text-xl font-semibold shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 group"
            >
              Start Your Consultation
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
