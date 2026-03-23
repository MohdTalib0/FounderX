import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = 'G-QMPW6C9NKN'

/**
 * GA4 initial page view is sent by gtag in index.html.
 * This sends page_view on client-side (React Router) navigations only.
 */
export default function GoogleAnalytics() {
  const location = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    const path = location.pathname + location.search
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: path })
  }, [location.pathname, location.search])

  return null
}
