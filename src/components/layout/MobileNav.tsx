import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Home, PenLine, MessageSquare, History, MoreHorizontal, RefreshCw, Shuffle, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const mainItems = [
  { to: '/dashboard',         label: 'Home',    icon: Home,           end: true },
  { to: '/dashboard/write',   label: 'Write',   icon: PenLine },
  { to: '/dashboard/engage',  label: 'Engage',  icon: MessageSquare },
  { to: '/dashboard/history', label: 'History',  icon: History },
]

const moreItems = [
  { to: '/dashboard/rewrite', label: 'Rewrite Draft', icon: RefreshCw },
  { to: '/dashboard/remix',   label: 'Remix a Post',  icon: Shuffle },
  { to: '/dashboard/settings', label: 'Settings',      icon: Settings },
]

export default function MobileNav() {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-20" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-sm font-semibold text-text">More tools</p>
              <button onClick={() => setShowMore(false)} className="p-1.5 text-text-muted hover:text-text rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {moreItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  <Icon className="w-5 h-5 text-text-muted" />
                  <span className="text-sm font-medium text-text">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-10">
        <div className="flex items-center justify-around px-1 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {mainItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex-1 min-w-0"
            >
              {({ isActive }) => (
                <div className={cn(
                  'flex flex-col items-center gap-1 py-1.5 mx-0.5 rounded-xl transition-colors',
                  isActive ? 'bg-primary/[0.08]' : 'hover:bg-surface-hover'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-text-muted'
                  )} />
                  <span className={cn(
                    'text-[10px] font-medium leading-none transition-colors',
                    isActive ? 'text-primary' : 'text-text-subtle'
                  )}>
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setShowMore(true)}
            className="flex-1 min-w-0"
          >
            <div className={cn(
              'flex flex-col items-center gap-1 py-1.5 mx-0.5 rounded-xl transition-colors',
              showMore ? 'bg-primary/[0.08]' : 'hover:bg-surface-hover'
            )}>
              <MoreHorizontal className={cn(
                'w-5 h-5 transition-colors',
                showMore ? 'text-primary' : 'text-text-muted'
              )} />
              <span className={cn(
                'text-[10px] font-medium leading-none transition-colors',
                showMore ? 'text-primary' : 'text-text-subtle'
              )}>
                More
              </span>
            </div>
          </button>
        </div>
      </nav>
    </>
  )
}
