let idCounter = 0

export function generateId() {
  return `stop-${Date.now()}-${idCounter++}`
}

export function buildGradientCSS({ type, angle, stops }) {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)
  const stopStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ')

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${stopStr})`
    case 'radial':
      return `radial-gradient(circle, ${stopStr})`
    case 'conic':
      return `conic-gradient(from ${angle}deg, ${stopStr})`
    default:
      return `linear-gradient(${angle}deg, ${stopStr})`
  }
}

export function randomColor() {
  const h = Math.floor(Math.random() * 360)
  const s = 50 + Math.floor(Math.random() * 50)
  const l = 30 + Math.floor(Math.random() * 40)
  return hslToHex(h, s, l)
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function randomGradient() {
  const types = ['linear', 'radial', 'conic']
  const type = types[Math.floor(Math.random() * types.length)]
  const angle = Math.floor(Math.random() * 360)
  const numStops = 2 + Math.floor(Math.random() * 3)
  const stops = []

  for (let i = 0; i < numStops; i++) {
    stops.push({
      id: generateId(),
      color: randomColor(),
      position: Math.round((i / (numStops - 1)) * 100),
    })
  }

  return { type, angle, stops }
}

export async function exportAsImage(gradientCSS) {
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  const ctx = canvas.getContext('2d')

  // Create a temporary div to render the gradient
  const div = document.createElement('div')
  div.style.width = '1920px'
  div.style.height = '1080px'
  div.style.background = gradientCSS
  div.style.position = 'fixed'
  div.style.top = '-9999px'
  document.body.appendChild(div)

  // Use SVG foreignObject to render
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:1920px;height:1080px;background:${gradientCSS}"></div>
      </foreignObject>
    </svg>
  `
  const img = new Image()
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      document.body.removeChild(div)

      canvas.toBlob((blob) => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'gradient.png'
        a.click()
        URL.revokeObjectURL(a.href)
        resolve()
      }, 'image/png')
    }
    img.onerror = () => {
      // Fallback: draw gradient manually for linear
      document.body.removeChild(div)
      URL.revokeObjectURL(url)
      resolve()
    }
    img.src = url
  })
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

// ── Color conversion ──

export function hexToHSL(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  if (hex.length !== 6) return { h: 0, s: 0, l: 50 }

  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// ── Color harmonies ──

export function getColorHarmonies(hex) {
  const { h, s, l } = hexToHSL(hex)
  return {
    complementary: [hslToHex((h + 180) % 360, s, l)],
    analogous: [
      hslToHex((h + 30) % 360, s, l),
      hslToHex((h - 30 + 360) % 360, s, l),
    ],
    triadic: [
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l),
    ],
    splitComplementary: [
      hslToHex((h + 150) % 360, s, l),
      hslToHex((h + 210) % 360, s, l),
    ],
  }
}

// ── Tailwind gradient classes ──

export function buildTailwindClasses({ type, angle, stops }) {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  if (type === 'linear' && sortedStops.length >= 2 && sortedStops.length <= 3) {
    const dirMap = { 0: 't', 45: 'tr', 90: 'r', 135: 'br', 180: 'b', 225: 'bl', 270: 'l', 315: 'tl' }
    const angles = [0, 45, 90, 135, 180, 225, 270, 315]
    const closest = angles.reduce((prev, curr) =>
      Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
    )
    const dir = dirMap[closest]
    const parts = [`bg-gradient-to-${dir}`]
    parts.push(`from-[${sortedStops[0].color}]`)
    if (sortedStops.length === 3) parts.push(`via-[${sortedStops[1].color}]`)
    parts.push(`to-[${sortedStops[sortedStops.length - 1].color}]`)
    return parts.join(' ')
  }

  const css = buildGradientCSS({ type, angle, stops })
  return `bg-[${css.replace(/\s/g, '_')}]`
}

// ── Share URL ──

export function encodeGradientToURL({ type, angle, stops }) {
  const data = {
    t: type,
    a: angle,
    s: [...stops]
      .sort((a, b) => a.position - b.position)
      .map(s => ({ c: s.color, p: s.position })),
  }
  const encoded = btoa(JSON.stringify(data))
  return `${window.location.pathname}#${encoded}`
}

export function decodeGradientFromURL() {
  // Try hash-based base64 first
  const hash = window.location.hash.slice(1)
  if (hash) {
    try {
      const data = JSON.parse(atob(hash))
      const type = ['linear', 'radial', 'conic'].includes(data.t) ? data.t : 'linear'
      const angle = Math.max(0, Math.min(360, parseInt(data.a, 10) || 0))
      const stops = (data.s || []).map(s => ({
        id: generateId(),
        color: s.c,
        position: Math.max(0, Math.min(100, parseInt(s.p, 10) || 0)),
      })).filter(st => /^#[0-9a-fA-F]{3,6}$/.test(st.color))
      if (stops.length >= 2) return { type, angle, stops }
    } catch { /* invalid hash, fall through */ }
  }

  // Legacy: query params
  const params = new URLSearchParams(window.location.search)
  const t = params.get('t')
  const a = params.get('a')
  const s = params.get('s')
  if (!t || !a || !s) return null

  const type = ['linear', 'radial', 'conic'].includes(t) ? t : 'linear'
  const angle = Math.max(0, Math.min(360, parseInt(a, 10) || 0))
  const stops = s.split(',').map(part => {
    const [colorHex, pos] = part.split(':')
    const color = colorHex.startsWith('#') ? colorHex : `#${colorHex}`
    return {
      id: generateId(),
      color,
      position: Math.max(0, Math.min(100, parseInt(pos, 10) || 0)),
    }
  }).filter(st => /^#[0-9a-fA-F]{3,6}$/.test(st.color))

  if (stops.length < 2) return null
  return { type, angle, stops }
}

// ── History (localStorage) ──

const HISTORY_KEY = 'gradient-playground-history'
const MAX_HISTORY = 10

export function saveGradientToHistory({ type, angle, stops }) {
  try {
    const history = loadGradientHistory()
    const entry = {
      type,
      angle,
      stops: stops.map(s => ({ color: s.color, position: s.position })),
      css: buildGradientCSS({ type, angle, stops }),
      timestamp: Date.now(),
    }
    const filtered = history.filter(h => h.css !== entry.css)
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch { /* localStorage unavailable */ }
}

export function loadGradientHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function clearGradientHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch { /* ignore */ }
}
