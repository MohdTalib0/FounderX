import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Zap } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'

const LAST_UPDATED = 'March 24, 2026'

const sections = [
  {
    title: '1. Free Plan',
    body: `The Wrively free plan costs nothing. There is nothing to refund. You can use the free plan indefinitely with no obligation to upgrade.`,
  },
  {
    title: '2. Paid Plans:Monthly Billing',
    body: `Wrively Starter and Pro are billed monthly. You can cancel your subscription at any time from Settings → Account → Manage Billing. Cancellation takes effect at the end of your current billing period:you will retain access until that date and will not be charged again after that.`,
  },
  {
    title: '3. Payments and Refunds',
    body: `Payments for Wrively Starter and Pro are processed by Paddle, our authorised reseller. All refund requests are handled in accordance with the Paddle Buyer Terms (paddle.com/legal/buyers). To request a refund, contact us at hello@wrively.com and we will work with Paddle to process it promptly.`,
  },
  {
    title: '4. EU / EEA and UK Consumers',
    body: `If you are a consumer residing in the EU, EEA, or United Kingdom, you have the right to withdraw from your subscription within 14 days of purchase for a full refund, in accordance with applicable consumer law. If you have already started using Wrively during that period, your right of withdrawal may be affected as permitted by law. To exercise this right, email hello@wrively.com.`,
  },
  {
    title: '5. Contact',
    body: `For billing questions or refund requests, email hello@wrively.com. We aim to respond within 2 business days.`,
  },
]

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | Wrively</title>
        <meta name="description" content="Read the Wrively Refund Policy. Understand when refunds apply and how to request one for your Wrively subscription." />
        <link rel="canonical" href="https://wrively.com/refunds" />
        <meta property="og:title" content="Refund Policy | Wrively" />
        <meta property="og:url" content="https://wrively.com/refunds" />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta name="robots" content="noindex, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Refund Policy | Wrively" />
        <meta name="twitter:description" content="Read the Wrively Refund Policy. Understand when refunds apply for your Wrively subscription." />
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
            Payments for Wrively paid plans are processed by Paddle as our authorised reseller.
            Refunds are handled in accordance with the{' '}
            <a href="https://www.paddle.com/legal/buyers" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover transition-colors">
              Paddle Buyer Terms
            </a>
            . Questions? Email{' '}
            <a href="mailto:hello@wrively.com" className="text-primary hover:text-primary-hover transition-colors">
              hello@wrively.com
            </a>
            .
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
