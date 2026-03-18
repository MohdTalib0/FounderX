import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

// Pages
import Landing from '@/pages/Landing'
import Pricing from '@/pages/Pricing'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import AuthCallback from '@/pages/auth/Callback'
import Onboarding from '@/pages/Onboarding'
import DashboardLayout from '@/layouts/DashboardLayout'
import Dashboard from '@/pages/dashboard/Dashboard'
import Write from '@/pages/dashboard/Write'
import Rewrite from '@/pages/dashboard/Rewrite'
import Engage from '@/pages/dashboard/Engage'
import History from '@/pages/dashboard/History'
import Settings from '@/pages/dashboard/Settings'

// Guards
import AuthGuard from '@/components/guards/AuthGuard'
import OnboardingGuard from '@/components/guards/OnboardingGuard'
import Toaster from '@/components/ui/Toaster'

export default function App() {
  const { setUser, setSession, setInitialized, fetchProfile, fetchCompany } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
        fetchCompany()
      }
      setInitialized(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
        fetchCompany()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Onboarding (auth required, not yet onboarded) */}
        <Route path="/onboarding" element={
          <AuthGuard>
            <Onboarding />
          </AuthGuard>
        } />

        {/* Dashboard (auth + onboarded required) */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <OnboardingGuard>
              <DashboardLayout />
            </OnboardingGuard>
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="write" element={<Write />} />
          <Route path="rewrite" element={<Rewrite />} />
          <Route path="engage" element={<Engage />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
