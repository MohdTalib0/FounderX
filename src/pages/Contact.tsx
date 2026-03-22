import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import { Mail, Clock, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { cn } from '@/lib/utils'

const schema = z.object({
  name:    z.string().min(2, 'Enter your name'),
  email:   z.string().email('Enter a valid email'),
  subject: z.string().min(1, 'Pick a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})
type FormData = z.infer<typeof schema>

const SUBJECTS = [
  'General question',
  'Feature request',
  'Bug report',
  'Billing',
  'Other',
]

const INFO = [
  {
    icon: Mail,
    label: 'Email us directly',
    value: 'hello@wrively.com',
    href: 'mailto:hello@wrively.com',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours',
    href: null,
  },
]

export default function Contact() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    const subject = encodeURIComponent(`[Wrively] ${data.subject}`)
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    )
    window.location.href = `mailto:hello@wrively.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Helmet>
        <title>Contact Wrively • Get in Touch</title>
        <meta name="description" content="Have a question, feedback, or idea? Contact the Wrively team. We read every message and respond within one business day." />
        <link rel="canonical" href="https://wrively.com/contact" />
        <meta property="og:title" content="Contact Wrively • Get in Touch" />
        <meta property="og:description" content="Have a question, feedback, or idea? Contact the Wrively team. We read every message." />
        <meta property="og:url" content="https://wrively.com/contact" />
      </Helmet>
      <PublicHeader />

      <main className="max-w-5xl mx-auto px-5 py-14 md:py-20">

        {/* Hero */}
        <div className="max-w-xl mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-3">
            Get in touch
          </h1>
          <p className="text-base text-text-muted leading-relaxed">
            Have a question, found a bug, or want to share feedback?
            We read every message and reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-start">

          {/* Left: contact info */}
          <div className="space-y-3">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3.5 bg-surface border border-border rounded-card px-4 py-4">
                <div className="w-8 h-8 rounded-lg bg-primary/[0.08] border border-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-text hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Product note */}
            <div className="bg-surface border border-border rounded-card px-4 py-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-primary-gradient rounded-md flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-semibold text-text">Still in beta</p>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Wrively is actively being built. Your feedback directly shapes what we build next.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="relative px-6 pt-6 pb-5 border-b border-border">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <h2 className="text-base font-semibold text-text">Send a message</h2>
              <p className="text-xs text-text-muted mt-0.5">We'll open your email client with the message pre-filled.</p>
            </div>

            {sent ? (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-base font-semibold text-text mb-1">Your email client opened</h3>
                <p className="text-sm text-text-muted mb-6">
                  Your message was pre-filled. Just hit send and we'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-primary hover:text-primary-hover transition-colors font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Your name" error={errors.name?.message}>
                    <input
                      {...register('name')}
                      placeholder="Alex Johnson"
                      autoComplete="name"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  <Field label="Email" error={errors.email?.message}>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@startup.com"
                      autoComplete="email"
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                </div>

                <Field label="Subject" error={errors.subject?.message}>
                  <select
                    {...register('subject')}
                    className={cn(inputClass(!!errors.subject), 'appearance-none')}
                    defaultValue=""
                  >
                    <option value="" disabled>Pick a topic</option>
                    {SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" error={errors.message?.message}>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className={cn(inputClass(!!errors.message), 'resize-none leading-relaxed')}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  Send message
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return cn(
    'w-full bg-background border rounded-input px-3 py-3 text-sm text-text',
    'placeholder:text-text-subtle transition-colors duration-100',
    'focus:outline-none focus:shadow-input-focus',
    hasError
      ? 'border-danger focus:border-danger'
      : 'border-border hover:border-border-hover focus:border-border-focus'
  )
}

function Field({ label, error, children }: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
