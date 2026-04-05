import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ColorStopEditor({ stops, addStop, removeStop, updateStop }) {
  const barRef = useRef(null)
  const [dragging, setDragging] = useState(null)
  const [editingColor, setEditingColor] = useState(null)

  const handleBarClick = useCallback(
    (e) => {
      if (dragging) return
      if (e.target !== barRef.current) return
      // Don't add on bar click, use the button
    },
    [dragging]
  )

  const handleMouseDown = useCallback((id) => {
    setDragging(id)

    const handleMouseMove = (e) => {
      if (!barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const pos = Math.round((x / rect.width) * 100)
      updateStop(id, { position: pos })
    }

    const handleMouseUp = () => {
      setDragging(null)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [updateStop])

  const sortedStops = [...stops].sort((a, b) => a.position - b.position)
  const barGradient = `linear-gradient(to right, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ')})`

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50">Color Stops</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">{stops.length}/8</span>
          <button
            onClick={addStop}
            disabled={stops.length >= 8}
            className="text-[10px] px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-white/[0.06]"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Gradient Bar */}
      <div
        ref={barRef}
        className="relative h-8 rounded-lg cursor-crosshair border border-white/[0.08] overflow-visible"
        style={{ background: barGradient }}
        onClick={handleBarClick}
      >
        {/* Checkered background for transparency */}
        <div className="absolute inset-0 rounded-lg -z-10 opacity-30" style={{
          backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
          backgroundSize: '8px 8px',
        }} />

        {/* Stop handles */}
        {stops.map((stop) => (
          <motion.div
            key={stop.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${stop.position}%` }}
            animate={{ left: `${stop.position}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className={`w-4 h-6 rounded-sm border-2 cursor-grab shadow-lg transition-transform ${
                dragging === stop.id ? 'scale-125 border-white' : 'border-white/60 hover:border-white hover:scale-110'
              }`}
              style={{ backgroundColor: stop.color, boxShadow: `0 2px 8px ${stop.color}40` }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(stop.id)
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Stop list */}
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {stops.map((stop) => (
            <motion.div
              key={stop.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] group hover:border-white/[0.1] transition-colors"
            >
              {/* Color picker */}
              <div className="relative">
                <div
                  className="w-6 h-6 rounded-md border border-white/[0.15] cursor-pointer shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: stop.color }}
                  onClick={() => setEditingColor(editingColor === stop.id ? null : stop.id)}
                />
                {editingColor === stop.id && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="p-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl"
                    >
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                        className="w-32 h-32 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Hex value */}
              <input
                type="text"
                value={stop.color}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                    updateStop(stop.id, { color: val })
                  }
                }}
                className="w-[72px] text-[11px] font-mono bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-1 text-white/80 focus:outline-none focus:border-accent/50 transition-colors"
              />

              {/* Position */}
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                className="flex-1 h-4"
              />
              <span className="text-[10px] font-mono text-white/40 w-8 text-right">{stop.position}%</span>

              {/* Remove */}
              <button
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all disabled:opacity-0 cursor-pointer text-sm leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
