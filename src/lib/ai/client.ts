import { supabase } from '@/lib/supabase'

// All AI calls go through Supabase Edge Functions — API key never touches the browser.

export class LimitReachedError extends Error {
  readonly limit: number
  constructor(limit: number) {
    super('limit_reached')
    this.limit = limit
  }
}

async function invoke<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  // getSession() triggers an auto-refresh if the access token is expired.
  // supabase.functions.invoke() uses whatever token the client currently holds,
  // which may be stale if called before onAuthStateChange has fired (e.g. right
  // after signup / page load). Awaiting getSession() first guarantees a fresh token.
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke(fn, {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) {
    // supabase-js wraps non-2xx responses as FunctionsHttpError — the body is in error.context
    const context = (error as { context?: Response }).context
    if (context instanceof Response) {
      let json: { error?: string; limit?: number } = {}
      try { json = await context.json() } catch { /* ignore */ }
      if (json.error === 'limit_reached') throw new LimitReachedError(json.limit ?? 0)
      const msg = json.error ?? error.message ?? 'AI request failed'
      throw new Error(msg)
    }
    throw new Error((error as { message?: string }).message ?? 'AI request failed')
  }

  return data as T
}

// ─── Generate Post ──────────────────────────────────────────────────────────
export interface GeneratePostResult {
  variation_safe: string
  variation_bold: string
  variation_controversial: string
  post_structure: string
  hook_type: string
  id: string | null
}

export async function generatePost(payload: {
  topic: string
  company_id: string
}): Promise<GeneratePostResult> {
  return invoke<GeneratePostResult>('generate-post', payload)
}

// ─── Refine / Regenerate Post ────────────────────────────────────────────────
export async function refinePost(payload: {
  company_id: string
  post: string
  refinement: 'too_formal' | 'too_generic' | 'too_long' | 'too_ai'
}): Promise<string> {
  const result = await invoke<{ refined: string }>('refine-post', { ...payload, mode: 'refine' })
  return result.refined
}

export async function regenerateVariation(payload: {
  company_id: string
  topic: string
  variation: 'safe' | 'bold' | 'controversial'
}): Promise<string> {
  const result = await invoke<{ refined: string }>('refine-post', { ...payload, mode: 'regenerate' })
  return result.refined
}

// ─── Generate Comments ───────────────────────────────────────────────────────
export interface GenerateCommentsResult {
  insightful: string
  curious: string
  bold: string
}

export async function generateComments(payload: {
  source_post: string
  company_id: string
  source_url?: string
}): Promise<GenerateCommentsResult> {
  return invoke<GenerateCommentsResult>('generate-comments', payload)
}

// ─── Rewrite Draft ───────────────────────────────────────────────────────────
export interface RewriteDraftResult {
  hooks: string[]
  rewritten: string
  id: string | null
}

export async function rewriteDraft(payload: {
  draft: string
  company_id: string
}): Promise<RewriteDraftResult> {
  return invoke<RewriteDraftResult>('rewrite-draft', payload)
}

// ─── Remix Post ──────────────────────────────────────────────────────────────

export interface RemixPostResult {
  structure: string
  hook_type: string
  tone: string
  why_it_works: string
  adapted_version: string
  id: string
}

export async function remixPost(payload: {
  source_post: string
  company_id: string
}): Promise<RemixPostResult> {
  return invoke<RemixPostResult>('remix-post', payload)
}

// ─── Generate Persona ─────────────────────────────────────────────────────────
export interface GeneratePersonaResult {
  persona_statement: string
  content_pillars: string[]
  company: Record<string, unknown>
}

export async function generatePersona(payload: {
  company_id: string
}): Promise<GeneratePersonaResult> {
  return invoke<GeneratePersonaResult>('generate-persona', payload)
}
