import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ─── Topic generation (mirrors Dashboard.tsx) ─────────────────────────────────

const TOPIC_TEMPLATES = [
  (p: string) => `${p}: the thing nobody warned me about`,
  (p: string) => `An honest look at ${p.toLowerCase()}: what's actually working`,
  (p: string) => `What I wish I knew about ${p.toLowerCase()} 6 months ago`,
  (p: string) => `The hardest part of ${p.toLowerCase()} right now`,
  (p: string) => `A recent ${p.toLowerCase()} lesson that changed how I think`,
  (p: string) => `${p}: what the advice gets wrong`,
  (p: string) => `The counterintuitive truth about ${p.toLowerCase()}`,
]

function getTopics(pillars: string[], count: number): string[] {
  if (!pillars.length) {
    return [
      'What you learned this week',
      'A lesson from your current stage',
      'Something your team discovered recently',
    ].slice(0, count)
  }
  return Array.from({ length: count }, (_, i) => {
    const pillar = pillars[i % pillars.length]
    const template = TOPIC_TEMPLATES[(i * 2) % TOPIC_TEMPLATES.length]
    return template(pillar)
  })
}

// ─── Email HTML helpers ───────────────────────────────────────────────────────

function btn(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#6366F1;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;margin-top:20px;">${text} →</a>`
}

function topicPill(topic: string): string {
  return `<div style="background:#F0F0FF;border-left:3px solid #6366F1;border-radius:0 6px 6px 0;padding:11px 14px;margin:14px 0 6px;">
    <p style="margin:0;font-size:14px;color:#18181B;font-weight:500;line-height:1.5;">"${topic}"</p>
  </div>`
}

