import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const nextUrl = searchParams.get('next') || null

    async function resolveAndNavigate(userId: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', userId)
        .maybeSingle()
      navigate(nextUrl ?? (profile?.onboarded ? '/dashboard' : '/onboarding'), { replace: true })
    }

    // Strategy 1: Try getSession() immediately — works when hash fragment is present
    // This handles the common case where App.tsx hasn't consumed the token yet.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        resolveAndNavigate(session.user.id)
        return
      }

      // Strategy 2: Listen for auth state change — handles cases where the
      // token exchange is still in progress (mobile browsers, slow networks).
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') && session) {
            subscription.unsubscribe()
            resolveAndNavigate(session.user.id)
          }
        }
      )

      // Strategy 3: Timeout fallback — if nothing fires within 10s,
      // redirect to login rather than showing infinite loading.
      setTimeout(() => {
        subscription.unsubscribe()
        // One last check before giving up
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            resolveAndNavigate(session.user.id)
          } else {
            navigate('/login?error=invalid_link', { replace: true })
          }
        })
      }, 10_000)
    })
  }, [navigate, searchParams])

  return <LoadingScreen />
}
