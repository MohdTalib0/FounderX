import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete } from '../_shared/openrouter.ts'
import { buildBrandContext, buildRemixPrompt, parseRemix } from '../_shared/prompts.ts'

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

    const { source_post, company_id } = await req.json()
    if (!source_post?.trim() || !company_id) {
      return new Response(JSON.stringify({ error: 'source_post and company_id are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch company (verify ownership)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .eq('user_id', user.id)
      .single()

    if (companyError || !company) {
      return new Response(JSON.stringify({ error: 'Company not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const raw = await complete(
      [
        { role: 'system', content: buildBrandContext(company) },
        { role: 'user', content: buildRemixPrompt(
            source_post,
            company.persona_statement ?? 'A founder building in public',
            company.name,
            company.description
          )
        },
      ],
      { temperature: 0.75, max_tokens: 800 }
    )

    const parsed = parseRemix(raw)
    if (!parsed.adapted_version || !parsed.structure) {
      throw new Error('AI returned incomplete remix')
    }

    const { data: saved, error: saveError } = await supabase
      .from('remixed_posts')
      .insert({
        user_id: user.id,
        company_id,
        source_post,
        structure: parsed.structure,
        hook_type: parsed.hook_type,
        tone: parsed.tone,
        why_it_works: parsed.why_it_works,
        adapted_version: parsed.adapted_version,
      })
      .select('id')
      .single()

    if (saveError) throw new Error('Failed to save remix: ' + saveError.message)

    return new Response(
      JSON.stringify({ ...parsed, id: saved.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('remix-post error:', msg)
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
