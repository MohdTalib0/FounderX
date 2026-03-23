import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Zap } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'

const LAST_UPDATED = 'March 23, 2026'

const sections = [
  {
    title: '1. Free Plan',
    body: `The Wrively free plan costs nothing. There is nothing to refund. You can use the free plan indefinitely with no obligation to upgrade.`,
  },
  {
    title: '2. Pro Plan — Monthly Billing',
    body: `Wrively Pro is billed monthly. You can cancel your subscription at any time from Settings → Account → Manage Billing. Cancellation stops future charges immediately. You will retain Pro access until the end of the current billing period. We do not issue refunds for the remaining days of a billing period after cancellation.`,
  },
  {
    title: '3. Refund Eligibility',
    body: `We offer refunds in the following circumstances: (a) you were charged after cancelling your subscription due to a billing error on our side; (b) you were charged twice for the same period; (c) you signed up for Pro and experienced a service outage that made the product unusable for more than 48 consecutive hours during your first billing period. Refund requests must be submitted within 14 days of the charge in question.`,
  },
  {
    title: '4. How to Request a Refund',
    body: `Email hello@wrively.com with your account email, the charge date, and a brief description of the issue. We aim to respond within 2 business days. Approved refunds are processed back to your original payment method within 5–10 business days, depending on your bank or card issuer.`,
  },
  {
    title: '5. Disputes',
    body: `We ask that you contact us before initiating a chargeback with your bank. Most issues can be resolved quickly by email. Chargebacks create extra cost and friction for both parties. If you contact us first and we cannot resolve your issue, we will not contest a dispute raised in good faith.`,
  },
  {
    title: '6. Changes to This Policy',
    body: `We may update this policy from time to time. Changes will be posted here and take effect immediately. If you have an active Pro subscription when material changes are made, we will notify you by email.`,
  },
  {
    title: '7. Contact',
    body: `Billing questions or refund requests: hello@wrively.com. We're a small team and we genuinely want to make things right.`,
  },
]

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | Wrively</title>
        <meta name="description" content="Read the Wrively Refund Policy. Understand when refunds apply and how to request one for your Wrively Pro subscription." />
        <link rel="canonical" href="https://wrively.com/refunds" />
        <meta property="og:title" content="Refund Policy | Wrively" />
        <meta property="og:url" content="https://wrively.com/refunds" />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta name="robots" content="noindex, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refund Policy | Wrively" />
        <meta name="twitter:description" content="Read the Wrively Refund Policy. Understand when refunds apply for your Wrively Pro subscription." />
        <meta name="twitter:image" content="https://wrively.com/og/home.png" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text text-base">Wrively</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Title block */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-text mb-2">Refund Policy</h1>
          <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Intro */}
        <div className="bg-surface border border-border rounded-card px-5 py-4 mb-8">
          <p className="text-sm text-text-muted leading-relaxed">
            We want you to feel confident upgrading to Pro. This policy explains when refunds
            apply and how to get one. If something went wrong with your billing, just email{' '}
            <a href="mailto:hello@wrively.com" className="text-primary hover:text-primary-hover transition-colors">
              hello@wrively.com
            </a>{' '}
            — we'll sort it out.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map(s => (
            <section key={s.title}>
              <h2 className="text-base font-semibold text-text mb-2">{s.title}</h2>
              <p className="text-sm text-text-muted leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
