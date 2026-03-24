/**
 * Paddle Billing webhooks — sync subscription → profiles.plan
 *
 * Secrets: PADDLE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY
 *          PADDLE_PRICE_ID_STARTER, PADDLE_PRICE_ID_PRO (price ids from Paddle dashboard)
 *
 * Checkout must pass customData: { supabase_user_id: "<uuid>" } so the first event can link the profile.
 * Later events resolve by paddle_subscription_id if custom_data is absent.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SupabaseAdmin = ReturnType<typeof createClient>
import { corsHeaders } from '../_shared/cors.ts'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

async function verifyPaddleSignature(
  rawBody: string,
  paddleSignatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!paddleSignatureHeader) return false
  const parts = paddleSignatureHeader.split(';')
  let ts = ''
  let h1 = ''
  for (const part of parts) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const k = part.slice(0, eq)
    const v = part.slice(eq + 1)
    if (k === 'ts') ts = v
    if (k === 'h1') h1 = v
  }
  if (!ts || !h1) return false

  const signedPayload = `${ts}:${rawBody}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return timingSafeEqual(hex.toLowerCase(), h1.toLowerCase())
}

function planFromPriceIds(
  items: Array<{ price?: { id?: string } }> | undefined,
  priceStarter: string,
  pricePro: string,
): 'starter' | 'pro' | null {
  const first = items?.[0]?.price?.id
  if (!first) return null
  if (first === priceStarter) return 'starter'
  if (first === pricePro) return 'pro'
  return null
}

async function resolveProfileUserId(
  supabase: SupabaseAdmin,
  customUserId: string | null,
  subscriptionId: string | undefined,
  customerId: string | undefined,
): Promise<string | null> {
  if (customUserId) return customUserId
  if (subscriptionId) {
    const { data } = await supabase.from('profiles').select('id').eq('paddle_subscription_id', subscriptionId).maybeSingle()
    if (data?.id) return data.id
  }
  if (customerId) {
    const { data } = await supabase.from('profiles').select('id').eq('paddle_customer_id', customerId).maybeSingle()
    if (data?.id) return data.id
  }
  return null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const secret = Deno.env.get('PADDLE_WEBHOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const priceStarter = Deno.env.get('PADDLE_PRICE_ID_STARTER') ?? ''
  const pricePro = Deno.env.get('PADDLE_PRICE_ID_PRO') ?? ''

  if (!secret || !supabaseUrl || !serviceKey) {
    console.error('paddle-webhook: missing env')
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const rawBody = await req.text()
  const sigOk = await verifyPaddleSignature(
    rawBody,
    req.headers.get('paddle-signature'),
    secret,
  )
  if (!sigOk) {
    return new Response(JSON.stringify({ error: 'invalid_signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let payload: {
    event_type?: string
    data?: {
      id?: string
      status?: string
      customer_id?: string
      items?: Array<{ price?: { id?: string } }>
      custom_data?: Record<string, unknown>
    }
  }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const eventType = payload.event_type ?? ''
  const data = payload.data ?? {}
  const customData = data.custom_data ?? {}
  const customUserId =
    typeof customData.supabase_user_id === 'string' ? customData.supabase_user_id : null

  const supabase = createClient(supabaseUrl, serviceKey)

  const subscriptionId = data.id
  const customerId = data.customer_id
  const status = data.status

  if (!eventType.startsWith('subscription.')) {
    return new Response(JSON.stringify({ received: true, ignored: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const uid = await resolveProfileUserId(supabase, customUserId, subscriptionId, customerId)
  if (!uid) {
    console.warn('paddle-webhook: could not resolve user', { eventType, subscriptionId, customerId })
    return new Response(JSON.stringify({ received: true, skipped: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const items = data.items
  const mapped = planFromPriceIds(items, priceStarter, pricePro)

  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (status === 'canceled' || status === 'paused') {
    row.plan = 'free'
    row.paddle_subscription_id = null
    row.subscription_status = status
    if (customerId) row.paddle_customer_id = customerId
  } else if (status === 'active' || status === 'trialing' || status === 'past_due') {
    if (subscriptionId) row.paddle_subscription_id = subscriptionId
    if (customerId) row.paddle_customer_id = customerId
    row.subscription_status = status
    if (mapped) row.plan = mapped
    else console.warn('paddle-webhook: active sub but unknown price — set PADDLE_PRICE_ID_*', items)
  } else {
    row.subscription_status = status ?? null
    if (subscriptionId) row.paddle_subscription_id = subscriptionId
    if (customerId) row.paddle_customer_id = customerId
  }

  // Update profile (current state)
  const { error } = await supabase.from('profiles').update(row).eq('id', uid)
  if (error) console.error('paddle-webhook: update failed', error)

  // Log event (immutable audit trail)
  const { error: logError } = await supabase.from('subscription_events').insert({
    user_id: uid,
    event_type: eventType,
    plan: (row.plan as string) ?? mapped ?? null,
    status: status ?? null,
    paddle_subscription_id: subscriptionId ?? null,
    paddle_customer_id: customerId ?? null,
  })
  if (logError) console.error('paddle-webhook: event log failed', logError)

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
