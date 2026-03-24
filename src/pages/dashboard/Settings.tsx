import React, { useState } from 'react'
import { toast } from '@/store/toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { generatePersona } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Company, Profile } from '@/types/database'

type Tab = 'brand' | 'account'

const STAGES = ['idea', 'mvp', 'live', 'scale'] as const
const PERSONALITIES = [
  { value: 'builder',     label: 'The Builder' },
  { value: 'storyteller', label: 'The Storyteller' },
  { value: 'analyst',     label: 'The Analyst' },
  { value: 'contrarian',  label: 'The Contrarian' },
] as const

export default function Settings() {
  const { profile, company, setCompany, setProfile } = useAuthStore()
  const [tab, setTab] = useState<Tab>('brand')

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-text">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-card p-1 w-fit">
        {([
          ['brand',   company?.is_individual ? 'Personal Brand' : 'Founder Brand'],
          ['account', 'Account'],
        ] as [Tab, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              'text-sm px-4 py-1.5 rounded-btn transition-all',
              tab === value
                ? 'bg-primary text-white font-medium'
                : 'text-text-muted hover:text-text'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'brand' && company && (
        <BrandTab company={company} onUpdate={setCompany} />
      )}

      {tab === 'account' && (
        <AccountTab
          profile={profile}
          onSignOut={async () => {
            await supabase.auth.signOut()
            setProfile(null)
            setCompany(null)
          }}
        />
      )}
    </div>
  )
}

// ─── Brand Tab ────────────────────────────────────────────────────────────────

const ROLES = ['idea', 'live', 'scale', 'mvp'] as const
const ROLE_LABELS: Record<string, string> = {
  idea: 'Founder', live: 'Consultant', scale: 'Executive', mvp: 'Creator',
}

function BrandTab({ company, onUpdate }: {
  company: Company
  onUpdate: (c: Company) => void
}) {
  const isIndividual = company.is_individual
  const [name, setName]                   = useState(company.name)
  const [description, setDescription]     = useState(company.description)
  const [targetAudience, setTargetAudience] = useState(company.target_audience)
  const [stage, setStage]                 = useState(company.stage)
  const [personality, setPersonality]     = useState(company.founder_personality)
  const [keywords, setKeywords]           = useState(company.keywords?.join(', ') ?? '')

  const [saving, setSaving]           = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')

    const { data, error: err } = await supabase
      .from('companies')
      .update({
        name,
        description,
        target_audience: targetAudience,
        stage,
        founder_personality: personality,
        keywords: keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
      })
      .eq('id', company.id)
      .select()
      .single()

    if (err) {
      setError('Failed to save. Try again.')
      toast.error('Failed to save changes.')
    } else if (data) {
      onUpdate(data)
      setSaved(true)
      toast.success(isIndividual ? 'Profile saved.' : 'Brand settings saved.')
      setTimeout(() => setSaved(false), 2000)
    }

    setSaving(false)
  }

  const handleRegeneratePersona = async () => {
    setRegenerating(true)
    setError('')

    try {
      await supabase
        .from('companies')
        .update({
          name,
          description,
          target_audience: targetAudience,
          stage,
          founder_personality: personality,
          keywords: keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        })
        .eq('id', company.id)

      const result = await generatePersona({ company_id: company.id })
      onUpdate(result.company as typeof company)
      toast.success('Persona regenerated.')
    } catch {
      setError('Failed to regenerate persona. Try again.')
      toast.error('Regeneration failed.')
    }

    setRegenerating(false)
  }

  return (
    <div className="space-y-6">

      {/* Persona card */}
      {company.persona_statement && (
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <p className="section-label mb-2">
              {isIndividual ? 'Your personal brand' : 'Your founder brand'}
            </p>
            <p className="text-sm text-text leading-snug">{company.persona_statement}</p>
            {company.content_pillars && company.content_pillars.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {company.content_pillars.map((p: string) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-primary/[0.08] text-primary border border-primary/20">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="px-4 py-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRegeneratePersona}
              loading={regenerating}
            >
              Regenerate persona
            </Button>
          </div>
        </div>
      )}

      {/* Edit fields */}
      <div className="space-y-4">
        <Input
          label={isIndividual ? 'Your name' : 'Company name'}
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <Textarea
          label={isIndividual ? 'What you do' : 'What it does'}
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Input
          label="Target audience"
          value={targetAudience}
          onChange={e => setTargetAudience(e.target.value)}
        />

        <Field label={isIndividual ? 'Your role' : 'Stage'}>
          <div className="flex gap-2 flex-wrap">
            {(isIndividual ? ROLES : STAGES).map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-btn border transition-all capitalize',
                  stage === s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-text-muted hover:border-border-hover hover:text-text'
                )}
              >
                {isIndividual ? ROLE_LABELS[s] : s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Personality">
          <div className="flex gap-2 flex-wrap">
            {PERSONALITIES.map(p => (
              <button
                key={p.value}
                onClick={() => setPersonality(p.value)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-btn border transition-all',
                  personality === p.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-text-muted hover:border-border-hover hover:text-text'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>

        <Input
          label={isIndividual ? 'Voice keywords' : 'Brand keywords'}
          hint="Comma-separated"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="transparent, scrappy, user-obsessed"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="pt-1 border-t border-border">
        <Button onClick={handleSave} loading={saving} className="w-full mt-4">
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}

// ─── Account Tab ──────────────────────────────────────────────────────────────

function AccountTab({
  profile,
  onSignOut,
}: {
  profile: Profile | null
  onSignOut: () => void
}) {
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.email_notifications ?? true
  )
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalStep, setPortalStep] = useState('')

  const plan = profile?.plan ?? 'free'
  const planLabel =
    plan === 'pro'  ? 'Pro'  :
    plan === 'starter' ? 'Starter' : 'Free'
  const isPaying = (plan === 'starter' || plan === 'pro') && profile?.paddle_subscription_id

  const handleToggleNotifications = async (enabled: boolean) => {
    setEmailNotifications(enabled)
    setSavingPrefs(true)
    const { error } = await supabase
      .from('profiles')
      .update({ email_notifications: enabled })
      .eq('id', profile!.id)
    setSavingPrefs(false)
    if (error) {
      setEmailNotifications(!enabled)
      toast.error('Failed to update email preference.')
    }
  }

  return (
    <div className="space-y-4">

      {/* Profile info */}
      <div className="bg-surface border border-border rounded-card divide-y divide-border overflow-hidden">
        {[
          { label: 'Name',  value: profile?.full_name ?? '-' },
          { label: 'Email', value: profile?.email ?? '-' },
          { label: 'Plan',  value: planLabel },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-text-muted">{label}</span>
            <span className="text-sm text-text font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Manage billing for paying subscribers */}
      {isPaying && (
        <div className="bg-surface border border-border rounded-card px-4 py-3.5">
          {portalLoading ? (
            <div className="flex items-center gap-3 py-1">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-text">{portalStep}</p>
                <p className="text-xs text-text-muted">This usually takes a few seconds</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">Billing</p>
                <p className="text-xs text-text-muted mt-0.5">Update payment method, view invoices, or cancel</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setPortalLoading(true)
                  setPortalStep('Connecting to billing...')
                  try {
                    await new Promise(r => setTimeout(r, 400))
                    setPortalStep('Loading your account...')
                    const { data, error } = await supabase.functions.invoke('paddle-portal')
                    if (error || !data?.url) throw new Error(error?.message || 'Could not open billing portal')
                    setPortalStep('Opening billing portal...')
                    await new Promise(r => setTimeout(r, 300))
                    window.open(data.url, '_blank', 'noopener')
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'Could not open billing portal')
                  } finally {
                    setPortalLoading(false)
                    setPortalStep('')
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Manage <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Email notifications toggle */}
      <div className="bg-surface border border-border rounded-card px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text">Email notifications</p>
            <p className="text-xs text-text-muted mt-0.5">Weekly post ideas and re-engagement reminders</p>
          </div>
          <button
            onClick={() => handleToggleNotifications(!emailNotifications)}
            disabled={savingPrefs}
            className={cn(
              'relative w-10 h-6 rounded-full transition-colors shrink-0 disabled:opacity-60',
              emailNotifications ? 'bg-primary' : 'bg-border'
            )}
          >
            <span className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
              emailNotifications ? 'translate-x-5' : 'translate-x-1'
            )} />
          </button>
        </div>
      </div>

      <Button variant="secondary" onClick={onSignOut} className="w-full">
        Sign out
      </Button>
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-muted">{label}</label>
        {hint && <span className="text-xs text-text-subtle">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
