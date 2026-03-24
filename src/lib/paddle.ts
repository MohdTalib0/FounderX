import { initializePaddle, type Paddle, type CheckoutEventsData } from '@paddle/paddle-js'
import { supabase } from '@/lib/supabase'

let paddleInstance: Paddle | undefined
let paddlePromise: Promise<Paddle | undefined> | null = null
let onCheckoutComplete: (() => void) | null = null
let checkoutPriceId: string | null = null

function isPaddleConfigured(): boolean {
  return Boolean(import.meta.env.VITE_PADDLE_CLIENT_TOKEN?.trim())
}

/** Lazy-init Paddle.js (Billing). Returns undefined if env is not set (local dev). */
export function getPaddle(): Promise<Paddle | undefined> {
  if (!isPaddleConfigured()) return Promise.resolve(undefined)
  const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN!.trim()
  const env = import.meta.env.VITE_PADDLE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: env,
      token,
      eventCallback: (event: { name?: string; data?: CheckoutEventsData }) => {
        const name = event.name ?? ''

        // Log checkout funnel events (best-effort, non-blocking)
        if (name.startsWith('checkout.')) {
          supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return
            supabase.from('checkout_events').insert({
              user_id: data.user.id,
              event: name,
              price_id: checkoutPriceId,
              metadata: name === 'checkout.error'
                ? { error: (event.data as unknown as Record<string, unknown>)?.error ?? null }
                : null,
            }).then(() => {}, () => {})
          })
        }

        if (name === 'checkout.completed') {
          // Auto-close the overlay after a brief pause so the user sees the checkmark
          setTimeout(() => paddleInstance?.Checkout.close(), 1500)
          onCheckoutComplete?.()
        }
      },
    }).then((p) => { paddleInstance = p; return p })
  }
  return paddlePromise
}

/** Pre-warm the SDK so checkout opens instantly on click. */
export function preloadPaddle(): void {
  getPaddle()
}

export async function openPaddleCheckout(opts: {
  priceId: string
  email: string
  supabaseUserId: string
  onSuccess?: () => void
}): Promise<void> {
  const paddle = await getPaddle()
  if (!paddle) {
    throw new Error('Paddle is not configured (set VITE_PADDLE_* in .env)')
  }
  onCheckoutComplete = opts.onSuccess ?? null
  checkoutPriceId = opts.priceId
  paddle.Checkout.open({
    items: [{ priceId: opts.priceId, quantity: 1 }],
    customer: { email: opts.email },
    customData: { supabase_user_id: opts.supabaseUserId },
  })
}
