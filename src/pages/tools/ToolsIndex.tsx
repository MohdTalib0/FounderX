import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, BarChart2, FileText, Mic } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

const TOOLS = [
  {
    to: '/tools/linkedin-headline-analyzer',
    icon: BarChart2,
    title: 'LinkedIn Headline Analyzer',
    description: 'Paste your current LinkedIn headline and get an instant grade: length, value prop, credibility signals, and specific rewrites.',
    tags: ['Free', '8,100 searches/mo'],
  },
  {
    to: '/tools/linkedin-post-checker',
    icon: FileText,
    title: 'LinkedIn Post Checker',
    description: 'Score any post before you publish. Analyzes hook strength, formatting, length, structure, and closing CTA. Live re-scoring as you type.',
    tags: ['Free', '2,400 searches/mo'],
  },
  {
    to: '/tools/linkedin-voice-analyzer',
    icon: Mic,
    title: 'LinkedIn Voice Analyzer',
    description: 'Does your writing sound like you or like everyone else? Analyzes first-person presence, rhythm, specificity, jargon, and question usage.',
    tags: ['Free'],
  },
]

export default function ToolsIndex() {
  return (
    <>
      <Helmet>
        <title>Free LinkedIn Tools for Founders | Wrively</title>
        <meta
          name="description"
          content="Free LinkedIn tools built for founders: Headline Analyzer, Post Checker, and Voice Analyzer. No signup required. Instant results."
        />
        <link rel="canonical" href="https://wrively.com/tools" />
        <meta property="og:title" content="Free LinkedIn Tools for Founders | Wrively" />
        <meta property="og:description" content="Free LinkedIn tools built for founders: Headline Analyzer, Post Checker, and Voice Analyzer. No signup required. Instant results." />
        <meta property="og:url" content="https://wrively.com/tools" />
        <meta property="og:image" content="https://wrively.com/og/tools.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free LinkedIn Tools for Founders | Wrively" />
        <meta name="twitter:description" content="Free LinkedIn tools built for founders: Headline Analyzer, Post Checker, and Voice Analyzer. No signup required. Instant results." />
        <meta name="twitter:image" content="https://wrively.com/og/tools.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Free LinkedIn Tools for Founders',
          description: 'Free LinkedIn tools: Headline Analyzer, Post Checker, and Voice Analyzer.',
          url: 'https://wrively.com/tools',
          numberOfItems: 3,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'LinkedIn Headline Analyzer', url: 'https://wrively.com/tools/linkedin-headline-analyzer' },
            { '@type': 'ListItem', position: 2, name: 'LinkedIn Post Checker', url: 'https://wrively.com/tools/linkedin-post-checker' },
            { '@type': 'ListItem', position: 3, name: 'LinkedIn Voice Analyzer', url: 'https://wrively.com/tools/linkedin-voice-analyzer' },
          ],
        })}</script>
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-screen">
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Free LinkedIn Tools for Founders</h1>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Three tools built for founders who want to write better on LinkedIn. No signup. No email. Just results.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-20 space-y-4">
          {TOOLS.map(tool => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex items-start gap-5 bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-base font-semibold text-text group-hover:text-primary transition-colors">
                    {tool.title}
                  </h2>
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{tool.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-subtle group-hover:text-primary shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </section>

        {/* Why section */}
        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-text mb-6">Why LinkedIn writing tools matter for founders</h2>
            <div className="space-y-4 text-base text-text-muted leading-relaxed">
              <p>
                The problem isn't that founders can't write. It's that LinkedIn has specific mechanics most people optimize against by instinct. The algorithm truncates your post after the first line or two. Mobile readers skim in under three seconds before scrolling. Search surfaces your profile based on the exact words in your headline. Writing the way you'd speak in a conversation doesn't automatically translate to content that performs.
              </p>
              <p>
                These three tools surface the gap between what you intended and what the content actually delivers. Is the opening line strong enough to survive the fold? Is your headline specific enough to appear in search when someone looks for your role? Does your writing sound like a distinct person, or could it have come from anyone?
              </p>
              <p>
                No signup. No email. Paste your content, get your result, use it immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Which tool to use */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-text mb-6">Which tool should you start with?</h2>
          <div className="space-y-4">
            {[
              {
                signal: "You're not getting profile visits from search or comments",
                tool: 'Start with the LinkedIn Headline Analyzer',
                reason: "Your headline is the primary signal LinkedIn uses to surface you in search results and in every comment you leave on other posts. A generic headline means people scroll past without clicking — even if the comment itself is good.",
                to: '/tools/linkedin-headline-analyzer',
              },
              {
                signal: 'Your posts go live but get minimal engagement',
                tool: 'Start with the LinkedIn Post Checker',
                reason: 'Low engagement almost always traces back to one of five structural problems: a weak hook that loses readers at the fold, wrong length, wall of text formatting, no specific detail in the body, or an abrupt ending with no CTA.',
                to: '/tools/linkedin-post-checker',
              },
              {
                signal: 'Your posts feel generic or indistinguishable from AI content',
                tool: 'Start with the LinkedIn Voice Analyzer',
                reason: 'Voice problems are harder to spot than structure problems. This tool identifies whether your writing reads as a specific person with a specific perspective — or as interchangeable content — and tells you exactly what to change.',
                to: '/tools/linkedin-voice-analyzer',
              },
            ].map(item => (
              <div key={item.to} className="bg-surface border border-border rounded-xl p-5">
                <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-1">If...</p>
                <p className="text-sm font-medium text-text mb-3">{item.signal}</p>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Then...</p>
                <p className="text-sm font-semibold text-text mb-1">{item.tool}</p>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{item.reason}</p>
                <Link to={item.to} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                  Use this tool <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-surface border-t border-border py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-text mb-8">Frequently asked questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Are these LinkedIn tools actually free?',
                  a: 'Yes. No email, no signup, no credit card, no trial period. Paste your content and get your result. The tools are free because we want founders to see what structured LinkedIn feedback looks like before deciding whether to build a full Voice Layer on Wrively.',
                },
                {
                  q: 'How accurate are the scores?',
                  a: "The scoring criteria are based on the patterns that consistently separate high-performing LinkedIn content from low-performing content: hook mechanics, mobile formatting behavior, structural arc, and specificity signals. These aren't arbitrary — they reflect how LinkedIn's algorithm and real readers actually respond to content.",
                },
                {
                  q: 'Can I use these tools on my phone?',
                  a: 'Yes. All three tools are fully responsive and work on mobile. LinkedIn itself is a mobile-first platform, so it made sense to build tools that work the same way.',
                },
                {
                  q: 'Do I need a Wrively account to use these tools?',
                  a: "No. The free tools work without an account and always will. If you want to go further — generating posts in your specific voice, building a founder persona, getting comment suggestions — that's what Wrively is built for.",
                },
                {
                  q: "What's the difference between the Post Checker and the Voice Analyzer?",
                  a: "The Post Checker scores structure: hook strength, length, formatting, arc, and CTA. These are objective, measurable signals any post can be evaluated against. The Voice Analyzer scores something harder to quantify: whether your writing sounds like a specific person or like generic content. Both matter. Most founders need the Post Checker first, the Voice Analyzer second.",
                },
              ].map(item => (
                <div key={item.q} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <h3 className="text-base font-semibold text-text mb-2">{item.q}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </>
  )
}
