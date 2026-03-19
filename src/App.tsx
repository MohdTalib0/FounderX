import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

// Eager - needed on first paint
import Landing from '@/pages/Landing'
import AuthGuard from '@/components/guards/AuthGuard'
import OnboardingGuard from '@/components/guards/OnboardingGuard'
import Toaster from '@/components/ui/Toaster'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Lazy - loaded on demand
const ForIndividuals = lazy(() => import('@/pages/ForIndividuals'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const AuthCallback = lazy(() => import('@/pages/auth/Callback'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Write = lazy(() => import('@/pages/dashboard/Write'))
const Rewrite = lazy(() => import('@/pages/dashboard/Rewrite'))
const Remix = lazy(() => import('@/pages/dashboard/Remix'))
const Engage = lazy(() => import('@/pages/dashboard/Engage'))
const History = lazy(() => import('@/pages/dashboard/History'))
const Settings = lazy(() => import('@/pages/dashboard/Settings'))

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
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/for-individuals" element={<ForIndividuals />} />
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
            <Route path="remix" element={<Remix />} />
            <Route path="engage" element={<Engage />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}
