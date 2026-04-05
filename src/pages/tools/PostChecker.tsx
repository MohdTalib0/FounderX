import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, AlertCircle, XCircle, Sparkles, RotateCcw, ArrowUpRight } from 'lucide-react'
import { trackToolUse } from '@/lib/toolTracking'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { ToolUpgradeCta } from '@/components/tools/ToolUpgradeCta'
import { cn } from '@/lib/utils'

// ─── Supabase Edge Function ────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function analyzeWithAI(text: string): Promise<PostResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/analyze-tool`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ tool: 'post-checker', content: text }),
  })
  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many requests. Try again in a few minutes.')
    if (res.status === 503) throw new Error('Analysis is temporarily unavailable. Try again shortly.')
    throw new Error('Something went wrong. Try again.')
  }
  return res.json()
}

// ─── Scoring engine ───────────────────────────────────────────────────────────

interface Criterion {
  id: string
  label: string
  score: number
  maxScore: number
  status: 'good' | 'warn' | 'bad'
  feedback: string
  tip: string
}

interface PostResult {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: string
  wordCount: number
  lineCount: number
  criteria: Criterion[]
  improved_hook?: string
  cta?: string
  cached?: boolean
}

const WEAK_HOOKS = [
  'i want to', 'i am going to', 'today i want', 'in this post',
  'i am excited', 'i am thrilled', 'i am happy to', 'i am pleased',
  'let me share', 'let me tell you', 'as we all know', 'it goes without saying',
  'in today\'s world', 'in today\'s fast', 'the world is changing',
  'i\'ve been thinking about', 'i wanted to share',
]

const FILLER_PHRASES = [
  'game changer', 'game-changer', 'leverage', 'synergy', 'pivot',
  'disruptive', 'thought leader', 'paradigm shift', 'move the needle',
  'circle back', 'low-hanging fruit', 'boil the ocean', 'deep dive',
  'at the end of the day', 'it is what it is',
]

const CTA_PATTERNS = [
  /\?/,
  /\b(share|comment|thoughts|what do you|agree|disagree|let me know|reply|tell me|drop|add yours|your take|your thoughts|have you|tried this|how do you)\b/i,
  /\b(follow|connect|dm|message me|reach out|subscribe)\b/i,
  /\b(save this|bookmark|repost|share this)\b/i,
]

function getParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
}

function getLines(text: string): string[] {
  return text.split('\n').map(l => l.trim()).filter(Boolean)
}

function getWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

