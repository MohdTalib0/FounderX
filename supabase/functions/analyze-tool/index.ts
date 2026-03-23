import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// OpenRouter :free models only — no paid fallback (see plan: free public tools)
const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'stepfun/step-3.5-flash:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'arcee-ai/trinity-large-preview:free',
]
const DAILY_LIMIT = 10
const TIMEOUT_MS = 30_000

// ─── Rate limiting via Deno KV ────────────────────────────────────────────────

async function checkRateLimit(ip: string, tool: string): Promise<boolean> {
  try {
    const kv = await Deno.openKv()
    const today = new Date().toISOString().split('T')[0]
    const key = ['rate_limit', ip, tool, today]
    const entry = await kv.get<number>(key)
    const count = entry.value ?? 0
    if (count >= DAILY_LIMIT) return false
    await kv.set(key, count + 1, { expireIn: 86_400_000 }) // expire after 24h
    return true
  } catch {
    return true // if KV fails, allow the request
  }
}

// ─── System prompts ───────────────────────────────────────────────────────────

const HEADLINE_PROMPT = `You are a LinkedIn profile expert. Analyze the LinkedIn headline and return ONLY a valid JSON object. No markdown, no code fences, no explanation — just the raw JSON.

Required structure:
{
  "score": <integer 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "summary": "<1-2 sentence overall verdict>",
  "rewrite": "<your improved version of the headline, max 220 chars>",
  "criteria": [
    {"id":"length","label":"Length","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"specificity","label":"No generic buzzwords","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"value","label":"Value proposition","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"credibility","label":"Credibility markers","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"keywords","label":"Role keyword","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"}
  ]
}

Scoring rules:
- Length: 20=60-120 chars, 14=30-60 or 120-180 chars, 8=under 30 or over 180 chars
- Specificity: 20=no generic words, 12=one generic word (passionate/experienced/results-driven/guru/ninja/rockstar/thought leader), 4=multiple generic words
- Value proposition: 20=has action verb AND named target audience, 12=has only one of them, 4=neither (just a title)
- Credibility: 20=two or more proof points (numbers/notable companies/outcomes), 12=one proof point, 4=none
- Role keyword: 20=has a clear role or title keyword, 8=no recognizable role
- grade: A=85+, B=70-84, C=55-69, D=35-54, F=0-34
- score = sum of the 5 criterion scores`

const POST_CHECKER_PROMPT = `You are a LinkedIn content expert for founders. Analyze the LinkedIn post and return ONLY a valid JSON object. No markdown, no code fences, no explanation — just the raw JSON.

Required structure:
{
  "score": <integer 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "summary": "<1-2 sentence overall verdict>",
  "improved_hook": "<rewrite of just the first line to make it stronger — keep it under 120 chars>",
  "wordCount": <integer>,
  "lineCount": <integer>,
  "criteria": [
    {"id":"hook","label":"Hook strength","score":<0-25>,"maxScore":25,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"length","label":"Length","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"formatting","label":"Formatting","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"structure","label":"Structure","score":<0-20>,"maxScore":20,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"},
    {"id":"cta","label":"Call to action","score":<0-15>,"maxScore":15,"status":<"good"|"warn"|"bad">,"feedback":"<specific observation>","tip":"<actionable fix>"}
  ]
}

Scoring rules:
- Hook (0-25): 25=bold/number/question/story that creates curiosity, 15=decent but generic, 5=weak opener ("I want to share", "Excited to announce", "In this post")
- Length (0-20): 20=100-250 words, 14=50-100 or 250-400 words, 8=under 50 or over 400 words
- Formatting (0-20): 20=short paragraphs with line breaks and white space, 12=some structure, 4=wall of text
- Structure (0-20): 20=clear hook-body-close arc, 12=has two of the three, 4=no discernible structure
- CTA (0-15): 15=ends with a question or clear invitation to engage, 8=weak or missing CTA, 3=abrupt end
- grade: A=85+, B=70-84, C=55-69, D=35-54, F=0-34
- score = sum of all 5 criterion scores`

