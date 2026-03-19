import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpgradeWallProps {
  plan: 'free' | 'starter' | 'pro' | 'beta'
  postsGenerated: number
  postsCopied: number
  postsPublished: number
  postsUsed: number
  postsLimit: number | null
  compact?: boolean
}

export default function UpgradeWall({
  plan,
  postsGenerated,
  postsCopied,
  postsPublished,
  postsUsed,
  postsLimit,
  compact = false,
}: UpgradeWallProps) {
  const isFullAccess = plan === 'beta' || plan === 'pro'
  const remaining = postsLimit !== null ? Math.max(0, postsLimit - postsUsed) : null
  const showScarcity = !isFullAccess && remaining !== null

  // Lead sentence - strongest signal first
  const leadSentence =
    postsPublished >= 1
      ? `You've published ${postsPublished} post${postsPublished > 1 ? 's' : ''}. Your content is out there working.`
      : postsCopied >= 1
      ? `${postsCopied} post${postsCopied > 1 ? 's' : ''} copied and ready to post on LinkedIn.`
      : postsGenerated >= 3
      ? `${postsGenerated} posts generated and ready to go.`
      : null

  // Supporting summary (only shown when we have multi-signal data worth combining)
  const showSummary = leadSentence !== null && (
    (postsPublished >= 1 && (postsCopied > 0 || postsGenerated > 0)) ||
    (postsCopied >= 1 && postsGenerated > 0)
  )

  const inner = (
    <div className="space-y-2.5">
      {leadSentence !== null ? (
        <>
          <p className="text-sm font-semibold text-text">{leadSentence}</p>
          {showSummary && (
            <p className="text-sm text-text-muted">
              This month: {postsGenerated} generated
              {postsCopied > 0 ? `, ${postsCopied} copied` : ''}
              {postsPublished > 0 ? `, ${postsPublished} published` : ''}.
            </p>
          )}
          {isFullAccess ? (
            <p className="text-sm text-text-muted">You're on full access.</p>
          ) : showScarcity ? (
            <p className="text-sm text-text-muted">
              {remaining === 0
                ? "You've hit your limit for this month."
                : <>You have <span className="font-semibold text-text">{remaining}</span> posts left this month.</>
              }
            </p>
          ) : null}
          {!isFullAccess && <p className="text-sm text-text-muted">Pro unlocks unlimited posts + full history + persona regeneration.</p>}
        </>
      ) : (
        <>
          <p className="text-sm text-text-muted">
            Founders who post 3×/week on LinkedIn see 5–10× more profile views within 30 days.
          </p>
          <p className="text-sm text-text-muted">
            Start building your record. FounderX tracks what works for you over time.
          </p>
        </>
      )}
      {!isFullAccess && (
        <Link
          to="/pricing"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Upgrade to Pro
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  )

  if (compact) {
    return <div>{inner}</div>
  }

  return (
    <div className={cn('bg-surface border border-primary/20 rounded-card p-5')}>
      {inner}
    </div>
  )
}
