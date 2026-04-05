export interface ComparisonRow {
  feature: string
  wrively: string | boolean
  competitor: string | boolean
  wrivelySub?: string   // optional clarifying note under the Wrively cell
}

export interface ComparisonData {
  slug: string
  competitorName: string
  competitorTagline: string   // how they describe themselves
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  intro: string
  whoSwitches: string         // one sentence on the typical switcher
  wrivelySummary: string
  competitorSummary: string
  table: ComparisonRow[]
  switchReasons: {
    title: string
    body: string
  }[]
  quote?: {
    text: string
    name: string
    role: string
  }
  faq: {
    q: string
    a: string
  }[]
}

export const comparisons: ComparisonData[] = [
  // ── Taplio ───────────────────────────────────────────────────────────────────
  {
    slug: 'taplio-alternative',
    competitorName: 'Taplio',
    competitorTagline: 'LinkedIn scheduling and analytics platform',
    metaTitle: 'Wrively vs Taplio • The Taplio Alternative Built for Founder Voice',
    metaDescription: 'Looking for a Taplio alternative? Wrively skips the scheduler and focuses on what actually makes LinkedIn work: posts that sound like you. Compare features, pricing, and use cases.',
    headline: 'A Taplio alternative that writes in your voice, not a template.',
    subheadline: 'Taplio schedules. Wrively writes. If your posts don\'t sound like you, no scheduler fixes that.',
    intro: 'Taplio is a solid LinkedIn scheduling and analytics tool. If you need a content calendar, auto-posting, and engagement pod features, it covers those well. But most founders who try Taplio hit the same wall: the writing still feels like work. The scheduler is only useful if the content is worth scheduling.',
    whoSwitches: 'Founders who signed up for Taplio, saw the scheduling dashboard, and realized they still had no idea what to write or how to make it sound like them.',
    wrivelySummary: 'Wrively builds a Voice Layer from your onboarding answers - your stage, your audience, your personality, how you think about your work. Every post it generates comes from that model. You never start from a blank page and you never get output that sounds like it was written for someone else.',
    competitorSummary: 'Taplio is primarily a LinkedIn scheduling and CRM tool. It has AI writing features but they are not voice-trained - they generate LinkedIn-style content, not your-voice content. The core product is built around scheduling queues, engagement pods, and profile analytics.',
    table: [
      { feature: 'AI post generation',         wrively: true,            competitor: true,  wrivelySub: 'Voice-trained to you', },
      { feature: 'Writes in your personal voice', wrively: true,         competitor: false, },
      { feature: 'Voice Layer setup (onboarding)', wrively: true,        competitor: false, },
      { feature: 'Safe / Bold / Contrarian variations', wrively: true,   competitor: false, },
      { feature: 'Draft rewrite tool',          wrively: true,           competitor: false, },
      { feature: 'Smart comment suggestions',   wrively: true,           competitor: false, },
      { feature: 'Post scheduling',             wrively: false,          competitor: true,  },
      { feature: 'Auto-posting to LinkedIn',    wrively: false,          competitor: true,  },
      { feature: 'Engagement pods',             wrively: false,          competitor: true,  },
      { feature: 'LinkedIn analytics',          wrively: false,          competitor: true,  },
      { feature: 'Free plan available',         wrively: true,           competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',              wrively: '$0 / $9 / $19', competitor: '$39+/mo', },
      { feature: 'No credit card to start',     wrively: true,           competitor: false, },
    ],
    switchReasons: [
      {
        title: 'You need the writing solved, not the scheduling',
        body: 'Scheduling a post you\'re not proud of doesn\'t fix anything. Most founders\' LinkedIn problem isn\'t a calendar problem. It\'s a "what do I say and how do I say it" problem. Wrively solves that first.',
      },
      {
        title: 'Your posts keep sounding generic even with Taplio\'s AI',
        body: 'Taplio\'s AI writes LinkedIn posts. Wrively writes your LinkedIn posts. That difference is everything. When the output doesn\'t sound like you, you either rewrite it (more work) or don\'t post it (defeats the purpose).',
      },
      {
        title: 'You\'re a solo founder, not a content team',
        body: 'Taplio is designed for people who manage LinkedIn at scale: agencies, marketing teams, people posting across multiple accounts. If it\'s just you posting as yourself, most of Taplio is overhead you don\'t need.',
      },
      {
        title: 'The price difference is real',
        body: 'Taplio starts at $39/month. Wrively\'s free plan covers 12 posts per month with no credit card. The Starter plan is $9/month. If you\'re an early-stage founder testing whether LinkedIn is worth it, that difference matters.',
      },
    ],
    faq: [
      {
        q: 'Can Wrively replace Taplio completely?',
        a: 'If you primarily use Taplio for scheduling and auto-posting, no. Wrively does not schedule or auto-post. If you use Taplio mainly to generate and organize content, then yes - Wrively covers that with significantly better voice quality.',
      },
      {
        q: 'Does Wrively have LinkedIn analytics?',
        a: 'Not in the current version. Wrively tracks what you generate and copy, and learns over time which variation types you prefer. Native LinkedIn analytics (impressions, reach) are only available through tools with LinkedIn API access. That\'s planned for a future version.',
      },
      {
        q: 'How is Wrively\'s AI writing different from Taplio\'s?',
        a: 'Taplio\'s AI generates LinkedIn posts. Wrively builds a Voice Layer during onboarding - your role, stage, personality type, audience, and content pillars - and every post generates from that model. The output is specific to you, not to "a founder in SaaS."',
      },
      {
        q: 'Is there a free trial?',
        a: 'Wrively has a permanent free plan with 12 posts per month, 15 comment suggestions, and 5 draft rewrites. No credit card and no trial period that expires. You can use the free plan indefinitely.',
      },
    ],
  },

  // ── Hypefury ─────────────────────────────────────────────────────────────────
  {
    slug: 'hypefury-alternative',
    competitorName: 'Hypefury',
    competitorTagline: 'Social media scheduling for Twitter/X and LinkedIn',
    metaTitle: 'Wrively vs Hypefury • The Hypefury Alternative That Actually Writes for You',
    metaDescription: 'Comparing Wrively and Hypefury for LinkedIn? Hypefury schedules content. Wrively writes it in your voice. See which one solves the problem you actually have.',
    headline: 'A Hypefury alternative for founders who want better writing, not just a queue.',
    subheadline: 'Hypefury helps you schedule. Wrively helps you have something worth scheduling.',
    intro: 'Hypefury is a popular scheduling tool, primarily built for Twitter/X creators who also post on LinkedIn. If you\'re cross-posting between platforms and want a queue-based workflow, it handles that well. But LinkedIn and Twitter are different platforms with different audiences and different content formats. A tool built around Twitter scheduling is not the same as a tool built around LinkedIn voice.',
    whoSwitches: 'Founders who started with Hypefury for Twitter, added LinkedIn as a secondary channel, and realized their cross-posted content wasn\'t resonating because it wasn\'t written for the LinkedIn audience or format.',
    wrivelySummary: 'Wrively is built exclusively for LinkedIn. Every feature - post generation, draft rewriting, comment suggestions - is designed for how LinkedIn works, how its algorithm distributes content, and how a founder builds credibility on that specific platform. It writes in your voice because it first learns your voice.',
    competitorSummary: 'Hypefury started as a Twitter scheduling tool and expanded to LinkedIn. Its core strength is cross-platform content management, reposting top-performing tweets as LinkedIn posts, and managing a posting queue. The AI writing features are general-purpose and not LinkedIn-specific.',
    table: [
      { feature: 'AI post generation',              wrively: true,             competitor: true,  },
      { feature: 'Built specifically for LinkedIn',  wrively: true,             competitor: false, },
      { feature: 'Voice Layer (learns your style)',  wrively: true,             competitor: false, },
      { feature: 'Safe / Bold / Contrarian variations', wrively: true,          competitor: false, },
      { feature: 'Draft rewrite tool',               wrively: true,             competitor: false, },
      { feature: 'Smart comment suggestions',        wrively: true,             competitor: false, },
      { feature: 'Twitter/X scheduling',             wrively: false,            competitor: true,  },
      { feature: 'LinkedIn scheduling',              wrively: false,            competitor: true,  },
      { feature: 'Cross-platform reposting',         wrively: false,            competitor: true,  },
      { feature: 'Auto-retweet / engagement boost',  wrively: false,            competitor: true,  },
      { feature: 'Free plan available',              wrively: true,             competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',                   wrively: '$0 / $9 / $19',  competitor: '$19+/mo', },
      { feature: 'No credit card to start',          wrively: true,             competitor: false, },
    ],
    switchReasons: [
      {
        title: 'You\'re LinkedIn-first, not Twitter-first',
        body: 'Hypefury is fundamentally a Twitter tool that added LinkedIn. If LinkedIn is your primary platform - where your potential customers, investors, and hires spend time - you want a tool designed from the ground up for how LinkedIn content works.',
      },
      {
        title: 'Cross-posted Twitter content doesn\'t land on LinkedIn',
        body: 'The formats are different. The hook structures are different. The audiences are different. What goes viral on Twitter often reads like noise on LinkedIn. Wrively writes for LinkedIn specifically - the right length, the right format, the right tone for the professional feed.',
      },
      {
        title: 'The writing still feels generic',
        body: 'Hypefury\'s AI generates social posts. It doesn\'t know you\'re a B2B SaaS founder at the MVP stage trying to attract early enterprise customers. Wrively builds that context in upfront and every generation reflects it.',
      },
      {
        title: 'You want 3 tones, not just a rephrasing',
        body: 'Wrively generates Safe, Bold, and Contrarian versions of every post. Three genuinely different angles on the same topic. You pick the one that feels right for the day. Hypefury rewrites posts but doesn\'t produce that kind of intentional variation.',
      },
    ],
    faq: [
      {
        q: 'Does Wrively work for both Twitter and LinkedIn?',
        a: 'Wrively is built for LinkedIn only. The post formats, hook structures, length guidelines, and voice training are all calibrated for LinkedIn\'s algorithm and professional audience. If you need cross-platform scheduling, Hypefury or Buffer are better fits for that specific need.',
      },
      {
        q: 'Can I use both Hypefury and Wrively together?',
        a: 'Yes. Some founders write their LinkedIn content in Wrively, then paste and schedule it through Hypefury or another scheduler. The tools don\'t overlap on the scheduling side, so they pair cleanly.',
      },
      {
        q: 'How long does Wrively\'s onboarding take?',
        a: 'About 2 minutes. Four questions: your company and what it does, your stage, your target audience and LinkedIn goal, and your personality type. From those answers, Wrively builds your Voice Layer and generates your first post before you leave the onboarding screen.',
      },
      {
        q: 'What\'s the difference between Wrively\'s free plan and Hypefury\'s trial?',
        a: 'Wrively\'s free plan is permanent - 12 post generations per month with no expiry date and no credit card required. You can use it indefinitely. Hypefury requires a credit card and runs a 7-day trial before billing starts.',
      },
    ],
  },

  // ── ChatGPT ──────────────────────────────────────────────────────────────────
  {
    slug: 'chatgpt-for-linkedin',
    competitorName: 'ChatGPT',
    competitorTagline: 'General-purpose AI assistant',
    metaTitle: 'Wrively vs ChatGPT for LinkedIn • Why ChatGPT Posts Don\'t Sound Like You',
    metaDescription: 'Using ChatGPT for LinkedIn posts? Here\'s why the output sounds generic - and how Wrively fixes it with a Voice Layer that actually remembers who you are.',
    headline: 'ChatGPT is a blank page. Wrively is a memory.',
    subheadline: 'ChatGPT starts from zero every session. Wrively starts from you - and stays there.',
    intro: 'ChatGPT can write LinkedIn posts. That\'s not the problem. The problem is that it doesn\'t know you. Every time you open it, you\'re a stranger. You brief it, it writes something competent and generic, you edit it into something vaguely resembling your voice, you spend 40 minutes on a post you\'re not fully happy with. Then you do it again next week. That\'s not a posting system. That\'s a different kind of blank page.',
    whoSwitches: 'Founders who have been using ChatGPT for LinkedIn posts, are tired of the output sounding like "a LinkedIn influencer wrote this," and want a tool that actually learns how they think.',
    wrivelySummary: 'Wrively builds a Voice Layer from your onboarding answers - your role, stage, personality, audience, and content pillars. Every post it generates comes from that persistent model. You never explain yourself to it. It already knows you. The output sounds like you because it\'s generated from a model of you, not from a fresh prompt.',
    competitorSummary: 'ChatGPT is a general-purpose AI assistant. It\'s excellent at many things. Writing LinkedIn posts in your specific voice is not one of them - not because the model is weak, but because it has no persistent memory of who you are. Each session starts from zero. The output quality is determined entirely by how well you brief it, which requires the kind of prompt engineering most founders don\'t have time for.',
    table: [
      { feature: 'Remembers your voice between sessions', wrively: true,           competitor: false, },
      { feature: 'Built specifically for LinkedIn',        wrively: true,           competitor: false, },
      { feature: 'Voice Layer setup (one-time)',           wrively: true,           competitor: false, },
      { feature: 'Safe / Bold / Contrarian variations',    wrively: true,           competitor: false, },
      { feature: 'LinkedIn-optimized post format',         wrively: true,           competitor: false, },
      { feature: 'Smart comment suggestions',             wrively: true,           competitor: false, },
      { feature: 'Draft rewrite tool',                    wrively: true,           competitor: false, },
      { feature: 'General-purpose writing',               wrively: false,          competitor: true,  },
      { feature: 'Code generation',                       wrively: false,          competitor: true,  },
      { feature: 'Browsing / research',                   wrively: false,          competitor: true,  },
      { feature: 'Free plan available',                   wrively: true,           competitor: true,  wrivelySub: '12 posts/month, no card' },
      { feature: 'Starting price',                        wrively: '$0 / $9 / $19', competitor: '$0 / $20/mo (Plus)', },
    ],
    switchReasons: [
      {
        title: 'ChatGPT doesn\'t know you. Wrively does.',
        body: 'This is the entire difference. ChatGPT is a brilliant generalist who meets you for the first time every session. Wrively builds a persistent model of your voice, stage, audience, and personality, and writes from it forever. The output gap is significant.',
      },
      {
        title: 'You spend 40 minutes on a ChatGPT post. Wrively takes 3.',
        body: 'The brief, the editing, the "this doesn\'t sound like me" cycle - that\'s all prompt engineering overhead. Wrively eliminates it. Your voice layer is already built. You pick a topic and get three usable variations.',
      },
      {
        title: 'ChatGPT output has tells. Wrively output doesn\'t.',
        body: '"In today\'s fast-paced world," "game-changer," "as a founder, I\'ve learned." You know the phrases. ChatGPT reaches for them. Wrively is explicitly instructed to never use them - and because it knows your voice, it doesn\'t need to.',
      },
      {
        title: 'Three variations, not one draft to edit',
        body: 'ChatGPT gives you one response you then iterate on. Wrively gives you Safe, Bold, and Contrarian versions of every post - all in your voice. You pick the one that fits the day. No iteration spiral.',
      },
    ],
    faq: [
      {
        q: 'Can\'t I just give ChatGPT a better prompt?',
        a: 'Yes, and it helps. But you\'re still doing the work of briefing a blank-slate AI every time. Even with a perfect system prompt, ChatGPT is working from a description of you, not a model of you. And the briefing resets every session - the workflow never gets faster.',
      },
      {
        q: 'Is Wrively just a ChatGPT wrapper?',
        a: 'No. The AI model is the engine. The Voice Layer is the product. Wrively\'s differentiation is the persistent persona system built during onboarding - the thing that makes every generation start from who you are, not from a blank prompt. That\'s not possible to replicate by prompting ChatGPT differently.',
      },
      {
        q: 'ChatGPT has memory now. Does that change things?',
        a: 'ChatGPT\'s memory is conversational context, not a structured voice model. It might remember your name and your company. It won\'t remember your stage, your content pillars, your personality type, your audience, and your communication tone in a way that shapes every generation. Wrively\'s voice layer is purpose-built for exactly this.',
      },
      {
        q: 'What if I want to use both?',
        a: 'That\'s fine. Many founders use Wrively for LinkedIn specifically and ChatGPT for everything else. They don\'t compete on general tasks - Wrively doesn\'t do research, code, or anything outside LinkedIn content. For LinkedIn posts specifically, Wrively produces meaningfully better output.',
      },
    ],
  },

  // ── Jasper ───────────────────────────────────────────────────────────────────
  {
    slug: 'jasper-for-linkedin',
    competitorName: 'Jasper',
    competitorTagline: 'AI content platform for marketing teams',
    metaTitle: 'Wrively vs Jasper for LinkedIn • A Jasper Alternative Built for Founder Voice',
    metaDescription: 'Looking for a Jasper alternative for LinkedIn? Wrively is purpose-built for founders and professionals - not marketing teams. Compare features and pricing.',
    headline: 'Jasper is built for marketing teams. You\'re a founder posting as yourself.',
    subheadline: 'Jasper is a powerful tool for the wrong use case. If you\'re posting as a person, not a brand, Wrively is built for that.',
    intro: 'Jasper is a strong AI writing platform - for marketing teams producing blog posts, ads, and brand content at scale. If you\'re a marketing manager running content across multiple channels, Jasper makes sense. If you\'re a founder or professional posting on LinkedIn as yourself, Jasper is a $49/month solution to a problem that doesn\'t require that much infrastructure.',
    whoSwitches: 'Founders and professionals who signed up for Jasper expecting LinkedIn-specific voice tools, found it was primarily built for marketing teams, and want something purpose-built for personal posting.',
    wrivelySummary: 'Wrively is built for one thing: LinkedIn posts that sound like you. Not blog posts. Not ad copy. Not brand content. One platform, one channel, and a Voice Layer that persists so every generation comes from your specific model - not a marketing brief.',
    competitorSummary: 'Jasper is a broad AI content platform designed for marketing teams. It has templates for dozens of content types - blog posts, ads, social media, email, landing pages. LinkedIn is one of many outputs. The voice matching is template-based, not persona-persistent. At $49/month minimum, it\'s priced for marketing budgets, not individual founders.',
    table: [
      { feature: 'Built specifically for LinkedIn',     wrively: true,            competitor: false, },
      { feature: 'Persistent Voice Layer',              wrively: true,            competitor: false, },
      { feature: 'Safe / Bold / Contrarian variations', wrively: true,            competitor: false, },
      { feature: 'Smart comment suggestions',          wrively: true,            competitor: false, },
      { feature: 'Draft rewrite tool',                 wrively: true,            competitor: false, },
      { feature: 'Blog post generation',               wrively: false,           competitor: true,  },
      { feature: 'Ad copy generation',                 wrively: false,           competitor: true,  },
      { feature: 'Brand voice (team-level)',           wrively: false,           competitor: true,  },
      { feature: 'Multi-channel content',              wrively: false,           competitor: true,  },
      { feature: 'Free plan available',                wrively: true,            competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',                     wrively: '$0 / $9 / $19', competitor: '$49+/mo', },
      { feature: 'No credit card to start',            wrively: true,            competitor: false, },
    ],
    switchReasons: [
      {
        title: 'Jasper is built for teams. You\'re a person.',
        body: 'Jasper\'s brand voice features are designed for marketing teams maintaining consistency across writers. If you\'re posting as yourself - one voice, one person - that infrastructure adds complexity without value.',
      },
      {
        title: 'The price difference is hard to justify early',
        body: 'Jasper starts at $49/month. Wrively\'s free plan covers 12 posts per month with no card. The Starter plan is $9/month. For an early-stage founder testing LinkedIn, that gap is real.',
      },
      {
        title: 'Jasper\'s LinkedIn output is template-based, not voice-trained',
        body: 'Jasper generates LinkedIn posts from templates. Wrively generates them from a persistent model of your specific voice - your stage, your personality type, your content pillars, your communication tone. The output difference is significant for personal posting.',
      },
      {
        title: 'Wrively is the entire workflow, not just the writing step',
        body: 'Daily topic suggestions, comment generation, draft rewriting, content history - the full posting habit loop. Jasper gives you a writing tool. Wrively gives you a system.',
      },
    ],
    faq: [
      {
        q: 'Does Wrively do anything beyond LinkedIn?',
        a: 'No. Wrively is exclusively built for LinkedIn posts, comments, and draft rewrites. If you need blog posts, ad copy, or multi-channel content, Jasper is better suited for those use cases. Wrively\'s focus is intentional.',
      },
      {
        q: 'Can Jasper learn my voice over time?',
        a: 'Jasper has brand voice features that can be trained on examples. But this is designed for team-level brand consistency, not individual personal voice. The setup is more involved and the output is calibrated for brand content, not personal LinkedIn posting.',
      },
      {
        q: 'Is Wrively cheaper than Jasper?',
        a: 'Significantly. Wrively\'s free plan is permanent with no credit card. Starter is $9/month. Pro is $19/month. Jasper starts at $49/month and scales with seat count and usage. For an individual posting on LinkedIn, there\'s no scenario where Jasper\'s pricing is justified over Wrively.',
      },
      {
        q: 'What if I\'m already paying for Jasper?',
        a: 'If you\'re using Jasper purely for LinkedIn posts, you\'re likely overpaying for features you don\'t use. Try Wrively free - no card required. If the LinkedIn output is better (most founders find it is), cancelling Jasper saves you $40+/month.',
      },
    ],
  },

  // ── Draftly ──────────────────────────────────────────────────────────────────
  {
    slug: 'draftly-alternative',
    competitorName: 'Draftly',
    competitorTagline: 'LinkedIn content creator and scheduler',
    metaTitle: 'Wrively vs Draftly • The Draftly Alternative That Writes in Your Voice',
    metaDescription: 'Comparing Wrively and Draftly for LinkedIn content? See how a Voice Layer approach outperforms template-based scheduling for founders who want to sound like themselves.',
    headline: 'A Draftly alternative focused on voice, not templates.',
    subheadline: 'Draftly helps you schedule. Wrively helps you write. The writing problem comes first.',
    intro: 'Draftly is a LinkedIn scheduling and content creation tool aimed at people who already know what to post and need a system to post it consistently. If you have a content team or a reliable writing process, it covers the workflow well. For founders who are still figuring out what to write and how to make it sound like them, the tool does not solve the core problem.',
    whoSwitches: 'Founders who signed up for Draftly expecting the content problem to get easier, discovered that the scheduler was only useful if they already had good content to schedule.',
    wrivelySummary: 'Wrively builds a Voice Layer from your company, stage, and writing personality. Every post it generates comes from that persona. You do not need a content calendar because the tool surfaces a daily topic for you. The problem it solves is the writing itself, not the logistics around it.',
    competitorSummary: 'Draftly focuses on helping users build a posting habit through scheduling, content queues, and LinkedIn-native formatting. It has AI writing features, but they generate LinkedIn-style content rather than voice-trained output.',
    table: [
      { feature: 'AI post generation',              wrively: true,             competitor: true  },
      { feature: 'Writes in your personal voice',   wrively: true,             competitor: false },
      { feature: 'Voice Layer onboarding',          wrively: true,             competitor: false },
      { feature: 'Safe / Bold / Contrarian tones',  wrively: true,             competitor: false },
      { feature: 'Draft rewrite tool',              wrively: true,             competitor: false },
      { feature: 'Comment suggestions',             wrively: true,             competitor: false },
      { feature: 'Post scheduling',                 wrively: false,            competitor: true  },
      { feature: 'Content queue',                   wrively: false,            competitor: true  },
      { feature: 'Free plan available',             wrively: true,             competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',                  wrively: '$0 / $9 / $19', competitor: '$19+/mo' },
    ],
    switchReasons: [
      {
        title: 'The writing is the hard part, not the scheduling',
        body: 'A content queue is only useful if you have content worth queueing. Most founders who switch from Draftly to Wrively say the same thing: they were staring at an empty queue because writing was still the bottleneck.',
      },
      {
        title: 'Voice consistency over posting frequency',
        body: 'Posting more often with generic output builds the wrong kind of presence. Wrively prioritizes posts that sound distinctly like you - which builds more trust per post than volume alone.',
      },
      {
        title: 'You are a solo founder, not a content operation',
        body: 'Draftly is well-suited for people managing content at scale. If it is just you posting as yourself, most of what Draftly offers is overhead. Wrively is built for one person, one voice.',
      },
      {
        title: 'Free plan with no credit card',
        body: 'Wrively\'s free tier covers 12 posts per month with no payment details required. You can test whether the output actually sounds like you before spending anything.',
      },
    ],
    faq: [
      {
        q: 'Does Wrively schedule posts like Draftly?',
        a: 'No. Wrively generates posts and you copy them with one click. You post to LinkedIn yourself. This keeps you in control and avoids LinkedIn\'s restrictions on third-party automation.',
      },
      {
        q: 'Can Wrively replace my entire Draftly workflow?',
        a: 'If you primarily use Draftly for scheduling, no. If you use it mainly to generate and organize content, then yes - Wrively covers that with significantly better voice quality.',
      },
      {
        q: 'Is Wrively cheaper than Draftly?',
        a: 'Wrively has a permanent free tier with no credit card required. Paid plans start at $9/month. Most Draftly plans start higher with no free tier. For a solo founder testing LinkedIn, the difference is meaningful.',
      },
    ],
  },

  // ── Shield Analytics ─────────────────────────────────────────────────────────
  {
    slug: 'shield-analytics-alternative',
    competitorName: 'Shield Analytics',
    competitorTagline: 'LinkedIn analytics and performance tracking',
    metaTitle: 'Wrively vs Shield Analytics • Two Different LinkedIn Problems',
    metaDescription: 'Shield Analytics tracks LinkedIn performance. Wrively generates LinkedIn content in your voice. They solve different problems. Here is when each one makes sense.',
    headline: 'Shield tracks your LinkedIn. Wrively writes it.',
    subheadline: 'If you do not have consistent posts, analytics will not help. Wrively solves the creation problem first.',
    intro: 'Shield Analytics is a LinkedIn analytics tool. It tells you which posts performed, what your best posting times are, and how your follower growth tracks over time. That information is genuinely useful - once you are posting consistently. For founders who are not posting consistently yet, adding an analytics layer to an empty content stream does not move anything forward.',
    whoSwitches: 'Founders who signed up for Shield Analytics while still struggling to post consistently, realized that tracking performance required having performance to track.',
    wrivelySummary: 'Wrively is a content generation tool, not an analytics tool. It builds your Voice Layer once and generates posts from it. The goal is to get you posting consistently first. Once you are posting, performance data starts to matter - which is when tools like Shield become genuinely useful.',
    competitorSummary: 'Shield Analytics provides detailed LinkedIn performance metrics: post analytics, follower growth, best times to post, content type breakdowns, and benchmarking. It does not generate content - it measures it.',
    table: [
      { feature: 'AI post generation',             wrively: true,             competitor: false },
      { feature: 'Voice-trained content',          wrively: true,             competitor: false },
      { feature: 'Comment suggestions',            wrively: true,             competitor: false },
      { feature: 'Draft rewrite tool',             wrively: true,             competitor: false },
      { feature: 'Post performance analytics',     wrively: false,            competitor: true  },
      { feature: 'Follower growth tracking',       wrively: false,            competitor: true  },
      { feature: 'Best time to post data',         wrively: false,            competitor: true  },
      { feature: 'Content benchmarking',           wrively: false,            competitor: true  },
      { feature: 'Free plan available',            wrively: true,             competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',                 wrively: '$0 / $9 / $19', competitor: '$9+/mo' },
    ],
    switchReasons: [
      {
        title: 'You need content before you need analytics',
        body: 'Analytics are a multiplier on an existing content operation. If you are posting once a month, better data about that one post will not change much. Build the posting habit first, then measure it.',
      },
      {
        title: 'Wrively and Shield solve different problems',
        body: 'The honest answer: these are not direct competitors. Wrively helps you write. Shield helps you measure. For founders who are actively posting, using both makes sense. Start with Wrively to build the habit, add Shield when you have enough data to learn from.',
      },
      {
        title: 'Voice quality over posting frequency metrics',
        body: 'A post that sounds like you will consistently outperform a generic post, regardless of optimal timing. Getting the voice right first is a higher-leverage problem than knowing the best hour to post.',
      },
      {
        title: 'Free plan to build the habit first',
        body: 'Wrively\'s free tier lets you build a posting habit before paying for anything. Once you are posting consistently, the case for analytics tools like Shield becomes much stronger.',
      },
    ],
    faq: [
      {
        q: 'Can I use both Wrively and Shield Analytics?',
        a: 'Yes, and we would recommend it for founders who are actively posting. Wrively handles the content generation. Shield handles the performance analysis. They complement each other.',
      },
      {
        q: 'Does Wrively provide any analytics?',
        a: 'Wrively tracks which post variations you copy most and lets you rate posts after publishing. Pro users get performance-aware prompts that improve based on what has worked. For deep analytics, Shield is the better tool.',
      },
      {
        q: 'Who should use Shield instead of Wrively?',
        a: 'Founders who are already posting consistently (3+ times per week) and want data to optimize their approach. If you are still struggling to post consistently, content generation is the bottleneck, not analytics.',
      },
    ],
  },

  // ── Lempod ───────────────────────────────────────────────────────────────────
  {
    slug: 'lempod-alternative',
    competitorName: 'Lempod',
    competitorTagline: 'LinkedIn engagement pods and automation',
    metaTitle: 'Wrively vs Lempod • Why Engagement Pods Are the Wrong Solution',
    metaDescription: 'Considering Lempod for LinkedIn growth? See why founders are switching to Wrively for authentic voice content instead of artificial engagement boosts.',
    headline: 'Authentic voice vs. artificial engagement.',
    subheadline: 'Lempod inflates your numbers. Wrively improves your writing. These are not the same thing.',
    intro: 'Lempod is an engagement pod tool - it connects you with other LinkedIn users who automatically like and comment on your posts to boost algorithmic reach. There is a real argument for early visibility. But engagement pods come with meaningful tradeoffs: the comments are generic, the engagement is not genuine, and LinkedIn has actively penalized pod activity in algorithm updates. The reach you get is not the same as the trust you build.',
    whoSwitches: 'Founders who tried Lempod for a few months, saw inflated impression numbers, but noticed that the engagement was not translating into real connections, DMs, or business outcomes.',
    wrivelySummary: 'Wrively focuses on writing quality rather than engagement volume. When a post sounds genuinely like you, it earns real comments from real people who found it valuable. That kind of engagement compounds: a thoughtful comment from an investor is worth more than 50 pod likes.',
    competitorSummary: 'Lempod is an engagement pod platform that automatically generates likes and comments on your posts from other pod members. The goal is to trigger the LinkedIn algorithm early and boost distribution. It does not help with content creation.',
    table: [
      { feature: 'AI post generation',            wrively: true,             competitor: false },
      { feature: 'Voice-trained content',         wrively: true,             competitor: false },
      { feature: 'Comment suggestions',           wrively: true,             competitor: false },
      { feature: 'Authentic engagement only',     wrively: true,             competitor: false },
      { feature: 'Engagement pod automation',     wrively: false,            competitor: true  },
      { feature: 'Automatic likes and comments',  wrively: false,            competitor: true  },
      { feature: 'LinkedIn ToS compliant',        wrively: true,             competitor: false, wrivelySub: 'No automation' },
      { feature: 'Free plan available',           wrively: true,             competitor: false, wrivelySub: '12 posts/month free' },
      { feature: 'Starting price',                wrively: '$0 / $9 / $19', competitor: '$10+/mo' },
    ],
    switchReasons: [
      {
        title: 'Artificial engagement does not convert',
        body: 'Pod likes inflate your impression count but they do not produce investor DMs, customer signups, or hire interest. Real business outcomes on LinkedIn come from posts that make real people want to respond - not automated interactions from strangers in a pod.',
      },
      {
        title: 'LinkedIn actively penalizes pod activity',
        body: 'LinkedIn has updated its algorithm multiple times to identify and discount coordinated engagement. The reach boost from pods has declined significantly. The risk of account restriction is real and growing.',
      },
      {
        title: 'Write better posts instead of gaming distribution',
        body: 'A post that earns 10 genuine comments from your ICP will outperform a pod-boosted post with 80 generic likes every time. Wrively helps you write the post that earns genuine engagement.',
      },
      {
        title: 'Voice quality compounds, pod metrics do not',
        body: 'Every post you write in your authentic voice builds your brand reputation. That compounds over time. Pod engagement stops the moment you stop paying. Your voice stays with you.',
      },
    ],
    faq: [
      {
        q: 'Does Wrively use any automation or pods?',
        a: 'No. Wrively generates content that you post manually. There is no automation, no engagement pods, and no LinkedIn API access. It is fully compliant with LinkedIn\'s terms of service.',
      },
      {
        q: 'Will Wrively posts get the same reach as pod-boosted posts?',
        a: 'Not immediately. Pods can boost early signal on a post which helps with algorithm distribution. But posts that earn genuine early engagement (real comments from real readers) typically outperform pod-boosted posts over a 48-hour window - and do not carry the account risk.',
      },
      {
        q: 'Who should stick with Lempod?',
        a: 'Founders who are posting high-quality content consistently and want an additional early-signal boost may find some value in pods. But for founders who are still figuring out their voice and content, fixing the writing is a much higher-leverage investment.',
      },
    ],
  },

  // ── AuthoredUp ──────────────────────────────────────────────────────────────
  {
    slug: 'authoredup-alternative',
    competitorName: 'AuthoredUp',
    competitorTagline: 'All-in-one LinkedIn content creation tool',
    metaTitle: 'Wrively vs AuthoredUp • The AuthoredUp Alternative That Actually Writes for You',
    metaDescription: 'AuthoredUp helps you format and preview LinkedIn posts. Wrively generates them in your voice. Compare the two tools and see which fits your workflow.',
    headline: 'AuthoredUp formats your posts. Wrively writes them.',
    subheadline: 'AuthoredUp is a great editor. But editing requires a draft. Wrively gives you three.',
    intro: 'AuthoredUp is a popular LinkedIn content tool focused on formatting, previewing, and organizing posts. It does not generate content. Wrively generates full posts in your founder voice from a single topic. If your bottleneck is "I need help formatting my post," AuthoredUp is great. If your bottleneck is "I don\'t have a post," Wrively solves that.',
    whoSwitches: 'Founders who used AuthoredUp for formatting but realized their bottleneck is writing the first draft, not polishing it.',
    wrivelySummary: 'AI generates posts in your voice from your persona. 3 variations per topic. Refine controls. Free plan with 12 posts/month.',
    competitorSummary: 'Text editor with bold/italic formatting, post preview, snippet library, 200+ hooks, scheduling. No AI generation.',
    table: [
      { feature: 'AI post generation', wrively: true, competitor: false },
      { feature: 'Voice Layer persona', wrively: true, competitor: false },
      { feature: '3 variations per topic', wrively: true, competitor: false },
      { feature: 'Text formatting (bold, italic)', wrively: false, competitor: true },
      { feature: 'Post preview before publishing', wrively: false, competitor: true },
      { feature: 'Hook/CTA snippet library', wrively: false, competitor: true, wrivelySub: 'AI generates hooks per post' },
      { feature: 'Scheduling', wrively: false, competitor: true },
      { feature: 'Free plan', wrively: true, competitor: false, wrivelySub: '12 posts/month' },
      { feature: 'Pricing', wrively: '$0 – $19/mo', competitor: '$19.95/mo' },
    ],
    switchReasons: [
      { title: 'You need a draft, not an editor', body: 'AuthoredUp assumes you already have content to format. Wrively creates the content from scratch, in your voice, with 3 angles to choose from.' },
      { title: 'Speed matters more than formatting', body: 'With Wrively, you go from topic to copyable post in under 3 minutes. No blank-page staring, no manual formatting.' },
      { title: 'You want voice consistency', body: 'Wrively builds a persistent Voice Layer from your onboarding. Every post sounds like you. AuthoredUp\'s hooks library is generic.' },
    ],
    faq: [
      { q: 'Can I use both?', a: 'Yes. Some founders generate posts in Wrively, then paste them into AuthoredUp for formatting and scheduling. The tools are complementary.' },
      { q: 'Does AuthoredUp have AI?', a: 'No. AuthoredUp is a content creation and formatting tool. It provides hooks and templates, but does not generate posts with AI.' },
      { q: 'Which is cheaper?', a: 'Wrively has a free plan (12 posts/month). AuthoredUp starts at $19.95/month with no free tier.' },
    ],
  },

  // ── ContentIn ───────────────────────────────────────────────────────────────
  {
    slug: 'contentin-alternative',
    competitorName: 'ContentIn',
    competitorTagline: 'AI LinkedIn content generator',
    metaTitle: 'Wrively vs ContentIn • The ContentIn Alternative Built for Founder Voice',
    metaDescription: 'ContentIn generates LinkedIn content from templates. Wrively generates it from your persona. See why founders switch to voice-first AI writing.',
    headline: 'ContentIn uses templates. Wrively uses your voice.',
    subheadline: 'Both tools generate LinkedIn posts. Only one builds a persistent model of how you write.',
    intro: 'ContentIn is a solid LinkedIn AI tool that generates posts using templates and viral post patterns. Wrively takes a different approach: it builds a Voice Layer from your founder context and generates posts that sound specifically like you, not like a template.',
    whoSwitches: 'Founders who got decent drafts from ContentIn but found the output too template-y and not personal enough.',
    wrivelySummary: 'Voice Layer persona built in 2 minutes. 3 variations per topic. Posts reference your company, stage, and audience. Free plan.',
    competitorSummary: 'AI content generation with topic discovery, templates, and content calendar. Trained on viral post patterns.',
    table: [
      { feature: 'AI post generation', wrively: true, competitor: true },
      { feature: 'Voice Layer persona', wrively: true, competitor: false },
      { feature: 'Company-specific output', wrively: true, competitor: false, wrivelySub: 'References your company by name' },
      { feature: '3 variations per topic', wrively: true, competitor: false },
      { feature: 'Topic discovery', wrively: false, competitor: true },
      { feature: 'Content calendar', wrively: false, competitor: true },
      { feature: 'Viral post templates', wrively: false, competitor: true },
      { feature: 'Free plan', wrively: true, competitor: false, wrivelySub: '12 posts/month' },
      { feature: 'Pricing', wrively: '$0 – $19/mo', competitor: 'From $25/mo' },
    ],
    switchReasons: [
      { title: 'Templates don\'t sound like you', body: 'ContentIn\'s strength is topic discovery and template-based generation. But the output sounds like templates, not like a specific founder. Wrively\'s Voice Layer makes every post personal.' },
      { title: 'Your company should be in the post', body: 'Wrively references your company name, stage, and audience naturally in every generation. ContentIn produces posts about topics, not about your specific journey.' },
      { title: 'Three angles beat one', body: 'Wrively generates safe, bold, and debate variations. You pick the angle that fits your mood. ContentIn gives you one output to edit.' },
    ],
    faq: [
      { q: 'Is ContentIn bad?', a: 'No. ContentIn is a solid tool, especially for topic ideation. Wrively is better for founders who want output that sounds specifically like them.' },
      { q: 'Which has better topic suggestions?', a: 'ContentIn has dedicated topic discovery features. Wrively suggests topics from your content pillars, which are more targeted to your niche.' },
      { q: 'Which is more affordable?', a: 'Wrively starts free (12 posts/month). ContentIn starts at approximately $25/month.' },
    ],
  },

  // ── MagicPost ───────────────────────────────────────────────────────────────
  {
    slug: 'magicpost-alternative',
    competitorName: 'MagicPost',
    competitorTagline: 'AI LinkedIn post generator',
    metaTitle: 'Wrively vs MagicPost • Why Voice Beats Viral Templates',
    metaDescription: 'MagicPost generates engagement-optimized LinkedIn posts from viral patterns. Wrively generates posts from your founder persona. Compare the two approaches.',
    headline: 'MagicPost optimizes for engagement. Wrively optimizes for your voice.',
    subheadline: 'Viral patterns get clicks. Your voice gets trust. Pick what matters more.',
    intro: 'MagicPost is a popular free LinkedIn post generator that analyzes viral content patterns. It produces engagement-optimized posts using proven hooks and formats. Wrively focuses on something different: generating posts that sound like a specific founder, not like every other viral post on LinkedIn.',
    whoSwitches: 'Founders whose MagicPost output got engagement but felt inauthentic. People who want to be known for their voice, not for using engagement hacks.',
    wrivelySummary: 'Voice Layer persona. Posts reference your company and stage. 3 variations. Refine controls. Focus on authenticity over virality.',
    competitorSummary: 'Viral pattern analysis. Engagement-optimized output. Carousel generator. Free tier. High-volume generation.',
    table: [
      { feature: 'AI post generation', wrively: true, competitor: true },
      { feature: 'Voice Layer persona', wrively: true, competitor: false },
      { feature: 'Viral pattern matching', wrively: false, competitor: true },
      { feature: 'Carousel generator', wrively: false, competitor: true },
      { feature: 'Company-specific posts', wrively: true, competitor: false },
      { feature: '3 variations per topic', wrively: true, competitor: false },
      { feature: 'Refine controls', wrively: true, competitor: false },
      { feature: 'Free plan', wrively: true, competitor: true },
      { feature: 'Pricing', wrively: '$0 – $19/mo', competitor: 'Free + paid tiers' },
    ],
    switchReasons: [
      { title: 'Viral =/= authentic', body: 'MagicPost produces posts that look like they\'ll get likes. But they also look like every other AI-generated post on LinkedIn. Wrively\'s output is specific to you.' },
      { title: 'Your audience notices patterns', body: 'If every post follows a viral template (hook, numbered list, CTA), your audience stops trusting the content. Voice-first posts feel real.' },
      { title: 'Founders need credibility, not just reach', body: 'Investors, customers, and hires read your posts. Sounding like a real person matters more than optimizing for the algorithm.' },
    ],
    faq: [
      { q: 'Is MagicPost free?', a: 'MagicPost has a free tier for basic generation. Wrively also has a free plan with 12 posts per month.' },
      { q: 'Can MagicPost learn my voice?', a: 'MagicPost focuses on viral patterns, not individual voice modeling. Wrively builds a persistent Voice Layer from your onboarding.' },
      { q: 'Which produces more posts?', a: 'MagicPost may allow more generations on free tier. Wrively focuses on fewer, higher-quality posts that actually sound like you.' },
    ],
  },

  // ── SuperGrow ───────────────────────────────────────────────────────────────
  {
    slug: 'supergrow-alternative',
    competitorName: 'SuperGrow',
    competitorTagline: 'AI-powered LinkedIn growth tool',
    metaTitle: 'Wrively vs SuperGrow • The SuperGrow Alternative for Founder Voice',
    metaDescription: 'SuperGrow offers broad LinkedIn growth features. Wrively focuses on one thing: posts that sound like you. Compare the two approaches for founders.',
    headline: 'SuperGrow does everything. Wrively does one thing better.',
    subheadline: 'Broad tools spread thin. Focused tools go deep. Your voice needs depth.',
    intro: 'SuperGrow is a multi-feature LinkedIn growth platform offering AI content generation, carousel creation, scheduling, and engagement tools. Wrively is focused: it builds a Voice Layer and generates LinkedIn posts that sound like a specific founder. If you want an all-in-one platform, SuperGrow covers more ground. If you want posts that actually sound like you, Wrively goes deeper.',
    whoSwitches: 'Founders who tried SuperGrow\'s AI generation and found the output generic. People who want depth over breadth in their writing tool.',
    wrivelySummary: 'Voice Layer persona. Company-specific output. 3 variations. Refine controls. Built for founders. Free plan.',
    competitorSummary: 'AI generation + carousel maker + scheduling + engagement tools + "Content DNA" voice matching. Broad LinkedIn growth platform.',
    table: [
      { feature: 'AI post generation', wrively: true, competitor: true },
      { feature: 'Voice Layer persona', wrively: true, competitor: false, wrivelySub: 'SuperGrow has "Content DNA"' },
      { feature: 'Carousel generator', wrively: false, competitor: true },
      { feature: 'Scheduling', wrively: false, competitor: true },
      { feature: 'Engagement tools', wrively: false, competitor: true },
      { feature: 'Company-specific posts', wrively: true, competitor: false },
      { feature: '3 variations per topic', wrively: true, competitor: false },
      { feature: 'Free plan', wrively: true, competitor: false, wrivelySub: '12 posts/month' },
      { feature: 'Pricing', wrively: '$0 – $19/mo', competitor: 'From $19/mo' },
    ],
    switchReasons: [
      { title: 'Depth over breadth', body: 'SuperGrow covers many features at a surface level. Wrively does one thing and goes deep: generating posts that sound like a specific person.' },
      { title: 'Voice is the bottleneck', body: 'Most founders don\'t need a carousel maker or scheduling tool. They need posts worth scheduling. Wrively solves the writing problem first.' },
      { title: 'Simpler is faster', body: 'Wrively\'s interface is focused: topic in, 3 posts out. No dashboard overwhelm. Under 3 minutes to a copyable post.' },
    ],
    faq: [
      { q: 'Does SuperGrow match my voice?', a: 'SuperGrow offers a "Content DNA" feature for voice matching. Wrively\'s Voice Layer is built during onboarding and used on every generation. Both attempt voice personalization with different approaches.' },
      { q: 'Is SuperGrow better for teams?', a: 'SuperGrow has more team-oriented features. Wrively is currently built for individual founders and consultants.' },
      { q: 'Which is more affordable?', a: 'Wrively starts free (12 posts/month). SuperGrow starts at approximately $19/month with no free plan.' },
    ],
  },

  // ── EasyGen ─────────────────────────────────────────────────────────────────
  {
    slug: 'easygen-alternative',
    competitorName: 'EasyGen',
    competitorTagline: 'AI LinkedIn content generator built for growth',
    metaTitle: 'Wrively vs EasyGen • The EasyGen Alternative That Remembers Your Voice',
    metaDescription: 'EasyGen generates LinkedIn posts with writing style customization. Wrively builds a persistent Voice Layer. Compare the two AI writing tools for founders.',
    headline: 'EasyGen customizes your style. Wrively remembers your voice.',
    subheadline: 'Style settings are a start. A persistent voice model is the finish line.',
    intro: 'EasyGen is a LinkedIn-specific AI tool that uses performance data to optimize content and offers writing style customization. Wrively builds a persistent Voice Layer from your founder context and generates posts that reference your company, stage, and audience. Both personalize output, but through different mechanisms.',
    whoSwitches: 'Founders who liked EasyGen\'s data-driven approach but wanted posts that felt more personally specific, not just stylistically adjusted.',
    wrivelySummary: 'Voice Layer from onboarding. Company-specific output. 3 variations. Refine controls. Free plan with 12 posts/month.',
    competitorSummary: 'Writing style customization. Performance tracking. Data-driven optimization. LinkedIn-specific AI. Paid plans.',
    table: [
      { feature: 'AI post generation', wrively: true, competitor: true },
      { feature: 'Voice Layer persona', wrively: true, competitor: false, wrivelySub: 'EasyGen has style settings' },
      { feature: 'Performance tracking', wrively: false, competitor: true },
      { feature: 'Data-driven optimization', wrively: false, competitor: true },
      { feature: 'Company-specific output', wrively: true, competitor: false },
      { feature: '3 variations per topic', wrively: true, competitor: false },
      { feature: 'Refine controls', wrively: true, competitor: false },
      { feature: 'Free plan', wrively: true, competitor: false, wrivelySub: '12 posts/month' },
      { feature: 'Pricing', wrively: '$0 – $19/mo', competitor: 'From $29/mo' },
    ],
    switchReasons: [
      { title: 'Style settings vs voice model', body: 'EasyGen lets you adjust tone sliders. Wrively builds a model of who you are from your company, stage, audience, and personality. The difference shows in the output.' },
      { title: 'Your company in every post', body: 'Wrively references your product, your stage, your specific situation. EasyGen produces well-styled posts about generic topics.' },
      { title: 'Free to start', body: 'Wrively has a free plan with 12 posts/month. EasyGen requires a paid subscription from day one.' },
    ],
    faq: [
      { q: 'Does EasyGen learn from my posts?', a: 'EasyGen tracks performance and optimizes suggestions. Wrively builds a Voice Layer from your context. Different learning mechanisms.' },
      { q: 'Which is better for beginners?', a: 'Wrively\'s 2-minute onboarding is simpler. EasyGen\'s style customization has a slightly steeper setup curve.' },
      { q: 'Can I try both?', a: 'Wrively has a free plan so you can test it. EasyGen typically requires a paid subscription to access generation features.' },
    ],
  },
]

export function getComparison(slug: string): ComparisonData | undefined {
  return comparisons.find(c => c.slug === slug)
}
