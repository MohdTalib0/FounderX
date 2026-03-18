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
  quality: 'anthropic/claude-3.5-sonnet',
  fast: 'anthropic/claude-3-haiku',
  fallback: 'openai/gpt-4o-mini',
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

  // Try OpenRouter first
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
  } catch (err) {
    // Fallback to OpenRouter with fallback model
    if (model !== MODELS.fallback) {
      const fallbackRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://founderx.app',
          'X-Title': 'FounderX',
        },
        body: JSON.stringify({ ...body, model: MODELS.fallback }),
      })
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        const content = data.choices?.[0]?.message?.content
        if (content) return content
      }
    }
    throw err
  }
}

export { MODELS }
