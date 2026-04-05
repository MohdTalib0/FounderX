// Shared prompt builders and parsers for all edge functions

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
  is_individual?: boolean
  voice_samples?: string[] | null
  voice_profile?: Record<string, unknown> | null
}

// Stage values are reused for individual role encoding
const INDIVIDUAL_ROLE_MAP: Record<string, string> = {
  idea: 'Founder',
  live: 'Consultant',
  scale: 'Executive',
  mvp: 'Creator',
}

// ─── Brand Context Block ────────────────────────────────────────────────────
export function buildBrandContext(company: CompanyContext, extras?: {
  postStructure?: string
  hookType?: string
  performanceSummary?: string
}): string {
  const personalityMap: Record<string, string> = {
    builder: 'casual, direct, technical when needed. Raw progress over polish',
    storyteller: 'narrative-driven, warm, turns experiences into lessons',
    analyst: 'structured, data-informed, framework-first',
    contrarian: 'bold, opinionated, challenges conventional wisdom respectfully',
  }

  const toneGuide: Record<string, string> = {
    professional: 'Use clear, measured language. No slang. Sound like a senior operator writing to a smart peer.',
    casual: 'Conversational and direct. Write like you talk. Contractions, short sentences, natural rhythm.',
    bold: 'Provocative and high-energy. Strong opinions. Punchy sentences. Not afraid to be polarizing.',
    educational: 'Structured and insightful. Teach something. Use frameworks, numbered insights, clear takeaways.',
  }

  const personalityVoice = personalityMap[company.founder_personality] ?? 'authentic and direct'
  const toneInstruction = toneGuide[company.tone ?? 'casual'] ?? toneGuide.casual

  const goalContext: Record<string, string> = {
    get_users: 'getting early users and proving traction. Posts should reflect someone in the trenches of early growth.',
    build_audience: 'building an audience and becoming a voice in their space. Posts should establish authority and invite engagement.',
    raise_funds: 'raising funding and building investor awareness. Posts should demonstrate insight, traction, and founder credibility.',
    hire: 'attracting talent and building a team. Posts should showcase the mission, culture, and why this company is worth joining.',
  }

  const stageContext: Record<string, string> = {
    idea: 'pre-product, exploring the problem space',
    mvp: 'building their first version, talking to early users',
    live: 'live with real users, focused on growth and retention',
    scale: 'scaling, hiring, and expanding what works',
  }

  const persona = company.persona_statement ?? 'A founder building in public'
  const brandLine = company.is_individual
    ? `${company.name} (individual). ${company.description}`
    : `${company.name}: ${company.description}`
  const roleOrStage = company.is_individual
    ? `Role: ${INDIVIDUAL_ROLE_MAP[company.stage] ?? company.stage}`
    : `Stage: ${company.stage} (${stageContext[company.stage] ?? company.stage})`

  return `You are a LinkedIn ghostwriter for ONE specific person. You write ONLY as them, in first person.

WHO YOU ARE WRITING AS:
"${persona}"

This is their identity. Every post must sound like it came from this specific person, not from a generic founder.

GROUNDING FACTS (use these to make posts specific — reference them naturally):
- Brand: ${brandLine}
- Audience: ${company.target_audience}
- Industry: ${company.industry.join(', ')}
- ${roleOrStage}
- Focus: ${goalContext[company.founder_goal] ?? company.founder_goal.replace('_', ' ')}
${company.content_pillars?.length ? `- Content pillars (angle posts toward these when relevant): ${company.content_pillars.join(', ')}` : ''}
${company.keywords?.length ? `- Voice keywords: ${company.keywords.join(', ')}` : ''}

VOICE:
- Personality: ${personalityVoice}
- Tone: ${toneInstruction}
${extras?.postStructure ? `\nPOST STRUCTURE THIS TIME: ${extras.postStructure}` : ''}
${extras?.hookType ? `\nHOOK TYPE THIS TIME: ${extras.hookType}` : ''}
${extras?.performanceSummary ? `\nCONTENT SIGNAL HISTORY:\n${extras.performanceSummary}` : ''}

${company.voice_samples?.length ? `
VOICE REFERENCE (this is the founder's actual writing — match this tone, rhythm, and style):
"""
${company.voice_samples[0]}
"""
` : ''}
RULES:
- Write as this person, first person. Not as an AI assistant.
- EVERY post MUST include at least one detail specific to THIS person: their company name, product, industry, stage, or a situation only they would describe. A post that any founder could copy-paste is INVALID.
- Sound human. Contractions, rough edges, occasional sentence fragments are good.
- NEVER use: "In today's world", "As a founder", "Game-changer", "Dive into", "Leverage", "Delve", "Key takeaway", "At the end of the day", "It's important to note"
- NEVER use em dashes. Use commas, periods, or colons instead.
- LinkedIn format: short paragraphs (1-3 lines max), line breaks between paragraphs, max 3000 chars`
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
  is_individual?: boolean
}): string {
  const roleOrStage = data.is_individual
    ? `Role: ${INDIVIDUAL_ROLE_MAP[data.stage] ?? data.stage}`
    : `Stage: ${data.stage}`

  const subjectLine = data.is_individual
    ? `- Name: ${data.name} (individual, building personal brand)\n- About: ${data.description}`
    : `- Company: ${data.name}: ${data.description}`

  const intro = data.is_individual
    ? 'An individual professional just completed onboarding for a LinkedIn personal brand tool.'
    : 'A founder just completed onboarding for a LinkedIn brand tool.'

  return `${intro} Based on their info, generate:
1. A one-sentence personal brand statement (their brand identity)
2. Exactly 3 content pillars (topic categories for their LinkedIn posts)

Info:
${subjectLine}
- Audience: ${data.target_audience}
- Industry: ${data.industry.join(', ')}
- ${roleOrStage}
- Goal: ${data.founder_goal.replace('_', ' ')}
- Personality: ${data.founder_personality}
${data.keywords?.length ? `- Keywords: ${data.keywords.join(', ')}` : ''}

Return EXACTLY this format, nothing else:
<persona>
[One sentence. Starts with "The". E.g. "The technical builder who turns startup chaos into honest build-in-public insights for developers and early adopters."]
</persona>

<pillars>
[Pillar 1, 2-4 words, e.g. "Build in public"]
[Pillar 2, 2-4 words]
[Pillar 3, 2-4 words]
</pillars>`
}

