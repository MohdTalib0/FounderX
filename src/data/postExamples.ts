export interface PostExample {
  title: string
  tone: 'Safe' | 'Bold' | 'Contrarian'
  toneColor: 'green' | 'amber' | 'red'
  body: string
  why: string
}

export interface PostExamplesTopic {
  slug: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  intro: string
  examples: PostExample[]
  tips: string[]
  relatedTopics: { slug: string; label: string }[]
}

const ALL_RELATED = [
  { slug: 'fundraising', label: 'Fundraising' },
  { slug: 'product-launch', label: 'Product Launch' },
  { slug: 'build-in-public', label: 'Build in Public' },
  { slug: 'hiring', label: 'Hiring' },
  { slug: 'lessons-learned', label: 'Lessons Learned' },
  { slug: 'founder-mindset', label: 'Founder Mindset' },
]

export const postExamplesTopics: PostExamplesTopic[] = [
  // ─── Fundraising ────────────────────────────────────────────────────────────
  {
    slug: 'fundraising',
    metaTitle: 'LinkedIn Post Examples for Fundraising (Safe, Bold, Contrarian)',
    metaDescription: 'Real LinkedIn post examples founders use when talking about fundraising, rejections, and investor relationships. Copy, adapt, and post.',
    headline: 'LinkedIn Post Examples: Fundraising',
    subheadline: 'What founders actually post when raising, getting rejected, or reflecting on the process.',
    intro: 'Fundraising is one of the most followed founder journeys on LinkedIn. Investors, other founders, and future hires all pay attention. These examples show how to write about the process in a way that builds credibility without oversharing or sounding like a press release.',
    examples: [
      {
        title: 'The honest rejection story',
        tone: 'Safe',
        toneColor: 'green',
        body: `We got rejected by 47 investors before closing our seed round.

Here's what I learned from those no's:

1. "Not the right time" usually means "not the right traction"
2. The most useful rejections came with a specific reason
3. Three VCs who passed introduced us to the investor who said yes

The rejections weren't wasted time. They were market research.

We raised $850K in the end. The round took 6 months longer than I expected.

Anyone else gone through a longer-than-expected raise? What helped you stay focused?`,
        why: 'Specific numbers (47, $850K, 6 months) make this credible. Lessons are structured. Ends with a question that founders actively want to answer.',
      },
      {
        title: 'The contrarian take on term sheets',
        tone: 'Bold',
        toneColor: 'amber',
        body: `The worst advice I got during our fundraise: "Take the highest valuation you can get."

We almost did.

The term sheet with the highest cap came with 2x liquidation preference and full ratchets. The "lower" offer had clean terms.

We took the clean terms. Founders 18 months ahead of us told us we'd thank ourselves later.

They were right.

Valuation is a vanity metric during the seed stage. Terms are everything.

What did your most experienced advisor tell you that turned out to be right?`,
        why: 'Shares genuine insight that is counterintuitive without being obvious. The "clean terms vs. high valuation" tension is real and respected in the founder community.',
      },
      {
        title: 'The contrarian on storytelling to investors',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `Stop trying to tell investors a compelling story.

Tell them the truth instead.

I spent our first 3 pitch meetings trying to make our numbers look better than they were. Smart VCs saw through it immediately. The meetings that went well were the ones where I said: "Here's where we are, here's what's not working, here's why we still believe this works."

Investors fund founders who know their business deeply. Not founders who can spin.

The best fundraising advice nobody gives: be the most honest person in the room.

Hot take or do you agree?`,
        why: 'Challenges a widely held belief (storytelling = pitching). Backs it with a specific personal experience. Invites debate without being combative.',
      },
    ],
    tips: [
      'Specific numbers build more trust than general claims. "$850K raised" beats "we closed our round."',
      'Rejections are reader magnets. Founders at all stages relate to them.',
      'Avoid sounding like a PR announcement. "We are thrilled to announce" signals nothing was learned.',
      'The best fundraising posts end with a question to other founders - this builds real community.',
      'Keep the investor name out of it unless they have given explicit permission.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'fundraising'),
  },

  // ─── Product launch ──────────────────────────────────────────────────────────
  {
    slug: 'product-launch',
    metaTitle: 'LinkedIn Post Examples for Product Launches (3 Tones)',
    metaDescription: 'How founders post about product launches on LinkedIn without sounding like a press release. Real examples across safe, bold, and contrarian tones.',
    headline: 'LinkedIn Post Examples: Product Launch',
    subheadline: 'How to announce what you built without sounding like a startup press release.',
    intro: 'Product launches are the post type most founders get wrong. They write a marketing announcement when LinkedIn readers want a founder story. These examples show how to share a launch in a way that is honest, specific, and genuinely interesting to follow.',
    examples: [
      {
        title: 'The honest launch day story',
        tone: 'Safe',
        toneColor: 'green',
        body: `We launched publicly today.

227 signups in the first 4 hours. 3 support tickets. 1 critical bug we found at 2am that we fixed before most users woke up.

The thing nobody tells you about launch day: it feels both bigger and smaller than you expected at the same time.

Bigger because real people are using something you built. Smaller because the anxiety disappears and gets replaced by: "okay, what's next?"

We've been building in private for 8 months. Today was the first day the thing existed outside our heads.

Thank you to the 40 beta users who helped us get here.

What was your launch day like?`,
        why: 'Real numbers (227, 3, 1, 2am, 8 months) ground the story. Emotional honesty about what launch day actually feels like. Ends with gratitude and a question.',
      },
      {
        title: 'The uncomfortable truth about launch traction',
        tone: 'Bold',
        toneColor: 'amber',
        body: `We launched 2 weeks ago. Here's the honest version of how it went:

Day 1: 340 signups. I thought we'd nailed it.
Day 3: 12% activated. I panicked.
Day 7: 3% still active. I had a long conversation with my co-founder.
Day 14: We understood our activation problem completely.

Launch day is not the milestone. It is the start of a new problem.

The founders who grow are not the ones who had a perfect launch. They're the ones who diagnosed what went wrong in the first 2 weeks and fixed it.

What did your first 14 days look like?`,
        why: 'Buries the vanity metric (340 signups) and surfaces the real work (3% active). Most founders relate to this but few say it out loud.',
      },
      {
        title: 'Challenging the Product Hunt obsession',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `We deliberately did not launch on Product Hunt.

I know. Heresy.

Here's why: Product Hunt traffic converts at 0.8% for B2B SaaS based on every founder I've spoken to who tracked it. The day after the spike, you're at baseline. The users who come from PH are tech-savvy procrastinators, not your ICP.

We spent the same energy doing direct outreach to 200 people who fit our ideal customer profile.

Conversion rate: 14%. Retention at 30 days: 41%.

Not saying PH is wrong for everyone. But if your ICP is not "people who browse Product Hunt," you might be optimizing for the wrong distribution channel.

Disagree? I want to hear the other side.`,
        why: 'Takes a real and defensible contrarian stance. Backs it with specific numbers. Invites debate without dismissing the other view.',
      },
    ],
    tips: [
      'Never start with "I am excited to announce." It signals you are writing for PR, not for people.',
      'Day 1 numbers are vanity. Day 14 retention is the real signal - and readers respect founders who know this.',
      'If your launch did not go as planned, that is your best post. Honest failure posts out-perform success announcements.',
      'Tag 1-2 people who meaningfully helped (co-founder, early users, an advisor). Do not create a thank-you list.',
      'If you raise a round on the same day, choose one story. Both in one post dilutes both.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'product-launch'),
  },

  // ─── Build in public ─────────────────────────────────────────────────────────
  {
    slug: 'build-in-public',
    metaTitle: '9 LinkedIn Build-in-Public Post Examples for Founders',
    metaDescription: 'How to build in public on LinkedIn without oversharing or sounding performative. Real post examples across Safe, Bold, and Contrarian tones.',
    headline: 'LinkedIn Post Examples: Build in Public',
    subheadline: 'How to share the messy middle of building without oversharing or sounding performative.',
    intro: 'Build-in-public is the most powerful content strategy for founders - and the one most often done wrong. Done right, it is honest, specific, and creates real community. Done wrong, it is a performance of struggle that rings hollow. These examples show the difference.',
    examples: [
      {
        title: 'The weekly progress post',
        tone: 'Safe',
        toneColor: 'green',
        body: `Week 14 of building in public.

What happened this week:
- Shipped the comment feature we have been working on for 3 weeks
- Had 5 user calls. 4 said onboarding was confusing.
- Lost 1 paying customer (churn reason: competitor)
- Wrote 2 pieces of content. One got 4K impressions.

The honest number: we are at $1,200 MRR. Down $80 from last week.

I share these numbers not because they are impressive. Because in 12 months I want to look back and see exactly where we were.

Anyone else find that writing weekly updates forces you to be more honest with yourself?`,
        why: 'Real numbers at every turn. The frame ("I want to look back") explains why the founder is sharing this - removes the "why is he posting this?" question.',
      },
      {
        title: 'The mistake post',
        tone: 'Bold',
        toneColor: 'amber',
        body: `I made a mistake that cost us 3 months of progress.

I built a feature nobody asked for.

Not a little feature. A full workflow builder. 8 weeks of engineering. Shipped it. 3 users tried it. 0 kept using it.

The reason we built it: I assumed I knew what users wanted because one user mentioned it once in a call.

One mention is a signal. One mention is not a requirement.

Here is what I do differently now: any feature that takes more than 2 weeks gets validated by 5 conversations first. No exceptions.

3 months of progress for a lesson I could have read in any product book. I had to live it to actually learn it.

What is the most expensive lesson your startup has taught you?`,
        why: 'Specific (8 weeks, 3 users, 0 retention, 5 conversations). Teaches a clear lesson. Self-aware without being self-pitying.',
      },
      {
        title: 'Against performative vulnerability',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `Hot take: most "build in public" content is not actually honest.

It is a performance of honesty.

"We struggled but then we figured it out."
"This was hard but it made us stronger."
"Our darkest moment became our turning point."

Every story has a redemption arc. Every hard moment ends with a lesson. Every failure becomes a win.

Real building is messier than that. Some weeks you ship nothing. Some months you go backwards. Some decisions you still do not know if they were right.

Build in public is valuable. But the sanitized version is just marketing with a vulnerability filter.

The founders I trust most are the ones who share problems they have not solved yet.

Am I wrong?`,
        why: 'Names a real pattern in a space (sanitized BIP content) that the audience already notices but does not say. Invites genuine debate.',
      },
    ],
    tips: [
      'Real numbers every time. Founders who share MRR, user counts, and retention earn trust that vague posts never can.',
      'Share a problem before you have solved it. Posts where you say "I do not know yet" outperform lessons-learned posts.',
      'The weekly update format (what happened, honest number, lesson) is the highest-signal BIP format on LinkedIn.',
      'Avoid the redemption arc every time. Not every hard week needs a silver lining.',
      'Tag nobody in a struggle post unless they have read it and agreed to be included.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'build-in-public'),
  },

  // ─── Hiring ──────────────────────────────────────────────────────────────────
  {
    slug: 'hiring',
    metaTitle: 'LinkedIn Post Examples for Startup Hiring (That Actually Work)',
    metaDescription: 'How founders write LinkedIn posts that attract great hires. Real examples with specific language, honest job descriptions, and founder voice.',
    headline: 'LinkedIn Post Examples: Hiring',
    subheadline: 'Hiring posts that attract people who actually want to work at a startup, not just people looking for any job.',
    intro: 'Most startup hiring posts on LinkedIn read like job board listings. The founders who attract the best early hires write about what the work is actually like. These examples show how to post about hiring in a way that self-selects for the right candidates.',
    examples: [
      {
        title: 'The honest "what this job is actually like" post',
        tone: 'Safe',
        toneColor: 'green',
        body: `We are looking for our first full-time engineer.

Here is what this job actually is:

The good: you will ship features that real users see within days, not sprints. You will have a direct line to why we are building what we are building. Your work will matter immediately.

The hard: we do not have a QA team yet. The codebase has some parts that need love. We are still figuring out our process as we go.

The honest: we are at $4K MRR with 180 users. Early. Real.

If that sounds like the right kind of challenge, I would like to talk to you. We pay market rate. We are remote-first. Equity is real.

DM me or comment. I read every message.`,
        why: 'Structured "good / hard / honest" format signals the founder respects the candidate\'s intelligence. Specific numbers qualify candidates before they apply.',
      },
      {
        title: 'Why we turned down experienced candidates',
        tone: 'Bold',
        toneColor: 'amber',
        body: `We interviewed 14 people for our first hire. We turned down 9 with impressive resumes.

Here is what we were actually looking for that resumes do not show:

1. Do they ask about our users or about the tech stack first?
2. Do they talk about what they built or what team they were on?
3. When I say "we have a messy codebase," do they lean in or hesitate?

Experienced does not always mean right for early stage. We hired someone with 3 years of experience over candidates with 10+.

The reason: they had shipped things alone. Big-company engineers often have not.

The best early hire is not the most impressive candidate. It is the one who has something to prove.

What do you actually look for in early hires?`,
        why: 'The 3-question filter is immediately actionable and highly shareable. Challenges the "always hire the most experienced" assumption with a real hiring lens.',
      },
      {
        title: 'Against the job description as a filter',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `The worst thing we did when hiring: wrote a job description.

We listed 14 requirements. We got 60 applications. 55 did not read what we actually do.

The best hire we ever made came through a DM from someone who had read our blog, used our product, and had a specific idea for improving it. No application. No resume. Just a message.

Job descriptions filter for people who are good at applying for jobs. That skill has almost no overlap with being good at early-stage startup work.

The next hire we make, I am not posting a JD. I am posting about a problem we are trying to solve and seeing who has strong opinions about it.

How do you find early-stage people who are actually a fit?`,
        why: 'Challenges a near-universal startup practice. The alternative method (post a problem, see who responds) is actionable and surprising.',
      },
    ],
    tips: [
      'Specific company stage and metrics help candidates self-select. "$4K MRR" saves everyone time.',
      'The "good / hard / honest" structure is the most trusted hiring post format on LinkedIn.',
      'Never write a bullet list of 14 requirements in a LinkedIn post. You are writing for humans, not HR systems.',
      'Tell them what the first 30 days will actually look like. Specificity signals a well-run team.',
      'End with a direct action: "DM me" or "comment below." Make it easy for the right person to respond.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'hiring'),
  },

  // ─── Lessons learned ─────────────────────────────────────────────────────────
  {
    slug: 'lessons-learned',
    metaTitle: 'LinkedIn Post Examples • Lessons Learned (Founder Edition)',
    metaDescription: 'How founders write lessons-learned posts that actually teach something. Real examples that avoid generic advice and share specific insight.',
    headline: 'LinkedIn Post Examples: Lessons Learned',
    subheadline: 'How to write a lessons-learned post that actually teaches something, not just lists things everyone already knows.',
    intro: 'The lessons-learned post is the most common format on founder LinkedIn - and the most often done badly. Most are lists of advice that sound like they came from any business book. The ones that perform are specific, personal, and unexpected. These examples show the difference.',
    examples: [
      {
        title: 'The specific lesson from a specific mistake',
        tone: 'Safe',
        toneColor: 'green',
        body: `18 months in. Here is the most useful thing I have learned:

Talk to churned customers, not current ones.

Current customers will tell you what features to add. Churned customers will tell you why they left. Those are not the same conversation.

We were getting consistent 4/5 scores on NPS surveys. Felt good. Then I spent one week talking to 11 users who had cancelled.

Every single one left for the same reason: they did not understand how to get value from the core feature in week one.

We had an onboarding problem, not a feature problem. Our NPS was hiding it.

If you are not regularly talking to people who left, you are only hearing one side of the story.

What is the most useful conversation you have had with a churned user?`,
        why: 'One specific lesson, backed by one specific experience (11 users, NPS hiding the real problem). Not a list of advice. One insight, argued well.',
      },
      {
        title: 'The lesson that went against received wisdom',
        tone: 'Bold',
        toneColor: 'amber',
        body: `The most common advice I ignored that I am glad I ignored:

"Do things that do not scale."

We scaled too early instead. And it was the right call for us.

Everyone told us to do manual concierge work with each user in year one. We did that for 3 months. Our per-user time was 4 hours.

We built the automation. Dropped to 20 minutes per user. Freed up 60 hours a month to improve the product.

The advice applies to sales and distribution. Not to operations. These are different problems.

Context matters more than the advice itself.

What piece of common startup advice have you broken on purpose?`,
        why: 'Does not just restate the original advice. Actually challenges it with a specific counter-example. The question at the end is one founders actively want to answer.',
      },
      {
        title: 'Against the "10 lessons in one post" format',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `Unpopular opinion: "10 lessons after 2 years of building" posts are mostly useless.

Not because the founder does not know things. Because forcing 10 insights into a post means every one is half-formed.

You cannot explain why "hire slowly" matters without telling the story of the hire you rushed and what it cost you.

You cannot explain "talk to customers daily" without telling me how many customers you actually talked to and what you learned.

Lists of lessons are a substitute for one insight argued well.

The most valuable post you could write is one lesson, one story behind it, one reason it applies to someone else.

I would rather read 300 words about one thing you genuinely learned than 1,000 words of advice you have assembled.

What is the one lesson you would actually write a full essay about?`,
        why: 'Calls out a widely practiced format in a way that founders who write a lot will recognize immediately. Gives a clear alternative. Does not lecture - it has a real argument.',
      },
    ],
    tips: [
      'One lesson argued well outperforms a list of ten. Pick your best insight and go deep.',
      'The lesson should come from a specific experience, not general reflection. "After talking to 11 churned users" beats "in my experience."',
      'Avoid lessons that could appear in any business book. The more specific to your stage and context, the better.',
      'Include a counter-argument to your own lesson. It shows you have actually thought about it.',
      'The best ending is a question that asks for the reader\'s version of the same lesson.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'lessons-learned'),
  },

  // ─── Founder mindset ─────────────────────────────────────────────────────────
  {
    slug: 'founder-mindset',
    metaTitle: 'LinkedIn Post Examples • Founder Mindset (Not Generic Motivation)',
    metaDescription: 'How founders write about mental models, decision-making, and mindset without sounding like a motivational speaker. Real post examples.',
    headline: 'LinkedIn Post Examples: Founder Mindset',
    subheadline: 'How to write about mental models and hard decisions without sounding like a motivational calendar.',
    intro: 'Founder mindset posts are the hardest to write well. Done badly, they are generic motivation that anyone could have written. Done well, they share a specific mental model or hard decision that only a founder in the middle of building could offer. These examples show how.',
    examples: [
      {
        title: 'The decision framework post',
        tone: 'Safe',
        toneColor: 'green',
        body: `There is a decision I face every week as a founder. I have gotten better at it.

When a user asks for a feature, there are only 3 possible things happening:

1. They are describing a symptom of a deeper problem
2. They are describing the exact feature they need
3. They are wrong about what they need

The mistake most founders make: assuming it is number 2.

The question I now ask before building anything: "What are you trying to accomplish when you want this?" Not "what do you want?" But why do you want it.

Took me 14 months to stop building answers to questions and start solving the underlying problems.

What question do you ask before deciding to build something?`,
        why: 'Shares a concrete framework (3 possible things) grounded in real experience (14 months). Ends with a question that invites other founders to share their version.',
      },
      {
        title: 'The uncomfortable truth about motivation',
        tone: 'Bold',
        toneColor: 'amber',
        body: `I am not motivated every day. I am consistent every day. Those are not the same thing.

On motivated days, I make ambitious product decisions, have great calls, and write well.

On unmotivated days, I do the work anyway. Answer emails. Ship the small thing. Update the doc nobody reads.

The difference between founders who make it and those who don't is not motivation. It is whether they have built systems that work when motivation does not show up.

My most important system: a list of "small wins" tasks I can complete in under 30 minutes. On bad days, I do those. I ship something. I feel less stuck.

Motion creates motivation, not the other way around.

What do you do on the days when you do not feel like doing any of it?`,
        why: 'Challenges the "stay motivated" framing that fills most mindset content. The concrete alternative (small wins list, 30 minutes) is immediately actionable.',
      },
      {
        title: 'Against the hustle narrative',
        tone: 'Contrarian',
        toneColor: 'red',
        body: `I worked 80-hour weeks for 4 months. My best quarter came after I capped at 45.

This is not a productivity hack post. This is an honest data point.

At 80 hours, I was making decisions faster but worse. I was in more meetings but less present. I was shipping more but understanding users less.

The "hustle harder" advice optimizes for the feeling of work, not the output of work.

Hard stages require intensity. Most stages require clarity. These are not the same resource.

I am not saying to work less. I am saying: if your best thinking happens at hour 12, something is wrong with the first 11 hours.

Is the 80-hour week a badge of honor or a failure of prioritization? Genuinely asking.`,
        why: 'Takes a real and defensible position against a common founder myth. Uses personal data (80 hours vs. 45) instead of abstract argument. Ends with a real question.',
      },
    ],
    tips: [
      'Mindset posts live or die by specificity. "I realized something important" is the weakest possible opener. Tell them what you realized.',
      'Back every mental model with the experience that taught it to you. The model alone is just advice. The story makes it a lesson.',
      'Avoid inspirational language. "Believe in yourself" belongs on a poster. "I almost quit in month 8 because of X" belongs on LinkedIn.',
      'The best mindset posts have a counter-argument built in. "This is not for everyone because..." shows actual thinking.',
      'End with the real version of your insight in one sentence. Make it quotable without being a quote.',
    ],
    relatedTopics: ALL_RELATED.filter(t => t.slug !== 'founder-mindset'),
  },
]

export function getPostExamplesTopic(slug: string): PostExamplesTopic | undefined {
  return postExamplesTopics.find(t => t.slug === slug)
}
