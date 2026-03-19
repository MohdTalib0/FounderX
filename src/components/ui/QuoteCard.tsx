import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import { ImageDown, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Card renderer ────────────────────────────────────────────────────────────
// Renders at whatever size the parent dictates via `size` prop.

interface QuoteCardInnerProps {
  text: string
  founderName: string
  companyName: string
  variation: 'safe' | 'bold' | 'controversial'
  size: number  // width = height (square)
}

const VARIATION_COLOR: Record<string, string> = {
  safe:          '#22C55E',
  bold:          '#F59E0B',
  controversial: '#EF4444',
}

function QuoteCardInner({ text, founderName, companyName, variation, size }: QuoteCardInnerProps) {
  const accent = VARIATION_COLOR[variation] ?? VARIATION_COLOR.safe
  const scale = size / 1080

  const paragraphs = text.split('\n').filter(Boolean)
  const hook = paragraphs[0] ?? ''
  const body = paragraphs.slice(1)

  const baseFontSize = text.length > 600 ? 22 : text.length > 400 ? 26 : text.length > 250 ? 30 : 34

  const s = (n: number) => Math.round(n * scale)

  return (
    <div style={{
      width: size,
      height: size,
      background: '#0F0F0F',
      borderRadius: s(40),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: s(80),
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: s(6),
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      }} />

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: s(-200), left: s(-200),
        width: s(600), height: s(600),
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Quote mark - SVG so it renders consistently regardless of font availability */}
      <svg
        width={s(72)} height={s(56)}
        viewBox="0 0 72 56"
        fill={accent}
        style={{ opacity: 0.2, marginBottom: s(-16), marginTop: s(-8), flexShrink: 0 }}
      >
        <path d="M0 56V36.4C0 23.467 3.2 13.067 9.6 5.2L18.4 0C14.933 6.133 13.2 13.067 13.2 20.8V28H28V56H0ZM44 56V36.4C44 23.467 47.2 13.067 53.6 5.2L62.4 0C58.933 6.133 57.2 13.067 57.2 20.8V28H72V56H44Z" />
      </svg>

      {/* Text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: s(20) }}>
        <p style={{
          fontSize: s(baseFontSize + 4),
          fontWeight: 700,
          color: '#F5F5F5',
          lineHeight: 1.35,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          {hook}
        </p>
        {body.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
            {body.map((para, i) => (
              <p key={i} style={{
                fontSize: s(baseFontSize),
                color: '#A1A1AA',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: s(48),
        paddingTop: s(32),
        borderTop: `1px solid #2E2E2E`,
      }}>
        {/* Founder info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: s(16) }}>
          <div style={{
            width: s(48), height: s(48),
            borderRadius: '50%',
            background: `${accent}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s(18),
            fontWeight: 700,
            color: accent,
            flexShrink: 0,
          }}>
            {founderName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: s(18), fontWeight: 600, color: '#F5F5F5' }}>{founderName}</p>
            <p style={{ margin: 0, fontSize: s(15), color: '#71717A' }}>{companyName}</p>
          </div>
        </div>

        {/* FounderX logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: s(10), opacity: 0.6 }}>
          <div style={{
            width: s(32), height: s(32),
            borderRadius: s(10),
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span style={{ fontSize: s(18), fontWeight: 700, color: '#F5F5F5', letterSpacing: '-0.02em' }}>
            FounderX
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface QuoteCardModalProps {
  text: string
  founderName: string
  companyName: string
  variation: 'safe' | 'bold' | 'controversial'
  onClose: () => void
}

// Full export resolution - always 1080px
const EXPORT_SIZE = 1080

export function QuoteCardModal({ text, founderName, companyName, variation, onClose }: QuoteCardModalProps) {
  const captureRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [previewSize, setPreviewSize] = useState(380)

  // Measure the container on mount so the preview fits any screen size
  useEffect(() => {
    if (!previewContainerRef.current) return
    const w = previewContainerRef.current.clientWidth
    if (w > 0) setPreviewSize(w)
  }, [])

  const handleDownload = async () => {
    if (!captureRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(captureRef.current, {
        width: EXPORT_SIZE,
        height: EXPORT_SIZE,
        pixelRatio: 1,
      })
      const link = document.createElement('a')
      link.download = `founderx-${variation}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Image export failed', err)
    } finally {
      setDownloading(false)
    }
  }

  return createPortal(
    <>
      {/* Off-screen full-res card for capture only - never visible */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -1, pointerEvents: 'none' }}>
        <div ref={captureRef}>
          <QuoteCardInner
            text={text} founderName={founderName} companyName={companyName}
            variation={variation} size={EXPORT_SIZE}
          />
        </div>
      </div>

      {/* Modal - portalled to body so no parent stacking context interferes */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-surface border border-border rounded-card shadow-card-hover w-full max-w-lg space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <p className="text-sm font-semibold text-text">Quote card</p>
              <p className="text-xs text-text-muted mt-0.5">1080×1080 · ready for LinkedIn</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview - fills available width, measured on mount */}
          <div className="px-5">
            <div className="rounded-[10px] overflow-hidden border border-border" ref={previewContainerRef}>
              <QuoteCardInner
                text={text} founderName={founderName} companyName={companyName}
                variation={variation} size={previewSize}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-5 pb-5">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 h-10 rounded-btn text-sm font-semibold transition-all',
                'bg-primary hover:bg-primary-hover text-white',
                downloading && 'opacity-60 cursor-not-allowed'
              )}
            >
              {downloading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
                : <><ImageDown className="w-4 h-4" /> Download PNG</>
              }
            </button>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-btn text-sm text-text-muted border border-border hover:border-border-hover hover:text-text transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
