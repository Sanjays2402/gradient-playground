import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getColorHarmonies } from '../utils/gradient'

export default function ColorHarmony({ color, onSelect }) {
  const harmonies = useMemo(() => getColorHarmonies(color), [color])

  const groups = [
    { label: 'Complementary', colors: harmonies.complementary },
    { label: 'Analogous', colors: harmonies.analogous },
    { label: 'Triadic', colors: harmonies.triadic },
    { label: 'Split Comp.', colors: harmonies.splitComplementary },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      className="absolute left-full top-0 ml-2 z-50 p-2.5 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl min-w-[140px]"
    >
      <p className="text-[9px] text-white/40 font-medium mb-2 uppercase tracking-wider">Harmonies</p>
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] text-white/30 mb-1">{group.label}</p>
            <div className="flex gap-1">
              {group.colors.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onSelect(c) }}
                  className="w-5 h-5 rounded-md border border-white/[0.15] cursor-pointer shadow-sm"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
