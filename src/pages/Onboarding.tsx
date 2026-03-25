import { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, Sparkles, Copy, Zap, Building2, User, Hammer, Users, Briefcase, PenLine, Wrench, BookOpen, BarChart2, Flame } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { generatePersona, generatePost } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'brand' | 'individual'

interface FormData {
  mode: Mode
  name: string
  description: string
  stage: string
  industry: string[]
  target_audience: string
  founder_goal: string
  founder_personality: string
  keywords: string
}

type Step = 0 | 1 | 2 | 3 | 4 | 'generating' | 'reveal'

// ─── Options ─────────────────────────────────────────────────────────────────

const STAGES = [
  { value: 'idea',  label: 'Idea',  icon: <Sparkles className="w-4 h-4" />,  sub: 'Pre-product' },
  { value: 'mvp',   label: 'MVP',   icon: <Hammer className="w-4 h-4" />,    sub: 'Building' },
  { value: 'live',  label: 'Live',  icon: <Zap className="w-4 h-4" />,       sub: 'Revenue' },
  { value: 'scale', label: 'Scale', icon: <PenLine className="w-4 h-4" />,   sub: 'Growing' },
]

// Maps to existing stage values so no DB migration is needed
const ROLES = [
  { value: 'idea',  label: 'Founder',    icon: <Hammer className="w-4 h-4" />,    sub: 'Building' },
  { value: 'live',  label: 'Consultant', icon: <Briefcase className="w-4 h-4" />, sub: 'Client work' },
  { value: 'scale', label: 'Executive',  icon: <Users className="w-4 h-4" />,     sub: 'In-house' },
  { value: 'mvp',   label: 'Creator',    icon: <PenLine className="w-4 h-4" />,   sub: 'Content / Capital' },
]

const INDUSTRIES = [
  'AI/ML', 'SaaS', 'B2B', 'B2C', 'Developer Tools',
  'FinTech', 'EdTech', 'HealthTech', 'E-commerce', 'Other',
]

const GOALS = [
  { value: 'get_users', label: 'Get early users' },
  { value: 'build_audience', label: 'Build audience & credibility' },
  { value: 'raise_funds', label: 'Attract investors' },
  { value: 'hire', label: 'Hire great people' },
]

const PERSONALITIES = [
  {
    value: 'builder',
    icon: <Wrench className="w-4 h-4" />,
    label: 'The Builder',
    description: 'Raw progress, technical insight, build-in-public',
  },
  {
    value: 'storyteller',
    icon: <BookOpen className="w-4 h-4" />,
    label: 'The Storyteller',
    description: 'Experiences turned into lessons, narrative-driven',
  },
  {
    value: 'analyst',
    icon: <BarChart2 className="w-4 h-4" />,
    label: 'The Analyst',
    description: 'Frameworks, data, structured insight, deep-dives',
  },
  {
    value: 'contrarian',
    icon: <Flame className="w-4 h-4" />,
    label: 'The Contrarian',
    description: 'Bold takes, challenges norms, starts debates',
  },
]

// ─── Progress Dots ────────────────────────────────────────────────────────────

function ProgressDots({ step }: { step: Step }) {
  if (step === 0) return null
  const stepNum = typeof step === 'number' ? step : 4

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map(n => (
        <motion.div
          key={n}
          initial={false}
          animate={{ width: n === stepNum ? 20 : 6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={cn(
            'h-1.5 rounded-full',
            n < stepNum ? 'bg-success' : n === stepNum ? 'bg-primary' : 'bg-surface-hover'
          )}
        />
      ))}
    </div>
  )
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    setDone(false)
    const timer = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1))
        idx.current++
      } else {
        clearInterval(timer)
        setDone(true)
        onDone?.()
      }
    }, 18)
    return () => clearInterval(timer)
  }, [text, onDone])

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse opacity-60">|</span>}
    </span>
  )
}

// ─── Generating Screen ────────────────────────────────────────────────────────

const GENERATING_STEPS = [
  'Analyzing your inputs...',
  'Crafting your persona...',
  'Building your content pillars...',
  'Writing your first post...',
]

