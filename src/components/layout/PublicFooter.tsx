import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

const LINKS = [
  {
    heading: 'Product',
    items: [
      { label: 'Write Post',      to: '/signup' },
      { label: 'Get Comments',    to: '/signup' },
      { label: 'Rewrite Draft',   to: '/signup' },
      { label: 'For Individuals', to: '/for-individuals' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'Pricing',   to: '/pricing' },
      { label: 'Contact',   to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
]

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">

        {/* Top: brand + columns */}
        <div className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-[15px] h-[15px] text-white" />
              </div>
              <span className="font-bold text-base text-text">FounderX</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-[220px]">
              LinkedIn posts that sound like you. Built for founders.
            </p>
            <a
              href="mailto:hello@founderx.app"
              className="inline-block mt-4 text-xs text-text-subtle hover:text-primary transition-colors"
            >
              hello@founderx.app
            </a>
          </div>

          {/* Link columns */}
          {LINKS.map(group => (
            <div key={group.heading}>
              <p className="text-xs font-semibold text-text uppercase tracking-widest mb-4">
                {group.heading}
              </p>
              <ul className="space-y-3">
                {group.items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-subtle">© 2026 FounderX. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-text-subtle">
            <Link to="/terms" className="hover:text-text-muted transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-text-muted transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
