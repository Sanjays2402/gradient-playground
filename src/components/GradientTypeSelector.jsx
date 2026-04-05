import { motion } from 'framer-motion'

const types = [
  { value: 'linear', label: 'Linear', icon: '↗' },
  { value: 'radial', label: 'Radial', icon: '◎' },
  { value: 'conic', label: 'Conic', icon: '◐' },
]

export default function GradientTypeSelector({ type, setType }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
      {types.map((t) => (
        <button
          key={t.value}
          onClick={() => setType(t.value)}
          className="relative flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          style={{ color: type === t.value ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
        >
          {type === t.value && (
            <motion.div
              layoutId="type-indicator"
              className="absolute inset-0 rounded-lg bg-white/[0.1] border border-white/[0.08]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <span className="text-sm">{t.icon}</span>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  )
}
