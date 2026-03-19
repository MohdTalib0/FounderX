import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete } from '../_shared/openrouter.ts'
import { buildPersonaPrompt, parsePersona } from '../_shared/prompts.ts'

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

    const { company_id } = await req.json()
    if (!company_id) {
      return new Response(JSON.stringify({ error: 'company_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get company (verify ownership)
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

    const prompt = buildPersonaPrompt({
      name: company.name,
      description: company.description,
      target_audience: company.target_audience,
      industry: company.industry,
      stage: company.stage,
      founder_goal: company.founder_goal,
      founder_personality: company.founder_personality,
      keywords: company.keywords ?? [],
    })

    const raw = await complete(
      [{ role: 'user', content: prompt }],
      { temperature: 0.7, max_tokens: 400 }
    )

    const parsed = parsePersona(raw)

    if (!parsed.persona_statement || parsed.content_pillars.length === 0) {
      throw new Error('AI returned incomplete persona')
    }

    // Save back to company
    const { data: updated, error: updateError } = await supabase
      .from('companies')
      .update({
        persona_statement: parsed.persona_statement,
        content_pillars: parsed.content_pillars,
      })
      .eq('id', company_id)
      .select()
      .single()

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        persona_statement: parsed.persona_statement,
        content_pillars: parsed.content_pillars,
        company: updated,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('generate-persona error:', msg)
    return new Response(
      JSON.stringify({ error: msg }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
