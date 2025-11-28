"use client"

import { motion } from "framer-motion"

interface AudioPulseProps {
  volume: number
  active: boolean
  hover?: boolean
}

export default function AudioPulse({ volume, active, hover = false }: AudioPulseProps) {
  const bars = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1 h-6">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className={`w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full ${
            active ? "opacity-100" : "opacity-30"
          }`}
          animate={{
            height: active ? [8, 16 + volume * 20 + bar * 2, 8] : 8,
            opacity: active ? [0.6, 1, 0.6] : 0.3,
          }}
          transition={{
            duration: 0.5 + bar * 0.1,
            repeat: active ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
            delay: bar * 0.1,
          }}
        />
      ))}
    </div>
  )
}
