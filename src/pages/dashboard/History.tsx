import { useEffect, useState } from 'react'
import { FileText, MessageSquare, RefreshCw, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import CopyButton from '@/components/ui/CopyButton'
import Badge from '@/components/ui/Badge'
import { cn, truncate } from '@/lib/utils'
import type { GeneratedPost, CommentSuggestion, DraftRewrite } from '@/types/database'

type Filter = 'all' | 'posts' | 'comments' | 'rewrites'

type HistoryItem =
  | { type: 'post'; data: GeneratedPost; created_at: string }
  | { type: 'comment'; data: CommentSuggestion; created_at: string }
  | { type: 'rewrite'; data: DraftRewrite; created_at: string }

export default function History() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function load() {
    setLoading(true)

    const [postsRes, commentsRes, rewritesRes] = await Promise.all([
      supabase.from('generated_posts').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('comment_suggestions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('draft_rewrites').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50),
    ])

    const all: HistoryItem[] = [
      ...(postsRes.data ?? []).map(d => ({ type: 'post' as const, data: d, created_at: d.created_at })),
      ...(commentsRes.data ?? []).map(d => ({ type: 'comment' as const, data: d, created_at: d.created_at })),
      ...(rewritesRes.data ?? []).map(d => ({ type: 'rewrite' as const, data: d, created_at: d.created_at })),
    ]

    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setItems(all)
    setLoading(false)
  }

  const filtered = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'posts') return item.type === 'post'
    if (filter === 'comments') return item.type === 'comment'
    if (filter === 'rewrites') return item.type === 'rewrite'
    return true
  })

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'posts', label: 'Posts' },
    { value: 'comments', label: 'Comments' },
    { value: 'rewrites', label: 'Rewrites' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-page text-text">History</h1>
        <p className="text-sm text-text-muted mt-0.5">All your generated content</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-card p-1 w-fit">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'text-sm px-3 py-1.5 rounded-btn transition-all',
              filter === f.value
                ? 'bg-primary text-white font-medium'
                : 'text-text-muted hover:text-text'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface border border-border rounded-card p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-card p-10 text-center space-y-1">
          <p className="text-text-muted text-sm font-medium">Nothing here yet.</p>
          <p className="text-text-muted/60 text-xs">
            {filter === 'all'
              ? 'Your generated posts, comments, and rewrites will show up here.'
              : `Your ${filter} will appear here once you generate some.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryCard
              key={item.type + '-' + item.data.id}
              item={item}
              onRate={(id, rating) => handleRate(id, rating)}
            />
          ))}
        </div>
      )}
    </div>
  )

  async function handleRate(postId: string, rating: 1 | 2 | 3) {
    await supabase
      .from('generated_posts')
      .update({ performance_rating: rating })
      .eq('id', postId)

    setItems(prev => prev.map(item => {
      if (item.type === 'post' && item.data.id === postId) {
        return { ...item, data: { ...item.data, performance_rating: rating } }
      }
      return item
    }))
  }
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({
  item,
  onRate,
}: {
  item: HistoryItem
  onRate: (id: string, rating: 1 | 2 | 3) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showRating, setShowRating] = useState(false)
  // For posts: which variation tab is active when expanded
  const [activeVariation, setActiveVariation] = useState<'safe' | 'bold' | 'controversial'>('safe')

  if (item.type === 'post') {
    const post = item.data
    const defaultVariation = (post.selected_variation ?? 'safe') as 'safe' | 'bold' | 'controversial'

    // Collapsed: show the selected (or safe) variation, truncated
    const collapsedText = defaultVariation === 'bold'
      ? post.variation_bold
      : defaultVariation === 'controversial'
      ? post.variation_controversial
      : post.variation_safe

    // Expanded: show whichever tab is selected
    const expandedText = activeVariation === 'bold'
      ? post.variation_bold
      : activeVariation === 'controversial'
      ? post.variation_controversial
      : post.variation_safe

    // Initialise active variation to the one they actually used
    const handleExpand = () => {
      if (!expanded) setActiveVariation(defaultVariation)
      setExpanded(v => !v)
    }

    return (
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="text-xs text-text-muted">POST</span>
            <Badge variant={defaultVariation}>{defaultVariation.toUpperCase()}</Badge>
            <span className="text-xs text-text-muted">{relativeDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyButton text={expanded ? expandedText : collapsedText} size="sm" />
          </div>
        </div>

        {/* Body */}
        {expanded ? (
          <div className="px-4 pb-3 space-y-3">
            {/* Variation tabs */}
            <div className="flex gap-1">
              {(['safe', 'bold', 'controversial'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVariation(v)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded border transition-all capitalize',
                    activeVariation === v
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:border-border-hover hover:text-text'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {/* Full text */}
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{expandedText}</p>
          </div>
        ) : (
          <div className="px-4 pb-3">
            <p className="text-sm text-text-muted leading-relaxed">{truncate(collapsedText, 140)}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between gap-2">
          {/* Rating */}
          <div className="flex items-center gap-2">
            {post.performance_rating ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {post.performance_rating === 3 ? '🔥' : post.performance_rating === 2 ? '😐' : '😕'}
                </span>
                <span className="text-xs text-text-muted">
                  {post.performance_rating === 3 ? 'Great' : post.performance_rating === 2 ? 'Ok' : 'Poor'}
                </span>
                <button
                  onClick={() => setShowRating(true)}
                  className="text-xs text-text-subtle hover:text-text-muted transition-colors"
                >
                  Change
                </button>
              </div>
            ) : showRating ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {([
                  { rating: 3 as const, emoji: '🔥', label: 'Great' },
                  { rating: 2 as const, emoji: '😐', label: 'Ok' },
                  { rating: 1 as const, emoji: '😕', label: 'Poor' },
                ]).map(({ rating, emoji, label }) => (
                  <button
                    key={rating}
                    onClick={() => { onRate(post.id, rating); setShowRating(false) }}
                    className="text-xs px-2 py-1 rounded border border-border text-text-muted hover:border-primary/50 hover:text-primary transition-all"
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setShowRating(true)}
                className="text-xs text-text-subtle hover:text-text-muted transition-colors flex items-center gap-1"
              >
                <Star className="w-3 h-3" /> Rate
              </button>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={handleExpand}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show full post</>
            }
          </button>
        </div>
      </div>
    )
  }

  if (item.type === 'comment') {
    const c = item.data
    const comments = [
      { label: 'Insightful', text: c.comment_insightful },
      { label: 'Curious',    text: c.comment_curious },
      { label: 'Bold',       text: c.comment_bold },
    ]
    const preview = c.comment_insightful

    return (
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted">COMMENT</span>
            <span className="text-xs text-text-muted">{relativeDate(c.created_at)}</span>
          </div>
          <CopyButton text={preview} size="sm" />
        </div>

        {/* Source */}
        <p className="text-xs text-text-subtle px-4 pb-2">On: "{truncate(c.source_post, 70)}"</p>

        {/* Body */}
        {expanded ? (
          <div className="px-4 pb-3 space-y-3">
            {comments.map(({ label, text }) => text && (
              <div key={label} className="space-y-1">
                <p className="text-xs font-medium text-text-muted">{label}</p>
                <p className="text-sm text-text leading-relaxed">{text}</p>
                <CopyButton text={text} size="sm" label="Copy" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(preview, 140)}</p>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex justify-end">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show all 3 comments</>
            }
          </button>
        </div>
      </div>
    )
  }

  if (item.type === 'rewrite') {
    const r = item.data

    return (
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted">REWRITE</span>
            <span className="text-xs text-text-muted">{relativeDate(r.created_at)}</span>
          </div>
          <CopyButton text={r.rewritten} size="sm" />
        </div>

        {/* Source */}
        <p className="text-xs text-text-subtle px-4 pb-2">Draft: "{truncate(r.original_draft, 70)}"</p>

        {/* Body */}
        {expanded ? (
          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap px-4 pb-3">{r.rewritten}</p>
        ) : (
          <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(r.rewritten, 140)}</p>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex justify-end">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show full rewrite</>
            }
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
