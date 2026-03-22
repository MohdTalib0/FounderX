export interface PersonaFeature {
  title: string
  body: string
}

export interface PersonaTestimonialMock {
  quote: string
  name: string
  role: string
}

export interface PersonaData {
  slug: string
  label: string
  metaTitle: string
  metaDescription: string
  badge: string
  headline: string
  subheadline: string
  intro: string
  painPoints: string[]
  features: PersonaFeature[]
  howItWorks: { step: number; title: string; body: string }[]
  cta: string
  ctaSub: string
}

export const personas: PersonaData[] = [
  // ── Founders ─────────────────────────────────────────────────────────────────
  {
    slug: 'founders',
    label: 'Founders',
    metaTitle: 'Wrively for Founders: LinkedIn Posts That Sound Like You',
    metaDescription: 'Wrively is the LinkedIn Voice Layer built for founders. Stop staring at a blank page. Build your voice in 4 questions and post consistently in under 3 minutes.',
    badge: 'For startup founders',
    headline: 'You built a company. Now build the audience that makes it matter.',
    subheadline: 'Investors, early users, and future hires are on LinkedIn every day. Wrively writes your posts so you show up consistently - in your voice, not a template.',
    intro: 'Founders know they should post on LinkedIn. They don\'t. Not because they have nothing to say - they have more to say than anyone. Because every time they open a blank text box, the output doesn\'t sound like them. So they don\'t post it. The week becomes a month. The month becomes a quarter. Wrively solves the identity problem, not the idea problem.',
    painPoints: [
      'You tried ChatGPT. The posts sounded like a LinkedIn influencer, not a founder.',
      'You have things to say but no time to turn them into posts you\'re proud of.',
      'You know LinkedIn matters for fundraising, hiring, and distribution — but you\'re not on it.',
      'You\'ve posted a few times, got weak results, and quietly stopped.',
    ],
    features: [
      {
        title: 'Voice Layer built from your founder context',
        body: 'Four questions at setup: your startup, your stage, your audience, your personality. Wrively builds a model of you — not a generic founder, you specifically. Every post generates from it.',
      },
      {
        title: 'Stage-aware content',
        body: 'Idea stage content is different from MVP stage content is different from scale stage content. Wrively knows where you are and writes accordingly. You don\'t have to explain your context every session.',
      },
      {
        title: 'Safe, Bold, and Contrarian — every time',
        body: 'Three variations of every post. Safe builds credibility. Bold drives follows. Contrarian starts conversations. Pick the one that fits the day. All three are in your voice.',
      },
      {
        title: 'Rough notes to post-ready in seconds',
        body: 'Had a customer call that changed your thinking? A launch that didn\'t go as planned? Paste your messy notes. Wrively turns them into something postable without losing your original insight.',
      },
      {
        title: 'Smart comment suggestions',
        body: 'Engaging with investors and potential hires is part of the game. Paste any post, get three quality comments in your voice. No more generic "great insight!" replies.',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Build your Voice Layer in 4 questions',
        body: 'Your startup, stage, audience, and personality. Two minutes. Wrively generates your founder persona and your first post before you leave the setup screen.',
      },
      {
        step: 2,
        title: 'Pick a topic, get 3 variations',
        body: 'Open the app, choose a topic or use today\'s suggestion. Three posts in your voice appear in seconds. Safe, Bold, Contrarian.',
      },
      {
        step: 3,
        title: 'Copy, paste, post',
        body: 'One click to copy. Paste into LinkedIn. Under 3 minutes start to finish. The habit compounds — 52 posts a year beats 0.',
      },
    ],
    cta: 'Build my founder voice',
    ctaSub: 'Free to start. No credit card. 4 questions, 2 minutes.',
  },

  // ── Consultants ───────────────────────────────────────────────────────────────
  {
    slug: 'consultants',
    label: 'Consultants',
    metaTitle: 'Wrively for Consultants — LinkedIn Content That Builds Inbound',
    metaDescription: 'Wrively helps independent consultants build a LinkedIn presence that generates inbound leads. Write in your voice consistently without spending hours on content.',
    badge: 'For independent consultants',
    headline: 'Your next client is on LinkedIn. They just don\'t know you exist yet.',
    subheadline: 'Consultants who post consistently get found. Wrively makes consistent posting possible — in your voice, on your expertise, without the content grind.',
    intro: 'For consultants, LinkedIn is not optional. It\'s your pipeline. Every post is a chance to demonstrate expertise to the exact people who hire consultants. But posting consistently is hard when you\'re billing hours, managing clients, and running a business by yourself. Wrively removes the friction so you can show up every week without it taking your whole morning.',
    painPoints: [
      'You know your expertise is valuable but you struggle to turn it into posts that don\'t sound like a press release.',
      'You spend an hour on a post, delete half of it, and still aren\'t happy with what\'s left.',
      'Your competitors are posting consistently and getting inquiries. You\'re not posting.',
      'You\'ve tried AI writing tools — the output is generic and doesn\'t reflect how you actually think.',
    ],
    features: [
      {
        title: 'Voice Layer built around your expertise',
        body: 'You define your niche, your target clients, and how you communicate. Wrively builds a model of your consulting voice and writes every post from it — not from a generic professional template.',
      },
      {
        title: 'Insight posts that demonstrate expertise',
        body: 'The posts that get consultants hired are not "here\'s my service" posts. They\'re posts that demonstrate thinking. Wrively generates posts around your frameworks, your lessons, your takes on your industry.',
      },
      {
        title: 'Rewrite your messy client insights',
        body: 'You have insights from client work every week. Paste your rough notes from a project, a debrief, or a pattern you noticed. Wrively turns them into a post worth sharing — without the client details you can\'t share.',
      },
      {
        title: 'Comments that build relationships',
        body: 'The fastest way to get known by your ideal clients is to add value in their comments. Wrively generates specific, insightful comments in your voice — not "great point!" but something they actually remember.',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Set up your consulting voice',
        body: 'Tell Wrively who you consult for, what you specialize in, and how you communicate. Your voice layer is built in under 2 minutes.',
      },
      {
        step: 2,
        title: 'Get posts from your expertise',
        body: 'Wrively generates posts that reflect your actual thinking on your niche — not generic business advice. Three variations, your tone, your angle.',
      },
      {
        step: 3,
        title: 'Post, engage, get found',
        body: 'Consistent posting builds visibility. Wrively keeps you consistent without the time cost. Over time, the right people find you.',
      },
    ],
    cta: 'Build my consulting voice',
    ctaSub: 'Free to start. No credit card. 2-minute setup.',
  },

  // ── Executives ────────────────────────────────────────────────────────────────
  {
    slug: 'executives',
    label: 'Executives',
    metaTitle: 'Wrively for Executives — LinkedIn Thought Leadership Without the Ghostwriter',
    metaDescription: 'Wrively helps executives build a LinkedIn presence that sounds like them — not a PR team. Share your perspective consistently without the time cost.',
    badge: 'For executives and leaders',
    headline: 'Your perspective has value. LinkedIn is where it compounds.',
    subheadline: 'Executives who share their thinking on LinkedIn attract talent, build reputation, and shape their industry. Wrively makes it sustainable without a ghostwriter.',
    intro: 'The best executive LinkedIn content doesn\'t sound like a press release. It sounds like a person with genuine experience and real opinions. The problem is that the time and cognitive load of producing that content consistently is high — and the output from generic AI tools is exactly the corporate-sounding content you\'re trying to avoid. Wrively writes in your voice, not in a version of executive-speak.',
    painPoints: [
      'You have opinions and experience worth sharing, but every draft you write sounds too formal or too corporate.',
      'Hiring a ghostwriter costs thousands per month and the output still needs heavy editing.',
      'Your comms team produces press releases, not authentic posts. They sound nothing like you.',
      'You know your visibility matters for attracting talent and shaping your industry, but you don\'t post.',
    ],
    features: [
      {
        title: 'Your voice, not executive template voice',
        body: 'Wrively builds a model of how you think, not how executives in general communicate. Your specific perspective, your specific tone, your specific way of framing an argument.',
      },
      {
        title: 'Opinion posts without the risk',
        body: 'Safe, Bold, and Contrarian variations of every post. The Safe version is credibility-first. When you want to take a stronger stance, Bold and Contrarian are ready. You choose the risk level for each post.',
      },
      {
        title: 'Turn your thinking into structured posts',
        body: 'You have frameworks and observations from years of experience. They\'re often in your head, not on a page. Paste your rough thinking. Wrively structures it into a post people will actually read.',
      },
      {
        title: 'Under 3 minutes per post',
        body: 'Your time is the scarcest thing you have. Wrively\'s design is built around one constraint: the total time from opening the app to having a post ready to copy must be under 3 minutes.',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Define your executive voice',
        body: 'Your industry, your role, your audience, and the personality that best reflects how you communicate. Wrively builds your Voice Layer in 2 minutes.',
      },
      {
        step: 2,
        title: 'Generate posts from your perspective',
        body: 'Choose a topic from your content pillars or enter your own. Three posts appear in your voice — not in generic leadership speak.',
      },
      {
        step: 3,
        title: 'Approve, copy, post',
        body: 'You retain full control. Every post goes through you before it goes anywhere. Wrively just removes the blank page.',
      },
    ],
    cta: 'Build my executive voice',
    ctaSub: 'Free to start. No credit card. 2-minute setup.',
  },

  // ── Solopreneurs ──────────────────────────────────────────────────────────────
  {
    slug: 'solopreneurs',
    label: 'Solopreneurs',
    metaTitle: 'Wrively for Solopreneurs — LinkedIn Content That Grows Your One-Person Business',
    metaDescription: 'Wrively helps solopreneurs build a LinkedIn audience without a team or a content budget. Your voice, your expertise, posted consistently in under 3 minutes.',
    badge: 'For solopreneurs',
    headline: 'You are the brand. Show up like it.',
    subheadline: 'Solopreneurs who post consistently grow faster — more clients, more visibility, more opportunities. Wrively makes consistency possible when you\'re running everything yourself.',
    intro: 'Running a one-person business means every hour counts twice. You can\'t hire a content team. You can\'t spend three hours a week on LinkedIn posts. But you also can\'t afford to be invisible. Wrively gives you a sustainable posting system — posts in your voice, in under 3 minutes, that build the audience your business needs without consuming the time your work requires.',
    painPoints: [
      'You\'re doing everything yourself. Content keeps falling to the bottom of the list.',
      'You know LinkedIn could grow your business but you can\'t justify the time it takes.',
      'The AI tools you\'ve tried produce posts that sound like everyone else on LinkedIn.',
      'You start writing, spend 45 minutes, end up with something you\'re not proud of, and don\'t post it.',
    ],
    features: [
      {
        title: 'One voice layer, everything comes from it',
        body: 'Set it up once. Your niche, your style, your audience, your goals. Every post Wrively generates flows from that model. You never explain yourself to the AI again.',
      },
      {
        title: 'Three minutes is all it takes',
        body: 'Open the app. Pick a topic. Copy the post you like. Close the app. The habit doesn\'t have to compete with running your business.',
      },
      {
        title: 'Ideas you already have, posts you\'ll actually use',
        body: 'Your best content is the stuff you already know from doing the work. Paste your rough observations, notes, or lessons. Wrively shapes them into something worth posting.',
      },
      {
        title: 'Free plan that matches the habit',
        body: '12 posts per month on the free plan — exactly enough for the 3x/week posting habit that LinkedIn rewards. No credit card. No trial that expires.',
      },
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Set up your Voice Layer once',
        body: 'What you do, who you help, how you sound. 4 questions, 2 minutes. Done. Your persona is built and your first post is ready before you leave the screen.',
      },
      {
        step: 2,
        title: 'Post in your voice in under 3 minutes',
        body: 'Open Wrively, pick today\'s topic or use the suggestion, copy the variation that feels right. That\'s the whole workflow.',
      },
      {
        step: 3,
        title: 'Let the audience compound',
        body: '52 posts a year beats 0. The solopreneurs who win on LinkedIn aren\'t posting better content — they\'re posting more consistently. Wrively makes consistency the easy choice.',
      },
    ],
    cta: 'Build my solopreneur voice',
    ctaSub: 'Free to start. No credit card. 4 questions, 2 minutes.',
  },
]

export function getPersona(slug: string): PersonaData | undefined {
  return personas.find(p => p.slug === slug)
}
