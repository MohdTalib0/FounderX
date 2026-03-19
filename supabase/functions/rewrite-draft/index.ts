import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete } from '../_shared/openrouter.ts'
import { buildBrandContext, buildRewritePrompt, parseRewrite } from '../_shared/prompts.ts'


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
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { draft, company_id } = await req.json()
    if (!draft?.trim() || !company_id) {
      return new Response(JSON.stringify({ error: 'draft and company_id are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Run usage check + company fetch in parallel
    const [usageRes, companyRes] = await Promise.all([
      supabase.rpc('increment_usage', { p_field: 'rewrites' }),
      supabase.from('companies').select('*').eq('id', company_id).eq('user_id', user.id).single(),
    ])

    if (usageRes.error) throw new Error(usageRes.error.message)
    if (!usageRes.data.allowed) {
      return new Response(
        JSON.stringify({ error: 'limit_reached', limit: usageRes.data.limit }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const company = companyRes.data
    if (companyRes.error || !company) {
      return new Response(JSON.stringify({ error: 'Company not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const raw = await complete(
      [
        { role: 'system', content: buildBrandContext(company) },
        { role: 'user', content: buildRewritePrompt(draft) },
      ],
      { temperature: 0.75, max_tokens: 700 }
    )

    const parsed = parseRewrite(raw)
    if (!parsed.rewritten || parsed.hooks.length === 0) {
      throw new Error('AI returned incomplete rewrite')
    }

    // Persist - return id so frontend can update selected_hook without a second insert
    const { data: saved, error: saveError } = await supabase
      .from('draft_rewrites')
      .insert({
        user_id: user.id,
        company_id,
        original_draft: draft,
        rewritten: parsed.rewritten,
        hooks: parsed.hooks,
        selected_hook: parsed.hooks[0] ?? null,
      })
      .select('id')
      .single()

    if (saveError) throw new Error('Failed to save rewrite: ' + saveError.message)

    return new Response(
      JSON.stringify({ hooks: parsed.hooks, rewritten: parsed.rewritten, id: saved.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('rewrite-draft error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
