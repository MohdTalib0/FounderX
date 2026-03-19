import { Link } from 'react-router-dom'
import { ArrowRight, Check, PenLine, Zap, Sparkles, RefreshCw, MessageSquare, Briefcase, Users, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import PublicHeader from '@/components/layout/PublicHeader'
import { cn } from '@/lib/utils'

export default function ForIndividuals() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">

      <PublicHeader />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-primary/[0.05] rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-pill mb-6">
          <User className="w-3.5 h-3.5" />
          Personal brand mode
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-5 max-w-2xl mx-auto">
          You don't need a startup to build a voice on LinkedIn.
        </h1>

        <p className="text-base text-text-muted leading-relaxed mb-3 max-w-lg mx-auto">
          Consultants, coaches, executives, and creators face the exact same problem founders do:
          blank page, generic output, inconsistent posting.
        </p>
        <p className="text-base text-text-muted leading-relaxed mb-10 max-w-lg mx-auto">
          FounderX builds your personal voice and writes every post from it.
          No company required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link to="/signup">
            <Button size="lg" className="px-7">
              Build my personal brand
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors">
            Already have an account →
          </Link>
        </div>
        <p className="text-xs text-text-subtle">No credit card · 2-minute setup</p>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">Who uses it</p>
          <h2 className="text-2xl font-bold tracking-tight">Built for anyone who posts as a person.</h2>
          <p className="text-sm text-text-muted mt-2 max-w-md mx-auto">
            If you're posting as yourself, not as a company account, this mode is for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: <Briefcase className="w-5 h-5 text-amber-400" />,
              iconBg: 'bg-amber-500/10 border-amber-500/20',
              title: 'Consultant / Coach',
              body: 'Build inbound. Let clients find you through consistent, credible posts, not cold outreach.',
            },
            {
              icon: <Users className="w-5 h-5 text-sky-400" />,
              iconBg: 'bg-sky-500/10 border-sky-500/20',
              title: 'Executive / Leader',
              body: 'Share your perspective without it sounding like a press release. Your thinking, your words.',
            },
            {
              icon: <Zap className="w-5 h-5 text-violet-400" />,
              iconBg: 'bg-violet-500/10 border-violet-500/20',
              title: 'Founder',
              body: 'Post as yourself, not just your brand. The best founder content is personal. This helps you write it.',
            },
            {
              icon: <PenLine className="w-5 h-5 text-emerald-400" />,
              iconBg: 'bg-emerald-500/10 border-emerald-500/20',
              title: 'Creator / Investor',
              body: 'Turn your thinking into structured posts. Faster. Without losing the raw edge that makes people follow you.',
            },
          ].map(({ icon, iconBg, title, body }) => (
            <div key={title} className="bg-surface border border-border rounded-card p-5 space-y-3 hover:border-primary/25 transition-colors">
              <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center', iconBg)}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-center mb-10">How personal brand mode works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />

          {[
            {
              step: 1,
              icon: Sparkles,
              title: 'Choose "Myself" at setup',
              body: 'One click at the start. FounderX builds your personal voice profile: your style, your role, your audience.',
            },
            {
              step: 2,
              icon: PenLine,
              title: 'Get posts in your voice',
              body: 'Every post reflects you, not a generic brand. Safe, Bold, and Contrarian versions. Pick the one that fits.',
            },
            {
              step: 3,
              icon: Check,
              title: 'Copy and post',
              body: 'One click to copy. Paste into LinkedIn. No editing spiral. No second-guessing whether it sounds like you.',
            },
          ].map(({ step, title, body, icon: Icon }) => (
            <div key={step} className="relative bg-surface border border-border rounded-card p-5 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-full bg-surface border-2 border-border group-hover:border-primary/40 flex items-center justify-center transition-colors shrink-0 z-10">
                  <span className="text-xs font-bold text-text-muted group-hover:text-primary transition-colors">{step}</span>
                </div>
                <Icon className="w-4 h-4 text-text-subtle group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-text mb-1.5">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold">Same tools. Built around you, not a brand.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <Sparkles className="w-5 h-5 text-violet-400" />,
              iconBg: 'bg-violet-500/10 border-violet-500/20',
              title: 'Personal voice profile',
              body: 'Set up once in 2 minutes. Your personality, role, and audience get baked into every post, not just when you remember to mention it.',
            },
            {
              icon: <PenLine className="w-5 h-5 text-primary" />,
              iconBg: 'bg-primary/10 border-primary/20',
              title: '3 variations per post',
              body: 'Safe, Bold, Contrarian. All in your voice. Pick the one that feels right for the day. Don\'t overthink it.',
            },
            {
              icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
              iconBg: 'bg-amber-500/10 border-amber-500/20',
              title: 'Rough notes to real post',
              body: 'Had a conversation or experience worth sharing? Paste your messy notes. FounderX turns them into something post-ready.',
            },
            {
              icon: <MessageSquare className="w-5 h-5 text-sky-400" />,
              iconBg: 'bg-sky-500/10 border-sky-500/20',
              title: 'Smart comments',
              body: 'Engage meaningfully in your niche without spending an hour crafting a comment. Paste any post, get 3 quality replies.',
            },
          ].map(({ icon, iconBg, title, body }) => (
            <div key={title} className="bg-surface border border-border rounded-card p-6 flex gap-4 hover:border-primary/25 transition-colors">
              <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', iconBg)}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison callout ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-surface border border-primary/20 rounded-card p-8 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-4">Company brand mode</p>
              <ul className="space-y-2.5">
                {[
                  'Posts written for your startup',
                  'Stage-aware (Idea → Scale)',
                  '"Your company does X" framing',
                  'Company name + product focus',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check className="w-3.5 h-3.5 text-border shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Personal brand mode</p>
              <ul className="space-y-2.5">
                {[
                  'Posts written for you as a person',
                  'Role-aware (Founder, Consultant, Executive, Creator)',
                  '"You do X" framing throughout',
                  'Your name + your expertise in focus',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">Your voice. Starting today.</h2>
        <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
          No company needed. Just pick "Myself" when you sign up and you're set in 2 minutes.
        </p>
        <Link to="/signup">
          <Button size="lg" className="px-8">
            Build my personal brand
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <p className="text-xs text-text-subtle mt-4">Free to start · No credit card</p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-gradient rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-muted">FounderX</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-text-subtle hover:text-text-muted transition-colors">Home</Link>
            <Link to="/pricing" className="text-xs text-text-subtle hover:text-text-muted transition-colors">Pricing</Link>
            <Link to="/login" className="text-xs text-text-subtle hover:text-text-muted transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-text-subtle">2025 FounderX.</p>
        </div>
      </footer>
    </div>
  )
}