function analyzePost(text: string): PostResult {
  const trimmed = text.trim()
  const words = getWords(trimmed)
  const lines = getLines(trimmed)
  const paragraphs = getParagraphs(trimmed)
  const wordCount = words.length
  const lower = trimmed.toLowerCase()

  // First line / hook
  const firstLine = lines[0] ?? ''
  const firstLineWords = getWords(firstLine).length

  // ── 1. Hook strength (0–25) ───────────────────────────────────────────────
  const hasWeakHook = WEAK_HOOKS.some(w => lower.startsWith(w) || lower.slice(0, 80).includes(w))
  const hookIsQuestion = firstLine.trim().endsWith('?')
  const hookIsBold = firstLine.length > 10 && firstLine.length < 120 && !hasWeakHook
  const hookTooLong = firstLineWords > 20

  let hookScore = 0
  let hookFeedback = ''
  let hookTip = ''

  if (hasWeakHook) {
    hookScore = 6
    hookFeedback = 'Weak opening line. It leads with intent ("I want to share") instead of value or tension.'
    hookTip = 'Start with a bold claim, a specific number, a counterintuitive statement, or a one-line story. The hook is the only line most people read.'
  } else if (hookTooLong) {
    hookScore = 12
    hookFeedback = 'Opening line is too long. On LinkedIn, the hook is everything - it needs to stop the scroll in under 10 words.'
    hookTip = 'Cut your first line to under 12 words. One idea, maximum impact. The rest can come after the "...more" fold.'
  } else if (hookIsQuestion) {
    hookScore = 18
    hookFeedback = 'Question hook. Good for engagement - makes the reader answer in their head.'
    hookTip = 'Make sure the question is specific, not generic. "Have you ever felt lost?" is weak. "Why do 90% of founders quit LinkedIn after 3 posts?" is strong.'
  } else if (hookIsBold) {
    hookScore = 25
    hookFeedback = 'Strong opening line. Specific, short, and designed to stop the scroll.'
    hookTip = 'Test a version that starts with a specific number or a counterintuitive claim - they tend to outperform narrative opens.'
  } else {
    hookScore = 14
    hookFeedback = 'Average opening. It won\'t repel readers but it won\'t stop them mid-scroll either.'
    hookTip = 'Try rewriting the first line as a bold claim or a specific counterintuitive observation. The goal: make someone think "wait, what?"'
  }

  // ── 2. Length (0–20) ──────────────────────────────────────────────────────
  let lengthScore = 0
  let lengthFeedback = ''
  let lengthTip = ''

  if (wordCount < 30) {
    lengthScore = 6
    lengthFeedback = `Too short at ${wordCount} words. Not enough substance to build trust or deliver value.`
    lengthTip = 'Aim for 80 to 250 words. Add the reasoning behind your point, a specific example, or one concrete takeaway.'
  } else if (wordCount <= 100) {
    lengthScore = 14
    lengthFeedback = `${wordCount} words. On the short side - good for bold takes, thin for insight posts.`
    lengthTip = 'If this is an insight or lesson post, add one specific example or data point. Short posts work best when the claim is genuinely bold.'
  } else if (wordCount <= 280) {
    lengthScore = 20
    lengthFeedback = `${wordCount} words. Optimal range. Long enough to deliver value, short enough to hold attention.`
    lengthTip = 'LinkedIn\'s algorithm tends to reward posts in the 150 to 300 word range. You\'re in the sweet spot.'
  } else if (wordCount <= 500) {
    lengthScore = 14
    lengthFeedback = `${wordCount} words. Getting long. You may lose readers before the end.`
    lengthTip = 'Cut the post by 20%. Find the one sentence in each paragraph that does the most work and delete the rest.'
  } else {
    lengthScore = 6
    lengthFeedback = `${wordCount} words. Too long for a LinkedIn post. This reads like a blog post, not a feed post.`
    lengthTip = 'Cut aggressively. If the content deserves this length, publish it as an article and link to it from a short post.'
  }

  // ── 3. Formatting and readability (0–20) ─────────────────────────────────
  const avgWordsPerParagraph = paragraphs.length > 0 ? wordCount / paragraphs.length : wordCount
  const hasSingleLineParagraphs = paragraphs.some(p => getWords(p).length <= 3)
  const hasLongParagraph = paragraphs.some(p => getWords(p).length > 60)
  const hasWallOfText = paragraphs.length === 1 && wordCount > 80
  const hasFillerPhrases = FILLER_PHRASES.filter(f => lower.includes(f))

  let formatScore = 0
  let formatFeedback = ''
  let formatTip = ''

  if (hasWallOfText) {
    formatScore = 4
    formatFeedback = 'Wall of text. No line breaks means readers see a block of gray and scroll past.'
    formatTip = 'Break every 1 to 3 sentences into its own line. Whitespace is not wasted space on LinkedIn - it\'s what makes posts scannable.'
  } else if (hasLongParagraph) {
    formatScore = 10
    formatFeedback = 'At least one paragraph is too dense. LinkedIn readers skim - dense blocks lose them.'
    formatTip = 'No paragraph should exceed 3 sentences. If you have more to say, break it into a new line.'
  } else if (hasFillerPhrases.length > 0) {
    formatScore = 14
    formatFeedback = `Contains filler phrases: ${hasFillerPhrases.slice(0, 2).map(f => `"${f}"`).join(', ')}. These dilute your credibility.`
    formatTip = `Replace "${hasFillerPhrases[0]}" with a specific example or concrete claim. Every word should earn its place.`
  } else if (avgWordsPerParagraph <= 25 && paragraphs.length > 1) {
    formatScore = 20
    formatFeedback = 'Well formatted. Short paragraphs and clear line breaks make this easy to read.'
    formatTip = hasSingleLineParagraphs ? 'Strong use of single-line paragraphs for emphasis. Use them sparingly - they lose impact if every line is a one-liner.' : 'Clean structure. Keep it.'
  } else {
    formatScore = 14
    formatFeedback = 'Decent formatting but some paragraphs are longer than ideal.'
    formatTip = 'Break any paragraph over 3 sentences into smaller chunks. The visual rhythm of short paragraphs keeps readers moving through the post.'
  }

  // ── 4. Structure - has a clear arc (0-20) ────────────────────────────────
  const hasMultipleActs = paragraphs.length >= 3
  const bodyHasSpecifics = /\b(\d+|specific|example|for instance|for example|last week|last month|this morning|yesterday|our|my|we)\b/i.test(trimmed)
  const hasContrast = /\b(but|however|instead|not|never|wrong|mistake|actually|the truth|most people|everyone thinks)\b/i.test(lower)

  let structureScore = 0
  let structureFeedback = ''
  let structureTip = ''

  if (!hasMultipleActs) {
    structureScore = 8
    structureFeedback = 'Single block of content. No clear hook, body, and close structure.'
    structureTip = 'Break the post into three parts: an opening that creates tension, a middle that delivers value, and a close that asks for engagement or lands a takeaway.'
  } else if (bodyHasSpecifics && hasContrast) {
    structureScore = 20
    structureFeedback = 'Good structure. Has a hook, specific detail in the body, and contrast to hold tension.'
    structureTip = 'Strong post structure. Make sure the ending lands cleanly - the last line is the second-most-read line after the hook.'
  } else if (bodyHasSpecifics || hasContrast) {
    structureScore = 14
    structureFeedback = bodyHasSpecifics
      ? 'Has specific details - good. Missing contrast or tension to pull the reader through.'
      : 'Has contrast / tension - good. Could use more specific examples to back the claim.'
    structureTip = bodyHasSpecifics
      ? 'Add one "but" or "however" moment - a turn that subverts the reader\'s expectation. Posts with a twist retain attention better.'
      : 'Ground the contrast in a specific example. "Most people think X. I thought so too, until [specific thing happened]."'
  } else {
    structureScore = 8
    structureFeedback = 'Generic structure. No specific details or tension to hold the reader\'s attention.'
    structureTip = 'Add one specific detail from your own experience. Specificity is what makes posts feel real, not AI-generated.'
  }

  // ── 5. Closing / CTA (0–15) ──────────────────────────────────────────────
  const lastLines = lines.slice(-3).join(' ').toLowerCase()
  const hasCTA = CTA_PATTERNS.some(p => p.test(lastLines))
  const lastLine = lines[lines.length - 1] ?? ''
  const lastLineIsShort = getWords(lastLine).length <= 12
  const endsAbruptly = !hasCTA && wordCount > 50

  let ctaScore = 0
  let ctaFeedback = ''
  let ctaTip = ''

  if (hasCTA && lastLineIsShort) {
    ctaScore = 15
    ctaFeedback = 'Strong close. Ends with a clear, short call to action or engagement question.'
    ctaTip = 'A question at the end consistently outperforms a statement for comment rate. Keep it.'
  } else if (hasCTA) {
    ctaScore = 10
    ctaFeedback = 'Has a call to action but the close is a bit long.'
    ctaTip = 'The last line should be punchy - 5 to 10 words maximum. Cut everything after your engagement question.'
  } else if (endsAbruptly) {
    ctaScore = 4
    ctaFeedback = 'No call to action. The post ends without inviting any response.'
    ctaTip = 'End with a specific question. Not "what do you think?" - something answerable: "What\'s the most counterintuitive lesson from your first product launch?"'
  } else {
    ctaScore = 8
    ctaFeedback = 'Short post with no explicit CTA. Acceptable for bold takes, weaker for insight posts.'
    ctaTip = 'Even a one-word question at the end ("Agree?") generates 3x more comments than no CTA. Try it.'
  }

  // ── Total + grade ─────────────────────────────────────────────────────────
  const total = hookScore + lengthScore + formatScore + structureScore + ctaScore

  let grade: PostResult['grade']
  let summary: string

  if (total >= 85) {
    grade = 'A'
    summary = 'High-quality post. Strong hook, good structure, clean formatting. Ready to publish.'
  } else if (total >= 70) {
    grade = 'B'
    summary = 'Solid post. One or two targeted edits away from excellent.'
  } else if (total >= 55) {
    grade = 'C'
    summary = 'Average. Readable but not memorable. Something is holding it back.'
  } else if (total >= 35) {
    grade = 'D'
    summary = 'Weak. Most readers will scroll past without engaging.'
  } else {
    grade = 'F'
    summary = 'Needs a full rewrite. Start with the hook.'
  }

  const criteria: Criterion[] = [
    { id: 'hook',      label: 'Hook strength',          score: hookScore,      maxScore: 25, status: scoreToStatus(hookScore, 25),      feedback: hookFeedback,      tip: hookTip },
    { id: 'length',    label: 'Length',                  score: lengthScore,    maxScore: 20, status: scoreToStatus(lengthScore, 20),    feedback: lengthFeedback,    tip: lengthTip },
    { id: 'format',    label: 'Formatting / readability', score: formatScore,    maxScore: 20, status: scoreToStatus(formatScore, 20),    feedback: formatFeedback,    tip: formatTip },
    { id: 'structure', label: 'Structure',                score: structureScore, maxScore: 20, status: scoreToStatus(structureScore, 20), feedback: structureFeedback, tip: structureTip },
    { id: 'cta',       label: 'Closing / CTA',           score: ctaScore,       maxScore: 15, status: scoreToStatus(ctaScore, 15),       feedback: ctaFeedback,       tip: ctaTip },
  ]

  return { total, grade, summary, wordCount, lineCount: lines.length, criteria }
}

