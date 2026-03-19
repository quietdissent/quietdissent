'use client'
import { useEffect, useRef } from 'react'

export default function BlobCursor() {
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const blob = blobRef.current
    if (!blob) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let animationId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08
      currentY += (mouseY - currentY) * 0.08
      blob.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`
      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={blobRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(95,133,117,0.35) 0%, rgba(95,133,117,0.15) 40%, transparent 70%)',
        filter: 'blur(20px)',
        pointerEvents: 'none',
        zIndex: 9997,
        willChange: 'transform',
      }}
    />
  )
}
