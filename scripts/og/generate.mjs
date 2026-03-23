/**
 * OG Image Generator
 * Renders HTML templates to 1200×630 PNG files using Puppeteer.
 *
 * Usage:
 *   npm install -D puppeteer   (one-time)
 *   node scripts/og/generate.mjs
 *
 * Output:  public/og/home.png
 *          public/og/blog.png
 *          public/og/tools.png
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { mkdirSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir    = resolve(__dirname, '../../public/og')

const IMAGES = [
  { html: 'home.html',  out: 'home.png'  },
  { html: 'blog.html',  out: 'blog.png'  },
  { html: 'tools.html', out: 'tools.png' },
]

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

console.log('Launching browser...')
const browser = await puppeteer.launch({ headless: 'new' })
const page    = await browser.newPage()

// 2× device pixel ratio for crisp retina output, still saves at 1200×630
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 })

for (const { html, out } of IMAGES) {
  const htmlPath = join(__dirname, html)
  const outPath  = join(outDir, out)

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })

  // Give Google Fonts an extra moment if network was slow
  await new Promise(r => setTimeout(r, 500))

  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  console.log(`  ✓  public/og/${out}`)
}

await browser.close()
console.log('\nDone. All 3 OG images written to public/og/')
