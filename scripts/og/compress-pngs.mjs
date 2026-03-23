/**
 * Shrink public/og/*.png for the web.
 * Puppeteer screenshots use deviceScaleFactor: 2 — files are 2× the layout size.
 * This script resizes to the intended display dimensions + max PNG compression.
 *
 * Usage: npm run og:compress
 */
import sharp from 'sharp'
import { readdirSync } from 'fs'
import { writeFile, stat } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ogDir = join(__dirname, '../../public/og')

/** Logical pixel size (matches scripts/og/generate.mjs viewport / clip) */
const TARGET = {
  'home.png': { width: 1200, height: 630 },
  'blog.png': { width: 1200, height: 630 },
  'tools.png': { width: 1200, height: 630 },
  'linkedin-banner.png': { width: 1584, height: 396 },
  'hero-preview.png': { width: 1600, height: 900 },
  'hero-preview-light.png': { width: 1600, height: 900 },
}

async function main() {
  const files = readdirSync(ogDir).filter((f) => f.endsWith('.png'))
  let totalBefore = 0
  let totalAfter = 0

  for (const name of files) {
    const target = TARGET[name]
    if (!target) {
      console.warn(`  skip (no target): ${name}`)
      continue
    }

    const inputPath = join(ogDir, name)
    const before = (await stat(inputPath)).size
    const buf = await sharp(inputPath)
      .resize(target.width, target.height, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3,
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 10,
      })
      .toBuffer()

    await writeFile(inputPath, buf)

    const after = buf.length
    totalBefore += before
    totalAfter += after
    const pct = (((before - after) / before) * 100).toFixed(1)
    console.log(`  ${name}  ${before} → ${after} bytes (${pct}% smaller)`)
  }

  console.log(`\n  Total: ${totalBefore} → ${totalAfter} bytes (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% saved)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
