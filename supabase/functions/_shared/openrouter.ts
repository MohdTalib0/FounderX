export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface CompletionOptions {
  model?: string
  temperature?: number
  max_tokens?: number
}

const MODELS = {
  quality: 'anthropic/claude-3.5-sonnet-20241022',
  fast: 'anthropic/claude-3-haiku-20240307',
  fallback: 'openai/gpt-4o-mini',
}

const TIMEOUT_MS = 25_000 // 25 s - well under Supabase's 150 s wall-clock limit

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function callOpenRouter(apiKey: string, body: object): Promise<string> {
  const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://founderx.app',
      'X-Title': 'FounderX',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${text}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from OpenRouter')
  return content
}

export async function complete(
  messages: Message[],
  options: CompletionOptions = {}
): Promise<string> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY')
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set')

  // OPENROUTER_MODEL_NAME overrides the default quality model if set
  const defaultModel = Deno.env.get('OPENROUTER_MODEL_NAME') ?? MODELS.quality
  const model = options.model ?? defaultModel
  const body = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 800,
  }

  try {
    return await callOpenRouter(apiKey, body)
  } catch (err) {
    // Fallback to gpt-4o-mini if primary model fails
    if (model !== MODELS.fallback) {
      try {
        return await callOpenRouter(apiKey, { ...body, model: MODELS.fallback })
      } catch {
        // ignore fallback error, throw original
      }
    }
    throw err
  }
}

export { MODELS }
