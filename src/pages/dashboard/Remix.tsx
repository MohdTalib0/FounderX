import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { remixPost, LimitReachedError } from '@/lib/ai/client'
import { toast } from '@/store/toast'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import CopyButton from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

interface RemixResult {
  structure: string
  hook_type: string
  tone: string
  why_it_works: string
  adapted_version: string
}

export default function Remix() {
  const { company } = useAuthStore()
  const [sourcePost, setSourcePost] = useState('')
  const [result, setResult] = useState<RemixResult | null>(null)
  const [inputCollapsed, setInputCollapsed] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!company || !sourcePost.trim()) return
    setError('')
    setGenerating(true)
    setResult(null)

    try {
      const data = await remixPost({ source_post: sourcePost, company_id: company.id })
      setResult(data)
      setInputCollapsed(true)
    } catch (err: unknown) {
      if (err instanceof LimitReachedError) {
        setError(`You've used all your rewrites & remixes this month. Upgrade to keep going.`)
      } else {
        console.error('Remix error:', err)
        setError('Failed to remix. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const handleRestart = () => {
    setResult(null)
    setInputCollapsed(false)
    setError('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text">Remix a Post</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Paste a post that caught your eye. We'll decode what makes it work and rewrite it in your voice.
        </p>
      </div>

      {/* ─── Input ─────────────────────────────────────────────────────── */}
      {inputCollapsed ? (
        <div className="bg-surface border border-border rounded-card px-4 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium mb-0.5">Source post</p>
            <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{sourcePost}</p>
          </div>
          <button
            onClick={handleRestart}
            className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 transition-colors mt-0.5"
          >
            New post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            label="Paste the post"
            rows={6}
            placeholder="Paste the LinkedIn post you want to remix here..."
            value={sourcePost}
            onChange={e => setSourcePost(e.target.value)}
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            onClick={handleGenerate}
            loading={generating}
            disabled={!sourcePost.trim() || generating}
            size="lg"
            className="w-full"
          >
            {generating ? 'Analysing & remixing...' : 'Remix this post'}
          </Button>
        </div>
      )}

      {/* ─── Results ───────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-4">

          {/* Structure breakdown */}
          <div className="space-y-2">
            <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium px-0.5">Why this post works</p>
            <div className="bg-surface border border-border rounded-card divide-y divide-border overflow-hidden">
              {[
                { label: 'Structure',    value: result.structure,    color: 'text-violet-400' },
                { label: 'Hook type',    value: result.hook_type,    color: 'text-amber-400' },
                { label: 'Tone',         value: result.tone,         color: 'text-sky-400' },
                { label: 'Why it works', value: result.why_it_works, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-start gap-3 px-4 py-3">
                  <span className={cn('text-[11px] font-bold uppercase tracking-wide shrink-0 w-20 mt-0.5', color)}>
                    {label}
                  </span>
                  <span className="text-sm text-text-muted leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adapted version */}
          <div className="space-y-2">
            <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium px-0.5">Your version</p>
            <div className="bg-surface border-l-4 border-l-primary/50 border border-border rounded-card overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-[11px] text-text-subtle uppercase tracking-wide font-medium">Adapted</span>
                <span className="text-[11px] text-text-subtle tabular-nums">{result.adapted_version.length}/3000</span>
              </div>

              <div className="px-4 pb-3 space-y-2">
                {(() => {
                  const lines = result.adapted_version.split('\n')
                  const hookLine = lines[0] ?? ''
                  const bodyLines = lines.slice(1).join('\n').trim()
                  return (
                    <>
                      <p className="text-[16px] font-semibold text-text leading-snug">{hookLine}</p>
                      {bodyLines && (
                        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{bodyLines}</p>
                      )}
                    </>
                  )
                })()}
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors disabled:opacity-40"
                >
                  <Shuffle className={cn('w-3.5 h-3.5', generating && 'animate-spin')} />
                  Remix again
                </button>
                <CopyButton
                  text={result.adapted_version}
                  onCopy={() => toast.success('Copied! Paste on LinkedIn')}
                  label="Copy post"
                />
              </div>

              {/* Post-copy next steps */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-primary/15 bg-primary/[0.03]">
                <a
                  href="https://www.linkedin.com/feed/?shareActive=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Open LinkedIn to paste ↗
                </a>
                <button
                  onClick={() => { setResult(null); setSourcePost('') }}
                  className="text-xs text-text-muted hover:text-text transition-colors"
                >
                  Remix another post →
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
