import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToolUpgradeCtaProps = {
  cta?: string
  /** Shown when the edge function returned a KV cache hit */
  cached?: boolean
  className?: string
}

const WRIVELY_HOME = 'https://wrively.com'

/**
 * Optional “join Wrively” funnel after a free tool result — copy from `analyze-tool` (`cta`).
 * Does not replace the on-page “no signup required” messaging for the tool itself.
 */
export function ToolUpgradeCta({ cta, cached, className }: ToolUpgradeCtaProps) {
  if (!cta?.trim()) return null
  return (
    <div className={cn('space-y-2', className)}>
      {cached && (
        <p className="text-xs text-text-subtle">
          Instant result — same input was analyzed recently.
        </p>
      )}
      <div className="rounded-card border border-primary/20 bg-primary/[0.04] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-text leading-relaxed">{cta}</p>
        <a
          href={WRIVELY_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Join Wrively
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </a>
      </div>
    </div>
  )
}
