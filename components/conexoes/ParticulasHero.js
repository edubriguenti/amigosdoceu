import { useEffect, useRef } from 'react'

/**
 * Canvas leve de partículas — exclusivo do hero.
 * - ≤30 pontos
 * - throttle 30fps em mobile
 * - pausa quando aba invisível
 * - respeita prefers-reduced-motion
 */
export default function ParticulasHero({ count = 30 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let lastDraw = 0
    const isMobile = window.innerWidth < 768
    const minDelta = isMobile ? 1000 / 30 : 1000 / 60

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.4 + 0.6,
      a: Math.random() * 0.4 + 0.2,
    }))

    function draw(t) {
      raf = requestAnimationFrame(draw)
      if (document.visibilityState !== 'visible') return
      if (t - lastDraw < minDelta) return
      lastDraw = t
      ctx.clearRect(0, 0, w(), h())
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w()) p.vx *= -1
        if (p.y < 0 || p.y > h()) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${p.a})`
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
