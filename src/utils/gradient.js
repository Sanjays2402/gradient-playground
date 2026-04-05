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
