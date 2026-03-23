import { useState, useEffect, useCallback } from 'react'
import { Check } from 'lucide-react'
import { toast } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { generateComments, LimitReachedError } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import { isLinkedInPostUrl, cn } from '@/lib/utils'

interface CommentResults {
  insightful: string
  curious: string
  bold: string
}

const COMMENT_META: {
  key: keyof CommentResults
  label: string
  desc: string
  accent: string
  badge: string
}[] = [
  {
    key: 'insightful',
    label: 'Insightful',
    desc: 'Adds a perspective or data point',
    accent: 'border-l-sky-500/50',
    badge: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20',
  },
  {
    key: 'curious',
    label: 'Curious',
    desc: 'Asks a thoughtful question',
    accent: 'border-l-violet-500/50',
    badge: 'text-violet-400 bg-violet-500/[0.08] border-violet-500/20',
  },
  {
    key: 'bold',
    label: 'Bold',
    desc: 'Strong take or respectful disagreement',
    accent: 'border-l-amber-500/50',
    badge: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20',
  },
]

const COMMENT_GOAL = 5

function getWeekStart(): Date {
  const today = new Date()
  const day = today.getDay()
  const mon = new Date(today)
  mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  mon.setHours(0, 0, 0, 0)
  return mon
}

export default function Engage() {
  const { company, user } = useAuthStore()

  const [postText, setPostText] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [results, setResults] = useState<CommentResults | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [goalLoading, setGoalLoading] = useState(true)

  const loadWeeklyCount = useCallback(async () => {
    if (!user) return
    const weekStart = getWeekStart()
    const { data } = await supabase
      .from('comment_suggestions')
      .select('source_post, created_at')
      .eq('user_id', user.id)
      .gte('created_at', weekStart.toISOString())
    const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
    const count = new Set((data ?? []).map(r => normalize(r.source_post))).size
    setWeeklyCount(count)
    setGoalLoading(false)
  }, [user])

  useEffect(() => {
    loadWeeklyCount()
  }, [loadWeeklyCount])

  const generate = async () => {
    if (!company || !postText.trim()) return
    setError('')
    setGenerating(true)
    setResults(null)

    try {
      const comments = await generateComments({
        source_post: postText,
        company_id: company.id,
        source_url: linkedinUrl.trim() || undefined,
      })

      setResults(comments)
      toast.success('3 comment suggestions ready')
      loadWeeklyCount()
    } catch (err: unknown) {
      console.error('Comment generation error:', err)
      if (err instanceof LimitReachedError) {
        setError("You've used all your comments for this month. Upgrade to keep going.")
      } else {
        setError('Failed to generate comments. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const urlIsLinkedIn = linkedinUrl.trim() && isLinkedInPostUrl(linkedinUrl)
  const displayCount = Math.min(weeklyCount, COMMENT_GOAL)
  const goalComplete = displayCount >= COMMENT_GOAL

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text">Get Comment Suggestions</h1>
        <p className="text-sm text-text-muted mt-0.5">Paste any post, get 3 ready-to-use comments in seconds</p>
      </div>

      {/* ─── Weekly goal tracker ───────────────────────────────────────── */}
      {goalLoading ? (
        <div className="skeleton h-[72px] rounded-card" />
      ) : (
        <div className={cn(
          'bg-surface border rounded-card px-4 py-3.5',
          goalComplete ? 'border-success/25' : 'border-border'
        )}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-medium text-text">
              {goalComplete ? 'Weekly goal hit!' : `Comment on ${COMMENT_GOAL} posts this week`}
            </p>
            <span className={cn(
              'text-xs font-semibold',
              goalComplete ? 'text-success' : 'text-text-muted'
            )}>
              {displayCount}/{COMMENT_GOAL}
            </span>
          </div>

          {/* Circle tracker */}
          <div className="flex items-center gap-2">
            {Array.from({ length: COMMENT_GOAL }).map((_, i) => {
              const done = i < displayCount
              return (
                <div
                  key={i}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0',
                    done
                      ? 'bg-success shadow-[0_0_0_3px_rgba(34,197,94,0.12)]'
                      : 'border-2 border-border'
                  )}
                >
                  {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              )
            })}
            {goalComplete && (
              <p className="text-xs text-success font-medium ml-1">
                Keep going. Every extra comment compounds visibility.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── Input ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <Textarea
          label="Paste the post text"
          rows={6}
          placeholder="Paste the post you want to comment on here..."
          value={postText}
          onChange={e => setPostText(e.target.value)}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          onClick={generate}
          loading={generating}
          disabled={!postText.trim() || generating}
          size="lg"
          className="w-full"
        >
          {generating ? 'Generating...' : 'Generate 3 Comments'}
        </Button>

        {/* LinkedIn URL — truly optional metadata */}
        <div className="pt-1">
          <input
            type="url"
            placeholder="LinkedIn post URL (optional, for tracking only)"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            className="w-full bg-transparent text-xs text-text-muted placeholder:text-text-subtle border-0 border-b border-border/50 pb-1.5 focus:outline-none focus:border-border-focus transition-colors"
          />
          {linkedinUrl.trim() && !urlIsLinkedIn && (
            <p className="text-[11px] text-text-subtle mt-1">
              We can't read post content from URLs. Paste the text above.
            </p>
          )}
        </div>
      </div>

      {/* ─── Results ───────────────────────────────────────────────────── */}
      {results && (
        <div className="space-y-3">
          {COMMENT_META.map(({ key, label, desc, accent, badge }) => {
            const text = results[key]
            if (!text) return null

            return (
              <div
                key={key}
                className={cn(
                  'bg-surface border border-border border-l-4 rounded-card overflow-hidden',
                  accent
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 pt-3.5 pb-2">
                  <span className={cn(
                    'text-[11px] font-bold px-2 py-0.5 rounded border tracking-widest uppercase',
                    badge
                  )}>
                    {label}
                  </span>
                  <span className="text-xs text-text-subtle hidden sm:block">{desc}</span>
                </div>

                {/* Comment text */}
                <p className="text-sm text-text leading-relaxed px-4 pb-3">{text}</p>

                {/* Action bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
                  <p className="text-[11px] text-text-subtle">Edit before posting</p>
                  <CopyButton text={text} label="Copy to edit" />
                </div>
              </div>
            )
          })}

          <p className="text-[11px] text-text-subtle text-center pt-1">
            These are starting points. Make them yours before posting.
          </p>
        </div>
      )}
    </div>
  )
}
