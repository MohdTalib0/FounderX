/**
 * Rasterize public/favicon.svg to PNGs (vector → high-DPI bitmap).
 * Run: node scripts/rasterize-favicon.mjs
 */
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgPath = join(root, 'public', 'favicon.svg')
const svg = readFileSync(svgPath)

// Master asset: 1024×1024 @ crisp edges (32× scale from 32×32 viewBox)
await sharp(svg)
  .resize(1024, 1024, { fit: 'fill' })
  .png({
    compressionLevel: 9,
    adaptiveFiltering: true,
  })
  .toFile(join(root, 'public', 'favicon.png'))

// Apple touch icon (referenced in index.html)
await sharp(svg)
  .resize(180, 180, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public', 'apple-touch-icon.png'))

console.log('OK: public/favicon.png (1024×1024), public/apple-touch-icon.png (180×180)')
