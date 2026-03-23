/**
 * OG Image + LinkedIn Banner Generator
 * Renders HTML templates to PNG files using Puppeteer.
 *
 * Usage:
 *   npm install -D puppeteer   (one-time)
 *   node scripts/og/generate.mjs
 *
 * Output:  public/og/home.png            — 1200×630  (OG / Twitter card)
 *          public/og/blog.png            — 1200×630
 *          public/og/tools.png           — 1200×630
 *          public/og/linkedin-banner.png — 1584×396  (LinkedIn cover photo)
 *
 * Screenshots are 2× resolution (deviceScaleFactor: 2). After generating, run:
 *   npm run og:compress
 * to resize to logical dimensions + compress PNGs for the website.
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { mkdirSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir    = resolve(__dirname, '../../public/og')

const IMAGES = [
  { html: 'home.html',            out: 'home.png',            width: 1200, height: 630  },
  { html: 'blog.html',            out: 'blog.png',            width: 1200, height: 630  },
  { html: 'tools.html',           out: 'tools.png',           width: 1200, height: 630  },
  { html: 'linkedin-banner.html', out: 'linkedin-banner.png', width: 1584, height: 396  },
  { html: 'hero-preview.html',       out: 'hero-preview.png',       width: 1600, height: 900  },
  { html: 'hero-preview-light.html', out: 'hero-preview-light.png', width: 1600, height: 900  },
]

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

console.log('Launching browser...')
const browser = await puppeteer.launch({ headless: 'new' })
const page    = await browser.newPage()

for (const { html, out, width, height } of IMAGES) {
  const htmlPath = join(__dirname, html)
  const outPath  = join(outDir, out)

  // 2× device pixel ratio for crisp retina output
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })

  // Give Google Fonts an extra moment if network was slow
  await new Promise(r => setTimeout(r, 500))

  const omitBg = out.startsWith('hero-preview')
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width, height }, omitBackground: omitBg })
  console.log(`  ✓  public/og/${out}  (${width}×${height})`)
}

await browser.close()
console.log('\nDone. All images written to public/og/')
console.log('Tip: npm run og:compress  — shrink PNGs for production (~4× fewer pixels from 2× screenshots).')
