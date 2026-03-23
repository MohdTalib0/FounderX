import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * SPAs keep window scroll position across navigations by default.
 * Scroll to top when the path or query string changes (not hash-only updates).
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    const goTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    goTop()
    // Second frame: lazy-loaded routes / Suspense may paint after first scroll
    const id = requestAnimationFrame(() => goTop())
    return () => cancelAnimationFrame(id)
  }, [pathname, search])

  return null
}
