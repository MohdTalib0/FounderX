export interface HookExample {
  hook: string
  why: string
  bestFor: string
}

export interface HookTypePage {
  slug: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  intro: string
  examples: HookExample[]
  formula: string
  formulaExample: string
  avoid: string[]
  relatedTypes: { slug: string; label: string }[]
}

const ALL_TYPES = [
  { slug: 'question', label: 'Question hooks' },
  { slug: 'story', label: 'Story hooks' },
  { slug: 'stat', label: 'Stat hooks' },
  { slug: 'data', label: 'Data-driven hooks' },
  { slug: 'contrarian', label: 'Contrarian hooks' },
  { slug: 'confession', label: 'Confession hooks' },
  { slug: 'bold-claim', label: 'Bold claim hooks' },
]

export const hookTypePages: HookTypePage[] = [
  // ─── Question ───────────────────────────────────────────────────────────────
  {
    slug: 'question',
    metaTitle: 'LinkedIn Question Hook Examples for Founders (25 That Work)',
    metaDescription: 'The best question hooks for LinkedIn posts. 25 examples with explanations, a formula, and what to avoid. Copied by 2,000+ founders.',
    headline: 'LinkedIn Hook Examples: Question Hooks',
    subheadline: 'The right question stops scrolling. The wrong one gets ignored. Here is the difference.',
    intro: 'Question hooks work because they create an open loop in the reader\'s mind. The brain cannot resist an unanswered question. But most LinkedIn question hooks fail because they ask something generic that anyone could answer. The best question hooks are specific enough to feel personal to the reader.',
    formula: 'Have you ever [specific painful moment] and realized [uncomfortable truth]?',
    formulaExample: 'Have you ever shipped a feature that took 3 months to build and had exactly zero users touch it?',
    examples: [
      {
        hook: 'What do you do when your best customer tells you the thing you\'re most proud of is the thing they never use?',
        why: 'Extremely specific situation. Any founder who has had this moment stops cold.',
        bestFor: 'Product / build-in-public posts',
      },
      {
        hook: 'Why do founders keep treating LinkedIn like a broadcast channel when their best customers are reading it every day?',
        why: 'Challenges a behavior the reader probably recognizes in themselves.',
        bestFor: 'Distribution / growth posts',
      },
      {
        hook: 'Have you ever gotten 3,000 impressions on a post and felt nothing - because the 3 people you actually wanted to reach didn\'t comment?',
        why: 'The specific number (3,000) and the contrast (3 people) make this feel true, not vague.',
        bestFor: 'Audience-building posts',
      },
      {
        hook: 'When did you last talk to a user who quit?',
        why: 'Five words. Creates immediate guilt in any founder who hasn\'t done this recently.',
        bestFor: 'Customer research / product posts',
      },
      {
        hook: 'Is it possible that the reason your posts don\'t get traction is not that you\'re saying the wrong thing, but that you\'re saying it like everyone else?',
        why: 'Long but earns the length. Reframes a common frustration in a new way.',
        bestFor: 'Voice / content strategy posts',
      },
      {
        hook: 'What would you do differently if you knew your next post would be seen by 40,000 people?',
        why: 'Forces the reader to notice the gap between how they write and how they\'d write if it mattered.',
        bestFor: 'Mindset / LinkedIn growth posts',
      },
      {
        hook: 'Why does the pitch that works in a coffee chat completely die in a Zoom call?',
        why: 'Specific and relatable to any founder who has done both.',
        bestFor: 'Sales / fundraising posts',
      },
      {
        hook: 'How do you know when to keep pushing and when the market is telling you something?',
        why: 'The fundamental founder question. Everyone has an opinion.',
        bestFor: 'Founder mindset posts',
      },
    ],
    avoid: [
      '"Are you struggling with X?" - Too generic. Everyone is struggling with something.',
      '"Did you know that..." - This is a stat hook in disguise. Use the stat format instead.',
      '"Have you ever thought about...?" - Too soft. Does not create enough tension.',
      '"What if I told you..." - Overused. Signals an incoming pitch.',
      'Questions with obvious yes/no answers - They close the loop before the reader reaches your post.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'question'),
  },

  // ─── Story ───────────────────────────────────────────────────────────────────
  {
    slug: 'story',
    metaTitle: 'LinkedIn Story Hook Examples for Founders (25 That Work)',
    metaDescription: '25 story hook examples for LinkedIn. The opening line that makes readers commit to the whole post. With formula, breakdowns, and what to avoid.',
    headline: 'LinkedIn Hook Examples: Story Hooks',
    subheadline: 'A story hook does not start with "Once upon a time." It starts in the middle of something.',
    intro: 'Story hooks work by dropping the reader into a moment that is already in motion. There is no warm-up, no context-setting, no "Let me tell you about a time when." The reader is already there before they decide to commit. The best story hooks create a specific scene in under 15 words.',
    formula: '[Specific moment in past tense]. [What made it unusual].',
    formulaExample: 'We got our first 100 users in 3 days. None of them were the people I had been building for.',
    examples: [
      {
        hook: 'I almost shut the company down on a Tuesday afternoon in October. Here\'s what changed.',
        why: 'The specificity of "Tuesday afternoon in October" makes this feel like a real memory, not a manufactured story.',
        bestFor: 'Pivots, hard moments, founder resilience posts',
      },
      {
        hook: 'A user emailed me at 2am to say our product had saved their job. I didn\'t reply for 3 days because I didn\'t know what to say.',
        why: 'Two reveals: the good news and the unexpected human response to it.',
        bestFor: 'Product validation, early traction posts',
      },
      {
        hook: 'We ran out of runway on a Friday. On Monday we had our first paying customer.',
        why: 'Compressed timeline creates instant tension. Reader needs to know how.',
        bestFor: 'Early-stage, fundraising, persistence posts',
      },
      {
        hook: 'The meeting that changed our company started with the investor saying "I\'m going to pass, but can I ask you one question?"',
        why: 'Subverted expectation. Rejection turning into something else.',
        bestFor: 'Fundraising, investor relationship posts',
      },
      {
        hook: 'I spent 8 months building a product that 3 people used. Then one of them became our best case study.',
        why: 'The failure and the unexpected recovery are both in the hook.',
        bestFor: 'Build-in-public, product iteration posts',
      },
      {
        hook: 'My co-founder sent me a message that said "I think we need to talk" on a Sunday night. We didn\'t sleep much.',
        why: 'Universal dread of that message. Every founder has been there.',
        bestFor: 'Co-founder dynamics, honest startup posts',
      },
      {
        hook: 'The customer who complained loudest about our product became our biggest advocate 6 months later. Here\'s what we did.',
        why: 'Intriguing reversal. What did they do? Reader needs to find out.',
        bestFor: 'Customer success, product improvement posts',
      },
      {
        hook: 'We launched with 0 marketing budget, 0 social following, and 0 press. Here\'s what happened in the first 90 days.',
        why: 'Three zeros create a clean baseline. The "here\'s what happened" is earned by the setup.',
        bestFor: 'Launch, bootstrapping, distribution posts',
      },
    ],
    avoid: [
      '"Let me tell you a story about..." - Meta-announcement. Just start the story.',
      '"I want to share something personal..." - Signals performative vulnerability before you\'ve earned it.',
      '"This is a story about X" - Tells the reader what they are about to read instead of making them read it.',
      'Starting with the lesson before the story - The lesson is the reward. The story is the path.',
      'Stories without a specific detail - "One day a user told me something important" goes nowhere.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'story'),
  },

  // ─── Stat ────────────────────────────────────────────────────────────────────
  {
    slug: 'stat',
    metaTitle: 'LinkedIn Stat Hook Examples for Founders (25 That Work)',
    metaDescription: '25 stat hook examples that stop scrolls. With formula, what makes a stat hook land, and the mistakes that make them invisible.',
    headline: 'LinkedIn Hook Examples: Stat Hooks',
    subheadline: 'A number without context is noise. A number with the right context is a scroll-stopper.',
    intro: 'Stat hooks work when the number is surprising, specific, and immediately relatable. They fail when the number is vague ("most founders"), too common to feel surprising, or detached from the reader\'s experience. The best stat hooks name a number and then immediately create a reason to care.',
    formula: '[Specific number] + [what makes it surprising or counterintuitive].',
    formulaExample: '73% of LinkedIn posts are never read past the first line. Most founders write for the 27%.',
    examples: [
      {
        hook: 'We had 340 signups on launch day. 12% activated. 3% came back the next week.',
        why: 'Cascading numbers tell the funnel story. Every founder knows this pain.',
        bestFor: 'Launch analysis, activation, retention posts',
      },
      {
        hook: '47 investor rejections. One yes. Here\'s what changed between rejection 40 and rejection 47.',
        why: 'The exact number (47) makes it feel documented, not exaggerated.',
        bestFor: 'Fundraising, persistence posts',
      },
      {
        hook: 'I wrote 2 posts in all of 2023. I\'ve written 36 posts in the past 12 weeks. Here\'s what shifted.',
        why: 'Personal comparison across time. Most founders see themselves in the 2-post number.',
        bestFor: 'Content consistency, LinkedIn growth posts',
      },
      {
        hook: 'Our top feature takes 14 clicks to reach. Our most-used feature is on the homepage. We built the 14-click feature first.',
        why: 'The absurdity of the numbers highlights a universal product mistake without editorializing.',
        bestFor: 'Product decisions, UX, prioritization posts',
      },
      {
        hook: '11 churned users. 1 common reason. 4 months before we figured it out.',
        why: 'Compressed timeline with human regret. The 4 months is the emotional punch.',
        bestFor: 'Churn, customer research, product posts',
      },
      {
        hook: 'We talked to 200 potential users before writing a line of code. 180 said they wanted the product. 3 paid for it.',
        why: 'The gap between 180 and 3 is the lesson. No explanation needed.',
        bestFor: 'Validation, PMF, founder lessons posts',
      },
      {
        hook: '$0 in revenue for 11 months. Then $8,400 in month 12. Same product. Different channel.',
        why: 'The contrast drives curiosity. What changed? Readers need to know.',
        bestFor: 'Distribution, GTM, growth channel posts',
      },
      {
        hook: 'One post. 41,000 impressions. 12 investor DMs. Here\'s the exact structure I used.',
        why: 'Specific outcome + promise of replicable method. High click-through intent.',
        bestFor: 'LinkedIn growth, post structure posts',
      },
    ],
    avoid: [
      '"90% of startups fail" - Overused, context-free, says nothing new.',
      'Stats without a source when they are not your own data - Readers fact-check.',
      'Vague ranges ("most", "many", "some") - These are not stat hooks, they are opinion hooks.',
      'Starting with "Did you know..." - Signals a generic fact dump, not a founder insight.',
      'Stats that require background knowledge to understand - The hook has 3 seconds. If it needs a footnote, rewrite it.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'stat'),
  },

  // ─── Contrarian ──────────────────────────────────────────────────────────────
  {
    slug: 'contrarian',
    metaTitle: 'LinkedIn Contrarian Hook Examples for Founders (25 That Work)',
    metaDescription: '25 contrarian LinkedIn hook examples. How to challenge conventional wisdom without sounding arrogant. With formula, examples, and what to avoid.',
    headline: 'LinkedIn Hook Examples: Contrarian Hooks',
    subheadline: 'A contrarian hook challenges something readers believe. Not for the sake of it - to make them think.',
    intro: 'Contrarian hooks get high engagement because they create a reaction. But most contrarian posts on LinkedIn fail because they challenge something nobody actually believes, or they take a position without being able to back it up. The best contrarian hooks challenge a real belief held by smart people, backed by a specific experience.',
    formula: '[Common advice or belief]. [One word contradiction]. [Your counter-experience in one sentence].',
    formulaExample: '"Hire slowly, fire fast." We did the opposite. Our two fastest hires became our two best team members.',
    examples: [
      {
        hook: 'Stop trying to find product-market fit. You will know when you have it because you will not be able to stop it.',
        why: 'Challenges the "search for PMF" framework. Takes a strong position that sparks debate.',
        bestFor: 'Product-market fit, founder mindset posts',
      },
      {
        hook: 'The best thing you can do for your LinkedIn is to stop thinking about LinkedIn.',
        why: 'Paradox format. Forces the reader to hold two contradictory ideas simultaneously.',
        bestFor: 'Content strategy, founder presence posts',
      },
      {
        hook: 'We ignored our top-requested feature for 6 months. It was the best product decision we ever made.',
        why: 'Counterintuitive but immediately believable. Founders relate to user requests they did not want to build.',
        bestFor: 'Product prioritization, founder decisions posts',
      },
      {
        hook: '"Move fast and break things" got us stuck for 3 months cleaning up what we broke.',
        why: 'Challenges a canonical startup mantra with a direct personal consequence.',
        bestFor: 'Engineering, startup culture, founder lessons posts',
      },
      {
        hook: 'I hired a coach. My productivity went down. My clarity went up. Worth it.',
        why: 'The nuance (productivity down, clarity up) shows real thinking, not a simple success story.',
        bestFor: 'Founder mental health, personal development posts',
      },
      {
        hook: 'The worst thing for our growth was getting featured in TechCrunch.',
        why: 'Counterintuitive outcome from a universally desired milestone.',
        bestFor: 'Growth, distribution, PR posts',
      },
      {
        hook: 'We reduced our free tier from unlimited to 12 posts per month. Conversions tripled.',
        why: 'Counterintuitive pricing outcome backed by a specific result.',
        bestFor: 'Pricing, monetization, freemium posts',
      },
      {
        hook: 'The advice nobody gave me when I started: talk less, listen more, and wait longer before building anything.',
        why: 'Frames common advice as missing. Creates empathy with founders who got the wrong playbook.',
        bestFor: 'Founder advice, early-stage posts',
      },
    ],
    avoid: [
      'Taking contrarian positions you cannot defend with personal experience - You will get challenged in comments.',
      '"Hot take:" as an opener - Signals you are about to perform, not share a real belief.',
      'Contrarian positions that are just cynicism - "Everything is broken" is not a take, it is a mood.',
      'Challenging advice that no serious person actually believes - False contrarianism gets dismissed quickly.',
      'Ending without a reason - State the position, but give the experience that earned it.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'contrarian'),
  },

  // ─── Confession ──────────────────────────────────────────────────────────────
  {
    slug: 'confession',
    metaTitle: 'LinkedIn Confession Hook Examples for Founders (25 That Work)',
    metaDescription: '25 confession hook examples that build founder credibility. The format that turns vulnerability into authority on LinkedIn.',
    headline: 'LinkedIn Hook Examples: Confession Hooks',
    subheadline: 'Admission earns more trust than achievement. These hooks lead with what went wrong.',
    intro: 'Confession hooks work because they are rare. LinkedIn is full of success stories and lessons-learned posts that have been cleaned up after the fact. A founder who admits a real mistake, a real belief that turned out to be wrong, or a real cost they paid earns disproportionate credibility. The key: the confession must be specific, and it must be genuinely honest.',
    formula: 'I [did / believed / ignored] [specific thing]. It cost me [specific consequence]. Here\'s what I know now.',
    formulaExample: 'I ignored our churn rate for 4 months because I was focused on new signups. When I finally looked, we had a leaking bucket. Here\'s what I know now.',
    examples: [
      {
        hook: 'I was a bad manager for the first year of our company. I confused being direct with being dismissive.',
        why: 'Specific failure (bad manager) with a specific cause (confused directness with dismissiveness). Not vague self-deprecation.',
        bestFor: 'Leadership, team building, founder growth posts',
      },
      {
        hook: 'I said "yes, we can do that" to a customer we could not serve well. We kept them for 3 months. They left angry. I should have said no on day one.',
        why: 'Timeline, outcome, and the clearer choice are all in the hook. The lesson is implicit.',
        bestFor: 'Sales, customer fit, founder decisions posts',
      },
      {
        hook: 'I built for 6 months without talking to a single user. I thought I knew what they needed. I was wrong about almost everything.',
        why: 'The "almost" is important. It is more honest than "wrong about everything."',
        bestFor: 'Customer discovery, product, build-in-public posts',
      },
      {
        hook: 'I raised money before I was ready. Not financially - I was not ready for what it does to your relationship with risk.',
        why: 'The second sentence reframes what "ready" means. Unexpected angle on a common experience.',
        bestFor: 'Fundraising, founder mindset posts',
      },
      {
        hook: 'Confession: I have shipped features to avoid a hard conversation with my co-founder. It never worked.',
        why: 'The "confession" framing is earned here because it reveals something the founder is not proud of.',
        bestFor: 'Co-founder dynamics, honest founder posts',
      },
      {
        hook: 'I spent 3 months optimizing a metric that did not matter. MRR was growing but our best customers were quietly leaving.',
        why: 'Specific metric confusion that any founder running a SaaS product will recognize.',
        bestFor: 'Metrics, product analytics, founder mistakes posts',
      },
      {
        hook: 'I hired someone because I liked them. Not because they were right for the role. They were not. We both paid for that.',
        why: '"We both paid for that" shows empathy for the hire, not just for the founder. Rare.',
        bestFor: 'Hiring, team building, founder lessons posts',
      },
      {
        hook: 'I wrote 0 posts for 8 months because I was afraid of what people would think. The only person who noticed was me.',
        why: 'The fear is universal. The punchline deflates it without being preachy.',
        bestFor: 'LinkedIn presence, content consistency posts',
      },
    ],
    avoid: [
      'Confessions that are humble-brags - "I was too focused on our 10x growth" is not a real admission.',
      'Confessions where the lesson is too tidy - Real mistakes take time to understand. Be honest about ambiguity.',
      'Admitting things that carry no real cost - Low-stakes confessions create low-trust responses.',
      '"I\'m not perfect, but..." - This cancels out the confession before it lands.',
      'Confessions that hurt someone else more than you - Protect employees, co-founders, and customers in what you share.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'confession'),
  },

  // ─── Bold claim ──────────────────────────────────────────────────────────────
  {
    slug: 'bold-claim',
    metaTitle: 'LinkedIn Bold Claim Hook Examples for Founders (25 That Work)',
    metaDescription: '25 bold claim hook examples for LinkedIn. How to make a strong opening statement that earns the right to be read. With formula and breakdowns.',
    headline: 'LinkedIn Hook Examples: Bold Claim Hooks',
    subheadline: 'A bold claim is a promise. Your post must deliver the proof.',
    intro: 'Bold claim hooks work because they create instant commitment. The reader either agrees or disagrees - either way, they are in. But a bold claim without substance underneath is just clickbait. The best bold claim hooks make a specific, defensible assertion and then use the rest of the post to prove it.',
    formula: '[Strong declarative statement]. [One sentence that sets up the proof].',
    formulaExample: 'Most founders are building the wrong product. Not because of bad execution - because of the wrong question.',
    examples: [
      {
        hook: 'Your LinkedIn headline is losing you customers every day. Most founders have no idea.',
        why: 'Immediate consequence (losing customers) + implicit challenge (what is your headline doing?)',
        bestFor: 'LinkedIn optimization, personal brand posts',
      },
      {
        hook: 'The reason your posts get 8 likes is not your writing. It is your hook.',
        why: 'Relieves the reader of blame (writing) and redirects to something fixable (hook).',
        bestFor: 'LinkedIn writing, content strategy posts',
      },
      {
        hook: 'Consistency is not a personality trait. It is a system. You do not have a motivation problem.',
        why: 'Two declarative sentences that reframe the problem entirely.',
        bestFor: 'Founder habits, productivity, mindset posts',
      },
      {
        hook: 'Most "lessons learned" posts teach nothing. Here is how to tell the difference.',
        why: 'Meta-commentary on a content format. Immediately creates curiosity about the criteria.',
        bestFor: 'Content quality, LinkedIn writing posts',
      },
      {
        hook: 'LinkedIn organic reach is the best-kept secret in B2B distribution right now. This window will close.',
        why: 'Urgency without hyperbole. The "will close" is the implicit call to act.',
        bestFor: 'LinkedIn growth, distribution, founder presence posts',
      },
      {
        hook: 'The best founders I know do not have better ideas. They have better information.',
        why: 'Reframes success from innate ability (ideas) to learnable behavior (information gathering).',
        bestFor: 'Founder mindset, decision-making posts',
      },
      {
        hook: 'Your first 100 users are more important than your first 10,000. Most founders act like it is the other way around.',
        why: 'Strong position that most founders will want to agree or argue with.',
        bestFor: 'Early traction, customer development posts',
      },
      {
        hook: 'You do not have a content problem. You have a specificity problem.',
        why: 'Reframes a common complaint in two sentences. Creates immediate curiosity about the distinction.',
        bestFor: 'LinkedIn writing, personal brand, founder voice posts',
      },
    ],
    avoid: [
      'Bold claims you cannot substantiate in the post body - The hook is a check the post must cash.',
      '"I\'m going to change how you think about X" - Too self-important. Let the content do that.',
      'Claims that are bold but empty ("Success starts with mindset") - These are poster slogans, not hooks.',
      'Clickbait that misleads ("I made $1M in one day" for a post about a $12 sale) - Destroys trust permanently.',
      'Bold claims about other people\'s failures - Punching down reads as arrogance, not insight.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'bold-claim'),
  },

  // ─── Data-driven ─────────────────────────────────────────────────────────────
  {
    slug: 'data',
    metaTitle: 'LinkedIn Data-Driven Hook Examples for Founders (25 That Work)',
    metaDescription: '25 data-driven LinkedIn hook examples. How to open a post with research, analysis, or original data that makes readers stop and pay attention.',
    headline: 'LinkedIn Hook Examples: Data-Driven Hooks',
    subheadline: 'Original data stops scrolls better than any opinion. Here is how to open with evidence that earns attention.',
    intro: 'Data-driven hooks work because they signal that what follows is based on observation, not assumption. A founder who opens with "I analyzed 200 posts" has done something. A founder who opens with "here is my take" is just one of thousands. The best data hooks come from original research - even a small sample from your own experience carries more weight than citing someone else\'s report.',
    formula: 'I [analyzed / tracked / measured] [specific thing] over [time or sample size]. Here is what I found.',
    formulaExample: 'I tracked my last 30 LinkedIn posts across impressions, comments, and profile visits. One pattern showed up in every high-performing post.',
    examples: [
      {
        hook: 'I analyzed 200 LinkedIn posts from seed-stage founders. 80% had the same problem in the first line.',
        why: 'Specific sample (200 posts), specific audience (seed-stage founders), specific problem framing (first line). Readers want to know if they have this problem.',
        bestFor: 'Content strategy, LinkedIn writing posts',
      },
      {
        hook: 'We ran 4 pricing experiments last quarter. The one that worked surprised us.',
        why: 'Compressed curiosity gap. Four experiments, one winner, unexpected result. Readers need to know which one.',
        bestFor: 'Pricing, product, growth posts',
      },
      {
        hook: 'I counted: 14 of my last 20 posts got fewer than 200 impressions. Here is what the other 6 had in common.',
        why: 'Personal data is the most credible data. The founder is exposing their own numbers, which builds immediate trust.',
        bestFor: 'LinkedIn growth, content strategy posts',
      },
      {
        hook: 'After 47 customer calls, I finally understand why people churn. It is not what I thought.',
        why: 'Large sample (47 calls) signals real work done. The "not what I thought" creates the curiosity gap.',
        bestFor: 'Customer research, churn, product posts',
      },
      {
        hook: 'We A/B tested two onboarding flows. Version B had 3x better activation. The difference was one sentence.',
        why: 'Specific metric (3x activation). The specificity of "one sentence" makes this feel like a real finding, not a vague improvement.',
        bestFor: 'Product, UX, activation posts',
      },
      {
        hook: 'I read every 1-star review of the 5 biggest tools in our space. The same complaint appeared in 80% of them.',
        why: 'Research framing establishes credibility. The 80% stat creates urgency around what that complaint is.',
        bestFor: 'Competitive analysis, product positioning posts',
      },
      {
        hook: 'Our best-performing LinkedIn post this year had zero likes for the first 4 hours. Then it hit 22,000 impressions.',
        why: 'Real data from personal experience. The delayed traction is a counterintuitive finding that rewards reading.',
        bestFor: 'LinkedIn algorithm, content strategy posts',
      },
      {
        hook: 'I tracked where every paying customer came from in Q1. 60% came from one channel I almost ignored.',
        why: 'The "almost ignored" detail makes this feel like a genuine discovery rather than a planned insight.',
        bestFor: 'Distribution, GTM, growth channel posts',
      },
    ],
    avoid: [
      'Citing industry reports without adding your own observation - "Studies show that 90% of content fails" says nothing about you.',
      'Vague data: "many", "most", "a lot" - these are not data, they are feelings dressed as data.',
      'Inflating sample sizes - "I studied 5 posts" is not a dataset. Be honest about the scale.',
      'Data without interpretation - a number alone is not a hook. Add what it means or what surprised you.',
      'Data that leads nowhere - the hook must promise a finding, not just a measurement.',
    ],
    relatedTypes: ALL_TYPES.filter(t => t.slug !== 'data'),
  },
]

export function getHookTypePage(slug: string): HookTypePage | undefined {
  return hookTypePages.find(p => p.slug === slug)
}
