import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete, MODELS } from '../_shared/openrouter.ts'
import { buildBrandContext, buildCommentPrompt, parseComments } from '../_shared/prompts.ts'

const FREE_LIMIT = 15

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

    const { source_post, company_id, source_url } = await req.json()
    if (!source_post?.trim() || !company_id) {
      return new Response(JSON.stringify({ error: 'source_post and company_id are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Atomic check-and-increment
    const { data: usage, error: usageError } = await supabase.rpc('increment_usage', {
      p_field: 'comments',
      p_limit: FREE_LIMIT,
    })

    if (usageError) throw new Error(usageError.message)

    if (!usage.allowed) {
      return new Response(
        JSON.stringify({ error: 'limit_reached', limit: FREE_LIMIT }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
        { role: 'user', content: buildCommentPrompt(source_post) },
      ],
      { model: MODELS.fast, temperature: 0.85, max_tokens: 600 }
    )

    const parsed = parseComments(raw)
    if (!parsed.comment_insightful && !parsed.comment_curious) {
      throw new Error('AI returned incomplete comments')
    }

    const { error: saveError } = await supabase.from('comment_suggestions').insert({
      user_id: user.id,
      company_id,
      source_post,
      source_url: source_url?.trim() || null,
      comment_insightful: parsed.comment_insightful,
      comment_curious: parsed.comment_curious,
      comment_bold: parsed.comment_bold,
    })

    if (saveError) throw new Error('Failed to save comments: ' + saveError.message)

    return new Response(
      JSON.stringify({
        insightful: parsed.comment_insightful,
        curious: parsed.comment_curious,
        bold: parsed.comment_bold,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('generate-comments error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