function wrap(inner: string, baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FounderX</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:28px 16px;">
  <table role="presentation" width="100%" style="max-width:540px;" cellpadding="0" cellspacing="0">

    <!-- Logo -->
    <tr><td style="padding-bottom:16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#18181B;">⚡ FounderX</p>
    </td></tr>

    <!-- Card -->
    <tr><td style="background:#ffffff;border-radius:10px;border:1px solid #E4E4E7;padding:28px 28px 24px;">
      ${inner}
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:18px 0 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#A1A1AA;line-height:1.7;">
        You're getting this because you signed up for FounderX.&nbsp;
        <a href="${baseUrl}/dashboard/settings" style="color:#6366F1;text-decoration:none;">Manage preferences</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`
}

// ─── T+24h - first post nudge ─────────────────────────────────────────────────

function make24h(
  firstName: string,
  persona: string,
  pillars: string[],
  topic: string,
  baseUrl: string,
): { subject: string; html: string } {
  const topicUrl = `${baseUrl}/dashboard/write?topic=${encodeURIComponent(topic)}`

  const pillarsHtml = pillars.map(p =>
    `<span style="display:inline-block;background:#EEF2FF;color:#6366F1;border:1px solid #C7D2FE;border-radius:20px;font-size:11px;font-weight:500;padding:2px 9px;margin:2px 2px 0 0;">${p}</span>`
  ).join('')

  const personaBlock = persona
    ? `<div style="background:#F9FAFB;border:1px solid #E4E4E7;border-radius:8px;padding:14px;margin:0 0 18px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#71717A;letter-spacing:0.05em;text-transform:uppercase;">Your persona</p>
        <p style="margin:0${pillarsHtml ? ' 0 10px' : ''};font-size:13px;color:#18181B;line-height:1.6;">${persona}</p>
        ${pillarsHtml ? `<div>${pillarsHtml}</div>` : ''}
      </div>`
    : ''

  return {
    subject: `Your founder brand is waiting, ${firstName}`,
    html: wrap(`
      <h2 style="margin:0 0 14px;font-size:20px;font-weight:700;color:#18181B;line-height:1.3;">Time to post, ${firstName}.</h2>
      <p style="margin:0 0 18px;font-size:14px;color:#52525B;line-height:1.7;">You built your founder persona yesterday. It needs one thing to be worth something: a post.</p>
      ${personaBlock}
      <p style="margin:0 0 4px;font-size:14px;color:#52525B;">A topic based on your pillars to get you started:</p>
      ${topicPill(topic)}
      <p style="margin:0;font-size:12px;color:#A1A1AA;">3 variations ready in under 3 minutes.</p>
      ${btn('Generate my first post', topicUrl)}
      <p style="margin:22px 0 0;font-size:12px;color:#A1A1AA;line-height:1.6;">
        Or go to your dashboard: <a href="${baseUrl}/dashboard" style="color:#6366F1;text-decoration:none;">${baseUrl.replace('https://', '')}/dashboard</a>
      </p>
    `, baseUrl),
  }
}

// ─── T+72h - re-engagement nudge ─────────────────────────────────────────────

function make72h(
  firstName: string,
  topic: string,
  baseUrl: string,
): { subject: string; html: string } {
  const topicUrl = `${baseUrl}/dashboard/write?topic=${encodeURIComponent(topic)}`

  return {
    subject: `It's been a few days, ${firstName}. Here's a post idea`,
    html: wrap(`
      <h2 style="margin:0 0 14px;font-size:20px;font-weight:700;color:#18181B;line-height:1.3;">Back on track, ${firstName}.</h2>
      <p style="margin:0 0 14px;font-size:14px;color:#52525B;line-height:1.7;">LinkedIn rewards consistency. Every quiet day is a day your future users, investors, and hires don't find you.</p>
      <p style="margin:0 0 4px;font-size:14px;color:#52525B;">Here's a topic to get you back on track:</p>
      ${topicPill(topic)}
      <p style="margin:0;font-size:12px;color:#A1A1AA;">3 variations, in under 3 minutes. Pick the one that feels right.</p>
      ${btn('Generate this post', topicUrl)}
      <p style="margin:22px 0 0;font-size:12px;color:#A1A1AA;line-height:1.6;">The founders who show up consistently win. Your persona is ready, now let it work.</p>
    `, baseUrl),
  }
}

// ─── Weekly Monday - 3 topic ideas ───────────────────────────────────────────

function makeWeekly(
  firstName: string,
  companyName: string,
  topics: string[],
  baseUrl: string,
): { subject: string; html: string } {
  const topicsHtml = topics.map((topic, i) => {
    const url = `${baseUrl}/dashboard/write?topic=${encodeURIComponent(topic)}`
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #F4F4F5;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:22px;vertical-align:top;padding-right:10px;padding-top:2px;">
              <span style="display:inline-block;width:20px;height:20px;background:#EEF2FF;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#6366F1;">${i + 1}</span>
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0;font-size:13px;color:#18181B;line-height:1.5;">${topic}</p>
            </td>
            <td style="vertical-align:middle;text-align:right;padding-left:8px;white-space:nowrap;">
              <a href="${url}" style="font-size:12px;color:#6366F1;text-decoration:none;font-weight:500;">Write →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
  }).join('')

  return {
    subject: `3 post ideas for ${companyName} this week`,
    html: wrap(`
      <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#18181B;line-height:1.3;">3 post ideas for ${companyName}</h2>
      <p style="margin:0 0 20px;font-size:14px;color:#71717A;">Good Monday, ${firstName}. Here's your week.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${topicsHtml}
      </table>
      ${btn('Start writing', `${baseUrl}/dashboard`)}
      <p style="margin:20px 0 0;font-size:12px;color:#A1A1AA;line-height:1.6;">3 posts this week: Mon, Wed, Fri. Your persona handles the voice, you just pick the topic.</p>
    `, baseUrl),
  }
}

// ─── Resend delivery ──────────────────────────────────────────────────────────

async function sendEmail(
  resendKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  email_notifications: boolean
  companies: Array<{
    name: string
    persona_statement: string | null
    content_pillars: string[] | null
  }> | null
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok')
  }

  // Authenticate - fail closed: if secret is unset, refuse all requests
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (!cronSecret) {
    console.error('CRON_SECRET env var is not set - refusing request')
    return json({ error: 'Server misconfiguration' }, 500)
  }
  if (req.headers.get('x-cron-secret') !== cronSecret) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const body = await req.json().catch(() => ({}))
  const type = body?.type as string | undefined

  if (!type || !['24h', '72h', 'weekly'].includes(type)) {
    return json({ error: 'type must be "24h" | "72h" | "weekly"' }, 400)
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) {
    console.error('RESEND_API_KEY not set')
    return json({ error: 'Email service not configured' }, 500)
  }

  const baseUrl    = Deno.env.get('APP_URL')    ?? 'https://founderx.app'
  const fromAddr   = Deno.env.get('EMAIL_FROM')  ?? 'FounderX <team@founderx.app>'

  // Service role - needed to read all users, bypasses RLS
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const HOUR = 60 * 60 * 1000
  const now  = Date.now()

  // ── 1. Fetch candidates ────────────────────────────────────────────────────

  let candidates: Profile[] = []

  if (type === '24h') {
    // Signed up 24–48h ago, completed onboarding
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, email_notifications, companies(name, persona_statement, content_pillars)')
      .eq('onboarded', true)
      .eq('email_notifications', true)
      .gte('created_at', new Date(now - 48 * HOUR).toISOString())
      .lte('created_at', new Date(now - 24 * HOUR).toISOString())
    candidates = (data ?? []) as Profile[]

    // Only users who have never generated a post
    const userIds = candidates.map(u => u.id)
    if (userIds.length) {
      const { data: posts } = await supabase
        .from('generated_posts')
        .select('user_id')
        .in('user_id', userIds)
      const usersWithPosts = new Set((posts ?? []).map(p => p.user_id))
      candidates = candidates.filter(u => !usersWithPosts.has(u.id))
    }

  } else if (type === '72h') {
    // Any onboarded user whose last generated post was 72–96h ago
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, email_notifications, companies(name, persona_statement, content_pillars)')
      .eq('onboarded', true)
      .eq('email_notifications', true)
    if (!data?.length) return json({ sent: 0, eligible: 0 })

    // Batch fetch latest post timestamp per user
    const userIds = data.map(u => u.id)
    const { data: posts } = await supabase
      .from('generated_posts')
      .select('user_id, created_at')
      .in('user_id', userIds)
      .order('created_at', { ascending: false })

    const lastPostAt = new Map<string, number>()
    for (const p of posts ?? []) {
      if (!lastPostAt.has(p.user_id)) {
        lastPostAt.set(p.user_id, new Date(p.created_at).getTime())
      }
    }

    candidates = (data as Profile[]).filter(u => {
      const last = lastPostAt.get(u.id)
      if (!last) return false
      const age = now - last
      return age >= 72 * HOUR && age <= 96 * HOUR
    })

  } else {
    // weekly - all onboarded users who haven't opted out
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, email_notifications, companies(name, persona_statement, content_pillars)')
      .eq('onboarded', true)
      .eq('email_notifications', true)
    candidates = (data ?? []) as Profile[]
  }

  if (!candidates.length) return json({ sent: 0, eligible: 0 })

  // ── 2. Deduplicate - skip anyone who got this email recently ───────────────

  const dedupeWindow = type === 'weekly' ? 6 * 24 * HOUR : 7 * 24 * HOUR
  const dedupeSince  = new Date(now - dedupeWindow).toISOString()

  const { data: alreadySent } = await supabase
    .from('sent_emails')
    .select('user_id')
    .eq('email_type', type)
    .gte('sent_at', dedupeSince)
    .in('user_id', candidates.map(c => c.id))

  const sentSet   = new Set((alreadySent ?? []).map(r => r.user_id))
  const eligible  = candidates.filter(c => !sentSet.has(c.id))

  if (!eligible.length) return json({ sent: 0, eligible: 0 })

  // ── 3. Send ────────────────────────────────────────────────────────────────

  let sent = 0
  const errors: string[] = []

  for (const user of eligible) {
    try {
      const company    = Array.isArray(user.companies) ? user.companies[0] : (user.companies as Profile['companies'] & { name?: string; persona_statement?: string; content_pillars?: string[] } | null)
      const pillars    = company?.content_pillars ?? []
      const firstName  = user.full_name?.split(' ')[0] ?? 'there'
      const companyName = company?.name ?? 'your company'
      const persona    = company?.persona_statement ?? ''
      const [topic]    = getTopics(pillars, 1)

      const { subject, html } =
        type === '24h'   ? make24h(firstName, persona, pillars, topic, baseUrl) :
        type === '72h'   ? make72h(firstName, topic, baseUrl) :
                           makeWeekly(firstName, companyName, getTopics(pillars, 3), baseUrl)

      await sendEmail(resendKey, fromAddr, user.email, subject, html)
      const { error: insertError } = await supabase
        .from('sent_emails')
        .insert({ user_id: user.id, email_type: type })
      if (insertError) throw new Error(`sent_emails insert failed: ${insertError.message}`)
      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[send-reengagement] ${type} → ${user.email}: ${msg}`)
      errors.push(`${user.email}: ${msg}`)
    }
  }

  console.log(`[send-reengagement] type=${type} sent=${sent}/${eligible.length}`)
  return json({ sent, eligible: eligible.length, ...(errors.length ? { errors } : {}) })
})

// ─── Util ─────────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