function scoreToStatus(score: number, max: number): 'good' | 'warn' | 'bad' {
  const pct = score / max
  if (pct >= 0.75) return 'good'
  if (pct >= 0.4)  return 'warn'
  return 'bad'
}

// ─── Grade colors ─────────────────────────────────────────────────────────────

const GRADE_COLORS = {
  A: 'text-success border-success/30 bg-success/10',
  B: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  C: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  D: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  F: 'text-danger border-danger/30 bg-danger/10',
}

// ─── Status icon ──────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: 'good' | 'warn' | 'bad' }) {
  if (status === 'good') return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
  if (status === 'warn') return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
  return <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
}

// ─── Example posts ────────────────────────────────────────────────────────────

const EXAMPLES = [
  `We almost ran out of runway last month.\n\nHere's what saved us - and what I'd do differently.\n\nIn March we had 6 weeks of cash left. No term sheets. One potential customer ghosting us after 3 months of calls.\n\nI did something I'd been avoiding: I posted about it on LinkedIn.\n\nNot the sanitized version. The real one.\n\nWithin 48 hours:\n- Two investors reached out who hadn't responded to cold emails\n- A founder intro'd us to a customer who closed in 2 weeks\n- Our pipeline went from 0 to 4 active conversations\n\nDistribution is the product. Not just for B2C.\n\nWhat's the most counter-intuitive way you've found customers?`,
  `I want to share some thoughts about building in public and why I think it's really important for founders to be transparent about their journey and the lessons they've learned along the way because I believe it creates trust and authenticity which are both very valuable in today's startup ecosystem where everyone is trying to differentiate themselves from the competition.`,
  `3 things I learned after 100 customer calls:\n\nPrice is never the real objection.\n\nThey buy outcomes, not features.\n\nThe person in the room is rarely the decision maker.\n\nWhich one surprised you most?`,
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PostChecker() {
  const [post, setPost] = useState('')
  const [result, setResult] = useState<PostResult | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async () => {
    if (!post.trim()) return
    setLoading(true)
    setError(null)
    try {
      const aiResult = await analyzeWithAI(post)
      setResult(aiResult)
      setHasAnalyzed(true)
      trackToolUse({ tool: 'post-checker', score: aiResult.total, usedExample: false })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      const fallback = analyzePost(post)
      setResult(fallback)
      setHasAnalyzed(true)
      setError(msg)
      trackToolUse({ tool: 'post-checker', score: fallback.total, usedExample: false })
    } finally {
      setLoading(false)
    }
  }, [post])

  const reset = () => {
    setPost('')
    setResult(null)
    setHasAnalyzed(false)
    setError(null)
  }

  const tryExample = async (ex: string) => {
    setPost(ex)
    setLoading(true)
    setError(null)
    try {
      const aiResult = await analyzeWithAI(ex)
      setResult(aiResult)
      setHasAnalyzed(true)
      trackToolUse({ tool: 'post-checker', score: aiResult.total, usedExample: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      const fallback = analyzePost(ex)
      setResult(fallback)
      setHasAnalyzed(true)
      setError(msg)
      trackToolUse({ tool: 'post-checker', score: fallback.total, usedExample: true })
    } finally {
      setLoading(false)
    }
  }

  const toolSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LinkedIn Post Checker',
    description: 'Free tool to check and score your LinkedIn post before publishing. Get instant feedback on hook strength, length, formatting, structure, and CTA.',
    url: 'https://wrively.com/tools/linkedin-post-checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: { '@type': 'Organization', name: 'Wrively', url: 'https://wrively.com' },
  })

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>Free LinkedIn Post Checker — Score Your Post Before Publishing | Wrively</title>
        <meta name="description" content="Check your LinkedIn post before you publish. Get a score on hook strength, length, formatting, structure, and CTA. Free, instant, no signup required." />
        <link rel="canonical" href="https://wrively.com/tools/linkedin-post-checker" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Free LinkedIn Post Checker — Score Your Post Before Publishing" />
        <meta property="og:description" content="Check your LinkedIn post before you publish. Score on hook, length, formatting, structure, and CTA. Free, instant." />
        <meta property="og:url" content="https://wrively.com/tools/linkedin-post-checker" />
        <meta property="og:image" content="https://wrively.com/og/tools.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free LinkedIn Post Checker — Score Your Post Before Publishing" />
        <meta name="twitter:description" content="Check your LinkedIn post before you publish. Score on hook, length, formatting, structure, and CTA. Free, instant." />
        <meta name="twitter:image" content="https://wrively.com/og/tools.png" />
        <script type="application/ld+json">{toolSchema}</script>
      </Helmet>

      <PublicHeader />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Free tool - no signup required
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            LinkedIn Post Checker
          </h1>
          <p className="text-base text-text-muted leading-relaxed max-w-xl">
            Paste your draft LinkedIn post. Get an instant score across 5 criteria - hook strength, length,
            formatting, structure, and closing - with specific fixes before you publish.
          </p>
        </div>

        {/* Input */}
        <div className="bg-surface border border-border rounded-card overflow-hidden mb-6">
          <div className="relative px-6 pt-5 pb-0 border-b border-border">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <label className="text-sm font-medium text-text-muted block mb-3">
              Paste your LinkedIn post draft
            </label>
            <textarea
              value={post}
              onChange={e => setPost(e.target.value)}
              placeholder={`e.g.\nWe almost ran out of runway last month.\n\nHere's what saved us - and what I'd do differently.\n\n...`}
              rows={9}
              className="w-full bg-transparent border-0 text-sm text-text placeholder:text-text-subtle resize-none focus:outline-none pb-4 leading-relaxed font-mono"
            />
          </div>
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                'text-xs',
                post.length > 3000 ? 'text-danger' : 'text-text-subtle'
              )}>
                {getWords(post).length} words
              </span>
              {result && (
                <span className="text-xs text-text-subtle">
                  {result.lineCount} lines
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasAnalyzed && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
              <Button
                size="sm"
                onClick={analyze}
                disabled={!post.trim() || loading}
                className="px-5"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />Analyzing...</span>
                ) : (
                  <span className="flex items-center gap-1.5">Check my post<ArrowRight className="w-3.5 h-3.5" /></span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Try an example */}
        {!hasAnalyzed && !loading && (
          <div className="mb-10">
            <p className="text-xs text-text-subtle mb-3">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Strong post (A grade)',
                'Wall of text (C grade)',
                'Short punchy post (B grade)',
              ].map((label, i) => (
                <button
                  key={label}
                  onClick={() => tryExample(EXAMPLES[i])}
                  className="text-xs text-text-muted border border-border rounded-full px-3 py-1.5 hover:border-primary/30 hover:text-text transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-surface border border-border rounded-card p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-surface-hover shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-surface-hover rounded w-3/4" />
                <div className="h-3 bg-surface-hover rounded w-1/2" />
                <div className="h-2 bg-surface-hover rounded-full w-full max-w-[280px] mt-3" />
              </div>
            </div>
            <div className="bg-surface border border-border rounded-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border"><div className="h-4 bg-surface-hover rounded w-24" /></div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="px-6 py-4 border-b border-border last:border-0 flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-surface-hover shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-hover rounded w-32" />
                    <div className="h-3 bg-surface-hover rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && result && post.trim() && (
          <div className="space-y-4">

            {/* Error card */}
            {error && (
              <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-card p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text mb-0.5">Couldn't complete the analysis</p>
                  <p className="text-xs text-text-muted">{error}</p>
                </div>
              </div>
            )}

            <ToolUpgradeCta cta={result.cta} cached={result.cached} source="post-checker" />

            {/* Score summary */}
            <div className="bg-surface border border-border rounded-card p-6 flex items-center gap-6">
              <div className={cn(
                'w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0',
                GRADE_COLORS[result.grade]
              )}>
                <span className="text-3xl font-bold leading-none">{result.grade}</span>
                <span className="text-xs font-medium mt-0.5 opacity-80">{result.total}/100</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-text mb-1">{result.summary}</p>
                <div className="flex items-center gap-3 mt-1 mb-3">
                  <span className="text-xs text-text-subtle">{result.wordCount} words</span>
                  <span className="text-xs text-text-subtle">{result.lineCount} lines</span>
                </div>
                <div className="w-full max-w-[280px] h-2 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      result.total >= 85 ? 'bg-success' :
                      result.total >= 70 ? 'bg-sky-400' :
                      result.total >= 55 ? 'bg-amber-400' :
                      result.total >= 35 ? 'bg-orange-400' : 'bg-danger'
                    )}
                    style={{ width: `${result.total}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Improved Hook */}
            {result?.improved_hook && (
              <div className="bg-primary/[0.04] border border-primary/20 rounded-card p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">AI Improved Hook</p>
                <p className="text-sm text-text leading-relaxed font-medium">"{result.improved_hook}"</p>
                <p className="text-xs text-text-subtle mt-2">Replace your opening line with this to immediately increase scroll-stop rate.</p>
              </div>
            )}

            {/* Breakdown */}
            <div className="bg-surface border border-border rounded-card overflow-hidden">
              <div className="relative px-6 py-4 border-b border-border">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <p className="text-sm font-semibold text-text">Breakdown</p>
              </div>
              <div className="divide-y divide-border">
                {result.criteria.map(c => (
                  <div key={c.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={c.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <p className="text-sm font-medium text-text">{c.label}</p>
                          <span className={cn(
                            'text-xs font-semibold shrink-0',
                            c.status === 'good' ? 'text-success' :
                            c.status === 'warn' ? 'text-amber-400' : 'text-danger'
                          )}>
                            {c.score}/{c.maxScore}
                          </span>
                        </div>
                        {c.feedback && (
                          <p className="text-sm text-text-muted leading-relaxed mb-1">{c.feedback}</p>
                        )}
                        {c.status !== 'good' && c.tip && (
                          <p className="text-xs text-primary leading-relaxed">
                            Fix: {c.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-surface border border-primary/20 rounded-card p-6 relative overflow-hidden mt-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Wrively</p>
              <h3 className="text-base font-bold text-text mb-2">
                Stop checking. Start generating posts that score well from the start.
              </h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                Wrively builds your Voice Layer once, then generates Safe, Bold, and Contrarian posts
                in your voice. Every post is structured to score well on the criteria above - hook first, no filler, clean close.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button size="sm" className="px-5">
                    Generate a post free
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link
                  to="/tools/linkedin-headline-analyzer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors border border-border rounded-btn px-4 py-2"
                >
                  Also check your headline
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/tools/linkedin-voice-analyzer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors border border-border rounded-btn px-4 py-2"
                >
                  Also check your voice
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Educational content */}
        <div className="mt-16 space-y-10 border-t border-border pt-12">

          <div>
            <h2 className="text-xl font-bold text-text mb-3">What makes a LinkedIn post actually work?</h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              Most LinkedIn posts fail at the same five places. The hook doesn't stop the scroll. The length is wrong for the type of content. The formatting turns it into a wall of text. There's no specific detail in the body. And it ends without giving the reader anything to do.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              Fixing any one of these improves performance. Fixing all five consistently is how founders build an audience that actually converts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-3">The 5 criteria we score</h2>
            <div className="space-y-4">
              {[
                {
                  label: 'Hook strength (25 points)',
                  desc: 'The first line is the only line that gets read before the "...more" fold. If it doesn\'t stop the scroll, the rest doesn\'t matter. Strong hooks are short, specific, and create a gap between what the reader knows and what they want to know. Weak hooks lead with intent ("I want to share") or start with "In today\'s world."',
                },
                {
                  label: 'Length (20 points)',
                  desc: 'The optimal LinkedIn post length for engagement is 150 to 300 words. Too short and you haven\'t delivered enough value to earn a follow. Too long and you\'re writing a blog post - most readers won\'t reach the end. The algorithm also correlates dwell time (how long someone spends reading) with distribution, so length affects reach directly.',
                },
                {
                  label: 'Formatting and readability (20 points)',
                  desc: 'LinkedIn is a mobile-first platform. Readers skim. A wall of text is invisible. Short paragraphs, consistent line breaks, and no dense blocks are what make a post feel readable before anyone reads a word. Filler phrases ("game changer," "leverage," "paradigm shift") also score negatively - they signal low-effort content.',
                },
                {
                  label: 'Structure (20 points)',
                  desc: 'The best LinkedIn posts have an arc: a hook that creates tension, a body that delivers specific value, and a close that lands the point. Specificity is the key signal - a post with a real example, a specific number, or a named situation feels authentic. Generic posts feel AI-generated regardless of who wrote them.',
                },
                {
                  label: 'Closing and CTA (15 points)',
                  desc: 'The last line is the second-most-read line after the hook. A post that ends abruptly leaves engagement on the table. A specific question at the end - not "what do you think?" but something answerable - consistently generates 3 to 5x more comments than a post that just stops.',
                },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-surface border border-border rounded-card px-5 py-4">
                  <p className="text-sm font-semibold text-text mb-1.5">{label}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-3">The problem with editing your own posts</h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              You can't objectively score your own writing when you wrote it. You know what you meant to say, so you read the intention into the words rather than what's actually there. That's why posts that feel good when you write them can still fall flat.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              The better approach is to generate posts that are structured correctly from the start - hook first, specific body, clean close - rather than editing bad structure into good structure after the fact. Wrively generates that way by default, because it knows LinkedIn's format and your specific voice.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors mt-4"
            >
              Generate posts that score well from the start <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* More free tools */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-xl font-bold text-text mb-6">More free LinkedIn tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/tools/linkedin-headline-analyzer"
              className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-text mb-1 group-hover:text-primary transition-colors">LinkedIn Headline Analyzer</h3>
              <p className="text-sm text-text-muted">Is your headline driving profile visits? Get a grade and specific rewrites across 5 criteria.</p>
            </Link>
            <Link
              to="/tools/linkedin-voice-analyzer"
              className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-text mb-1 group-hover:text-primary transition-colors">LinkedIn Voice Analyzer</h3>
              <p className="text-sm text-text-muted">Does your writing sound like you or like everyone else? Instant voice profile across 5 dimensions.</p>
            </Link>
          </div>
        </div>

      </main>

      <PublicFooter />
    </div>
  )
}
