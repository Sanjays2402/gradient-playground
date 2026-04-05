import { motion } from 'framer-motion'
import { buildGradientCSS } from '../utils/gradient'

export default function GradientPreview({ type, angle, stops }) {
  const gradientCSS = buildGradientCSS({ type, angle, stops })

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ background: gradientCSS }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* Subtle grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid overlay (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-white/[0.08]" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-white/[0.08]" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-white/[0.08]" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-white/[0.08]" />

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/[0.08] text-xs font-medium tracking-[0.3em] uppercase">
            Gradient Playground
          </span>
        </motion.div>
      </div>
    </div>
  )
}
