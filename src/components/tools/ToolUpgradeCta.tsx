import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type ToolName = 'headline-analyzer' | 'post-checker' | 'voice-analyzer'

type ToolUpgradeCtaProps = {
  cta?: string
  /** Which tool is showing this — used as the waitlist source */
  source: ToolName
  /** Shown when the edge function returned a KV cache hit */
  cached?: boolean
  className?: string
}

/**
 * Post-analysis CTA — two paths for the visitor:
 *   1. Primary: "Try Wrively free" → /signup
 *   2. Secondary: email capture → waitlist table (for visitors not ready to sign up)
 */
export function ToolUpgradeCta({ cta, source, cached, className }: ToolUpgradeCtaProps) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  if (!cta?.trim()) return null

  async function handleWaitlist(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || status !== 'idle') return
    setStatus('submitting')
    try {
      await supabase.from('waitlist').insert({ email: email.trim().toLowerCase(), source })
    } catch {
      // unique violation = already on the list; treat as success
    }
    setStatus('done')
  }

  return (
    <div className={cn('space-y-3', className)}>
      {cached && (
        <p className="text-xs text-text-subtle">
          Instant result — same input was analyzed recently.
        </p>
      )}

      {/* Primary CTA */}
      <div className="rounded-card border border-primary/20 bg-primary/[0.04] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-text leading-relaxed">{cta}</p>
        <a
          href="/signup"
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Try Wrively free
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>

      {/* Secondary: email capture for visitors not ready to sign up */}
      <div className="px-1">
        {status === 'done' ? (
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-success shrink-0" />
            You're on the list — we'll keep you posted.
          </p>
        ) : (
          <form onSubmit={handleWaitlist} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 h-8 rounded-lg border border-border bg-surface px-3 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="h-8 shrink-0 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-muted hover:text-text hover:border-border-hover transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Saving…' : 'Notify me about new tools'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
