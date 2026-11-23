import React, { useEffect, useRef } from 'react'

/**
 * Nandi's globe: the dot sphere of the Nandi web app (Nandi_Frontend/src/components/Core.jsx),
 * drawn for a light page. It turns slowly and breathes; when the pointer comes near, ripples
 * run across it the way they do when Nandi listens. With "reduce motion" it is drawn once
 * and stays still.
 */

const TAU = Math.PI * 2
const POINTS = fibonacciSphere(620)

function fibonacciSphere(n) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2
    const r = Math.sqrt(1 - y * y)
    const th = i * 2.39996
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, seed: (i * 0.618) % TAU })
  }
  return pts
}

function accentRgb() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').split(',').map(Number)
  return v.length === 3 && v.every((n) => !Number.isNaN(n)) ? v : [11, 143, 182]
}

export default function Globe({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const [cr, cg, cb] = accentRgb()
    const sim = { t: 0, rot: 0.6, level: 0, target: 0 }
    let w = 0, h = 0, dpr = 1, raf = 0, last = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = rect.width; h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      if (reduceMotion) draw()
    }

    // The pointer's nearness to the globe drives the ripples (0 far … 1 on it).
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const R = Math.min(rect.width, rect.height) * 0.36
      sim.target = Math.max(0, Math.min(1, 1.6 - Math.hypot(dx, dy) / R)) * 0.9
    }
    const onLeave = () => { sim.target = 0 }

    function draw() {
      if (!w || !h) return
      const x = w / 2, y = h / 2
      const level = sim.level
      let R = Math.min(w, h) * 0.36
      R *= 1 + 0.018 * Math.sin(sim.t * 1.1) + level * 0.04
      const rgba = (a) => `rgba(${cr},${cg},${cb},${a})`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // a soft halo that fades out before the canvas edge, so no square shows
      const halo = Math.min(w, h) / 2 - 1
      const gr = ctx.createRadialGradient(x, y, R * 0.15, x, y, halo)
      gr.addColorStop(0, rgba(0.09 + level * 0.06))
      gr.addColorStop(0.7, rgba(0.025 + level * 0.02))
      gr.addColorStop(1, rgba(0))
      ctx.fillStyle = gr
      ctx.beginPath(); ctx.arc(x, y, halo, 0, TAU); ctx.fill()

      const c = Math.cos(sim.rot), s = Math.sin(sim.rot), ct = Math.cos(0.32), st = Math.sin(0.32)
      const dotScale = 0.6 + 0.5 * (R / 120)
      for (const p of POINTS) {
        const X = p.x * c - p.z * s
        const Z = p.x * s + p.z * c
        const Y = p.y * ct - Z * st
        const Z2 = p.y * st + Z * ct
        const rho = Math.min(1, Math.hypot(X, Y))
        const d = 1 + 0.012 * Math.sin(p.seed + sim.t * 1.4)
          + level * 0.13 * Math.sin(rho * 9 - sim.t * 6) * rho
        const depth = (Z2 + 1) / 2
        const size = (0.6 + 1.5 * depth) * dotScale
        const a = 0.16 + 0.8 * depth
        ctx.fillStyle = rgba(Math.min(1, a))
        ctx.beginPath(); ctx.arc(x + X * R * d, y + Y * R * d, size, 0, TAU); ctx.fill()
      }
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      sim.t += dt
      sim.rot += dt * 0.14
      sim.level += (sim.target - sim.level) * (1 - Math.exp(-dt * 5))
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    if (!reduceMotion) {
      raf = requestAnimationFrame(frame)
      window.addEventListener('pointermove', onPointer, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    // Pause while the tab is hidden.
    const onVis = () => {
      if (reduceMotion) return
      if (document.hidden) cancelAnimationFrame(raf)
      else { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame) }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} className={`globe ${className}`} role="img" aria-label="Nandi's globe" />
}
