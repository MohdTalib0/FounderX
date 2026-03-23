/**
 * Free tool usage tracking.
 *
 * - getSessionId()   — returns a stable anonymous UUID from localStorage.
 *                      Created on first call, persisted forever (survives page reloads).
 *                      Used to stitch anonymous tool uses to a user after signup.
 *
 * - trackToolUse()   — fires-and-forgets a row into `tool_uses`.
 *                      Safe to call without await — never throws, never blocks the UI.
 *
 * - setAcquisitionSource() — stores which tool the visitor used in localStorage
 *                            so Signup.tsx can write it to profiles.acquisition_source.
 *
 * - getAcquisitionSource() / clearAcquisitionSource() — used by Signup.tsx.
 */

import { supabase } from '@/lib/supabase'

const SESSION_KEY    = 'wrively_session_id'
const ACQ_SOURCE_KEY = 'wrively_acq_source'

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export type ToolName = 'headline-analyzer' | 'post-checker' | 'voice-analyzer'

interface TrackOptions {
  tool:        ToolName
  score:       number | null   // null when AI failed and we fell back to client-side
  usedExample: boolean
}

/** Strips query string and fragment — we only want the domain + path as referrer context. */
function cleanReferrer(): string | null {
  try {
    const ref = document.referrer
    if (!ref) return null
    const url = new URL(ref)
    return url.origin + url.pathname
  } catch {
    return null
  }
}

function getUtmParams(): Record<string, string | null> {
  try {
    const p = new URLSearchParams(window.location.search)
    return {
      utm_source:   p.get('utm_source'),
      utm_medium:   p.get('utm_medium'),
      utm_campaign: p.get('utm_campaign'),
    }
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null }
  }
}

export async function trackToolUse({ tool, score, usedExample }: TrackOptions): Promise<void> {
  try {
    const sessionId = getSessionId()
    const { utm_source, utm_medium, utm_campaign } = getUtmParams()

    // Mark this tool as the acquisition source (overwritten each visit — last touch wins)
    setAcquisitionSource(`tool:${tool}`)

    await supabase.from('tool_uses').insert({
      tool,
      session_id:   sessionId,
      score:        score ?? null,
      used_example: usedExample,
      referrer:     cleanReferrer(),
      utm_source,
      utm_medium,
      utm_campaign,
    })
  } catch {
    // Never surface tracking errors to the user
  }
}

export function setAcquisitionSource(source: string): void {
  try {
    // Only set if not already set — first touch attribution
    if (!localStorage.getItem(ACQ_SOURCE_KEY)) {
      localStorage.setItem(ACQ_SOURCE_KEY, source)
    }
  } catch { /* localStorage unavailable */ }
}

export function getAcquisitionSource(): string | null {
  try {
    return localStorage.getItem(ACQ_SOURCE_KEY)
  } catch {
    return null
  }
}

export function clearAcquisitionSource(): void {
  try {
    localStorage.removeItem(ACQ_SOURCE_KEY)
  } catch { /* ignore */ }
}
