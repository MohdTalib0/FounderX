import { NavLink } from 'react-router-dom'
import { Home, PenLine, RefreshCw, MessageSquare, History } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/dashboard',         label: 'Home',    icon: Home,         end: true },
  { to: '/dashboard/write',   label: 'Write',   icon: PenLine },
  { to: '/dashboard/rewrite', label: 'Rewrite', icon: RefreshCw },
  { to: '/dashboard/engage',  label: 'Engage',  icon: MessageSquare },
  { to: '/dashboard/history', label: 'History', icon: History },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-10">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0 flex-1',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary rounded-full" />
                )}
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
