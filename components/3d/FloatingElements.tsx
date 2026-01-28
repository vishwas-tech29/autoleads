'use client'

import { useEffect, useState } from 'react'

// Simple CSS-based floating elements as fallback
function SimpleFloatingElements() {
  return (
    <div className="fixed inset-0 -z-10 opacity-20 overflow-hidden">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      
      {/* Floating squares */}
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/3 left-20 w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  )
}

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <SimpleFloatingElements />
}