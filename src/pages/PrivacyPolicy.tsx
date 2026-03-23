import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Zap } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'

const LAST_UPDATED = 'March 23, 2026'

const sections = [
  {
    title: '1. What We Collect',
    body: `When you create an account, we collect your name and email address. When you use Wrively, we store the content you generate (posts, comments, rewrites) and your founder profile data (company, stage, persona). We also collect basic usage data — which features you use and when — to improve the product. If you upgrade, our payment processor (Stripe) handles billing; we do not store your card details.`,
  },
  {
    title: '2. How We Use Your Data',
    body: `We use your data to run and improve Wrively: to generate personalised content in your voice, to send product and billing emails, and to understand how the product is used at an aggregate level. We do not sell your data to third parties. We do not use your content to train AI models.`,
  },
  {
    title: '3. Free Tool Analytics',
    body: `Our free tools (Headline Analyzer, Post Checker, Voice Analyzer) collect anonymous session data including the tool used, result score, referring URL, and UTM parameters. This data is used to understand which channels drive signups. No account is required and no personally identifiable information is stored for anonymous sessions.`,
  },
  {
    title: '4. Cookies and Local Storage',
    body: `We use local storage (not cookies) to remember your session, theme preference, and attribution source. We use Google Analytics to track page views and navigation patterns using anonymised data. We do not use advertising cookies or tracking pixels.`,
  },
  {
    title: '5. Data Sharing',
    body: `We share data with a small number of trusted services necessary to operate Wrively: Supabase (database and authentication), OpenRouter (AI inference — prompts and responses are not stored by us after generation), Stripe (payment processing), and Google Analytics (anonymised usage analytics). All processors are under contractual obligations to protect your data.`,
  },
  {
    title: '6. Data Retention',
    body: `Your account data is retained for as long as your account is active. If you delete your account, your profile, posts, and personal data are permanently deleted within 30 days. Anonymised aggregate analytics may be retained indefinitely.`,
  },
  {
    title: '7. Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time. You can export your generated content from the History page. To delete your account, go to Settings → Account → Delete Account. For any data requests not covered by in-app features, email us at hello@wrively.com.`,
  },
  {
    title: '8. Data Security',
    body: `All data is transmitted over HTTPS. Your account password is hashed and never stored in plain text. Database access is protected by row-level security — your data is only accessible to you. We use industry-standard practices but no system is completely immune to breach. If a breach affects your data, we will notify you promptly.`,
  },
  {
    title: '9. Children',
    body: `Wrively is not directed at children under 18. We do not knowingly collect personal information from anyone under 18. If you believe a minor has created an account, contact us and we will delete it promptly.`,
  },
  {
    title: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or with an in-app notice before the changes take effect. Continued use of Wrively after that point constitutes acceptance.`,
  },
  {
    title: '11. Contact',
    body: `For privacy questions or data requests, email us at hello@wrively.com. We aim to respond within 5 business days.`,
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Wrively</title>
        <meta name="description" content="Read the Wrively Privacy Policy. Learn how we collect, use, and protect your data when you use the Wrively platform." />
        <link rel="canonical" href="https://wrively.com/privacy" />
        <meta property="og:title" content="Privacy Policy | Wrively" />
        <meta property="og:url" content="https://wrively.com/privacy" />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta name="robots" content="noindex, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Wrively" />
        <meta name="twitter:description" content="Read the Wrively Privacy Policy. Learn how we collect, use, and protect your data." />
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
          <h1 className="text-2xl font-bold text-text mb-2">Privacy Policy</h1>
          <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Intro */}
        <div className="bg-surface border border-border rounded-card px-5 py-4 mb-8">
          <p className="text-sm text-text-muted leading-relaxed">
            Your privacy matters to us. This policy explains what data we collect, why we collect
            it, and how you can control it. We keep it short and plain — no legal maze.
            Questions? Email{' '}
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
