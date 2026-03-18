import { useState, useEffect } from 'react'
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

const COMMENT_META = [
  { key: 'insightful' as const, label: 'Insightful', desc: 'Adds a perspective or data point' },
  { key: 'curious'    as const, label: 'Curious',    desc: 'Asks a thoughtful question' },
  { key: 'bold'       as const, label: 'Bold',        desc: 'Strong take or respectful disagreement' },
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

  const loadWeeklyCount = async () => {
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
  }

  useEffect(() => {
    loadWeeklyCount()
  }, [user])

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
        setError('You have reached your monthly comment limit. Upgrade to Pro for unlimited comments.')
      } else {
        setError('Failed to generate comments. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const urlIsLinkedIn = linkedinUrl.trim() && isLinkedInPostUrl(linkedinUrl)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-page text-text">Get Comment Suggestions</h1>
        <p className="text-sm text-text-muted mt-0.5">Paste any post text, get 3 ready-to-use comments</p>
      </div>

      {goalLoading ? (
        <div className="skeleton h-20 rounded-card" />
      ) : (
        (() => {
          const displayCount = Math.min(weeklyCount, COMMENT_GOAL)
          const complete = displayCount >= COMMENT_GOAL
          return (
            <div className={cn(
              'bg-surface border rounded-card px-4 py-3',
              complete ? 'border-success/20' : 'border-border'
            )}>
              <p className="text-sm font-medium text-text mb-2">
                Comment on {COMMENT_GOAL} posts this week
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: COMMENT_GOAL }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-8 h-1.5 rounded-full',
                        i < displayCount ? 'bg-primary' : 'bg-border'
                      )}
                    />
                  ))}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  complete ? 'text-success' : 'text-text-muted'
                )}>
                  {complete ? `${COMMENT_GOAL}/${COMMENT_GOAL} ✓ Week complete!` : `${displayCount}/${COMMENT_GOAL} done`}
                </span>
              </div>
              <p className="text-xs text-text-muted">Paste any post, get 3 comments in seconds.</p>
              {complete && (
                <div className="mt-2 pt-2.5 border-t border-success/20 space-y-1">
                  <p className="text-xs font-medium text-success">Week complete — great engagement habit!</p>
                  <p className="text-xs text-text-subtle">
                    Keep going for bonus reach — every extra comment compounds your visibility.
                  </p>
                </div>
              )}
            </div>
          )
        })()
      )}

      <div className="space-y-3">
        {/* Post text — primary */}
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
          {generating ? 'Generating...' : 'Generate Comments →'}
        </Button>

        {/* LinkedIn URL — truly optional, styled as metadata not a field */}
        <div className="pt-2">
          <input
            type="url"
            placeholder="LinkedIn post URL (optional — for tracking only)"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            className="w-full bg-transparent text-xs text-text-muted placeholder:text-text-subtle border-0 border-b border-border/50 pb-1 focus:outline-none focus:border-border-focus transition-colors"
          />
          {linkedinUrl.trim() && !urlIsLinkedIn && (
            <p className="text-xs text-text-subtle mt-1">
              We can't read post content from URLs — paste the text above.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {COMMENT_META.map(({ key, label, desc }) => {
            const text = results[key]
            if (!text) return null

            return (
              <div key={key} className="bg-surface border border-border rounded-card overflow-hidden">
                {/* Header */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text">{label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                  </div>
                  <CopyButton text={text} size="sm" label="Copy to edit" />
                </div>
                {/* Body */}
                <p className="text-sm text-text leading-relaxed px-4 pb-4">{text}</p>
              </div>
            )
          })}

          <p className="text-xs text-text-muted text-center pb-2">
            These are starting points. Edit them to make them feel personal.
          </p>
        </div>
      )}
    </div>
  )
}
