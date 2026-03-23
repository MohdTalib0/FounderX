/** Google Analytics gtag.js (loaded in index.html) */
export {}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
