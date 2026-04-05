import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete } from '../_shared/openrouter.ts'
import { buildBrandContext, buildRefinePrompt, buildPostPrompt, parsePostVariations } from '../_shared/prompts.ts'

type RefinementType = 'too_formal' | 'too_generic' | 'too_long' | 'too_ai'

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

    const body = await req.json()
    const { company_id, mode } = body

    if (!company_id || !mode) {
      return new Response(JSON.stringify({ error: 'company_id and mode are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get company
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

    const systemPrompt = buildBrandContext(company)

    if (mode === 'refine') {
      // Refine a single variation
      const { post, refinement } = body as { post: string; refinement: RefinementType; mode: string; company_id: string }
      if (!post || !refinement) {
        return new Response(JSON.stringify({ error: 'post and refinement are required for refine mode' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const userPrompt = buildRefinePrompt(post, refinement, company.name, company.stage, {
        persona: company.persona_statement,
        audience: company.target_audience,
        industry: company.industry,
      })

      const raw = await complete(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7, max_tokens: 500 }
      )

      return new Response(
        JSON.stringify({ refined: raw.trim() }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (mode === 'regenerate') {
      // Regenerate a single variation with a specific style
      const { topic, variation } = body as { topic: string; variation: 'safe' | 'bold' | 'controversial'; mode: string; company_id: string }
      if (!topic || !variation) {
        return new Response(JSON.stringify({ error: 'topic and variation are required for regenerate mode' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const userPrompt = `${buildPostPrompt(topic)}

Important: Only return the <${variation}> variation. Return it in the same format as before.`

      const raw = await complete(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.8, max_tokens: 400 }
      )

      const all = parsePostVariations(raw)
      const result = all[`variation_${variation}` as keyof typeof all] || raw.trim()

      return new Response(
        JSON.stringify({ refined: result }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(JSON.stringify({ error: 'Invalid mode. Use "refine" or "regenerate"' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('refine-post error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
