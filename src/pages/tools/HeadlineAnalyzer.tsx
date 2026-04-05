import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, AlertCircle, XCircle, Sparkles, RotateCcw } from 'lucide-react'
import { trackToolUse } from '@/lib/toolTracking'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { ToolUpgradeCta } from '@/components/tools/ToolUpgradeCta'
import { cn } from '@/lib/utils'

// ─── Scoring engine (kept as fallback) ────────────────────────────────────────

interface Criterion {
  id: string
  label: string
  score: number       // 0–20
  maxScore: number
  status: 'good' | 'warn' | 'bad'
  feedback: string
  tip: string
}

interface AnalysisResult {
  total: number       // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: string
  criteria: Criterion[]
  rewrite?: string
  /** Product funnel line from analyze-tool */
  cta?: string
  cached?: boolean
}

const WEAK_ROLE_WORDS = [
  'experienced', 'passionate', 'results-driven', 'dynamic', 'motivated',
  'hardworking', 'team player', 'self-starter', 'guru', 'ninja', 'rockstar',
  'visionary', 'thought leader', 'serial',
]

const VALUE_WORDS = [
  'help', 'build', 'grow', 'scale', 'create', 'drive', 'lead', 'launch',
  'turn', 'transform', 'solve', 'increase', 'reduce', 'save', 'enable',
  'develop', 'deliver', 'generate', 'improve',
]

const CREDIBILITY_PATTERNS = [
  /\d+\+?\s*(years?|yrs?)/i,
  /\$[\d.,]+[kmb]?/i,
  /[\d,]+\+?\s*(users?|customers?|clients?|companies|startups?|founders?)/i,
  /\d+x/i,
  /\b(ex|former|previously)\b/i,
  /\b(yc|ycombinator|500\s*startups?|techstars|sequoia|a16z)\b/i,
  /\b(forbes|techcrunch|wired|fast\s*company)\b/i,
]

function scoreToStatus(score: number, max: number): 'good' | 'warn' | 'bad' {
  const pct = score / max
  if (pct >= 0.75) return 'good'
  if (pct >= 0.4)  return 'warn'
  return 'bad'
}

