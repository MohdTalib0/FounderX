import { NavLink } from 'react-router-dom'
import { Home, PenLine, MessageSquare, History, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { to: '/dashboard',         label: 'Home',    icon: Home,           end: true },
  { to: '/dashboard/write',   label: 'Write',   icon: PenLine },
  { to: '/dashboard/engage',  label: 'Engage',  icon: MessageSquare },
  { to: '/dashboard/rewrite', label: 'Rewrite', icon: Wrench },
  { to: '/dashboard/history', label: 'History',  icon: History },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-10">
      <div className="flex items-center justify-around px-1 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map(({ to, label, icon: Icon, end }) => (
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
      </div>
    </nav>
  )
}
