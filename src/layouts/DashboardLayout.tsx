import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Zap, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { cn } from '@/lib/utils'

function UserMenu() {
  const { profile, setProfile, setCompany } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (profile?.email?.[0] ?? '?').toUpperCase()

  const firstName = profile?.full_name?.split(' ')[0] ?? profile?.email ?? ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setCompany(null)
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-8 px-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
          {initials}
        </div>
        <span className="text-sm font-semibold text-text">{firstName}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden border border-border shadow-card-hover z-50 bg-surface">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-text truncate">{profile?.full_name ?? firstName}</p>
            <p className="text-xs text-text-muted truncate mt-0.5">{profile?.email}</p>
          </div>

          {/* Actions */}
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => { navigate('/dashboard/settings'); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-text-muted',
                'hover:bg-surface-hover hover:text-text transition-colors text-left'
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Settings
            </button>

            <button
              onClick={handleSignOut}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-danger',
                'hover:bg-danger/10 transition-colors text-left'
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 md:ml-[220px]">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-10 h-14 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-gradient rounded-lg flex items-center justify-center shadow-card">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-text">FounderX</span>
          </div>

          <UserMenu />
        </header>

        <div className="max-w-3xl mx-auto px-4 py-6 pb-28 md:px-6 md:py-8 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
