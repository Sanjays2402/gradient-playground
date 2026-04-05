import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildGradientCSS, copyToClipboard, exportAsImage } from '../utils/gradient'

export default function CodeOutput({ type, angle, stops }) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState(null)

  const gradientCSS = buildGradientCSS({ type, angle, stops })
  const fullCSS = `background: ${gradientCSS};`

  const handleCopy = async () => {
    await copyToClipboard(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportImage = async () => {
    setExportFormat('image')
    await exportAsImage(gradientCSS)
    setTimeout(() => setExportFormat(null), 1500)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50">CSS Output</span>
        <div className="flex gap-1.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportImage}
            className="text-[10px] px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/90 transition-all cursor-pointer border border-white/[0.06]"
          >
            {exportFormat === 'image' ? '✓ Saved' : '↓ PNG'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="text-[10px] px-2.5 py-1 rounded-md bg-accent/20 hover:bg-accent/30 text-accent hover:text-accent-hover transition-all cursor-pointer border border-accent/20"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  ✓ Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  ⎘ Copy CSS
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="relative group">
        <pre className="text-[11px] font-mono leading-relaxed p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
          <span className="text-purple-400">background</span>
          <span className="text-white/40">: </span>
          <span className="text-emerald-400">{gradientCSS}</span>
          <span className="text-white/40">;</span>
        </pre>
      </div>
    </div>
  )
}
