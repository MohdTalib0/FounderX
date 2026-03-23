import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronUp, Sliders, ImageDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { generatePost, refinePost, regenerateVariation, LimitReachedError } from '@/lib/ai/client'
import { toast } from '@/store/toast'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import { QuoteCardModal } from '@/components/ui/QuoteCard'
import UpgradeWall from '@/components/ui/UpgradeWall'
import { cn } from '@/lib/utils'
import type { Company } from '@/types/database'

// ─── Types ────────────────────────────────────────────────────────────────────

type Variation = 'safe' | 'bold' | 'controversial'
type Refinement = 'too_formal' | 'too_generic' | 'too_long' | 'too_ai'

interface PostResults {
  safe: string
  bold: string
  controversial: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Write() {
  const [searchParams] = useSearchParams()
  const { company, profile, user } = useAuthStore()

  const [topic, setTopic] = useState(searchParams.get('topic') ?? '')
  const [results, setResults] = useState<PostResults | null>(null)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [refining, setRefining] = useState<Variation | null>(null)
  const [inputCollapsed, setInputCollapsed] = useState(false)
  const [error, setError] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [proofData, setProofData] = useState({ copied: 0, published: 0 })
  const [quoteCard, setQuoteCard] = useState<{ text: string; variation: Variation } | null>(null)

  useEffect(() => {
    if (!user) return
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    supabase
      .from('generated_posts')
      .select('was_copied, is_published')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .then(({ data, error }) => {
        if (data && !error) setProofData({
          copied: data.filter(p => p.was_copied).length,
          published: data.filter(p => p.is_published).length,
        })
      })
  }, [user])

  // Load existing post when arriving from Dashboard "Copy post →" next step
  const postId = searchParams.get('postId')
  useEffect(() => {
    if (!postId || !user) return
    supabase
      .from('generated_posts')
      .select('id, topic, variation_safe, variation_bold, variation_controversial')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (!data) return
        setTopic(data.topic)
        setResults({
          safe: data.variation_safe,
          bold: data.variation_bold,
          controversial: data.variation_controversial,
        })
        setSavedPostId(data.id)
        setInputCollapsed(true)
      })
  }, [postId, user])

  const [expanded, setExpanded] = useState<Record<Variation, boolean>>({
    safe: false, bold: false, controversial: false,
  })

  const resultsRef = useRef<HTMLDivElement>(null)
  const pillars = company?.content_pillars ?? []

  // ─── Generate ──────────────────────────────────────────────────────────────

  const generate = async (topicOverride?: string) => {
    if (!company) return
    const t = (topicOverride ?? topic).trim()
    if (!t) return

    setError('')
    setLimitReached(false)
    setGenerating(true)
    setResults(null)
    setSavedPostId(null)
    setInputCollapsed(false)

    try {
      const result = await generatePost({ topic: t, company_id: company.id })

      const posts: PostResults = {
        safe: result.variation_safe,
        bold: result.variation_bold,
        controversial: result.variation_controversial,
      }

      setResults(posts)
      setInputCollapsed(true)
      setSavedPostId(result.id)

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    } catch (err: unknown) {
      console.error('Generate error:', err)
      if (err instanceof LimitReachedError) {
        setLimitReached(true)
      } else {
        setError('Failed to generate posts. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  // ─── Refine ────────────────────────────────────────────────────────────────

  const refine = async (variation: Variation, refinement: Refinement) => {
    if (!company || !results) return
    setRefining(variation)

    try {
      const refined = await refinePost({
        company_id: company.id,
        post: results[variation],
        refinement,
      })

      setResults(prev => prev ? { ...prev, [variation]: refined } : prev)

      if (savedPostId) {
        await supabase
          .from('generated_posts')
          .update({ [`variation_${variation}`]: refined })
          .eq('id', savedPostId)
      }
    } catch {
      toast.error('Refinement failed. Try again.')
    } finally {
      setRefining(null)
    }
  }

  // ─── Regenerate one ────────────────────────────────────────────────────────

  const regenerateOne = async (variation: Variation) => {
    if (!company || !results) return
    setRefining(variation)

    try {
      const result = await regenerateVariation({
        company_id: company.id,
        topic,
        variation,
      })

      setResults(prev => prev ? { ...prev, [variation]: result } : prev)

      if (savedPostId) {
        await supabase
          .from('generated_posts')
          .update({ [`variation_${variation}`]: result })
          .eq('id', savedPostId)
      }
    } catch {
      toast.error('Regeneration failed. Try again.')
    } finally {
      setRefining(null)
    }
  }

  // ─── Copy + posted tracking ─────────────────────────────────────────────────

  const handleCopy = async (variation: Variation) => {
    if (!savedPostId) return
    await supabase
      .from('generated_posts')
      .update({ was_copied: true, selected_variation: variation })
      .eq('id', savedPostId)
    setProofData(prev => ({ ...prev, copied: prev.copied + 1 }))
  }

  const handleMarkPosted = async (variation: Variation) => {
    if (!savedPostId) return
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('generated_posts')
      .update({ is_published: true, published_at: now, selected_variation: variation })
      .eq('id', savedPostId)
    if (error) throw error
    setProofData(prev => ({ ...prev, published: prev.published + 1 }))
  }

  const toggleExpand = (v: Variation) =>
    setExpanded(prev => ({ ...prev, [v]: !prev[v] }))

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text">Write a Post</h1>
        <p className="text-sm text-text-muted mt-0.5">Get 3 variations ready to paste on LinkedIn</p>
      </div>

      {/* ─── Input section ─────────────────────────────────────────────── */}
      {inputCollapsed ? (
        /* Collapsed topic pill */
        <div className="bg-surface border border-border rounded-card px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium mb-0.5">Topic</p>
            <p className="text-sm text-text truncate">{topic}</p>
          </div>
          <button
            onClick={() => setInputCollapsed(false)}
            className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            label="What do you want to post about?"
            rows={2}
            autoFocus
            placeholder='e.g. "Why we almost quit last month"'
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && topic.trim()) {
                e.preventDefault()
                generate()
              }
            }}
          />

          {/* Content pillar chips */}
          {pillars.length > 0 && (
            <div>
              <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium mb-2">Your pillars</p>
              <div className="flex flex-wrap gap-2">
                {pillars.map(pillar => (
                  <button
                    key={pillar}
                    onClick={() => setTopic(`${pillar}: what I've learned so far`)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/[0.04] transition-all"
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          {limitReached && profile && (
            <UpgradeWall
              plan={profile.plan}
              postsGenerated={profile.posts_this_month}
              postsCopied={proofData.copied}
              postsPublished={proofData.published}
              postsUsed={profile.posts_this_month}
              postsLimit={profile.plan === 'free' ? 12 : profile.plan === 'starter' ? 80 : null}
              compact
            />
          )}

          <Button
            onClick={() => generate()}
            loading={generating}
            disabled={!topic.trim() || generating}
            size="lg"
            className="w-full"
          >
            {generating ? 'Generating...' : 'Generate 3 Variations'}
          </Button>
          <p className="text-[11px] text-text-subtle text-center">Press Enter to generate</p>
        </div>
      )}

      {/* Regenerate when collapsed */}
      {inputCollapsed && (
        <Button
          onClick={() => generate()}
          loading={generating}
          disabled={generating}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {generating ? 'Generating...' : 'Regenerate all'}
        </Button>
      )}

      {/* ─── Results ───────────────────────────────────────────────────── */}
      {results && (
        <div ref={resultsRef} className="space-y-3 scroll-mt-4">
          {(['safe', 'bold', 'controversial'] as Variation[]).map(variation => (
            <PostCard
              key={variation}
              variation={variation}
              text={results[variation]}
              topic={topic}
              company={company!}
              isExpanded={expanded[variation]}
              isRefining={refining === variation}
              isNewUser={proofData.copied === 0 && proofData.published === 0}
              onToggleExpand={() => toggleExpand(variation)}
              onCopy={() => handleCopy(variation)}
              onMarkPosted={() => handleMarkPosted(variation)}
              onRefine={(r) => refine(variation, r)}
              onRegenerate={() => regenerateOne(variation)}
              onQuoteCard={() => setQuoteCard({ text: results[variation], variation })}
            />
          ))}
        </div>
      )}

      {/* Quote card modal */}
      {quoteCard && company && (
        <QuoteCardModal
          text={quoteCard.text}
          variation={quoteCard.variation}
          founderName={profile?.full_name ?? profile?.email ?? 'Founder'}
          companyName={company.name}
          onClose={() => setQuoteCard(null)}
        />
      )}
    </div>
  )
}

// ─── Post Card ────────────────────────────────────────────────────────────────

const VARIATION_META: Record<Variation, {
  label: string
  desc: string
  hint: string
  accent: string        // left border
  badge: string         // badge text + bg
  indicator: string     // dot color
}> = {
  safe: {
    label: 'Safe',
    desc: 'Professional · builds authority',
    hint: 'Builds trust. Best for growing a new audience.',
    accent: 'border-l-emerald-500/50',
    badge: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20',
    indicator: 'bg-emerald-500',
  },
  bold: {
    label: 'Bold',
    desc: 'Opinionated take',
    hint: 'Gets more comments. Great for engagement.',
    accent: 'border-l-amber-500/50',
    badge: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20',
    indicator: 'bg-amber-500',
  },
  controversial: {
    label: 'Debate',
    desc: 'Starts a conversation',
    hint: 'High reach. Use sparingly.',
    accent: 'border-l-red-500/50',
    badge: 'text-red-400 bg-red-500/[0.08] border-red-500/20',
    indicator: 'bg-red-500',
  },
}

const REFINE_OPTIONS: { value: Refinement; label: string }[] = [
  { value: 'too_formal',  label: 'Too formal' },
  { value: 'too_generic', label: 'Too generic' },
  { value: 'too_long',    label: 'Too long' },
  { value: 'too_ai',      label: 'Sounds AI' },
]

function PostCard({
  variation,
  text,
  isExpanded,
  isRefining,
  isNewUser,
  onToggleExpand,
  onCopy,
  onMarkPosted,
  onRefine,
  onRegenerate,
  onQuoteCard,
}: {
  variation: Variation
  text: string
  topic: string
  company: Company
  isExpanded: boolean
  isRefining: boolean
  isNewUser: boolean
  onToggleExpand: () => void
  onCopy: () => void
  onMarkPosted: () => Promise<void>
  onRefine: (r: Refinement) => void
  onRegenerate: () => void
  onQuoteCard: () => void
}) {
  const [showRefine, setShowRefine] = useState(false)
  const [showPostedPrompt, setShowPostedPrompt] = useState(false)
  const [markedPosted, setMarkedPosted] = useState(false)
  const [postingToLinkedIn, setPostingToLinkedIn] = useState(false)

  const meta = VARIATION_META[variation]
  const lines = text.split('\n')
  const hook = lines[0] ?? ''
  const body = lines.slice(1).join('\n').trim()
  const charCount = text.length
  const isNearLimit = charCount > 2500

  const PREVIEW_CHARS = 240
  const isLong = body.length > PREVIEW_CHARS

  return (
    <div className={cn(
      'bg-surface border border-border border-l-4 rounded-card overflow-hidden transition-all duration-200',
      meta.accent,
      isRefining && 'opacity-60 pointer-events-none'
    )}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded border tracking-widest uppercase',
            meta.badge
          )}>
            {meta.label}
          </span>
          <span className="text-xs text-text-subtle hidden sm:block">{meta.desc}</span>
        </div>
        <span className={cn(
          'text-[11px] tabular-nums shrink-0',
          isNearLimit ? 'text-warning font-medium' : 'text-text-subtle'
        )}>
          {charCount}/3000
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="px-4 pb-3 space-y-2">
        {/* Hook — the scroll-stopper */}
        <p className="text-[16px] font-semibold text-text leading-snug">{hook}</p>

        {/* Body */}
        {body && (
          <>
            <p className={cn(
              'text-sm text-text-muted leading-relaxed whitespace-pre-wrap',
              !isExpanded && isLong ? 'line-clamp-3' : ''
            )}>
              {body}
            </p>
            {isLong && (
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-1 text-xs text-text-subtle hover:text-text-muted transition-colors"
              >
                {isExpanded
                  ? <><ChevronUp className="w-3 h-3" /> Show less</>
                  : <><ChevronDown className="w-3 h-3" /> Read more</>
                }
              </button>
            )}
          </>
        )}
      </div>

      {/* Mobile copy shortcut when expanded */}
      {isExpanded && isLong && (
        <div className="sm:hidden px-4 pb-3">
          <CopyButton
            text={text}
            onCopy={() => {
              onCopy()
              toast.success('Copied, ready to paste on LinkedIn')
              if (!markedPosted) setShowPostedPrompt(true)
            }}
            label="Copy post"
            className="w-full justify-center"
          />
        </div>
      )}

      {/* ── Action bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border">
        <div className="flex items-center gap-0.5">
          <button
            onClick={onRegenerate}
            disabled={isRefining}
            title="Regenerate"
            className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {!isNewUser && (
            <button
              onClick={() => setShowRefine(v => !v)}
              title="Adjust"
              className={cn(
                'p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs',
                showRefine
                  ? 'text-primary bg-primary/10'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover'
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Adjust</span>
            </button>
          )}
          <button
            onClick={onQuoteCard}
            title="Quote card image"
            className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-1.5 text-xs"
          >
            <ImageDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Image</span>
          </button>
        </div>
        <CopyButton
          text={text}
          onCopy={() => {
            onCopy()
            toast.success('Copied, ready to paste on LinkedIn')
            if (!markedPosted) setShowPostedPrompt(true)
          }}
          label="Copy post"
        />
      </div>

      {/* ── "Did you post?" inline prompt ───────────────────────────── */}
      {showPostedPrompt && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-surface-hover/30">
          <p className="text-xs text-text-muted">Did you post this on LinkedIn?</p>
          <div className="flex items-center gap-3">
            <button
              disabled={postingToLinkedIn}
              onClick={async () => {
                setPostingToLinkedIn(true)
                try {
                  await onMarkPosted()
                  setMarkedPosted(true)
                  setShowPostedPrompt(false)
                  toast.success('Marked as posted')
                } catch {
                  toast.error('Could not save. Try again.')
                } finally {
                  setPostingToLinkedIn(false)
                }
              }}
              className="text-xs font-semibold text-success hover:text-success/80 transition-colors disabled:opacity-50"
            >
              Yes, posted
            </button>
            <button
              onClick={() => setShowPostedPrompt(false)}
              className="text-xs text-text-subtle hover:text-text-muted transition-colors"
            >
              Not yet
            </button>
          </div>
        </div>
      )}
      {markedPosted && (
        <div className="px-4 py-2 border-t border-success/20 bg-success/[0.04]">
          <p className="text-xs text-success font-semibold">Posted on LinkedIn</p>
        </div>
      )}

      {/* ── Refine panel ────────────────────────────────────────────── */}
      {showRefine && (
        <div className="px-4 py-3 border-t border-border space-y-2 bg-surface-hover/20">
          <p className="text-xs text-text-muted font-medium">This sounds...</p>
          <div className="flex flex-wrap gap-2">
            {REFINE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onRefine(opt.value)
                  setShowRefine(false)
                }}
                disabled={isRefining}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface hover:border-primary/50 hover:text-primary hover:bg-primary/[0.04] text-text-muted transition-all disabled:opacity-40"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