const VOICE_PROMPT = `You are a LinkedIn voice coach for founders. Analyze these writing samples and return ONLY a valid JSON object. No markdown, no code fences, no explanation — just the raw JSON.

Required structure:
{
  "voiceScore": <integer 0-100>,
  "profile": <"Authentic Builder"|"Emerging Voice"|"Work in Progress"|"Generic Writer"|"AI-Sounding">,
  "summary": "<2-3 sentence assessment of their voice and what makes it distinct or generic>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "traits": [
    {"id":"first_person","label":"First-person presence","value":"<percentage or brief observation>","description":"<what you observed in the text>","status":<"strong"|"moderate"|"weak">,"tip":"<one specific actionable suggestion>"},
    {"id":"rhythm","label":"Sentence rhythm","value":"<avg sentence length or observation>","description":"<what you observed>","status":<"strong"|"moderate"|"weak">,"tip":"<one specific actionable suggestion>"},
    {"id":"specificity","label":"Specificity signals","value":"<observation about concrete details>","description":"<what you observed>","status":<"strong"|"moderate"|"weak">,"tip":"<one specific actionable suggestion>"},
    {"id":"questions","label":"Question usage","value":"<count or observation>","description":"<what you observed>","status":<"strong"|"moderate"|"weak">,"tip":"<one specific actionable suggestion>"},
    {"id":"jargon","label":"Jargon avoidance","value":"<observation>","description":"<what you observed>","status":<"strong"|"moderate"|"weak">,"tip":"<one specific actionable suggestion>"}
  ]
}

Profile thresholds: 80-100=Authentic Builder, 60-79=Emerging Voice, 40-59=Work in Progress, 20-39=Generic Writer, 0-19=AI-Sounding.
Strong first-person: uses "I", "my", "me" naturally and frequently.
Good rhythm: mixes short punchy sentences (under 8 words) with longer ones.
Strong specificity: real numbers, names, dates, concrete examples rather than vague claims.
Good question usage: occasional rhetorical or direct questions to engage the reader.
Good jargon avoidance: no buzzwords like leverage, synergy, paradigm shift, thought leader, game-changer.`

// ─── OpenRouter call ──────────────────────────────────────────────────────────

async function tryModel(apiKey: string, model: string, systemPrompt: string, userContent: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wrively.com',
        'X-Title': 'Wrively Free Tools',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`OpenRouter ${res.status}: ${text}`)
    }
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content
    const content = typeof raw === 'string' ? raw : ''
    if (!content.trim()) throw new Error('Empty response from model')
    return content.trim()
  } finally {
    clearTimeout(timer)
  }
}

async function callAnalysisModel(systemPrompt: string, userContent: string): Promise<string> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY')
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured')

  let lastError: Error = new Error('All models failed')
  for (const model of FREE_MODELS) {
    try {
      const result = await tryModel(apiKey, model, systemPrompt, userContent)
      return result
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.error(`Model ${model} failed:`, lastError.message)
      // Stop retrying only on clear client errors (bad request / unauthorized)
      // Retry on rate limits (429), server errors (5xx), timeouts, empty responses, etc.
      const isClientError = /OpenRouter 40[01]:/.test(lastError.message)
      if (isClientError) throw lastError
      // Otherwise try the next model
    }
  }

  throw lastError
}

/** True when free tier is overloaded / flaky (OpenRouter shared :free pool). */
function isFreeModelsBusyError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase()
  return (
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('rate-limited') ||
    msg.includes('empty response from model')
  )
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  try {
    const body = await req.json()
    const { tool, content } = body

    if (!tool || !content?.trim()) {
      return new Response(
        JSON.stringify({ error: 'tool and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!['headline', 'post-checker', 'voice'].includes(tool)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tool. Must be headline, post-checker, or voice.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const allowed = await checkRateLimit(ip, tool)
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: `You've used all ${DAILY_LIMIT} free AI analyses for today on this tool. Come back tomorrow.`,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const prompts: Record<string, string> = {
      'headline':     HEADLINE_PROMPT,
      'post-checker': POST_CHECKER_PROMPT,
      'voice':        VOICE_PROMPT,
    }

    const raw = await callAnalysisModel(prompts[tool], content.trim())

    // Extract JSON — model may wrap output in markdown code fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON object found in model response')

    const parsed = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('analyze-tool error:', err)

    if (err instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'parse_error', message: 'AI returned an unexpected format. Please try again.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (isFreeModelsBusyError(err)) {
      return new Response(
        JSON.stringify({
          error: 'free_models_busy',
          message: 'Free AI is temporarily busy. Try again in a minute.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ error: 'internal_error', message: 'Analysis failed. Please try again in a moment.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
