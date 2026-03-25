import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Copy, Check, PenLine, RefreshCw, MessageSquare, Sparkles, ArrowUpRight, Shield, Brain } from 'lucide-react'
import Button from '@/components/ui/Button'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme'

export default function Landing() {
  const { theme } = useThemeStore()
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>Wrively • AI That Sounds Like You | LinkedIn Voice Layer</title>
        <meta name="description" content="Wrively is the Voice Layer for LinkedIn. Build your voice once in 4 questions. Get posts that sound like you, every week, in under 3 minutes. Free to start." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wrively.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wrively" />
        <meta property="og:title" content="Wrively • AI That Sounds Like You | LinkedIn Voice Layer" />
        <meta property="og:description" content="Wrively is the Voice Layer for LinkedIn. Build your voice once. Get posts that sound like you, every week, in under 3 minutes." />
        <meta property="og:url" content="https://wrively.com/" />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wrively • AI That Sounds Like You | LinkedIn Voice Layer" />
        <meta name="twitter:description" content="Wrively is the Voice Layer for LinkedIn. Build your voice once. Get posts that sound like you, every week, in under 3 minutes." />
        <meta name="twitter:image" content="https://wrively.com/og/home.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Wrively',
          url: 'https://wrively.com',
          logo: 'https://wrively.com/favicon.svg',
          email: 'hello@wrively.com',
          description: 'Wrively is the Voice Layer for LinkedIn. Build your founder voice once, get posts that sound like you every time.',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Is Wrively free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The free plan includes 12 posts per month, 15 comment suggestions, and 5 rewrites & remixes. No credit card required. You can start posting today without entering payment details.' } },
            { '@type': 'Question', name: 'How is Wrively different from ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'ChatGPT starts from a blank page every session - you have to re-explain yourself every time and the output sounds generic. Wrively builds a Voice Layer from your onboarding answers once, then every post it generates comes from that model permanently. You never brief the AI twice.' } },
            { '@type': 'Question', name: 'Do my posts actually sound like me?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Wrively builds a persona from your company, stage, audience, and writing personality. Every generation pulls from that model. The output sounds like you on a clear-headed day, not like a LinkedIn influencer template.' } },
            { '@type': 'Question', name: 'How long does the setup take?', acceptedAnswer: { '@type': 'Answer', text: 'Four questions. About two minutes. You tell Wrively about your startup, your stage, your audience, and your writing personality. That is it: Wrively builds your Voice Layer and generates your first post before you reach the dashboard.' } },
            { '@type': 'Question', name: 'Does Wrively post to LinkedIn for me?', acceptedAnswer: { '@type': 'Answer', text: 'No. Wrively generates the post and you copy it with one click. You paste it into LinkedIn yourself. This keeps you in control of what goes out and when, and avoids the compliance issues that come with LinkedIn automation.' } },
          ],
        })}</script>
      </Helmet>
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/[0.06] rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-5 pt-16 sm:pt-24 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-text-muted border border-border rounded-full px-3.5 py-1.5 mb-8 bg-surface/60">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
            Free to start · Founders posting weekly
          </div>

          <h1 className="text-[42px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.04] tracking-[-0.03em] mb-6">
            Sound like yourself.<br />
            <span className="text-primary">Every time.</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl mx-auto mb-10">
            Most AI writes for everyone. Wrively writes for you - trained on how you think,
            what you believe, and how you sound when you're at your best.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link to="/signup">
              <Button size="lg" className="px-8 gap-2">
                Start free in 2 minutes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors">
              Already have an account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <Shield className="w-3.5 h-3.5" /> No credit card
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <Check className="w-3.5 h-3.5" /> Cancel anytime
            </span>
          </div>
        </div>

        {/* App preview */}
        <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.1)]">
            <img
              src={theme === 'dark' ? '/og/hero-preview.png' : '/og/hero-preview-light.png'}
              alt="Wrively dashboard — today's post ready, weekly tracker, quick actions"
              width={1600}
              height={900}
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Featured testimonial */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-4xl mx-auto px-5 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">A</div>
              <div>
                <p className="text-sm font-semibold text-text">Alex R.</p>
                <p className="text-xs text-text-muted">Seed-stage SaaS founder</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border shrink-0" />
            <p className="text-[15px] text-text leading-relaxed italic flex-1">
              "I posted twice in 2023, got 8 likes each time, and quit. I've now posted every week for 6 weeks.
              Two investors reached out. I didn't change. My process did."
            </p>
            <div className="hidden sm:flex gap-0.5 shrink-0">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voice Layer visual */}
      <section className="max-w-5xl mx-auto px-5 py-20 sm:py-28">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-4">The Voice Layer</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
            ChatGPT is a blank page.<br />
            <span className="text-primary">Wrively is a memory.</span>
          </h2>
          <p className="text-base text-text-muted max-w-lg mx-auto">
            Every other AI starts from zero. You brief it, it forgets, you brief it again.
            Wrively builds your voice once and writes from it forever.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-14">
          {[
            { label: 'You', sub: 'Your voice, ideas, and style', color: 'bg-surface border-border' },
            null,
            { label: 'Wrively', sub: 'Your Voice Layer', color: 'bg-primary/[0.06] border-primary/30', highlight: true },
            null,
            { label: 'LinkedIn', sub: 'Posts that sound like you', color: 'bg-surface border-border' },
          ].map((item, i) => {
            if (!item) return (
              <div key={i} className="flex sm:flex-row flex-col items-center">
                <div className="hidden sm:flex items-center gap-1 px-3">
                  <div className="w-8 h-px bg-border" />
                  <ArrowRight className="w-4 h-4 text-text-subtle" />
                </div>
                <div className="sm:hidden flex flex-col items-center gap-1 py-1">
                  <div className="w-px h-6 bg-border" />
                  <ArrowRight className="w-4 h-4 text-text-subtle rotate-90" />
                </div>
              </div>
            )
            return (
              <div
                key={item.label}
                className={cn(
                  'flex flex-col items-center justify-center text-center rounded-2xl border px-8 py-6 min-w-[140px]',
                  item.color,
                  item.highlight && 'shadow-[0_0_32px_rgba(99,102,241,0.15)]'
                )}
              >
                <p className={cn('font-bold text-lg mb-1', item.highlight ? 'text-primary' : 'text-text')}>{item.label}</p>
                <p className="text-xs text-text-muted leading-snug">{item.sub}</p>
                {item.highlight && (
                  <span className="mt-2 text-[10px] font-bold tracking-widest uppercase text-primary/70 border border-primary/20 rounded-full px-2 py-0.5">
                    Voice Layer
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-7">
            <p className="text-xs font-bold tracking-widest text-text-subtle uppercase mb-5">Every other AI tool</p>
            <div className="space-y-3">
              {[
                'Starts from zero every session',
                'You explain yourself each time',
                'Output sounds like everyone on LinkedIn',
                '40 minutes of editing to sound like you',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <span className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-px bg-red-400 block" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/[0.04] border border-primary/25 rounded-2xl p-7 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-5">Wrively</p>
            <div className="space-y-3">
              {[
                'Builds your voice once, uses it forever',
                'You never brief the AI twice',
                'Output sounds like you on a clear-headed day',
                'From topic to post in under 3 minutes',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              Founders don't stop posting because they have nothing to say.
            </h2>
            <p className="text-lg text-primary font-medium mb-4">
              They stop because every time they try, it doesn't sound like them.
            </p>
            <p className="text-base text-text-muted leading-relaxed">
              The blank page. The AI draft that could've been written by anyone.
              The 45 minutes of editing that still doesn't feel right.
              You quit. Not because you're not interesting. Because you don't have a system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'The blank page',
                body: 'You open the editor. Nothing comes. You close it. Tell yourself you\'ll post tomorrow. Tomorrow never comes.',
                color: 'text-violet-400',
                bg: 'bg-violet-500/[0.04] border-violet-500/15',
              },
              {
                num: '02',
                title: 'Generic AI output',
                body: '"As a founder, leveraging authenticity is key to building community." That\'s not you. That\'s nobody.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/[0.04] border-amber-500/15',
              },
              {
                num: '03',
                title: 'You quit. Again.',
                body: 'Three posts. No traction. No system. You decide LinkedIn isn\'t worth it. For the third time this year.',
                color: 'text-red-400',
                bg: 'bg-red-500/[0.04] border-red-500/15',
              },
            ].map(({ num, title, body, color, bg }) => (
              <div key={num} className={cn('rounded-2xl border p-7', bg)}>
                <p className={cn('text-xs font-bold tracking-widest mb-5', color)}>{num}</p>
                <h3 className="font-semibold text-text mb-2.5">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            Three steps. Under three minutes.
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Built around one habit: posting consistently without it consuming your morning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Build your Voice Layer once',
              body: 'Four questions. Wrively builds a persona that shapes every post you generate, forever. You never brief the AI twice.',
              detail: '2 minutes. Never repeated.',
              icon: Sparkles,
              accent: 'bg-violet-500/[0.08] border-violet-500/20 text-violet-400',
            },
            {
              step: '2',
              title: 'Pick a topic. Get 3 versions.',
              body: 'Type any topic or pick from your content pillars. Three post variations arrive in your voice: safe, bold, and spicy.',
              detail: '10 to 15 seconds.',
              icon: PenLine,
              accent: 'bg-primary/[0.08] border-primary/20 text-primary',
            },
            {
              step: '3',
              title: 'Copy and post.',
              body: 'One click to copy. Paste into LinkedIn. If nothing fits, tap a refinement chip and get a new version instantly.',
              detail: 'Done.',
              icon: Copy,
              accent: 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400',
            },
          ].map(({ step, title, body, detail, icon: Icon, accent }) => (
            <div key={step} className="flex flex-col gap-4">
              <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', accent)}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-subtle mb-2">Step {step}</p>
                <h3 className="font-semibold text-text mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{body}</p>
                <p className="text-xs text-text-subtle font-medium">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features bento */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
              Four tools. One posting habit.
            </h2>
            <p className="text-base text-text-muted">Everything you need to show up on LinkedIn consistently.</p>
          </div>

          <div className="space-y-4">
            {/* Write Post */}
            <div className="relative bg-background border border-primary/20 rounded-2xl overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-10 lg:border-r border-border flex flex-col justify-between gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary border border-primary/20 bg-primary/[0.06] px-3 py-1 rounded-full mb-6">
                      <PenLine className="w-3.5 h-3.5" />
                      Write Post
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text mb-3 leading-snug">
                      Three versions. One topic. Your voice.
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Every post comes from your persona, not a template. Pick Safe for authority-building,
                      Bold for a strong take, or Spicy when you want to start a conversation.
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {['Voice Layer trained output', '3 variations per topic', 'Refine with one tap', 'Never the same structure twice'].map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 flex items-center justify-center bg-surface/50 min-h-[280px]">
                  <WritePostDemo />
                </div>
              </div>
            </div>

            {/* Rewrite + Engage row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rewrite Draft */}
              <div className="bg-background border border-border rounded-2xl p-8 flex flex-col gap-6 hover:border-amber-500/25 transition-colors">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 border border-amber-500/20 bg-amber-500/[0.06] px-3 py-1 rounded-full mb-5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Rewrite Draft
                  </div>
                  <h3 className="font-bold text-text mb-2">Rough idea. Real post.</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Paste a brain dump. Wrively rewrites it into a clean LinkedIn post with three hook options.
                    Your ideas, better structure.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
                    <p className="text-[10px] text-text-subtle mb-1.5 font-semibold uppercase tracking-wider">Your rough draft</p>
                    <p className="text-[11px] text-text-muted italic leading-relaxed">"had a bad customer call today, they said the product direction is completely wrong..."</p>
                  </div>
                  <div className="flex items-center justify-center py-0.5">
                    <div className="text-[10px] text-text-subtle px-3 py-1 border border-border rounded-full bg-surface">rewriting in your voice</div>
                  </div>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-3.5 py-3">
                    <p className="text-[10px] text-amber-400 mb-1.5 font-semibold uppercase tracking-wider">Clean post</p>
                    <p className="text-[11px] text-text-muted leading-relaxed">"A customer call made me rethink our entire direction. Here's what they said, and why they're right."</p>
                  </div>
                </div>
              </div>

              {/* Get Comments */}
              <div className="bg-background border border-border rounded-2xl p-8 flex flex-col gap-6 hover:border-sky-500/25 transition-colors">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 border border-sky-500/20 bg-sky-500/[0.06] px-3 py-1 rounded-full mb-5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Get Comments
                  </div>
                  <h3 className="font-bold text-text mb-2">Engage without the cringe.</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Paste any post. Get three specific, smart comments in your voice.
                    No "Great insight!" No generic praise.
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { type: 'Insightful', text: 'The 90-day window you mention aligns with what I saw at my last company. The founders who survived were the ones who...', color: 'text-sky-400 border-sky-500/20 bg-sky-500/[0.04]' },
                    { type: 'Bold take', text: 'I\'d push back on one thing: the "launch fast" advice made sense in 2015. Now it just gives you users who don\'t care.', color: 'text-red-400 border-red-500/20 bg-red-500/[0.04]' },
                  ].map(({ type, text, color }) => (
                    <div key={type} className={cn('rounded-xl border px-3.5 py-3', color)}>
                      <p className="text-[10px] font-semibold mb-1 uppercase tracking-wider opacity-70">{type}</p>
                      <p className="text-[11px] text-text-muted leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Persona strip */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:border-violet-500/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/[0.1] border border-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">Your Voice Layer</p>
                    <p className="text-xs text-text-muted">Built once. Used forever.</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-muted leading-relaxed">
                    Four onboarding questions create your voice layer and content pillars.
                    Every post, rewrite, and comment pulls from it. You never brief the AI twice.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:justify-end shrink-0">
                  {['Build in public', 'Hard lessons', 'Contrarian takes'].map(p => (
                    <span key={p} className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-primary/20 bg-primary/[0.06] text-primary whitespace-nowrap">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            Founders who stopped making excuses.
          </h2>
          <p className="text-base text-text-muted">
            They all had the same problem. One of them is probably you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              initial: 'A',
              name: 'Alex R.',
              role: 'Seed-stage SaaS founder',
              quote: 'I posted twice in 2023, got 8 likes each time, and quit. I\'ve now posted every week for 6 weeks. Two investors reached out. I didn\'t change. My process did.',
            },
            {
              initial: 'S',
              name: 'Sara M.',
              role: 'B2B fintech co-founder',
              quote: 'Every AI tool I tried made me sound like a LinkedIn influencer. Wrively actually sounds like me. My team recognized my voice in the first post I showed them.',
            },
            {
              initial: 'J',
              name: 'James K.',
              role: 'Dev tools founder',
              quote: 'I used to spend 90 minutes on a post and never publish it. Now I spend 3 minutes and hit post. The consistency alone has changed how people perceive me.',
            },
          ].map(({ initial, name, role, quote }) => (
            <div key={name} className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text leading-relaxed flex-1 italic">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{name}</p>
                  <p className="text-xs text-text-muted">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
          <div className="max-w-xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
              Built for two kinds of people.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-2xl p-8 flex flex-col gap-5">
              <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Founders building companies</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  Pre-revenue or post-launch, your LinkedIn presence matters.
                  Investors research you. Early users follow you. Potential hires watch you.
                  Wrively helps you post without it consuming hours you don't have.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Pre-seed to Series A', 'Solo founders and co-founders', 'Technical and non-technical'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors mt-auto">
                Start as a founder <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-background border border-border rounded-2xl p-8 flex flex-col gap-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/[0.08] border border-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Individuals building a brand</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  Consultants, executives, creators, and professionals who know LinkedIn
                  matters but haven't cracked the consistency problem. Personal brand mode
                  is built for you. No startup required.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Consultants and freelancers', 'Corporate executives', 'Domain experts and creators'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/for-individuals" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text transition-colors mt-auto">
                Personal brand mode <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '< 3 min', label: 'From open to first post copied' },
              { value: '3x/week', label: 'Posting rhythm the product is built around' },
              { value: '40+', label: 'Founders on Wrively' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-bold text-text tracking-tight">{value}</p>
                <p className="text-xs text-text-muted mt-2 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-7xl mx-auto px-5 py-20 sm:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            Start free. Upgrade when you're posting.
          </h2>
          <p className="text-base text-text-muted">
            No credit card required.{' '}
            <Link to="/pricing" className="text-primary hover:text-primary-hover transition-colors">
              See full comparison
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Free */}
          <div className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-6">
            <div>
              <p className="font-semibold text-text mb-3">Free</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-text">$0</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders just starting out.</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {['12 posts / month', '15 comment suggestions', '5 rewrites & remixes', 'Voice Layer persona', '30-day history'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button variant="secondary" className="w-full">Start free</Button>
            </Link>
          </div>

          {/* Starter */}
          <div className="relative bg-surface border border-primary/30 rounded-2xl p-7 flex flex-col gap-6 overflow-hidden shadow-[0_4px_32px_rgba(99,102,241,0.1)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-primary">Starter</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/25 bg-primary/[0.08] text-primary tracking-widest uppercase">
                  Popular
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-text">$9</p>
                <p className="text-sm text-text-muted">/mo</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders building the habit.</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {['80 posts / month', '100 comment suggestions', '40 rewrites & remixes', 'Persona regeneration', '90-day history'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button className="w-full gap-1.5">
                Get Starter <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-6">
            <div>
              <p className="font-semibold text-text mb-3">Pro</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-text">$19</p>
                <p className="text-sm text-text-muted">/mo</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders posting consistently.</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {['Unlimited posts', 'Unlimited comments and rewrites', 'Persona regeneration', 'Full history', 'Priority AI', 'Performance insights'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button variant="secondary" className="w-full">Get Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <LandingFAQ />

      {/* Final CTA */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-5">Voice Layer</p>
          <h2 className="text-3xl sm:text-[44px] font-bold tracking-tight leading-tight mb-5">
            Your voice exists.<br />
            It just needs a system.
          </h2>
          <p className="text-base text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
            Two minutes to build your Voice Layer. Three minutes to your first post.
            No blank pages. No generic AI. Just you, posting.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8 gap-2">
              Start free in 2 minutes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-5 mt-5">
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <Shield className="w-3 h-3" /> No credit card
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <Check className="w-3 h-3" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

// Write Post Demo

function WritePostDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="bg-surface border border-border rounded-input px-3 py-2 text-xs text-text-subtle">
        Lessons from 6 months of building in public...
      </div>
      {[
        {
          badge: 'SAFE',
          color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.04]',
          text: 'Six months of building in public taught me more about my customers than any research sprint.',
        },
        {
          badge: 'BOLD',
          color: 'text-amber-400 border-amber-500/20 bg-amber-500/[0.06]',
          text: 'Building in public is the most underrated customer development strategy. Here\'s why I haven\'t missed a week.',
        },
        {
          badge: 'SPICY',
          color: 'text-red-400 border-red-500/20 bg-red-500/[0.04]',
          text: 'Most "build in public" content is just humble bragging. Here\'s what it actually looks like when things aren\'t working.',
        },
      ].map(({ badge, color, text }) => (
        <div key={badge} className={cn('rounded-[8px] border px-3 py-2.5', color)}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold">{badge}</span>
            <span className="text-[10px] text-text-subtle flex items-center gap-1">
              <Copy className="w-2.5 h-2.5" /> Copy
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  )
}

// Landing FAQ

const LANDING_FAQ = [
  {
    q: 'Is Wrively free?',
    a: 'Yes. The free plan includes 12 posts per month, 15 comment suggestions, and 5 rewrites & remixes. No credit card required.',
  },
  {
    q: 'How is Wrively different from ChatGPT?',
    a: 'ChatGPT starts from a blank page every session - you re-explain yourself every time and get generic output. Wrively builds a Voice Layer from your onboarding answers once. Every post it generates comes from that model permanently. You never brief the AI twice.',
  },
  {
    q: 'Do my posts actually sound like me?',
    a: 'Yes. Wrively builds a persona from your company, stage, audience, and writing personality. The output sounds like you on a clear-headed day, not like a LinkedIn influencer template.',
  },
  {
    q: 'How long does the setup take?',
    a: 'Four questions, about two minutes. Wrively builds your Voice Layer and generates your first post before you reach the dashboard.',
  },
  {
    q: 'Does Wrively post to LinkedIn for me?',
    a: 'No. Wrively generates the post and you copy it with one click. You paste it into LinkedIn yourself. You stay in full control of what goes out and when.',
  },
]

function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="max-w-2xl mx-auto px-5 py-20 sm:py-24">
      <h2 className="text-2xl sm:text-3xl font-bold text-text text-center mb-10 tracking-tight">
        Common questions
      </h2>
      <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
        {LANDING_FAQ.map((item, i) => (
          <div key={i} className="bg-surface">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
            >
              <span className="text-sm font-medium text-text">{item.q}</span>
              <svg
                className={cn('w-4 h-4 text-text-muted shrink-0 transition-transform duration-200', open === i && 'rotate-180')}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-border">
                <p className="text-sm text-text-muted leading-relaxed pt-4">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