function analyzeHeadline(headline: string): AnalysisResult {
  const text = headline.trim()
  const lower = text.toLowerCase()
  const len = text.length

  // ── 1. Length (0–20) ──────────────────────────────────────────────────────
  let lengthScore = 0
  let lengthFeedback = ''
  let lengthTip = ''

  if (len === 0) {
    lengthScore = 0
    lengthFeedback = 'No headline entered.'
    lengthTip = 'Aim for 60-120 characters: long enough to be specific, short enough to be scannable.'
  } else if (len < 30) {
    lengthScore = 8
    lengthFeedback = 'Too short. You have room to add specifics.'
    lengthTip = 'Add your target audience, a result you deliver, or a credibility marker.'
  } else if (len <= 120) {
    lengthScore = 20
    lengthFeedback = 'Good length. Enough room to be specific without being cut off.'
    lengthTip = 'Keep it under 220 characters total so it displays fully in search results.'
  } else if (len <= 180) {
    lengthScore = 14
    lengthFeedback = 'A little long. LinkedIn truncates headlines in search.'
    lengthTip = 'Try to fit your core value proposition in the first 120 characters.'
  } else {
    lengthScore = 8
    lengthFeedback = 'Too long. Most of this will be cut off in LinkedIn search results.'
    lengthTip = 'Cut to the most specific, highest-signal phrase. Remove anything decorative.'
  }

  // ── 2. Specificity - no generic buzzwords (0-20) ──────────────────────────
  const foundWeak = WEAK_ROLE_WORDS.filter(w => lower.includes(w))
  let specificityScore = 0
  let specificityFeedback = ''
  let specificityTip = ''

  if (len === 0) {
    specificityScore = 0
    specificityFeedback = ''
    specificityTip = ''
  } else if (foundWeak.length === 0) {
    specificityScore = 20
    specificityFeedback = 'No generic buzzwords found. Good.'
    specificityTip = 'Make it even more specific by naming your exact target audience or niche.'
  } else if (foundWeak.length === 1) {
    specificityScore = 12
    specificityFeedback = `Contains a weak word: "${foundWeak[0]}". This is common but forgettable.`
    specificityTip = `Replace "${foundWeak[0]}" with something concrete: a number, a result, or a specific niche.`
  } else {
    specificityScore = 4
    specificityFeedback = `Contains ${foundWeak.length} generic words: ${foundWeak.map(w => `"${w}"`).join(', ')}.`
    specificityTip = 'Rewrite from scratch. Replace every abstract word with something only you could say.'
  }

  // ── 3. Value proposition - action / outcome language (0-20) ──────────────
  const hasValue = VALUE_WORDS.some(w => lower.includes(w))
  const hasAudience = /\b(founders?|ceos?|startups?|saas|b2b|teams?|devs?|developers?|engineers?|marketers?|agencies?|brands?)\b/i.test(text)
  let valueScore = 0
  let valueFeedback = ''
  let valueTip = ''

  if (len === 0) {
    valueScore = 0
    valueFeedback = ''
    valueTip = ''
  } else if (hasValue && hasAudience) {
    valueScore = 20
    valueFeedback = 'Clear value proposition with audience and action. Strong.'
    valueTip = 'Consider adding a specific result or outcome to make it even more compelling.'
  } else if (hasValue || hasAudience) {
    valueScore = 12
    valueFeedback = hasValue
      ? 'Has action language but no clear target audience.'
      : 'Names an audience but not what you do for them.'
    valueTip = hasValue
      ? 'Add who specifically you help: "helping [specific audience] do X."'
      : 'Add an action word that describes what you actually deliver.'
  } else {
    valueScore = 4
    valueFeedback = 'Reads like a job title, not a value proposition.'
    valueTip = 'Reframe as "I help [specific audience] do [specific thing]", then compress it.'
  }

  // ── 4. Credibility markers (0–20) ─────────────────────────────────────────
  const credibilityMatches = CREDIBILITY_PATTERNS.filter(p => p.test(text))
  let credibilityScore = 0
  let credibilityFeedback = ''
  let credibilityTip = ''

  if (len === 0) {
    credibilityScore = 0
    credibilityFeedback = ''
    credibilityTip = ''
  } else if (credibilityMatches.length >= 2) {
    credibilityScore = 20
    credibilityFeedback = 'Strong credibility signals. Numbers and proof build instant trust.'
    credibilityTip = 'Make sure the numbers are verifiable and the most impressive one leads.'
  } else if (credibilityMatches.length === 1) {
    credibilityScore = 12
    credibilityFeedback = 'One credibility signal found. Good start.'
    credibilityTip = 'Can you add a second proof point? A number, a notable company, or a specific outcome.'
  } else {
    credibilityScore = 4
    credibilityFeedback = 'No credibility signals. Anyone could say this.'
    credibilityTip = 'Add a number: years of experience, users served, revenue generated, or a notable brand you\'ve worked with.'
  }

  // ── 5. Keyword clarity - title / role present (0-20) ─────────────────────
  const ROLE_KEYWORDS = [
    'founder', 'ceo', 'cto', 'coo', 'vp', 'head of', 'director',
    'engineer', 'developer', 'designer', 'marketer', 'consultant',
    'advisor', 'investor', 'operator', 'builder', 'product',
    'coach', 'writer', 'creator', 'analyst',
  ]
  const hasRole = ROLE_KEYWORDS.some(r => lower.includes(r))
  let keywordScore = 0
  let keywordFeedback = ''
  let keywordTip = ''

  if (len === 0) {
    keywordScore = 0
    keywordFeedback = ''
    keywordTip = ''
  } else if (hasRole) {
    keywordScore = 20
    keywordFeedback = 'Includes a clear role keyword. Good for LinkedIn search discoverability.'
    keywordTip = 'Make sure your role keyword is in the first 60 characters for maximum search weight.'
  } else {
    keywordScore = 8
    keywordFeedback = 'No clear role or title keyword detected.'
    keywordTip = 'LinkedIn\'s search algorithm uses your headline to match you to relevant searches. Include your core role.'
  }

  // ── Total + grade ─────────────────────────────────────────────────────────
  const total = len === 0 ? 0 : lengthScore + specificityScore + valueScore + credibilityScore + keywordScore

  let grade: AnalysisResult['grade']
  let summary: string

  if (total >= 85) {
    grade = 'A'
    summary = 'Strong headline. Specific, credible, and searchable. Keep it, or test a variation.'
  } else if (total >= 70) {
    grade = 'B'
    summary = 'Solid headline with room to sharpen. One focused edit away from excellent.'
  } else if (total >= 55) {
    grade = 'C'
    summary = 'Readable but generic. Too close to what everyone else has.'
  } else if (total >= 35) {
    grade = 'D'
    summary = 'Forgettable. A stranger visiting your profile won\'t know why they should connect.'
  } else {
    grade = 'F'
    summary = 'Needs a full rewrite. Start from what you do and who you do it for.'
  }

  const criteria: Criterion[] = [
    { id: 'length',      label: 'Length',              score: lengthScore,      maxScore: 20, status: scoreToStatus(lengthScore, 20),      feedback: lengthFeedback,      tip: lengthTip },
    { id: 'specificity', label: 'No generic buzzwords', score: specificityScore, maxScore: 20, status: scoreToStatus(specificityScore, 20), feedback: specificityFeedback, tip: specificityTip },
    { id: 'value',       label: 'Value proposition',   score: valueScore,       maxScore: 20, status: scoreToStatus(valueScore, 20),       feedback: valueFeedback,       tip: valueTip },
    { id: 'credibility', label: 'Credibility markers',  score: credibilityScore, maxScore: 20, status: scoreToStatus(credibilityScore, 20), feedback: credibilityFeedback, tip: credibilityTip },
    { id: 'keywords',    label: 'Role keyword',         score: keywordScore,     maxScore: 20, status: scoreToStatus(keywordScore, 20),     feedback: keywordFeedback,     tip: keywordTip },
  ]

  return { total, grade, summary, criteria }
}

