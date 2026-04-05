import { motion } from 'framer-motion'
import { useGradient } from './hooks/useGradient'
import GradientPreview from './components/GradientPreview'
import GradientTypeSelector from './components/GradientTypeSelector'
import AngleControl from './components/AngleControl'
import ColorStopEditor from './components/ColorStopEditor'
import CodeOutput from './components/CodeOutput'
import PresetGallery from './components/PresetGallery'

export default function App() {
  const {
    type,
    setType,
    angle,
    setAngle,
    stops,
    addStop,
    removeStop,
    updateStop,
    applyPreset,
    randomize,
  } = useGradient()

  return (
    <div className="h-full w-full relative">
      {/* Full-screen gradient preview */}
      <GradientPreview type={type} angle={angle} stops={stops} />

      {/* Controls panel - glassmorphism overlay */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
        className="absolute top-4 right-4 bottom-4 w-[320px] flex flex-col"
      >
        <div className="flex flex-col h-full rounded-2xl bg-[#0d0d14]/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-sm">🎨</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-white/90 tracking-tight">Gradient Playground</h1>
                  <p className="text-[10px] text-white/30 mt-0.5">CSS gradient builder</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={randomize}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/90 transition-colors cursor-pointer"
                title="Randomize"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
              </motion.button>
            </div>

            <GradientTypeSelector type={type} setType={setType} />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            <AngleControl angle={angle} setAngle={setAngle} type={type} />
            <ColorStopEditor
              stops={stops}
              addStop={addStop}
              removeStop={removeStop}
              updateStop={updateStop}
            />
            <PresetGallery applyPreset={applyPreset} />
          </div>

          {/* Footer - Code output */}
          <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
            <CodeOutput type={type} angle={angle} stops={stops} />
          </div>
        </div>
      </motion.div>

      {/* Bottom-left info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 flex items-center gap-3"
      >
        <div className="px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-xl border border-white/[0.06] text-[10px] text-white/30 font-mono">
          {type} · {angle}° · {stops.length} stops
        </div>
      </motion.div>
    </div>
  )
}
