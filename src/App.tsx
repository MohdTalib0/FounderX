import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

// Eager - needed on first paint
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import AuthGuard from '@/components/guards/AuthGuard'
import OnboardingGuard from '@/components/guards/OnboardingGuard'
import Toaster from '@/components/ui/Toaster'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollToTop from '@/components/ScrollToTop'
import GoogleAnalytics from '@/components/GoogleAnalytics'

// Lazy - loaded on demand
const Terms = lazy(() => import('@/pages/Terms'))
const Contact = lazy(() => import('@/pages/Contact'))
const ForIndividuals = lazy(() => import('@/pages/ForIndividuals'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const BlogIndex = lazy(() => import('@/pages/blog/BlogIndex'))
const BlogPost = lazy(() => import('@/pages/blog/BlogPost'))
const ToolsIndex = lazy(() => import('@/pages/tools/ToolsIndex'))
const HeadlineAnalyzer = lazy(() => import('@/pages/tools/HeadlineAnalyzer'))
const PostChecker = lazy(() => import('@/pages/tools/PostChecker'))
const VoiceAnalyzer = lazy(() => import('@/pages/tools/VoiceAnalyzer'))
const ComparisonPage = lazy(() => import('@/pages/compare/ComparisonPage'))
const PersonaPage = lazy(() => import('@/pages/for/PersonaPage'))
const PostExamplesPage = lazy(() => import('@/pages/examples/PostExamplesPage'))
const HookExamplesPage = lazy(() => import('@/pages/hooks/HookExamplesPage'))
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
const Upgrade = lazy(() => import('@/pages/dashboard/Upgrade'))

export default function App() {
  const { setUser, setSession, setInitialized, fetchProfile, fetchCompany } = useAuthStore()

  // Mount once: Supabase session + auth listener (store actions are stable)
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // If the session expired while the user was on a protected page, redirect to login
      // with a reason so the login page can show a contextual message.
      if (event === 'SIGNED_OUT' && window.location.pathname.startsWith('/dashboard')) {
        window.location.replace('/login?reason=session_expired')
        return
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
        fetchCompany()
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-time subscription
  }, [])

  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/for-individuals" element={<ForIndividuals />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/tools" element={<ToolsIndex />} />
          <Route path="/tools/linkedin-headline-analyzer" element={<HeadlineAnalyzer />} />
          <Route path="/tools/linkedin-post-checker" element={<PostChecker />} />
          <Route path="/tools/linkedin-voice-analyzer" element={<VoiceAnalyzer />} />
          <Route path="/linkedin-post-examples/:topic" element={<PostExamplesPage />} />
          <Route path="/hooks/:type" element={<HookExamplesPage />} />
          <Route path="/compare/:slug" element={<ComparisonPage />} />
          <Route path="/for/:slug" element={<PersonaPage />} />
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
            <Route path="upgrade" element={<Upgrade />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}
