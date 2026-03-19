import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { complete } from '../_shared/openrouter.ts'
import {
  buildBrandContext,
  buildPostPrompt,
  parsePostVariations,
  POST_STRUCTURES,
  HOOK_TYPES,
  pickRotation,
} from '../_shared/prompts.ts'


// ─── Performance summary builder ─────────────────────────────────────────────

type PostSignal = {
  selected_variation: string | null
  was_copied: boolean
  performance_rating: number | null
}

function buildPerformanceSummary(signals: PostSignal[]): string {
  const copyCount: Record<string, number> = {}
  const ratingSum: Record<string, number> = {}
  const ratingCount: Record<string, number> = {}

  for (const s of signals) {
    const v = s.selected_variation
    if (!v) continue
    if (s.was_copied) copyCount[v] = (copyCount[v] ?? 0) + 1
    if (s.performance_rating) {
      ratingSum[v] = (ratingSum[v] ?? 0) + s.performance_rating
      ratingCount[v] = (ratingCount[v] ?? 0) + 1
    }
  }

  const totalCopies = Object.values(copyCount).reduce((a, b) => a + b, 0)
  const lines: string[] = []

  const mostCopied = Object.entries(copyCount).sort((a, b) => b[1] - a[1])[0]
  if (mostCopied && totalCopies > 0) {
    lines.push(`Most copied variation: ${mostCopied[0]} (${mostCopied[1]}/${totalCopies} times)`)
  }

  const ratingLines: string[] = []
  for (const [v, sum] of Object.entries(ratingSum)) {
    const avg = (sum / (ratingCount[v] ?? 1)).toFixed(1)
    ratingLines.push(`${v} avg ${avg}/3`)
  }
  if (ratingLines.length > 0) lines.push(`Ratings: ${ratingLines.join(' · ')}`)

  const bestVariation = mostCopied?.[0] ??
    Object.entries(ratingSum)
      .sort((a, b) => b[1] / (ratingCount[b[0]] ?? 1) - a[1] / (ratingCount[a[0]] ?? 1))[0]?.[0]

  if (bestVariation) {
    lines.push(`→ This founder's ${bestVariation} posts resonate most. Prioritise that energy and hook style across all three variations.`)
  }

  return lines.join('\n')
}

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

    const { topic, company_id } = await req.json()
    if (!topic?.trim() || !company_id) {
      return new Response(JSON.stringify({ error: 'topic and company_id are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Run all three DB queries in parallel - none depend on each other
    const [usageRes, companyRes, postsRes] = await Promise.all([
      supabase.rpc('increment_usage', { p_field: 'posts' }),
      supabase.from('companies').select('*').eq('id', company_id).eq('user_id', user.id).single(),
      supabase.from('generated_posts')
        .select('post_structure, hook_type, selected_variation, was_copied, performance_rating')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
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

    const recentPosts = postsRes.data

    const recentStructures = (recentPosts ?? []).slice(0, 3).map((p: { post_structure: string | null }) => p.post_structure).filter(Boolean) as string[]
    const recentHooks = (recentPosts ?? []).slice(0, 3).map((p: { hook_type: string | null }) => p.hook_type).filter(Boolean) as string[]

    const postStructure = pickRotation(POST_STRUCTURES, recentStructures)
    const hookType = pickRotation(HOOK_TYPES, recentHooks)

    // Build performance summary once we have 8+ signals (copies or ratings)
    const signals = (recentPosts ?? []).filter((p: { was_copied: boolean; performance_rating: number | null }) => p.was_copied || p.performance_rating)
    const performanceSummary = signals.length >= 8 ? buildPerformanceSummary(signals) : undefined

    // Generate
    const raw = await complete(
      [
        { role: 'system', content: buildBrandContext(company, { postStructure, hookType, performanceSummary }) },
        { role: 'user', content: buildPostPrompt(topic) },
      ],
      { temperature: 0.75, max_tokens: 900 }
    )

    const variations = parsePostVariations(raw)
    if (!variations.variation_safe || !variations.variation_bold) {
      throw new Error('AI returned incomplete variations')
    }

    // Persist - single source of truth, frontend only patches (copy/rate/publish)
    const { data: saved, error: saveError } = await supabase
      .from('generated_posts')
      .insert({
        user_id: user.id,
        company_id,
        topic,
        variation_safe: variations.variation_safe,
        variation_bold: variations.variation_bold,
        variation_controversial: variations.variation_controversial,
        post_structure: postStructure,
        hook_type: hookType,
        tone_used: company.tone,
        was_copied: false,
      })
      .select('id')
      .single()

    if (saveError) throw new Error('Failed to save post: ' + saveError.message)

    return new Response(
      JSON.stringify({
        ...variations,
        post_structure: postStructure,
        hook_type: hookType,
        id: saved.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('generate-post error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
