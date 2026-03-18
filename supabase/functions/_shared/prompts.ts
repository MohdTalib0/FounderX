// Shared prompt builders and parsers for Supabase Edge Functions
// Mirrors src/lib/ai/prompts.ts — keep in sync

export interface CompanyContext {
  name: string
  description: string
  target_audience: string
  industry: string[]
  stage: string
  founder_goal: string
  founder_personality: string
  persona_statement?: string | null
  content_pillars?: string[] | null
  keywords?: string[] | null
  tone?: string
}

// ─── Brand Context Block ────────────────────────────────────────────────────
export function buildBrandContext(company: CompanyContext, extras?: {
  postStructure?: string
  hookType?: string
  performanceSummary?: string
}): string {
  const toneMap: Record<string, string> = {
    builder: 'casual, direct, technical when needed — raw progress over polish',
    storyteller: 'narrative-driven, warm, turns experiences into lessons',
    analyst: 'structured, data-informed, framework-first',
    contrarian: 'bold, opinionated, challenges conventional wisdom respectfully',
  }

  const tone = toneMap[company.founder_personality] ?? 'authentic and direct'

  return `You are a LinkedIn ghostwriter for a specific founder. Write ONLY in their voice.

FOUNDER PERSONA: ${company.persona_statement ?? 'A founder building in public'}
PERSONALITY TYPE: ${company.founder_personality}
COMPANY: ${company.name} — ${company.description}
TARGET AUDIENCE: ${company.target_audience}
INDUSTRY: ${company.industry.join(', ')}
STAGE: ${company.stage}
PRIMARY GOAL: ${company.founder_goal.replace('_', ' ')}
VOICE: ${tone}
${company.keywords?.length ? `BRAND KEYWORDS: ${company.keywords.join(', ')}` : ''}
${company.content_pillars?.length ? `CONTENT PILLARS: ${company.content_pillars.join(', ')}` : ''}
${extras?.postStructure ? `POST STRUCTURE THIS TIME: ${extras.postStructure}` : ''}
${extras?.hookType ? `HOOK TYPE THIS TIME: ${extras.hookType}` : ''}
${extras?.performanceSummary ? `\nCONTENT SIGNAL HISTORY:\n${extras.performanceSummary}` : ''}

Rules:
- Write as this founder, first person, not as an AI assistant
- Sound human — contractions, occasional imperfect grammar is fine
- NEVER use: "In today's world", "As a founder", "Game-changer", "Dive into", "Leverage", "Delve"
- LinkedIn posts only: short paragraphs (1-3 lines max), line breaks between paragraphs, max 3000 chars`
}

// ─── Persona Generation ─────────────────────────────────────────────────────
export function buildPersonaPrompt(data: {
  name: string
  description: string
  target_audience: string
  industry: string[]
  stage: string
  founder_goal: string
  founder_personality: string
  keywords?: string[]
}): string {
  return `A founder just completed onboarding for a LinkedIn brand tool. Based on their info, generate:
1. A one-sentence founder persona statement (their brand identity)
2. Exactly 3 content pillars (topic categories for their LinkedIn posts)

Founder info:
- Company: ${data.name} — ${data.description}
- Audience: ${data.target_audience}
- Industry: ${data.industry.join(', ')}
- Stage: ${data.stage}
- Goal: ${data.founder_goal.replace('_', ' ')}
- Personality: ${data.founder_personality}
${data.keywords?.length ? `- Keywords: ${data.keywords.join(', ')}` : ''}

Return EXACTLY this format, nothing else:
<persona>
[One sentence. Starts with "The". E.g. "The technical builder who turns startup chaos into honest build-in-public insights for developers and early adopters."]
</persona>

<pillars>
[Pillar 1 — 2-4 words, e.g. "Build in public"]
[Pillar 2 — 2-4 words]
[Pillar 3 — 2-4 words]
</pillars>`
}

// ─── Post Generation (3 variations) ────────────────────────────────────────
export function buildPostPrompt(topic: string): string {
  return `Write 3 LinkedIn post variations about this topic: "${topic}"

Return EXACTLY this format, no other text:

<safe>
[Hook line — professional, builds authority]

[Body — 130-180 words, safe take, ends with insight or CTA]
</safe>

<bold>
[Hook line — stronger opinion, clear stance]

[Body — 130-180 words, takes a side, might polarize slightly]
</bold>

<controversial>
[Hook line — challenges a common belief]

[Body — 130-180 words, starts a debate, respectfully provocative]
</controversial>

Rules:
- Each variation must start with a scroll-stopping first line (the hook)
- Short paragraphs, 1-3 lines each, blank line between paragraphs
- No bullet points unless it genuinely needs a list
- End with a question or a strong closing line
- Do NOT use the same opening words across variations`
}