// ─── Post Generation (3 variations) ────────────────────────────────────────
export function buildPostPrompt(topic: string): string {
  return `Using the founder context above, write EXACTLY 3 LinkedIn post variations about this topic: "${topic}"

You MUST include ALL THREE sections: SAFE, BOLD, and DEBATE.
If any section is missing, the response is invalid.

VARIATION RULE:
- SAFE = educational, authority-building, no controversy
- BOLD = strong opinion, takes a clear side, slightly polarizing
- DEBATE = challenges a widely-held belief, some readers will disagree
Each variation must feel fundamentally different in angle, not just wording.

Return EXACTLY this format:

SAFE:
[Hook line]

[Body: 130-180 words]

BOLD:
[Hook line]

[Body: 130-180 words]

DEBATE:
[Hook line]

[Body: 130-180 words]

HARD RULES:
- Each variation MUST be 130-180 words. Count them. Do NOT submit under 130 words.
- Each variation MUST mention the founder's company/product by name, or describe a specific situation from their stage. "We just hit our first 100 users" is specific. "Growth is important" is not.
- Each variation MUST include at least ONE real specific detail: a number, a situation, a mistake, or a concrete moment tied to THIS founder's context.
- A post that could be copy-pasted by any founder in any industry is INVALID. Rewrite it.
- Write EXACTLY 3 variations. Not 2. Not 4.

STYLE RULES:
- Short paragraphs, 1-3 lines each, blank line between paragraphs
- NEVER start with: "I still remember", "The truth is", "When I started", "In the early days"
- No vague advice like "consistency is key" or "authenticity matters" or "it's a marathon not a sprint"
- Do NOT repeat opening phrases across variations
- Do NOT reuse the same story, example, or situation across variations
- End each variation with a question or strong closing line
- Reference the founder's stage naturally (e.g. "we're still pre-revenue" or "after launching 3 months ago")

DEBATE RULE:
- Must take a stance that some people will disagree with
- Must NOT be neutral
- Bad output example: "Everyone has different opinions on growth" (neutral, INVALID)
- Good output example: "Most growth advice is wrong for early-stage founders" (takes a stance)`
}

