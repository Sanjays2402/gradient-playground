import { motion } from 'framer-motion'

export default function AngleControl({ angle, setAngle, type }) {
  if (type === 'radial') return null

  const label = type === 'conic' ? 'Start Angle' : 'Direction'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50">{label}</span>
        <span className="text-xs font-mono text-white/70 bg-white/[0.06] px-2 py-0.5 rounded-md">
          {angle}°
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.04] cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left - rect.width / 2
              const y = e.clientY - rect.top - rect.height / 2
              const deg = Math.round((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360
              setAngle(deg)
            }}
          >
            <motion.div
              className="absolute w-1 h-4 bg-accent rounded-full left-1/2 -translate-x-1/2 origin-bottom"
              style={{ bottom: '50%' }}
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="flex-1"
        />
      </div>
    </div>
  )
}
