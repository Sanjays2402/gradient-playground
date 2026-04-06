import { useState, useCallback, useEffect, useRef } from 'react'
import {
  generateId,
  randomGradient,
  decodeGradientFromURL,
  saveGradientToHistory,
} from '../utils/gradient'

const defaultStops = [
  { id: generateId(), color: '#7c5cfc', position: 0 },
  { id: generateId(), color: '#00dbde', position: 50 },
  { id: generateId(), color: '#fc00ff', position: 100 },
]

function getInitialState() {
  const fromURL = decodeGradientFromURL()
  if (fromURL) return fromURL
  return { type: 'linear', angle: 135, stops: defaultStops }
}

export function useGradient() {
  const initial = useRef(getInitialState()).current
  const [type, setType] = useState(initial.type)
  const [angle, setAngle] = useState(initial.angle)
  const [stops, setStops] = useState(initial.stops)

  // Debounce save to history whenever gradient changes
  const saveTimer = useRef(null)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveGradientToHistory({ type, angle, stops })
    }, 1000)
    return () => clearTimeout(saveTimer.current)
  }, [type, angle, stops])

  // Clear URL params/hash after loading from URL so it doesn't persist
  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const addStop = useCallback(() => {
    setStops((prev) => {
      if (prev.length >= 8) return prev
      const pos = Math.floor(Math.random() * 100)
      const hue = Math.floor(Math.random() * 360)
      const color = `hsl(${hue}, 70%, 55%)`
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      return [...prev, { id: generateId(), color: hex, position: pos }]
    })
  }, [])

  const removeStop = useCallback((id) => {
    setStops((prev) => {
      if (prev.length <= 2) return prev
      return prev.filter((s) => s.id !== id)
    })
  }, [])

  const updateStop = useCallback((id, updates) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }, [])

  const applyPreset = useCallback((preset) => {
    setType(preset.type)
    setAngle(preset.angle)
    setStops(
      preset.stops.map((s) => ({
        ...s,
        id: generateId(),
      }))
    )
  }, [])

  const randomize = useCallback(() => {
    const g = randomGradient()
    setType(g.type)
    setAngle(g.angle)
    setStops(g.stops)
  }, [])

  return {
    type,
    setType,
    angle,
    setAngle,
    stops,
    setStops,
    addStop,
    removeStop,
    updateStop,
    applyPreset,
    randomize,
  }
}
