/**
 * Generate an authenticated Paddle customer portal session.
 * Returns a one-click URL so the user doesn't have to log in again.
 *
 * Secrets: PADDLE_API_KEY, PADDLE_API_BASE (optional, defaults to sandbox)
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get customer's Paddle IDs from profile
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('paddle_customer_id, paddle_subscription_id')
      .eq('id', user.id)
      .single()

    if (!profile?.paddle_customer_id) {
      return new Response(JSON.stringify({ error: 'No active subscription' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const paddleApiKey = Deno.env.get('PADDLE_API_KEY')
    if (!paddleApiKey) {
      console.error('paddle-portal: PADDLE_API_KEY not set')
      return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Default to sandbox; set PADDLE_API_BASE=https://api.paddle.com for production
    const apiBase = Deno.env.get('PADDLE_API_BASE') || 'https://sandbox-api.paddle.com'

    // Build portal session request — include subscription for deep links
    const body: Record<string, unknown> = {}
    if (profile.paddle_subscription_id) {
      body.subscription_ids = [profile.paddle_subscription_id]
    }

    const res = await fetch(
      `${apiBase}/customers/${profile.paddle_customer_id}/portal-sessions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paddleApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('paddle-portal: Paddle API error', res.status, text)
      return new Response(JSON.stringify({ error: 'Failed to create portal session' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const portalUrl = data.data?.urls?.general?.overview

    if (!portalUrl) {
      console.error('paddle-portal: no overview URL in response', data)
      return new Response(JSON.stringify({ error: 'Portal URL not available' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ url: portalUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('paddle-portal error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
