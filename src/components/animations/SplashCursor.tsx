'use client'
import { useEffect } from 'react'

export default function SplashCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const createSplash = (x: number, y: number) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        left: ${x - 40}px;
        top: ${y - 40}px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid rgba(95, 133, 117, 0.3);
        background: radial-gradient(circle at center,
          rgba(95, 133, 117, 0.1) 0%,
          transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: scale(0);
        opacity: 1;
        transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1),
          opacity 0.5s ease-out;
      `
      document.body.appendChild(el)
      requestAnimationFrame(() => {
        el.style.transform = 'scale(1)'
        el.style.opacity = '0'
      })
      setTimeout(() => el.remove(), 550)
    }

    const onMouseDown = (e: MouseEvent) => createSplash(e.clientX, e.clientY)

    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [])

  return null
}
