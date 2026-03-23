import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, AlertCircle, XCircle, Mic, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { ToolUpgradeCta } from '@/components/tools/ToolUpgradeCta'
import { cn } from '@/lib/utils'

// ─── Supabase Edge Function ────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function analyzeWithAI(text: string): Promise<VoiceResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/analyze-tool`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ tool: 'voice', content: text }),
  })
  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many requests. Try again in a few minutes.')
    if (res.status === 503) throw new Error('Analysis is temporarily unavailable. Try again shortly.')
    throw new Error('Something went wrong. Try again.')
  }
  return res.json()
}

// ─── Voice analysis engine ────────────────────────────────────────────────────

interface VoiceTrait {
  id: string
  label: string
  value: string
  description: string
  status: 'strong' | 'moderate' | 'weak'
  tip: string
}

interface VoiceResult {
  profile: string
  traits: VoiceTrait[]
  strengths: string[]
  gaps: string[]
  voiceScore: number
  summary?: string
  cta?: string
  cached?: boolean
}

function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g) ?? [text]
}

function words(text: string): string[] {
  return text.toLowerCase().match(/\b\w+\b/g) ?? []
}

function analyzeVoice(sample: string): VoiceResult {
  const sentenceList = sentences(sample)
  const wordList = words(sample)
  const totalWords = wordList.length
  const totalSentences = Math.max(sentenceList.length, 1)

  // ─── Trait: First-person ratio ────────────────────────────────────────────
  const firstPersonWords = wordList.filter(w =>
    ['i', 'my', 'me', 'mine', "i'm", "i've", "i'd", "i'll", 'myself'].includes(w)
  ).length
  const fpRatio = firstPersonWords / totalWords
  const fpScore: VoiceTrait = (() => {
    if (fpRatio >= 0.04 && fpRatio <= 0.12) return {
      id: 'first_person',
      label: 'First-person presence',
      value: `${Math.round(fpRatio * 100)}% of words`,
      description: 'You write from direct personal experience, not generic advice.',
      status: 'strong',
      tip: 'Keep writing in first-person. It builds trust and separates you from generic AI content.',
    }
    if (fpRatio < 0.04) return {
      id: 'first_person',
      label: 'First-person presence',
      value: `${Math.round(fpRatio * 100)}% of words`,
      description: 'Your writing is impersonal or advice-focused. Readers cannot tell this is from a real founder.',
      status: 'weak',
      tip: 'Add "I" statements. Replace "founders should..." with "I learned that..." or "When I tried...".',
    }
    return {
      id: 'first_person',
      label: 'First-person presence',
      value: `${Math.round(fpRatio * 100)}% of words`,
      description: 'Slightly heavy on self-reference. Balance personal experience with broader insight.',
      status: 'moderate',
      tip: 'Alternate between your story and a takeaway for the reader every 2-3 sentences.',
    }
  })()

  // ─── Trait: Sentence rhythm (avg length) ─────────────────────────────────
  const avgSentenceLength = totalWords / totalSentences
  const sentenceLengths = sentenceList.map(s => (s.match(/\b\w+\b/g) ?? []).length)
  const shortSentences = sentenceLengths.filter(l => l <= 8).length
  const rhythmVariety = shortSentences / totalSentences
  const rhythmScore: VoiceTrait = (() => {
    if (avgSentenceLength <= 16 && rhythmVariety >= 0.25) return {
      id: 'rhythm',
      label: 'Sentence rhythm',
      value: `${Math.round(avgSentenceLength)} words avg`,
      description: 'You mix short punchy sentences with longer ones. This creates natural reading pace.',
      status: 'strong',
      tip: 'This rhythm is working. LinkedIn readers scan on mobile - keep sentences under 20 words on average.',
    }
    if (avgSentenceLength > 22) return {
      id: 'rhythm',
      label: 'Sentence rhythm',
      value: `${Math.round(avgSentenceLength)} words avg`,
      description: 'Your sentences run long. This creates density that is hard to read on mobile.',
      status: 'weak',
      tip: 'Break any sentence over 20 words into two. Try ending a key insight with a one-word sentence. "Really."',
    }
    return {
      id: 'rhythm',
      label: 'Sentence rhythm',
      value: `${Math.round(avgSentenceLength)} words avg`,
      description: 'Decent rhythm but could vary more. Mix short impact lines with fuller explanations.',
      status: 'moderate',
      tip: 'After every 2-3 long sentences, write one that is 5 words or fewer. It creates tension and release.',
    }
  })()

  // ─── Trait: Specificity signals ──────────────────────────────────────────
  const numbers = (sample.match(/\b\d+[\w%]*/g) ?? []).length
  const namedThings = (sample.match(/\b(we|our|my company|our product|our team|our users|our customers|our revenue|our mrr|our arr)\b/gi) ?? []).length
  const specificitySignals = numbers + namedThings
  const specificityScore: VoiceTrait = (() => {
    if (specificitySignals >= 4) return {
      id: 'specificity',
      label: 'Specificity',
      value: `${specificitySignals} specific references`,
      description: 'You ground your writing in concrete numbers and real context. This is what makes content memorable.',
      status: 'strong',
      tip: 'Numbers and named experiences are your differentiator. Keep using them - generic advice is forgettable.',
    }
    if (specificitySignals <= 1) return {
      id: 'specificity',
      label: 'Specificity',
      value: `${specificitySignals} specific references`,
      description: 'Your writing lacks concrete detail. It could have been written by anyone, about anything.',
      status: 'weak',
      tip: 'Add at least one number, one company reference, or one named customer moment. "Our churn dropped 18% after..." beats "I improved retention...".',
    }
    return {
      id: 'specificity',
      label: 'Specificity',
      value: `${specificitySignals} specific references`,
      description: 'Some specifics present, but more would sharpen your voice.',
      status: 'moderate',
      tip: 'For every claim you make, ask: "Can I add a number here?" If yes, add it.',
    }
  })()

  // ─── Trait: Question usage ────────────────────────────────────────────────
  const questionCount = (sample.match(/\?/g) ?? []).length
  const questionScore: VoiceTrait = (() => {
    if (questionCount >= 1 && questionCount <= 3) return {
      id: 'questions',
      label: 'Question usage',
      value: `${questionCount} question${questionCount !== 1 ? 's' : ''}`,
      description: 'You invite the reader into a conversation. Questions signal intellectual curiosity.',
      status: 'strong',
      tip: 'One question in the closing line drives comments better than any CTA. Keep it.',
    }
    if (questionCount === 0) return {
      id: 'questions',
      label: 'Question usage',
      value: 'No questions',
      description: 'You make statements but do not invite the reader in. Monologue, not dialogue.',
      status: 'weak',
      tip: 'End your next post with a genuine question. Not "Agree?" - something you actually want an answer to.',
    }
    return {
      id: 'questions',
      label: 'Question usage',
      value: `${questionCount} questions`,
      description: 'Many questions can feel like a quiz. Pick the one you most want answered.',
      status: 'moderate',
      tip: 'Cut to one closing question. Make it specific to your experience: "Has your team had this moment too?"',
    }
  })()

  // ─── Trait: Buzzword avoidance ────────────────────────────────────────────
  const buzzwords = [
    'leverage', 'synergy', 'paradigm', 'disruptive', 'game-changer', 'game changer',
    'thought leader', 'thought leadership', 'circle back', 'boil the ocean',
    'move the needle', 'deep dive', 'low-hanging fruit', 'pivot', 'scalable', 'robust',
    'best-in-class', 'cutting-edge', 'world-class', 'revolutionize', 'empower',
  ]
  const foundBuzzwords = buzzwords.filter(b => sample.toLowerCase().includes(b))
  const buzzScore: VoiceTrait = (() => {
    if (foundBuzzwords.length === 0) return {
      id: 'buzzwords',
      label: 'Jargon avoidance',
      value: 'No buzzwords found',
      description: 'Clean, direct language with no corporate filler. Your voice comes through clearly.',
      status: 'strong',
      tip: 'Keep writing this way. Jargon is a signal that you are writing for appearance rather than clarity.',
    }
    if (foundBuzzwords.length >= 3) return {
      id: 'buzzwords',
      label: 'Jargon avoidance',
      value: `${foundBuzzwords.length} buzzwords: ${foundBuzzwords.slice(0, 2).join(', ')}...`,
      description: 'Heavy use of corporate language weakens your voice and signals AI or PR-speak.',
      status: 'weak',
      tip: `Replace "${foundBuzzwords[0]}" with what you actually mean. "We scaled from 10 to 100 customers" beats "we leveraged growth."`,
    }
    return {
      id: 'buzzwords',
      label: 'Jargon avoidance',
      value: `${foundBuzzwords.length} buzzword${foundBuzzwords.length !== 1 ? 's' : ''}: ${foundBuzzwords.join(', ')}`,
      description: 'A few corporate phrases snuck in. They dilute an otherwise direct voice.',
      status: 'moderate',
      tip: `Try removing "${foundBuzzwords[0]}" entirely. Your point will be clearer without it.`,
    }
  })()

  // ─── Compute overall score and profile ───────────────────────────────────
  const traits = [fpScore, rhythmScore, specificityScore, questionScore, buzzScore]
  const strongCount = traits.filter(t => t.status === 'strong').length
  const voiceScore = Math.round((strongCount / traits.length) * 100)

  const profiles: Record<number, string> = {
    100: 'Authentic Builder',
    80: 'Emerging Voice',
    60: 'Work in Progress',
    40: 'Generic Writer',
    0: 'AI-Sounding',
  }
  const profileKey = Math.max(...Object.keys(profiles).map(Number).filter(k => voiceScore >= k))
  const profile = profiles[profileKey]

  const strengths = traits.filter(t => t.status === 'strong').map(t => t.label)
  const gaps = traits.filter(t => t.status === 'weak').map(t => t.label)

  return { profile, traits, strengths, gaps, voiceScore }
}

