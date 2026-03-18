import { useState } from 'react'
import { toast } from '@/store/toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { generatePersona } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
import type { Company, Profile } from '@/types/database'

type Tab = 'brand' | 'account'

const STAGES = ['idea', 'mvp', 'live', 'scale'] as const
const PERSONALITIES = [
  { value: 'builder', label: 'The Builder' },
  { value: 'storyteller', label: 'The Storyteller' },
  { value: 'analyst', label: 'The Analyst' },
  { value: 'contrarian', label: 'The Contrarian' },
] as const

export default function Settings() {
  const { profile, company, setCompany, setProfile } = useAuthStore()
  const [tab, setTab] = useState<Tab>('brand')

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-page text-text">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-card p-1 w-fit">
        {([['brand', 'Founder Brand'], ['account', 'Account']] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              'text-sm px-4 py-1.5 rounded-btn transition-all',
              tab === value ? 'bg-primary text-white font-medium' : 'text-text-muted hover:text-text'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'brand' && company && (
        <BrandTab
          company={company}
          onUpdate={(updated) => setCompany(updated)}
        />
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

function BrandTab({ company, onUpdate }: {
  company: Company
  onUpdate: (c: Company) => void
}) {
  const [name, setName] = useState(company.name)
  const [description, setDescription] = useState(company.description)
  const [targetAudience, setTargetAudience] = useState(company.target_audience)
  const [stage, setStage] = useState(company.stage)
  const [personality, setPersonality] = useState(company.founder_personality)
  const [keywords, setKeywords] = useState(company.keywords?.join(', ') ?? '')

  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

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
      toast.success('Brand settings saved.')
      setTimeout(() => setSaved(false), 2000)
    }

    setSaving(false)
  }

  const handleRegeneratePersona = async () => {
    setRegenerating(true)
    setError('')

    try {
      // Save current field state first so Edge Function reads the latest values
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

      // Call Edge Function — it generates persona and saves it back to company
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
    <div className="space-y-5">
      {/* Persona display */}
      {company.persona_statement && (
        <div className="bg-surface border border-border rounded-card p-5 space-y-3">
          <p className="text-xs font-medium text-text-muted">Your persona</p>
          <p className="text-text leading-snug">{company.persona_statement}</p>

          {company.content_pillars && company.content_pillars.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {company.content_pillars.map((p: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {p}
                </span>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRegeneratePersona}
            loading={regenerating}
          >
            Regenerate persona
          </Button>
        </div>
      )}

      {/* Edit fields */}
      <div className="space-y-4">
        <Input
          label="Company name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <Textarea
          label="What it does"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Input
          label="Target audience"
          value={targetAudience}
          onChange={e => setTargetAudience(e.target.value)}
        />

        <Field label="Stage">
          <div className="flex gap-2 flex-wrap">
            {STAGES.map(s => (
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
                {s}
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
          label="Brand keywords"
          hint="Comma-separated"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="transparent, scrappy, user-obsessed"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button onClick={handleSave} loading={saving} className="w-full">
        {saved ? '✓ Saved' : 'Save changes'}
      </Button>
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

  const planLabel =
    profile?.plan === 'pro' ? 'Pro' :
    profile?.plan === 'beta' ? 'Beta' : 'Free'

  const planBadge =
    profile?.plan === 'pro' ? 'PRO' :
    profile?.plan === 'beta' ? 'BETA' : 'FREE'

  const handleToggleNotifications = async (enabled: boolean) => {
    setEmailNotifications(enabled)
    setSavingPrefs(true)
    const { error } = await supabase
      .from('profiles')
      .update({ email_notifications: enabled })
      .eq('id', profile!.id)
    setSavingPrefs(false)
    if (error) {
      setEmailNotifications(!enabled) // rollback
      toast.error('Failed to update email preference.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-card p-5 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-text-muted">Name</p>
          <p className="text-text">{profile?.full_name ?? '-'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-text-muted">Email</p>
          <p className="text-text">{profile?.email ?? '-'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-text-muted">Plan</p>
          <div className="flex items-center gap-2">
            <p className="text-text">{planLabel}</p>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-primary/30 bg-primary/[0.08] text-primary">
              {planBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Beta access banner */}
      {profile?.plan === 'beta' && (
        <div className="relative bg-surface border border-primary/20 rounded-card p-5 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-text mb-0.5">Beta — full access</p>
              <p className="text-xs text-text-muted leading-relaxed">
                You're one of the first 50 founders. All features are free during the beta.
                Pro plan coming soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email notifications */}
      <div className="bg-surface border border-border rounded-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Email notifications</p>
            <p className="text-xs text-text-muted mt-0.5">
              Weekly post ideas and re-engagement reminders
            </p>
          </div>
          <button
            onClick={() => handleToggleNotifications(!emailNotifications)}
            disabled={savingPrefs}
            className={cn(
              'relative w-10 h-6 rounded-full transition-colors shrink-0',
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

      <div className="space-y-2">
        <Button variant="secondary" onClick={onSignOut} className="w-full">
          Sign out
        </Button>
      </div>
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-muted">{label}</label>
        {hint && <span className="text-xs text-text-muted/60">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