function GeneratingScreen({ mode, activeStep }: { mode: Mode; activeStep: number }) {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-semibold text-text">
            {mode === 'individual' ? 'Building your personal brand' : 'Building your founder brand'}
          </h2>
        </div>

        <div className="space-y-3">
          {GENERATING_STEPS.map((label, i) => {
            const done = i < activeStep
            const active = i === activeStep
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-card border transition-all duration-300',
                  done
                    ? 'border-success/30 bg-success/5'
                    : active
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border/40 opacity-40'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                  done
                    ? 'border-success bg-success'
                    : active
                    ? 'border-primary'
                    : 'border-border'
                )}>
                  {done ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : active ? (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  ) : null}
                </div>
                <span className={cn(
                  'text-sm transition-colors',
                  done ? 'text-text-muted' : active ? 'text-text font-medium' : 'text-text-muted'
                )}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, setProfile, setCompany, fetchProfile } = useAuthStore()

  const [step, setStep] = useState<Step>(0)
  const [form, setForm] = useState<FormData>({
    mode: 'brand',
    name: '',
    description: '',
    stage: '',
    industry: [],
    target_audience: '',
    founder_goal: '',
    founder_personality: '',
    keywords: '',
  })
  const [error, setError] = useState('')
  const [generatingStep, setGeneratingStep] = useState(0)

  // Reveal screen state
  const [persona, setPersona] = useState<{ statement: string; pillars: string[] } | null>(null)
  const [firstPost, setFirstPost] = useState<string>('')
  const [postExpanded, setPostExpanded] = useState(false)
  const [firstPostId, setFirstPostId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [typewriterDone, setTypewriterDone] = useState(false)

  const update = (key: keyof FormData, value: string | string[]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleIndustry = (val: string) => {
    setForm(prev => ({
      ...prev,
      industry: prev.industry.includes(val)
        ? prev.industry.filter(i => i !== val)
        : [...prev.industry, val],
    }))
  }

  // ─── Validation ────────────────────────────────────────────────────────────

  const canContinue = (): boolean => {
    switch (step) {
      case 1: return form.name.trim().length > 0 && form.description.trim().length > 0
      case 2: return form.stage !== '' && form.industry.length > 0
      case 3: return form.target_audience.trim().length > 0 && form.founder_goal !== ''
      case 4: return form.founder_personality !== ''
      default: return false
    }
  }

  // ─── Submit: generate persona + first post + save to DB ────────────────────

  const handleFinish = async () => {
    if (!user) return
    setError('')
    setGeneratingStep(0)
    setStep('generating')

    try {
      const keywords = form.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean)

      // Step 0: Save company
      const { data: company, error: companyErr } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          name: form.name,
          description: form.description,
          target_audience: form.target_audience,
          industry: form.industry,
          stage: form.stage as 'idea' | 'mvp' | 'live' | 'scale',
          founder_goal: form.founder_goal as 'get_users' | 'build_audience' | 'raise_funds' | 'hire',
          tone: 'casual' as const,
          founder_personality: form.founder_personality as 'builder' | 'storyteller' | 'analyst' | 'contrarian',
          keywords: keywords.length > 0 ? keywords : null,
          is_individual: form.mode === 'individual',
        })
        .select()
        .single()

      if (companyErr) throw companyErr

      // Step 1: Generate persona
      setGeneratingStep(1)
      const personaResult = await generatePersona({ company_id: company.id })

      // Step 2: Build content pillars (done as part of persona)
      setGeneratingStep(2)

      // Step 3: Generate first post
      setGeneratingStep(3)
      const firstPillar = personaResult.content_pillars[0] ?? form.founder_personality
      const postResult = await generatePost({
        topic: firstPillar,
        company_id: company.id,
      })

      const boldPost = postResult.variation_bold || postResult.variation_safe
      setFirstPostId(postResult.id)

      // Update local company with persona data returned from Edge Function
      const updatedCompany = personaResult.company as typeof company

      // Mark profile as onboarded
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .update({ onboarded: true })
        .eq('id', user.id)
        .select()
        .single()

      if (profileErr) throw profileErr

      // Update store
      setCompany(updatedCompany)
      setProfile(profile)

      // Show reveal screen
      setPersona({ statement: personaResult.persona_statement, pillars: personaResult.content_pillars })
      setFirstPost(boldPost)
      setStep('reveal')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('Something went wrong. Please try again.')
      setStep(4)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(firstPost)
    setCopied(true)
    // Ensure store has updated profile, then navigate after a beat
    fetchProfile().then(() => {
      setTimeout(() => navigate('/dashboard?onboarded=1'), 1800)
    })
  }

  const handleSeeVariations = () => {
    // Ensure the store has the updated profile before navigating to a guarded route
    fetchProfile().then(() => {
      const url = firstPostId
        ? `/dashboard/write?postId=${firstPostId}`
        : '/dashboard/write'
      navigate(url)
    })
  }

  const handleSkip = () => {
    fetchProfile().then(() => {
      navigate('/dashboard?onboarded=1')
    })
  }

  // ─── Render steps ──────────────────────────────────────────────────────────

  if (step === 'generating') {
    return <GeneratingScreen mode={form.mode} activeStep={generatingStep} />
  }

  if (step === 'reveal' && persona) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/[0.07] rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-xl space-y-4">

          {/* Success badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.07] text-primary text-xs font-medium px-3 py-1.5 rounded-pill">
              <Sparkles className="w-3.5 h-3.5" />
              {form.mode === 'individual' ? 'Your personal brand is ready' : 'Your founder brand is ready'}
            </div>
          </motion.div>

          {/* Persona card - identity moment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative bg-surface border border-primary/20 rounded-card p-5 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <p className="section-label mb-2">You are</p>
            <p className="text-text text-[15px] font-medium leading-relaxed">
              <Typewriter
                text={persona.statement}
                onDone={() => setTypewriterDone(true)}
              />
            </p>

            {typewriterDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {persona.pillars.map((pillar, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-pill bg-primary/10 text-primary border border-primary/20"
                  >
                    {pillar}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* First post - dominant action block */}
          {typewriterDone && firstPost && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-surface border border-border rounded-card overflow-hidden"
            >
              <div className="px-5 pt-4 pb-3 flex items-center gap-2 border-b border-border">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20 tracking-wide">
                  BOLD
                </span>
                <span className="text-xs text-text-muted">Your first post</span>
              </div>

              <div className="px-5 py-4">
                <p className={cn(
                  'text-text text-sm leading-relaxed whitespace-pre-wrap',
                  !postExpanded && 'line-clamp-6'
                )}>
                  {firstPost}
                </p>
                {firstPost.split('\n').length > 6 && (
                  <button
                    onClick={() => setPostExpanded(p => !p)}
                    className="text-xs text-primary hover:text-primary-hover transition-colors mt-2 font-medium"
                  >
                    {postExpanded ? 'Show less' : 'See full post'}
                  </button>
                )}
              </div>

              {/* Single primary CTA */}
              <div className="px-5 pb-5">
                <Button
                  onClick={handleCopy}
                  className="w-full"
                  size="lg"
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Copied! Paste on LinkedIn now</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy and post now</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Secondary + tertiary text actions */}
          {typewriterDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center justify-between px-1"
            >
              <button
                onClick={handleSeeVariations}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Try other versions →
              </button>
              <button
                onClick={handleSkip}
                className="text-sm text-text-subtle hover:text-text-muted transition-colors"
              >
                I'll do this later
              </button>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // ─── Step screens ──────────────────────────────────────────────────────────

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-7 h-7 bg-primary-gradient rounded-lg flex items-center justify-center shadow-card">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-text">Wrively</span>
        </div>

        <ProgressDots step={step as Step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepZero
              key="step0"
              onSelect={(mode: Mode) => {
                update('mode', mode)
                setStep(1)
              }}
            />
          )}
          {step === 1 && (
            <StepOne
              key="step1"
              form={form}
              update={update}
              onNext={() => setStep(2)}
              canContinue={canContinue()}
            />
          )}
          {step === 2 && (
            <StepTwo
              key="step2"
              form={form}
              update={update}
              toggleIndustry={toggleIndustry}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              canContinue={canContinue()}
            />
          )}
          {step === 3 && (
            <StepThree
              key="step3"
              form={form}
              update={update}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              canContinue={canContinue()}
            />
          )}
          {step === 4 && (
            <StepFour
              key="step4"
              form={form}
              update={update}
              onBack={() => setStep(3)}
              onFinish={handleFinish}
              canContinue={canContinue()}
              error={error}
              mode={form.mode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Step wrappers ────────────────────────────────────────────────────────────

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

// ─── Step 0: Mode select ─────────────────────────────────────────────────────

function StepZero({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text tracking-tight">Who are you building a brand for?</h1>
        <p className="text-text-muted mt-1.5 text-sm">This shapes every post we write for you.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelect('brand')}
          className="flex flex-col items-center gap-4 py-7 px-4 rounded-card border border-border bg-surface hover:border-primary/50 hover:bg-primary/[0.03] active:scale-[0.98] transition-all group text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-hover border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all">
            <Building2 className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">My company</p>
            <p className="text-xs text-text-muted mt-1 leading-snug">Startup or business</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('individual')}
          className="flex flex-col items-center gap-4 py-7 px-4 rounded-card border border-border bg-surface hover:border-primary/50 hover:bg-primary/[0.03] active:scale-[0.98] transition-all group text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-hover border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/[0.06] transition-all">
            <User className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Myself</p>
            <p className="text-xs text-text-muted mt-1 leading-snug">Consultant or creator</p>
          </div>
        </button>
      </div>
    </motion.div>
  )
}

// ─── Step 1: Company info ────────────────────────────────────────────────────

function StepOne({
  form,
  update,
  onNext,
  canContinue,
}: {
  form: FormData
  update: (k: keyof FormData, v: string) => void
  onNext: () => void
  canContinue: boolean
}) {
  const isIndividual = form.mode === 'individual'

  return (
    <motion.div {...stepVariants} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isIndividual ? "Let's build your personal brand." : "Let's build your founder brand."}
        </h1>
        <p className="text-text-muted mt-1 text-sm">Takes about 2 minutes.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-text-muted">
            {isIndividual ? "What's your name?" : "What's your startup called?"}
          </label>
          <input
            autoFocus
            type="text"
            placeholder={isIndividual ? 'e.g. Sarah Chen' : 'e.g. Acme'}
            value={form.name}
            onChange={e => update('name', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canContinue && onNext()}
            className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-border-focus focus:shadow-input-focus hover:border-border-hover transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-text-muted">
            {isIndividual
              ? <>What do you do? <span className="text-text-muted/60">(one sentence)</span></>
              : <>What does it do? <span className="text-text-muted/60">(one sentence)</span></>}
          </label>
          <input
            type="text"
            placeholder={isIndividual
              ? 'e.g. I help startup founders close their first 10 clients'
              : 'e.g. We help B2B teams automate their onboarding'}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canContinue && onNext()}
            className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-border-focus focus:shadow-input-focus hover:border-border-hover transition-colors"
          />
        </div>
      </div>

      <Button onClick={onNext} disabled={!canContinue} className="w-full" size="lg">
        Continue <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  )
}

// ─── Step 2: Stage + Industry ─────────────────────────────────────────────────

function StepTwo({
  form,
  update,
  toggleIndustry,
  onBack,
  onNext,
  canContinue,
}: {
  form: FormData
  update: (k: keyof FormData, v: string) => void
  toggleIndustry: (v: string) => void
  onBack: () => void
  onNext: () => void
  canContinue: boolean
}) {
  const isIndividual = form.mode === 'individual'
  const slots = isIndividual ? ROLES : STAGES

  return (
    <motion.div {...stepVariants} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isIndividual ? 'What best describes you?' : 'Where are you right now?'}
        </h1>
      </div>

      {/* Stage / Role — 2 cols on mobile, 4 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {slots.map(s => (
          <button
            key={s.value}
            onClick={() => update('stage', s.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 py-4 px-3 rounded-card border text-center transition-all active:scale-[0.97]',
              form.stage === s.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface text-text-muted hover:border-border-hover hover:bg-surface-hover'
            )}
          >
            <span className={cn(form.stage === s.value ? 'text-primary' : 'text-text-muted')}>
              {s.icon}
            </span>
            <span className="text-xs font-semibold text-text">{s.label}</span>
            <span className="text-[10px] text-text-muted leading-tight">{s.sub}</span>
          </button>
        ))}
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label className="text-sm text-text-muted">Your domain <span className="text-text-muted/60">(pick all that apply)</span></label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => toggleIndustry(ind)}
              className={cn(
                'text-sm px-3 py-2 rounded-full border transition-all active:scale-[0.97]',
                form.industry.includes(ind)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-text-muted hover:border-border-hover hover:text-text'
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-3 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1" size="lg">
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Step 3: Audience + Goal ──────────────────────────────────────────────────

function StepThree({
  form,
  update,
  onBack,
  onNext,
  canContinue,
}: {
  form: FormData
  update: (k: keyof FormData, v: string) => void
  onBack: () => void
  onNext: () => void
  canContinue: boolean
}) {
  const isIndividual = form.mode === 'individual'

  return (
    <motion.div {...stepVariants} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isIndividual ? 'Who do you want to reach?' : 'Who are you building for?'}
        </h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-text-muted">
            {isIndividual ? 'Your target audience' : 'Target audience'}
          </label>
          <input
            autoFocus
            type="text"
            placeholder={isIndividual
              ? 'e.g. Early-stage founders looking for their first clients'
              : 'e.g. B2B marketers at 50-500 person companies'}
            value={form.target_audience}
            onChange={e => update('target_audience', e.target.value)}
            className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-border-focus focus:shadow-input-focus hover:border-border-hover transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-muted">Your #1 goal on LinkedIn right now</label>
          <div className="space-y-2">
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => update('founder_goal', g.value)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-card border text-sm text-left transition-all active:scale-[0.99]',
                  form.founder_goal === g.value
                    ? 'border-primary bg-primary/10 text-text'
                    : 'border-border bg-surface text-text-muted hover:border-border-hover hover:bg-surface-hover hover:text-text'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                  form.founder_goal === g.value ? 'border-primary' : 'border-border'
                )}>
                  {form.founder_goal === g.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-3 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1" size="lg">
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Step 4: Personality + Keywords ──────────────────────────────────────────

function StepFour({
  form,
  update,
  onBack,
  onFinish,
  canContinue,
  error,
  mode,
}: {
  form: FormData
  update: (k: keyof FormData, v: string) => void
  onBack: () => void
  onFinish: () => void
  canContinue: boolean
  error: string
  mode: Mode
}) {
  return (
    <motion.div {...stepVariants} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {mode === 'individual' ? "What's your posting style?" : 'Which founder are you?'}
        </h1>
        <p className="text-text-muted mt-1 text-sm">This shapes how every post sounds.</p>
      </div>

      {/* Personality cards */}
      <div className="grid grid-cols-2 gap-3">
        {PERSONALITIES.map(p => (
          <button
            key={p.value}
            onClick={() => update('founder_personality', p.value)}
            className={cn(
              'flex flex-col gap-2.5 p-4 rounded-card border text-left transition-all active:scale-[0.97]',
              form.founder_personality === p.value
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:border-border-hover hover:bg-surface-hover'
            )}
          >
            <span className={cn(form.founder_personality === p.value ? 'text-primary' : 'text-text-muted')}>
              {p.icon}
            </span>
            <div>
              <p className={cn(
                'text-sm font-semibold',
                form.founder_personality === p.value ? 'text-primary' : 'text-text'
              )}>
                {p.label}
              </p>
              <p className="text-xs text-text-muted mt-0.5 leading-snug">{p.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Keywords (optional) */}
      <div className="space-y-1.5">
        <label className="text-sm text-text-muted">
          {mode === 'individual' ? 'Voice keywords' : 'Brand keywords'} <span className="text-text-muted/60">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. transparent, scrappy, user-obsessed"
          value={form.keywords}
          onChange={e => update('keywords', e.target.value)}
          className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-border-focus focus:shadow-input-focus hover:border-border-hover transition-colors"
        />
        <p className="text-xs text-text-muted">Comma-separated words that define your brand voice</p>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-card px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-3 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back
        </button>
        <Button onClick={onFinish} disabled={!canContinue} className="flex-1" size="lg">
          {mode === 'individual' ? 'Create my personal brand →' : 'Create my founder brand →'}
        </Button>
      </div>
    </motion.div>
  )
}