// ─── Examples ─────────────────────────────────────────────────────────────────

const EXAMPLES = [
  {
    label: 'Strong founder voice',
    text: `We almost shut down last month.

Our MRR had dropped 23% in 6 weeks. Our biggest customer churned. My co-founder and I had our first real fight - about whether to pivot or push through.

We stayed.

Here's what made us: we talked to 12 churned users in 3 days. Not to pitch them back. To understand what we got wrong.

The answer surprised us.

It wasn't the product. It was the onboarding. Users hit a wall on day 3 and never came back.

We fixed the onboarding. MRR recovered in 4 weeks.

What's the hardest thing you've pushed through this year?`,
  },
  {
    label: 'Generic, needs work',
    text: `In today's world, founders need to leverage every opportunity to build thought leadership and synergy with their audience.

The paradigm has shifted. Content marketing is now a game-changer for early-stage startups looking to move the needle.

To truly disrupt the status quo, you need to deep dive into your core value proposition and circle back to your fundamentals.

Thought leaders know that consistency is key. If you want to build your personal brand, you need to show up every day and empower your community.

Agree? Let me know your thoughts!`,
  },
]

// ─── Status icon ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: VoiceTrait['status'] }) {
  if (status === 'strong') return <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
  if (status === 'moderate') return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
  return <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, profile }: { score: number; profile: string }) {
  const color =
    score >= 80 ? 'text-success' :
    score >= 60 ? 'text-amber-400' :
    'text-danger'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('text-5xl font-bold tabular-nums', color)}>{score}</div>
      <div className="text-sm text-text-muted">/ 100</div>
      <div className="mt-1 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-text">
        {profile}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VoiceAnalyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<VoiceResult | null>(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = async (input: string) => {
    if (!input.trim() || input.trim().split(/\s+/).length < 30) return
    setLoading(true)
    setError(null)
    try {
      const aiResult = await analyzeWithAI(input)
      setResult(aiResult)
      setHasAnalyzed(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      setResult(analyzeVoice(input))
      setHasAnalyzed(true)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const analyze = () => runAnalysis(text)

  function handleReset() {
    setText('')
    setResult(null)
    setHasAnalyzed(false)
    setError(null)
  }

  function loadExample(sampleText: string) {
    setText(sampleText)
    setResult(null)
    setHasAnalyzed(false)
    setError(null)
    runAnalysis(sampleText)
  }

  const wordCount = (text.match(/\b\w+\b/g) ?? []).length

  return (
    <>
      <Helmet>
        <title>LinkedIn Voice Analyzer | Does Your Writing Sound Like You? | Wrively</title>
        <meta
          name="description"
          content="Free tool. Paste your LinkedIn writing sample and get an instant voice profile: first-person presence, rhythm, specificity, jargon score, and actionable fixes."
        />
        <link rel="canonical" href="https://wrively.com/tools/linkedin-voice-analyzer" />
        <meta property="og:title" content="LinkedIn Voice Analyzer | Does Your Writing Sound Like You?" />
        <meta property="og:description" content="Free tool. Paste your LinkedIn writing sample and get an instant voice profile: first-person presence, rhythm, specificity, jargon score, and actionable fixes." />
        <meta property="og:url" content="https://wrively.com/tools/linkedin-voice-analyzer" />
        <meta property="og:image" content="https://wrively.com/og/tools.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LinkedIn Voice Analyzer | Does Your Writing Sound Like You?" />
        <meta name="twitter:description" content="Paste your LinkedIn writing sample and get an instant voice profile. Free, no signup required." />
        <meta name="twitter:image" content="https://wrively.com/og/tools.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'LinkedIn Voice Analyzer',
          description: 'Analyze whether your LinkedIn writing has a distinctive founder voice or sounds generic and AI-like.',
          url: 'https://wrively.com/tools/linkedin-voice-analyzer',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}</script>
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-screen">

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
            <Mic className="w-3.5 h-3.5" />
            Free Voice Analyzer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            LinkedIn Voice Analyzer: Does Your Writing Sound Like You?
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-xl mx-auto">
            Paste a writing sample. Get an instant voice profile across 5 dimensions with specific fixes.
          </p>
        </section>

        {/* Tool */}
        <section className="max-w-3xl mx-auto px-6 pb-16">

          {/* Input */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-text">Paste a LinkedIn post or writing sample</label>
              <span className={cn(
                'text-xs tabular-nums',
                wordCount < 30 ? 'text-text-subtle' : 'text-text-muted',
              )}>
                {wordCount} words
              </span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste a LinkedIn post or paragraph here - at least 30 words for a meaningful analysis..."
              rows={8}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-text placeholder:text-text-subtle resize-y focus:outline-none focus:border-primary transition-colors"
            />

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button
                onClick={analyze}
                disabled={loading || wordCount < 30}
                className="flex items-center gap-2 px-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    Analyzing your voice...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Analyze my voice
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {hasAnalyzed && !loading && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Examples */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-text-subtle mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex.text)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="bg-surface border border-border rounded-card p-6 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-surface-hover shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-surface-hover rounded w-48" />
                  <div className="h-3 bg-surface-hover rounded w-full" />
                  <div className="h-3 bg-surface-hover rounded w-3/4" />
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
          {!loading && result && (
            <div className="space-y-6">

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

              <ToolUpgradeCta cta={result.cta} cached={result.cached} />

              {/* Score + profile */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ScoreRing score={result.voiceScore} profile={result.profile} />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-text mb-2">Your Voice Profile</h2>
                    {result.summary && (
                      <p className="text-sm text-text-muted mb-3 leading-relaxed">{result.summary}</p>
                    )}
                    {result.strengths.length > 0 && (
                      <p className="text-sm text-text-muted mb-1">
                        <span className="text-success font-medium">Strengths:</span>{' '}
                        {result.strengths.join(', ')}
                      </p>
                    )}
                    {result.gaps.length > 0 && (
                      <p className="text-sm text-text-muted">
                        <span className="text-danger font-medium">Needs work:</span>{' '}
                        {result.gaps.join(', ')}
                      </p>
                    )}
                    {!result.summary && result.strengths.length === 0 && result.gaps.length === 0 && (
                      <p className="text-sm text-text-muted">Mixed results across dimensions. See details below.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trait breakdown */}
              <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-text">Voice Breakdown</h3>
                </div>
                {result.traits.map(trait => (
                  <div key={trait.id} className="px-6 py-4">
                    <div className="flex items-start gap-3 mb-2">
                      <StatusIcon status={trait.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium text-text">{trait.label}</span>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            trait.status === 'strong' && 'bg-success/10 text-success',
                            trait.status === 'moderate' && 'bg-amber-400/10 text-amber-400',
                            trait.status === 'weak' && 'bg-danger/10 text-danger',
                          )}>
                            {trait.value}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted mb-2">{trait.description}</p>
                        <p className="text-xs text-text-subtle bg-background border border-border rounded-lg px-3 py-2">
                          {trait.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <h3 className="text-base font-semibold text-text mb-2">
                  Build your complete Voice Layer in Wrively
                </h3>
                <p className="text-sm text-text-muted mb-4 max-w-md mx-auto">
                  Wrively builds a founder persona from your company, stage, and personality type. Every post it generates matches your specific voice automatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/signup">
                    <Button className="flex items-center gap-2">
                      Build my Voice Layer
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    to="/tools/linkedin-post-checker"
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors px-4 py-2"
                  >
                    Also check your post score
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* What voice actually is */}
        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-text mb-6">What this analyzer measures</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'First-person presence',
                  body: 'Are you writing from your own experience, or from a generic "we" or "founders should" perspective? High first-person ratio signals authenticity.',
                },
                {
                  title: 'Sentence rhythm',
                  body: 'Do you mix short punchy sentences with fuller explanations? Monotone sentence length feels robotic. Natural voice varies.',
                },
                {
                  title: 'Specificity',
                  body: 'Numbers, named customers, real stages. Specific writing is memorable. Generic writing is forgettable. This measures how grounded your claims are.',
                },
                {
                  title: 'Question usage',
                  body: 'Questions signal curiosity and invite dialogue. Zero questions = monologue. Too many = a survey. One good closing question drives more comments than any CTA.',
                },
                {
                  title: 'Jargon avoidance',
                  body: '"Leverage synergy" sounds like PR speak. Real founders describe what actually happened. This tracks how much corporate filler dilutes your voice.',
                },
              ].map(item => (
                <div key={item.title} className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why voice is harder to fix than structure */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <div className="space-y-12">

            <div>
              <h2 className="text-xl font-bold text-text mb-4">Why voice is harder to fix than structure</h2>
              <p className="text-base text-text-muted leading-relaxed mb-4">
                Most LinkedIn advice focuses on structure: hook, body, CTA. Structure is fixable in an afternoon. Voice takes longer because it's not a formula — it's the accumulated weight of specific word choices: the ratio of "I" to "we," whether you cite real numbers or vague claims, whether your sentences breathe or run together.
              </p>
              <p className="text-base text-text-muted leading-relaxed">
                The practical problem: when founders switch to AI-assisted writing, voice is the first thing to disappear. The content becomes structurally correct and utterly forgettable. Posts score well on every metric except the one that actually builds an audience — they could have been written by anyone. This LinkedIn Voice Analyzer specifically flags that problem so you can correct it before it becomes a habit.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text mb-5">What weak vs strong voice looks like in practice</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-danger/5 border border-danger/20 rounded-xl p-5">
                  <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-3">Weak voice</p>
                  <p className="text-sm text-text-muted leading-relaxed italic">
                    "As founders, we need to leverage every opportunity to drive growth. In today's competitive landscape, building a strong personal brand is essential for success. Passionate about helping teams unlock their full potential."
                  </p>
                  <p className="text-xs text-text-subtle mt-3">No first-person singular. No specifics. Three buzzwords. Could be anyone.</p>
                </div>
                <div className="bg-success/5 border border-success/20 rounded-xl p-5">
                  <p className="text-xs font-semibold text-success uppercase tracking-wider mb-3">Strong voice</p>
                  <p className="text-sm text-text-muted leading-relaxed italic">
                    "I spent three months building a feature nobody asked for. When I finally showed it to users, they were polite. That's how I learned that 'users are happy' and 'users are using it' are two completely different things."
                  </p>
                  <p className="text-xs text-text-subtle mt-3">Strong first-person. Specific situation. Real stakes. Unmistakably one person.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text mb-6">Frequently asked questions</h2>
              <div className="space-y-5">
                {[
                  {
                    q: 'How much text do I need for a meaningful result?',
                    a: 'At least 30 words, but 100 to 300 words gives the most accurate reading. Paste a recent LinkedIn post, a paragraph from your bio, or a few lines you have written. The more representative the sample, the more accurate the voice profile.',
                  },
                  {
                    q: 'What does the voice score actually measure?',
                    a: 'Five dimensions: first-person presence (how much you write from your own perspective vs. a generic "we"), sentence rhythm (variation between short and long sentences), specificity (real numbers and named examples vs. vague claims), question usage (conversational engagement signals), and jargon avoidance (how much corporate filler dilutes your voice).',
                  },
                  {
                    q: 'My score is low. Where do I start?',
                    a: 'Start with whichever dimension the tool flags as weakest. If it is specificity, replace one vague claim per paragraph with a real number, a named customer, or a specific date. If it is jargon, delete every word that sounds like a press release. Small changes compound quickly across a post.',
                  },
                  {
                    q: 'How is this different from a grammar checker?',
                    a: 'Grammar checkers catch technical errors. This LinkedIn Voice Analyzer measures authenticity signals — the patterns that separate writing that sounds like a specific founder from writing that sounds like content produced at scale. The two problems are entirely unrelated.',
                  },
                  {
                    q: 'Does this tool work for non-founders?',
                    a: 'Yes. The voice dimensions it measures apply to anyone writing on LinkedIn: executives, consultants, freelancers, or anyone building a personal brand. The scoring criteria are based on what makes writing feel human and specific, not on any particular job title.',
                  },
                ].map(item => (
                  <div key={item.q} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-text mb-2">{item.q}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Related tools */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold text-text mb-6">More free tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                to: '/tools/linkedin-post-checker',
                title: 'LinkedIn Post Checker',
                desc: 'Score any post before you publish. Hook strength, length, formatting, and CTA.',
              },
              {
                to: '/tools/linkedin-headline-analyzer',
                title: 'LinkedIn Headline Analyzer',
                desc: 'Is your headline doing its job? Get a grade and specific rewrites.',
              },
            ].map(tool => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
              >
                <h3 className="text-sm font-semibold text-text mb-1 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-text-muted">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <PublicFooter />
    </>
  )
}
