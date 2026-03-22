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
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-screen">
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Free LinkedIn Tools</h1>
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
      </main>

      <PublicFooter />
    </>
  )
}
