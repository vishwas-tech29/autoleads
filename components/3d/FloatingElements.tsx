'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingSphere({ position, color, speed = 1 }: { 
  position: [number, number, number]
  color: string
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed
      meshRef.current.rotation.y += 0.01 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={color} transparent opacity={0.8} />
    </Sphere>
  )
}

function FloatingBox({ position, color, speed = 1 }: { 
  position: [number, number, number]
  color: string
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02 * speed
      meshRef.current.rotation.y += 0.02 * speed
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.3
    }
  })

  return (
    <Box ref={meshRef} position={position} args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </Box>
  )
}

function FloatingTorus({ position, color, speed = 1 }: { 
  position: [number, number, number]
  color: string
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.015 * speed
      meshRef.current.rotation.z += 0.015 * speed
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.4
    }
  })

  return (
    <Torus ref={meshRef} position={position} args={[0.6, 0.2, 16, 32]}>
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </Torus>
  )
}

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Floating elements */}
        <FloatingSphere position={[-4, 2, 0]} color="#3b82f6" speed={0.8} />
        <FloatingSphere position={[4, -2, -2]} color="#8b5cf6" speed={1.2} />
        <FloatingSphere position={[0, 4, -1]} color="#06b6d4" speed={0.6} />
        
        <FloatingBox position={[-2, -3, 1]} color="#f59e0b" speed={0.9} />
        <FloatingBox position={[3, 1, -3]} color="#ef4444" speed={1.1} />
        
        <FloatingTorus position={[0, -1, 2]} color="#10b981" speed={0.7} />
        <FloatingTorus position={[-3, 3, -1]} color="#f97316" speed={1.3} />
      </Canvas>
    </div>
  )
}