// ─── Edge function call ────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function analyzeWithAI(text: string): Promise<AnalysisResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/analyze-tool`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ tool: 'headline', content: text }),
  })
  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many requests. Try again in a few minutes.')
    if (res.status === 503) throw new Error('Analysis is temporarily unavailable. Try again shortly.')
    throw new Error('Something went wrong. Try again.')
  }
  return res.json()
}

// ─── Status icon ──────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: 'good' | 'warn' | 'bad' }) {
  if (status === 'good') return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
  if (status === 'warn') return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
  return <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
}

// ─── Grade ring ───────────────────────────────────────────────────────────────

const GRADE_COLORS = {
  A: 'text-success border-success/30 bg-success/10',
  B: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  C: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  D: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  F: 'text-danger border-danger/30 bg-danger/10',
}

// ─── Example headlines ────────────────────────────────────────────────────────

const EXAMPLES = [
  'Founder @ Wrively | Helping B2B founders build their LinkedIn voice | 200+ founders posting weekly',
  'CEO | Experienced entrepreneur | Passionate about startups',
  'Building AI tools for developers | Ex-Stripe | $2M ARR in 18 months',
  'Product Manager',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async () => {
    if (!headline.trim()) return
    setLoading(true)
    setError(null)
    try {
      const aiResult = await analyzeWithAI(headline)
      setResult(aiResult)
      setHasAnalyzed(true)
      trackToolUse({ tool: 'headline-analyzer', score: aiResult.total, usedExample: false })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      const fallback = analyzeHeadline(headline)
      setResult(fallback)
      setHasAnalyzed(true)
      setError(msg)
      trackToolUse({ tool: 'headline-analyzer', score: fallback.total, usedExample: false })
    } finally {
      setLoading(false)
    }
  }, [headline])

  const reset = () => {
    setHeadline('')
    setResult(null)
    setHasAnalyzed(false)
    setError(null)
  }

  const tryExample = (ex: string) => {
    setHeadline(ex)
    setResult(null)
    setHasAnalyzed(false)
    setError(null)
    // trigger async analyze with the example text directly
    setLoading(true)
    analyzeWithAI(ex)
      .then(aiResult => {
        setResult(aiResult)
        setHasAnalyzed(true)
        trackToolUse({ tool: 'headline-analyzer', score: aiResult.total, usedExample: true })
      })
      .catch(err => {
        const msg = err instanceof Error ? err.message : 'Analysis failed'
        const fallback = analyzeHeadline(ex)
        setResult(fallback)
        setHasAnalyzed(true)
        setError(msg)
        trackToolUse({ tool: 'headline-analyzer', score: fallback.total, usedExample: true })
      })
      .finally(() => setLoading(false))
  }

  const toolSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LinkedIn Headline Analyzer',
    description: 'Free tool to score and improve your LinkedIn headline. Get instant feedback on specificity, value proposition, credibility, and search keywords.',
    url: 'https://wrively.com/tools/linkedin-headline-analyzer',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: { '@type': 'Organization', name: 'Wrively', url: 'https://wrively.com' },
  })

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>Free LinkedIn Headline Analyzer: Score & Improve Your Headline | Wrively</title>
        <meta name="description" content="Analyze your LinkedIn headline in seconds. Get a score out of 100, see what's weak, and get an AI-rewritten version. Free, no signup required." />
        <link rel="canonical" href="https://wrively.com/tools/linkedin-headline-analyzer" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Free LinkedIn Headline Analyzer: Score & Improve Your Headline" />
        <meta property="og:description" content="Analyze your LinkedIn headline in seconds. Score out of 100, specific feedback, and an AI-rewritten version. Free, no signup." />
        <meta property="og:url" content="https://wrively.com/tools/linkedin-headline-analyzer" />
        <meta property="og:image" content="https://wrively.com/og/tools.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free LinkedIn Headline Analyzer: Score & Improve Your Headline" />
        <meta name="twitter:description" content="Analyze your LinkedIn headline in seconds. Score out of 100, specific feedback, and an AI-rewritten version. Free, no signup." />
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
            LinkedIn Headline Analyzer
          </h1>
          <p className="text-base text-text-muted leading-relaxed max-w-xl">
            Your headline is the first thing anyone sees. Paste yours below and get an instant score
            across 5 criteria that actually matter for discoverability and first impressions.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-surface border border-border rounded-card overflow-hidden mb-6">
          <div className="relative px-6 pt-5 pb-0 border-b border-border">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <label className="text-sm font-medium text-text-muted block mb-3">
              Your LinkedIn headline
            </label>
            <textarea
              value={headline}
              onChange={e => {
                setHeadline(e.target.value)
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); analyze() } }}
              placeholder="e.g. Founder @ Acme | Helping B2B teams close deals faster | Ex-Salesforce"
              rows={3}
              className="w-full bg-transparent border-0 text-base text-text placeholder:text-text-subtle resize-none focus:outline-none pb-4 leading-relaxed"
            />
          </div>
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <span className={cn(
              'text-xs',
              headline.length > 180 ? 'text-danger' : headline.length > 120 ? 'text-amber-400' : 'text-text-subtle'
            )}>
              {headline.length} / 220 chars
            </span>
            <div className="flex items-center gap-2">
              {hasAnalyzed && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
              <Button size="sm" onClick={analyze} disabled={!headline.trim() || loading} className="px-5">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />Analyzing...</span>
                ) : (
                  <span className="flex items-center gap-1.5">Analyze headline<ArrowRight className="w-3.5 h-3.5" /></span>
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
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => tryExample(ex)}
                  className="text-xs text-text-muted border border-border rounded-full px-3 py-1.5 hover:border-primary/30 hover:text-text transition-colors text-left max-w-xs truncate"
                >
                  {ex.length > 60 ? ex.slice(0, 58) + '…' : ex}
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
              <div className="px-6 py-4 border-b border-border">
                <div className="h-4 bg-surface-hover rounded w-24" />
              </div>
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
        {!loading && result && headline.trim() && (
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

            <ToolUpgradeCta cta={result.cta} cached={result.cached} source="headline-analyzer" />

            {/* Score summary */}
            <div className="bg-surface border border-border rounded-card p-6 flex items-center gap-6">
              <div className={cn(
                'w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0',
                GRADE_COLORS[result.grade]
              )}>
                <span className="text-3xl font-bold leading-none">{result.grade}</span>
                <span className="text-xs font-medium mt-0.5 opacity-80">{result.total}/100</span>
              </div>
              <div>
                <p className="text-base font-semibold text-text mb-1">{result.summary}</p>
                <div className="w-full max-w-[280px] h-2 bg-surface-hover rounded-full overflow-hidden mt-3">
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

            {/* AI rewrite suggestion */}
            {result?.rewrite && (
              <div className="bg-primary/[0.04] border border-primary/20 rounded-card p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">AI Rewrite Suggestion</p>
                <p className="text-sm text-text leading-relaxed font-medium mb-3">"{result.rewrite}"</p>
                <button
                  onClick={() => { setHeadline(result.rewrite!); setResult(null); setHasAnalyzed(false) }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Use this headline and re-analyze
                </button>
              </div>
            )}

            {/* Criteria breakdown */}
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
                A great headline is step one. Your posts are step two.
              </h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                Wrively builds your Voice Layer: the model of how you think and sound,
                so every post you generate actually sounds like you. Not a template. You.
              </p>
              <Link to="/signup">
                <Button size="sm" className="px-5">
                  Build my voice layer free
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <p className="text-xs text-text-subtle mt-3">No credit card. 2-minute setup.</p>
            </div>
          </div>
        )}

        {/* Educational content (SEO) */}
        <div className="mt-16 space-y-10 border-t border-border pt-12">

          <div>
            <h2 className="text-xl font-bold text-text mb-3">What makes a strong LinkedIn headline?</h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              Most LinkedIn headlines are job titles. "CEO at Acme." "Software Engineer." "Founder."
              These answer what you are. They don't answer why someone should connect with you, follow you,
              or hire you.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              A strong LinkedIn headline does three things: it tells people who you help, what you help them do,
              and why you're the right person to do it. In 220 characters or less.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-3">The 5 criteria we score</h2>
            <div className="space-y-4">
              {[
                { label: 'Length', desc: 'LinkedIn shows your headline in search results, connection requests, and post comments. Too short wastes real estate. Too long gets cut off. The sweet spot is 60 to 120 characters for the core message, with the full 220 available for detail.' },
                { label: 'No generic buzzwords', desc: '"Experienced," "passionate," "results-driven" - these words appear in millions of headlines and say nothing specific about you. They signal effort but not substance. Every word should be replaceable only with something specific to you.' },
                { label: 'Value proposition', desc: 'Your headline should answer: what do you do and who do you do it for? "I help B2B SaaS founders build their LinkedIn audience" is a value proposition. "Marketing professional" is a title. Titles describe you. Value propositions describe what you deliver.' },
                { label: 'Credibility markers', desc: 'Numbers, notable companies, and specific outcomes are credibility shortcuts. "200+ clients served," "ex-Stripe," "$5M ARR" - these turn a claim into proof. Even one specific number outperforms five adjectives.' },
                { label: 'Role keyword', desc: 'LinkedIn\'s search algorithm uses your headline as a primary signal for who you are. If someone searches for a "product designer" or "B2B consultant," your headline determines whether you appear. Include your actual role keyword somewhere visible.' },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-surface border border-border rounded-card px-5 py-4">
                  <p className="text-sm font-semibold text-text mb-1.5">{label}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-3">LinkedIn headline formula for founders</h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              The simplest high-scoring formula for early-stage founders:
            </p>
            <div className="bg-surface border border-border rounded-card px-5 py-4 font-mono text-sm text-text mb-4">
              [Role] @ [Company] | Helping [audience] do [specific thing] | [proof point]
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Example: "Founder @ Wrively | Helping B2B founders build a LinkedIn voice that sounds like them | 300+ weekly active users"
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text mb-3">Your headline attracts profile visits. Your posts build the audience.</h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              A strong headline drives profile clicks from search and from comments you leave on other posts.
              But what converts a visitor into a follower is your content - specifically, whether your posts
              sound like a real person with a real point of view.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              Wrively builds your Voice Layer: a persistent model of how you think, what you believe, and how
              you sound. Every post it generates comes from that model. Not from a generic prompt. From you.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors mt-4"
            >
              Start building your voice for free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* More free tools */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-xl font-bold text-text mb-6">More free LinkedIn tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/tools/linkedin-post-checker"
              className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-text mb-1 group-hover:text-primary transition-colors">LinkedIn Post Checker</h3>
              <p className="text-sm text-text-muted">Score any post before you publish. Hook strength, length, formatting, structure, and CTA.</p>
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