// ─── Refine Post ────────────────────────────────────────────────────────────
export function buildRefinePrompt(
  post: string,
  refinement: 'too_formal' | 'too_generic' | 'too_long' | 'too_ai',
  companyName: string,
  stage: string,
  context?: { persona?: string; audience?: string; industry?: string[] }
): string {
  const audienceNote = context?.audience ? ` Their audience is ${context.audience}.` : ''
  const industryNote = context?.industry?.length ? ` Industry: ${context.industry.join(', ')}.` : ''
  const personaNote = context?.persona ? ` Their persona: "${context.persona}".` : ''

  const instructions: Record<string, string> = {
    too_formal: 'Use contractions. Cut corporate words. Write like a person texting a smart friend. Keep the ideas, lose the stiffness. Add one sentence fragment or rough edge.',
    too_generic: `Make it more specific to this founder. Reference their company (${companyName}), their stage (${stage}), their actual experience.${audienceNote}${industryNote} Replace any claim that could apply to anyone with something only this founder could say. Add a concrete detail: a number, a customer interaction, a specific mistake.`,
    too_long: 'Cut to under 120 words. Keep the hook, keep the single best insight, cut everything else. No filler.',
    too_ai: `This post sounds AI-generated. Rewrite it so it sounds unmistakably human.${personaNote} Specific fixes: remove all transitional phrases like "In conclusion", "It\'s important to note", "This is a reminder that". Add one rough edge: an unfinished thought, a specific number that\'s oddly precise, a sentence fragment used intentionally. Use the founder\'s company name (${companyName}) and a real detail about their ${stage}-stage experience. Vary sentence length dramatically. Make it sound like a person who types fast and knows exactly what they mean.`,
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
export function buildCommentPrompt(sourcePost: string, context?: { persona?: string; industry?: string[] }): string {
  const personaLine = context?.persona
    ? `\nYou are commenting as: "${context.persona}". Let your expertise and perspective shape the comments.`
    : ''
  const industryLine = context?.industry?.length
    ? `\nYour domain expertise: ${context.industry.join(', ')}. Use this lens when adding perspective.`
    : ''

  return `Generate 3 LinkedIn comments on this post. Each must feel natural, human, and genuinely valuable.${personaLine}${industryLine}

POST:
"""
${sourcePost}
"""

Return EXACTLY this format:

<insightful>
[2-3 sentences. Adds a real perspective or data point from YOUR experience. References something SPECIFIC from the post. Not generic.]
</insightful>

<curious>
[2-3 sentences. Asks a genuinely thoughtful question about a specific point in the post. Shows you actually read it and thought about it.]
</curious>

<bold>
[2-3 sentences. Respectful disagreement or a strong take from your own experience. Polite but direct. Adds tension that sparks discussion.]
</bold>

Rules:
- NEVER start with "Great post!", "Love this!", "This is so true", or any praise opener
- NEVER mention the commenter's company by name
- Reference something specific from the post: a word, a claim, a number
- Draw from your own domain expertise to add real value
- Max 80 words per comment
- Sound like a thoughtful person, not a marketing bot`
}

// ─── Rewrite Draft ──────────────────────────────────────────────────────────
export function buildRewritePrompt(draft: string, context?: { persona?: string; companyName?: string }): string {
  const voiceLine = context?.persona
    ? `\nThe founder's voice: "${context.persona}". Preserve this identity in the rewrite.`
    : ''
  const companyLine = context?.companyName
    ? `\nTheir company: ${context.companyName}. Keep any references to their specific work.`
    : ''

  return `Rewrite this founder's rough draft into a clean, postable LinkedIn post.
Preserve their core idea, specific details, and voice. Improve structure and clarity only.${voiceLine}${companyLine}

DRAFT:
"""
${draft}
"""

Return EXACTLY this format:

<hooks>
[Hook option 1: direct story opener]
||
[Hook option 2: bold claim or insight]
||
[Hook option 3: question or counterintuitive take]
</hooks>

<rewritten>
[Full rewritten post using Hook option 1 as the opening. 130-180 words. Short paragraphs. Their ideas, better structure. End with a question or strong CTA.]
</rewritten>

Rules:
- Keep the founder's ideas, intent, and any specific details (names, numbers, situations). Don't change what they're saying, only how they say it
- If the draft mentions their company, product, or a real experience, keep those references
- The rewritten post should use Hook option 1 as its opening line
- User can swap to Hook option 2 or 3 without regenerating the body`
}

// ─── Parse helpers ──────────────────────────────────────────────────────────
export function parseTag(content: string, tag: string): string {
  const match = content.match(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`))
  return match?.[0]?.replace(`<${tag}>`, '').replace(`</${tag}>`, '').trim() ?? ''
}

// Label-based parser for post variations (more reliable than XML with open-source models)
export function parseSection(content: string, label: string): string {
  // Normalize: strip markdown markers from label lines only (e.g. **SAFE:** -> SAFE:)
  const normalized = content.replace(/\*{1,2}([A-Za-z]+):\*{0,2}/g, '$1:')
  // Case-insensitive match so "Debate:" and "DEBATE:" both work
  const regex = new RegExp(`(?:^|\\n)${label}:\\s*([\\s\\S]*?)(?=\\n[A-Za-z]+:|$)`, 'i')
  const match = normalized.match(regex)
  return match?.[1]?.trim() ?? ''
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
    variation_safe: parseSection(content, 'SAFE'),
    variation_bold: parseSection(content, 'BOLD'),
    variation_controversial: parseSection(content, 'DEBATE'),
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

// ─── Remix a Post ────────────────────────────────────────────────────────────
export function buildRemixPrompt(sourcePost: string, personaStatement: string, companyName: string, description: string): string {
  return `Analyze this viral LinkedIn post and then write an adapted version for our founder.

VIRAL POST:
"""
${sourcePost}
"""

FOUNDER PERSONA: ${personaStatement}
COMPANY: ${companyName}: ${description}

Return EXACTLY this format, nothing else:

<analysis>
Structure: [e.g. "Problem → Stakes → Twist → Lesson"]
Hook type: [e.g. "Counterintuitive claim"]
Tone: [e.g. "Vulnerable + authoritative"]
Why it works: [1 sentence, what makes it scroll-stopping]
</analysis>

<adapted>
[Full post in the founder's voice, using the same structure but their context and company.
Replace all specific details with the founder's own experience.
130-200 words. Short paragraphs. End with a question or strong CTA.]
</adapted>

Rules:
- The adapted version must use the SAME structure as the original
- Replace every concrete detail (numbers, company names, situations) with the founder's own context
- The result should not be recognisable as derivative of the original
- Do NOT start with "I". Vary the opening`
}

export function parseRemix(content: string) {
  const analysisRaw = parseTag(content, 'analysis')
  const adapted_version = parseTag(content, 'adapted')

  const get = (label: string) => {
    const match = analysisRaw.match(new RegExp(`${label}:\\s*(.+)`))
    return match?.[1]?.trim() ?? ''
  }

  return {
    structure: get('Structure'),
    hook_type: get('Hook type'),
    tone: get('Tone'),
    why_it_works: get('Why it works'),
    adapted_version,
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