// ─── Refine Post ────────────────────────────────────────────────────────────
export function buildRefinePrompt(
  post: string,
  refinement: 'too_formal' | 'too_generic' | 'too_long' | 'too_ai',
  companyName: string,
  stage: string
): string {
  const instructions: Record<string, string> = {
    too_formal: 'Use contractions. Cut corporate words. Write like a person texting a smart friend. Keep the ideas, lose the stiffness.',
    too_generic: `Make it more specific to this founder. Reference their company (${companyName}), their stage (${stage}), their actual experience. Replace any claim that could apply to anyone with something only this founder could say.`,
    too_long: 'Cut to under 120 words. Keep the hook, keep the single best insight, cut everything else. No filler.',
    too_ai: `This post sounds AI-generated. Rewrite it so it sounds unmistakably human. Specific fixes: remove all transitional phrases like "In conclusion", "It\'s important to note", "This is a reminder that". Add one rough edge — an unfinished thought, a specific number that\'s oddly precise, a sentence fragment used intentionally. Use the founder\'s company name (${companyName}) and a real detail that feels lived-in. Vary sentence length dramatically. Make it sound like a person who types fast and knows exactly what they mean.`,
  }

  return `Refine this LinkedIn post. The founder says it feels: "${refinement.replace('_', ' ')}"

CURRENT POST:
"""
${post}
"""

Instruction: ${instructions[refinement]}

Return ONLY the refined post. No labels, no explanation, no preamble.`
}

// ─── Comment Generation ─────────────────────────────────────────────────────
export function buildCommentPrompt(sourcePost: string): string {
  return `Generate 3 LinkedIn comments on this post. Each must feel natural, human, and genuinely valuable.

POST:
"""
${sourcePost}
"""

Return EXACTLY this format:

<insightful>
[2-3 sentences. Adds a real perspective or data point. References something SPECIFIC from the post. Not generic.]
</insightful>

<curious>
[2-3 sentences. Asks a genuinely thoughtful question about a specific point in the post. Shows you actually read it.]
</curious>

<bold>
[2-3 sentences. Respectful disagreement or a strong take. Polite but direct. Adds tension that sparks discussion.]
</bold>

Rules:
- NEVER start with "Great post!", "Love this!", "This is so true", or any praise opener
- NEVER mention the commenter's company by name
- Reference something specific from the post — a word, a claim, a number
- Max 80 words per comment
- Sound like a thoughtful person, not a marketing bot`
}

// ─── Rewrite Draft ──────────────────────────────────────────────────────────
export function buildRewritePrompt(draft: string): string {
  return `Rewrite this founder's rough draft into a clean, postable LinkedIn post.
Preserve their core idea and voice — improve structure and clarity only.

DRAFT:
"""
${draft}
"""

Return EXACTLY this format:

<hooks>
[Hook option 1 — direct story opener]
||
[Hook option 2 — bold claim or insight]
||
[Hook option 3 — question or counterintuitive take]
</hooks>

<rewritten>
[Full rewritten post using Hook option 1 as the opening. 130-180 words. Short paragraphs. Their ideas, better structure. End with a question or strong CTA.]
</rewritten>

Rules:
- Keep the founder's ideas and intent — don't change what they're saying, only how they say it
- The rewritten post should use Hook option 1 as its opening line
- User can swap to Hook option 2 or 3 without regenerating the body`
}

// ─── Parse helpers ──────────────────────────────────────────────────────────
export function parseTag(content: string, tag: string): string {
  const match = content.match(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`))
  return match?.[0]?.replace(`<${tag}>`, '').replace(`</${tag}>`, '').trim() ?? ''
}

export function parsePersona(content: string) {
  return {
    persona_statement: parseTag(content, 'persona'),
    content_pillars: parseTag(content, 'pillars')
      .split('\n')
      .map((l: string) => l.replace(/^\[|\]$/g, '').trim())
      .filter(Boolean)
      .slice(0, 3),
  }
}

export function parsePostVariations(content: string) {
  return {
    variation_safe: parseTag(content, 'safe'),
    variation_bold: parseTag(content, 'bold'),
    variation_controversial: parseTag(content, 'controversial'),
  }
}

export function parseComments(content: string) {
  return {
    comment_insightful: parseTag(content, 'insightful'),
    comment_curious: parseTag(content, 'curious'),
    comment_bold: parseTag(content, 'bold'),
  }
}

export function parseRewrite(content: string) {
  const hooksRaw = parseTag(content, 'hooks')
  const hooks = hooksRaw.split('||').map((h: string) => h.trim()).filter(Boolean)
  return {
    hooks,
    rewritten: parseTag(content, 'rewritten'),
  }
}

// ─── Structure / Hook rotation pools ────────────────────────────────────────
export const POST_STRUCTURES = [
  'Problem → Lesson',
  'Story → Insight',
  'Contrarian Take',
  'Behind the scenes',
  'Milestone reflection',
  'List with narrative',
  'Confession → Recovery',
]

export const HOOK_TYPES = [
  'Question',
  'Bold claim',
  'Story opener',
  'Specific number or stat',
  'Counterintuitive',
  'Confession',
]

export function pickRotation(pool: string[], recentlyUsed: string[]): string {
  const available = pool.filter(item => !recentlyUsed.includes(item))
  const from = available.length > 0 ? available : pool
  return from[Math.floor(Math.random() * from.length)]
}
