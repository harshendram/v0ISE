"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

export default function BrainModel() {
  const meshRef = useRef<Mesh>(null)
  const wireframeRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = state.clock.elapsedTime * -0.2
      wireframeRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
    }
  })

  return (
    <group>
      {/* Main brain mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.8} emissive="#4c1d95" emissiveIntensity={0.2} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireframeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.1, 16, 16]} />
        <meshBasicMaterial color="#ec4899" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Neural connections */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}
