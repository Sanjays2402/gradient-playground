import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildGradientCSS, loadGradientHistory, clearGradientHistory, generateId } from '../utils/gradient'

export default function GradientHistory({ onSelect }) {
  const [history, setHistory] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Refresh history when panel is open — poll every 2s to catch new saves
  useEffect(() => {
    setHistory(loadGradientHistory())
    if (!isOpen) return
    const interval = setInterval(() => {
      setHistory(loadGradientHistory())
    }, 2000)
    return () => clearInterval(interval)
  }, [isOpen])

  const handleSelect = (entry) => {
    onSelect({
      type: entry.type,
      angle: entry.angle,
      stops: entry.stops.map(s => ({ ...s, id: generateId() })),
    })
  }

  const handleClear = (e) => {
    e.stopPropagation()
    clearGradientHistory()
    setHistory([])
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-medium text-white/50 hover:text-white/70 transition-colors cursor-pointer py-1"
      >
        <span>History</span>
        <div className="flex items-center gap-2">
          {isOpen && history.length > 0 && (
            <span
              onClick={handleClear}
              className="text-[10px] text-white/30 hover:text-red-400 transition-colors"
            >
              Clear
            </span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-[10px]"
          >
            ▼
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            {history.length === 0 ? (
              <p className="text-[10px] text-white/25 text-center py-3">
                No history yet. Edit gradients to build history.
              </p>
            ) : (
              <div className="grid grid-cols-5 gap-1.5 pb-1">
                {history.map((entry, i) => (
                  <motion.button
                    key={`${entry.timestamp}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, type: 'spring', stiffness: 400, damping: 25 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(entry)}
                    className="aspect-square rounded-lg cursor-pointer border border-white/[0.06] hover:border-white/[0.2] transition-colors shadow-sm"
                    style={{ background: entry.css || buildGradientCSS(entry) }}
                    title={`${entry.type} · ${entry.angle}° · ${entry.stops.length} stops`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
