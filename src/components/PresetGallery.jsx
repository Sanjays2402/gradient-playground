import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildGradientCSS } from '../utils/gradient'
import { PRESETS } from '../data/presets'

export default function PresetGallery({ applyPreset }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredPreset, setHoveredPreset] = useState(null)

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-medium text-white/50 hover:text-white/70 transition-colors cursor-pointer py-1"
      >
        <span>Presets</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-[10px]"
        >
          ▼
        </motion.span>
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
            <div className="grid grid-cols-4 gap-1.5 pb-1">
              {PRESETS.map((preset, i) => {
                const css = buildGradientCSS(preset)
                return (
                  <motion.button
                    key={preset.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 25 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      applyPreset(preset)
                      setIsOpen(false)
                    }}
                    onMouseEnter={() => setHoveredPreset(preset.name)}
                    onMouseLeave={() => setHoveredPreset(null)}
                    className="relative aspect-square rounded-lg cursor-pointer border border-white/[0.06] hover:border-white/[0.15] transition-colors overflow-hidden group"
                    style={{ background: css }}
                  >
                    <AnimatePresence>
                      {hoveredPreset === preset.name && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
                        >
                          <span className="text-[9px] font-medium text-white/90 pb-1.5 drop-shadow-lg">
                            {preset.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
