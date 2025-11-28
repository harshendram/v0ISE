"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Node {
  id: string
  x: number
  y: number
  label: string
  color: string
  size: number
  connections: string[]
}

interface MindmapCanvasProps {
  mindmapId: number
}

export default function MindmapCanvas({ mindmapId }: MindmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Generate sample nodes based on mindmapId
  useEffect(() => {
    const generateNodes = () => {
      const centerX = 400
      const centerY = 300
      const sampleNodes: Node[] = [
        {
          id: "center",
          x: centerX,
          y: centerY,
          label: "Main Topic",
          color: "#8b5cf6",
          size: 60,
          connections: ["node1", "node2", "node3", "node4"],
        },
      ]

      // Generate surrounding nodes
      for (let i = 1; i <= 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const radius = 150 + Math.random() * 50
        sampleNodes.push({
          id: `node${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          label: `Topic ${i}`,
          color: ["#ec4899", "#06b6d4", "#10b981", "#f59e0b"][i % 4],
          size: 40 + Math.random() * 20,
          connections: i <= 4 ? ["center"] : [`node${Math.floor(i / 2)}`],
        })
      }

      setNodes(sampleNodes)
    }

    generateNodes()
  }, [mindmapId])

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach((node) => {
        node.connections.forEach((connectionId) => {
          const connectedNode = nodes.find((n) => n.id === connectionId)
          if (connectedNode) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.strokeStyle = "rgba(139, 92, 246, 0.3)"
            ctx.lineWidth = 2
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Node border
        if (selectedNode === node.id) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3
          ctx.stroke()
        }

        // Node label
        ctx.fillStyle = "#ffffff"
        ctx.font = "14px Inter"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.label, node.x, node.y)
      })
    }

    draw()
  }, [nodes, selectedNode])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= node.size / 2
    })

    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      setIsDragging(true)
      setDragOffset({
        x: x - clickedNode.x,
        y: y - clickedNode.y,
      })
    } else {
      setSelectedNode(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedNode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode ? { ...node, x: x - dragOffset.x, y: y - dragOffset.y } : node,
      ),
    )
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <motion.div className="w-full h-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full bg-gradient-to-br from-slate-800/50 to-purple-800/50 rounded-lg cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white"
        >
          <h4 className="font-semibold mb-2">{nodes.find((n) => n.id === selectedNode)?.label}</h4>
          <p className="text-sm text-white/70">Click and drag to move this node</p>
        </motion.div>
      )}
    </motion.div>
  )
}
