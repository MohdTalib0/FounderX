export interface BlogSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'quote' | 'callout' | 'divider'
  content: string | string[]
}

export interface BlogArticle {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  intro: string
  sections: BlogSection[]
  relatedSlugs?: string[]
}

export const articles: BlogArticle[] = [
  // ── Article 1 ────────────────────────────────────────────────────────────────
  {
    slug: 'why-chatgpt-linkedin-posts-dont-sound-like-you',
    title: 'Why Your ChatGPT LinkedIn Posts Don\'t Sound Like You',
    description: 'ChatGPT isn\'t bad at writing. It\'s bad at writing like you. Here\'s exactly why your AI-generated LinkedIn posts sound generic - and what actually fixes it.',
    date: '2026-03-20',
    readTime: '6 min read',
    category: 'AI Writing',
    intro: 'You\'ve tried ChatGPT for LinkedIn posts. It gave you something. You read it, thought "that\'s not me," and either rewrote the whole thing or never posted it. This happens to almost every founder who tries AI writing tools. The tool isn\'t broken. The model is wrong.',
    sections: [
      {
        type: 'h2',
        content: 'The real problem isn\'t the AI',
      },
      {
        type: 'p',
        content: 'ChatGPT is a very capable writer. It can write in dozens of styles, tones, and formats. The problem is that it doesn\'t know which style is yours.',
      },
      {
        type: 'p',
        content: 'Every time you open ChatGPT, it starts from zero. It has no memory of who you are, what you\'ve said before, what your company does, how you think about your industry, or what you sound like when you\'re at your best. You are a stranger to it.',
      },
      {
        type: 'p',
        content: 'So when you type "write me a LinkedIn post about our product launch," it writes something. Something competent. Something that could have been written by any founder at any company. Which is exactly the problem.',
      },
      {
        type: 'h2',
        content: 'You can\'t brief your way out of this',
      },
      {
        type: 'p',
        content: 'The common advice is to give ChatGPT a better prompt. Add context. Describe your tone. Paste your previous posts. Give it examples.',
      },
      {
        type: 'p',
        content: 'This helps. But it doesn\'t solve the problem. Here\'s why:',
      },
      {
        type: 'ul',
        content: [
          'Your voice is more than tone. It\'s your worldview, your specific examples, the way you structure an argument, the things you believe that most people don\'t, the stories only you have.',
          'You can\'t capture that in a prompt. Not really. A prompt is a description of a person. Your voice is the person.',
          'The briefing resets every session. Tomorrow you start over. You brief it again. It forgets again.',
          'Even with a perfect prompt, the AI is still approximating you. It\'s working from a description, not a model.',
        ],
      },
      {
        type: 'p',
        content: 'The result is always the same: something that reads like what you would write if you were a slightly worse version of yourself, slightly more corporate, slightly more generic. You recognize the shape of your thinking, but not the voice.',
      },
      {
        type: 'h2',
        content: 'What "sounding like you" actually requires',
      },
      {
        type: 'p',
        content: 'Authentic LinkedIn posts have four things that generic AI output almost never has:',
      },
      {
        type: 'ol',
        content: [
          'A specific opinion. Not "consistency is important" but "I think most founders post too much about wins and not enough about decisions." Opinions are personal. Generic AI avoids them.',
          'A real example. Not "a customer gave us feedback" but "last Tuesday, a user told us our onboarding was confusing and then became our most vocal advocate six weeks later." Specificity is impossible to fake.',
          'Your rhythm. Some people write in short punchy sentences. Some build slowly. Some open with a question. That rhythm is yours. AI defaults to a safe middle.',
          'Something you actually believe. Posts that resonate usually contain a take the writer genuinely holds. AI generates positions. It doesn\'t hold them.',
        ],
      },
      {
        type: 'h2',
        content: 'Why "better prompting" is a dead end',
      },
      {
        type: 'p',
        content: 'There is an entire cottage industry around prompt engineering for LinkedIn. Prompt templates. System prompts. Context windows filled with your past posts.',
      },
      {
        type: 'p',
        content: 'These approaches are better than nothing. But they have a ceiling. The ceiling is that you\'re still describing yourself to a blank-slate AI every time you want a post. That description will always be incomplete. The output will always be an approximation.',
      },
      {
        type: 'p',
        content: 'And beyond the quality problem, there\'s the time problem. Writing a 500-word system prompt before every LinkedIn post is not a posting system. It\'s a different kind of blank page.',
      },
      {
        type: 'quote',
        content: 'AI doesn\'t sound generic because it\'s bad. It sounds generic because it doesn\'t know who you are.',
      },
      {
        type: 'h2',
        content: 'What actually fixes it: a persistent voice layer',
      },
      {
        type: 'p',
        content: 'The fix is not a better prompt. It\'s a model of you that persists.',
      },
      {
        type: 'p',
        content: 'Instead of briefing an AI every session, you build a voice layer once. It captures your stage, your industry, how you think about your work, your content pillars, your tone. And then every post it generates comes from that model, not from a blank prompt.',
      },
      {
        type: 'p',
        content: 'The difference is significant. When you brief an AI, it writes for a character you\'ve described. When you have a voice layer, it writes from a model of who you actually are.',
      },
      {
        type: 'ul',
        content: [
          'You build it once, in about 4 questions',
          'Every post, rewrite, and comment generates from it',
          'You never explain yourself to the AI again',
          'The output improves the more specific you were in setup',
        ],
      },
      {
        type: 'h2',
        content: 'The test',
      },
      {
        type: 'p',
        content: 'There\'s a simple test for whether an AI-generated post sounds like you: show it to someone who knows you well. Not tell them you used AI. Just show them the post.',
      },
      {
        type: 'p',
        content: 'If they say "that sounds like you," it worked. If they say "hm, that\'s interesting" or "did you write that yourself?" it didn\'t.',
      },
      {
        type: 'p',
        content: 'Most ChatGPT outputs fail this test. Most voice-layer outputs pass it. That\'s the difference worth solving for.',
      },
      {
        type: 'callout',
        content: 'Wrively builds your Voice Layer in 4 questions and writes every LinkedIn post from it. The output sounds like you wrote it on a clear-headed day. Free to start, no credit card required.',
      },
    ],
    relatedSlugs: [
      '3-minute-linkedin-posting-system-for-founders',
      'how-to-write-linkedin-post-that-sounds-like-you',
    ],
  },

  // ── Article 2 ────────────────────────────────────────────────────────────────
  {
    slug: '3-minute-linkedin-posting-system-for-founders',
    title: 'The 3-Minute LinkedIn Posting System for Founders',
    description: 'Most founders don\'t have a content problem. They have a system problem. Here\'s the exact posting workflow that gets you from blank page to published LinkedIn post in under 3 minutes, every week.',
    date: '2026-03-18',
    readTime: '7 min read',
    category: 'Strategy',
    intro: 'Founders who post consistently on LinkedIn are not more creative than you. They are not better writers. They do not have more to say. They have a system. Here is that system.',
    sections: [
      {
        type: 'h2',
        content: 'The consistency problem is actually a friction problem',
      },
      {
        type: 'p',
        content: 'Every founder knows LinkedIn matters. Investors research you there. Early customers follow you. Potential hires form their first impression of the company from your profile and your posts.',
      },
      {
        type: 'p',
        content: 'So why do most founders post once every six weeks, if that? It\'s not a motivation problem. It\'s a friction problem.',
      },
      {
        type: 'p',
        content: 'Posting on LinkedIn requires making a series of small decisions, and each one burns enough mental energy that most people give up before they start:',
      },
      {
        type: 'ul',
        content: [
          'What should I post about today?',
          'How do I start the post without sounding like every other founder?',
          'Is this take too obvious? Too niche? Too promotional?',
          'Should I be more vulnerable or more authoritative?',
          'Is this long enough? Too long?',
          'Did I just spend 45 minutes on this and still hate it?',
        ],
      },
      {
        type: 'p',
        content: 'A system eliminates most of these decisions. That\'s what makes it work.',
      },
      {
        type: 'h2',
        content: 'Step 1: Build your voice once (2 minutes, never repeated)',
      },
      {
        type: 'p',
        content: 'The most important step in any posting system is also the one most people skip: defining who you are before you write anything.',
      },
      {
        type: 'p',
        content: 'This means knowing, explicitly, before you sit down to write:',
      },
      {
        type: 'ul',
        content: [
          'What stage you\'re at and what you\'re building',
          'What your 3 to 5 content pillars are (the topics you return to repeatedly)',
          'What your tone is when you\'re at your best (direct, analytical, conversational, provocative)',
          'What you believe that most people in your space don\'t',
        ],
      },
      {
        type: 'p',
        content: 'Most founders have this information in their head but have never made it explicit. The act of making it explicit is what makes consistent posting possible, because it eliminates the "what should I post about" question entirely. You already know what you post about. You defined it.',
      },
      {
        type: 'h2',
        content: 'Step 2: Pick a topic from your pillars (30 seconds)',
      },
      {
        type: 'p',
        content: 'Content pillars are the recurring themes your posts return to. Think of them as the 3 to 5 categories your audience expects from you.',
      },
      {
        type: 'p',
        content: 'For an early-stage SaaS founder, they might look like:',
      },
      {
        type: 'ul',
        content: [
          'Build in public (sharing the real process, not the polished narrative)',
          'Hard lessons (things that went wrong and what you learned)',
          'Industry contrarian takes (what you believe that the consensus gets wrong)',
          'Customer stories (what users do that surprises you)',
          'Product decisions (why you built something a certain way)',
        ],
      },
      {
        type: 'p',
        content: 'With pillars defined, topic selection becomes: "which pillar am I in today?" That\'s a 5-second decision, not a 20-minute blank-page spiral.',
      },
      {
        type: 'h2',
        content: 'Step 3: Generate 3 variations, pick one (15 seconds)',
      },
      {
        type: 'p',
        content: 'The best posting systems produce multiple options for each topic. This matters for two reasons:',
      },
      {
        type: 'ol',
        content: [
          'You always have a fallback. If the bold version feels too risky today, you take the safe version. You still post.',
          'The act of choosing between options is much easier than creating from scratch. Decision is faster than creation.',
        ],
      },
      {
        type: 'p',
        content: 'The three variation types that work best for LinkedIn:',
      },
      {
        type: 'ul',
        content: [
          'Safe: builds authority, shares a lesson, positions you as experienced. Low risk, solid engagement from your existing audience.',
          'Bold: takes a clear position, names something others dance around. Higher risk, higher reward.',
          'Spicy: challenges conventional wisdom directly. Starts conversations. Best for growing reach beyond your current followers.',
        ],
      },
      {
        type: 'h2',
        content: 'Step 4: Copy and post (10 seconds)',
      },
      {
        type: 'p',
        content: 'One click. Paste. Post.',
      },
      {
        type: 'p',
        content: 'The system only works if this step stays this simple. The moment you start extensively editing, rewriting, or second-guessing at the copy stage, the system breaks. You\'re back to 45 minutes.',
      },
      {
        type: 'p',
        content: 'The key insight: if your voice layer is accurate, you should not need to heavily edit the output. Small tweaks are fine. Major rewrites mean the voice model needs updating, not that you need to rewrite every post by hand.',
      },
      {
        type: 'h2',
        content: 'Why 3 minutes is the right target',
      },
      {
        type: 'p',
        content: 'Three minutes is short enough that you can do it before your first meeting on any given day. It\'s short enough that a bad week doesn\'t break the habit. It\'s short enough that the psychological cost of skipping is higher than the cost of doing it.',
      },
      {
        type: 'p',
        content: 'Longer systems fail because they require a "good day." You need time, energy, and creative momentum all at once. Three-minute systems succeed because they require almost nothing from you.',
      },
      {
        type: 'quote',
        content: 'The goal is not to write the best post you\'ve ever written. The goal is to post this week. And next week. And the week after that. Consistency is the strategy.',
      },
      {
        type: 'h2',
        content: 'The compounding math of consistent posting',
      },
      {
        type: 'p',
        content: 'One post a week is 52 posts a year. Most founders post fewer than 10.',
      },
      {
        type: 'p',
        content: '52 posts means 52 chances for an investor to see you thinking clearly about your market. 52 chances for a potential hire to decide you\'re the kind of founder they want to work for. 52 chances for a customer to remember you exist when they\'re ready to buy.',
      },
      {
        type: 'p',
        content: 'The founders who win on LinkedIn aren\'t the ones who write the most insightful individual posts. They\'re the ones who show up every week. The compounding is the strategy.',
      },
      {
        type: 'h2',
        content: 'What breaks most systems',
      },
      {
        type: 'p',
        content: 'Three things kill posting systems before they get a chance to work:',
      },
      {
        type: 'ol',
        content: [
          'Perfectionism at the output stage. The post doesn\'t need to be great. It needs to exist. Post the 80% version.',
          'No predefined pillars. If you\'re deciding what to post about from scratch each time, the system collapses at step 1.',
          'Relying on motivation. Build the system for the days when you don\'t want to post. Those are the days that matter most.',
        ],
      },
      {
        type: 'callout',
        content: 'Wrively is built around this exact system. Your Voice Layer handles steps 1 and 3. You handle steps 2 and 4. Total time: under 3 minutes. Free to start.',
      },
    ],
    relatedSlugs: [
      'why-chatgpt-linkedin-posts-dont-sound-like-you',
      'linkedin-for-founders',
    ],
  },

  // ── Article 3 ────────────────────────────────────────────────────────────────
  {
    slug: 'how-to-write-linkedin-post-that-sounds-like-you',
    title: 'How to Write a LinkedIn Post That Sounds Like You Wrote It',
    description: 'Most LinkedIn advice tells you what to write. This one tells you how to sound like yourself when you write it. The difference between a post people scroll past and one they stop at is almost always voice.',
    date: '2026-03-15',
    readTime: '8 min read',
    category: 'Writing',
    intro: 'There is a version of you that writes really well. You\'ve probably heard it in conversation, in a good email, in a Slack message that landed. The challenge with LinkedIn is getting that version of you onto the page consistently, without spending 45 minutes on each post.',
    sections: [
      {
        type: 'h2',
        content: 'What "sounding like you" actually means',
      },
      {
        type: 'p',
        content: 'Voice is not tone. Tone is just formal versus casual, direct versus gentle. Voice is the combination of things that make your writing recognizable as yours even without your name attached.',
      },
      {
        type: 'p',
        content: 'It includes:',
      },
      {
        type: 'ul',
        content: [
          'The kinds of examples you reach for (data, stories, analogies, conversations)',
          'The length of your sentences and whether you vary them',
          'The positions you take and how confident you sound when you take them',
          'The things you notice that others in your field tend to miss',
          'How you open: question, statement, contradiction, scene',
        ],
      },
      {
        type: 'p',
        content: 'Most generic LinkedIn posts fail on all of these. They\'re tonally fine, structurally competent, and completely interchangeable. You could replace the author\'s name with any other founder and it would still make sense. That\'s the problem.',
      },
      {
        type: 'h2',
        content: 'The 4 elements of an authentic LinkedIn post',
      },
      {
        type: 'h3',
        content: '1. A specific opinion',
      },
      {
        type: 'p',
        content: 'Generic: "Building in public is a great strategy for founders."',
      },
      {
        type: 'p',
        content: 'Specific: "Most build-in-public content is performative. The useful version is sharing the decisions, not the outcomes."',
      },
      {
        type: 'p',
        content: 'The specific version takes a position. It could be disagreed with. That\'s what makes it interesting. Posts that could not possibly be argued with are posts no one bothers to engage with.',
      },
      {
        type: 'h3',
        content: '2. A real example',
      },
      {
        type: 'p',
        content: 'Generic: "We learned a lot from our early customers."',
      },
      {
        type: 'p',
        content: 'Specific: "Our third user told us the onboarding took too long. We cut it in half. She became our most active user and referred four others."',
      },
      {
        type: 'p',
        content: 'Specificity is the single biggest differentiator between posts that feel authentic and posts that feel generated. AI can\'t produce real specifics. Only you have them.',
      },
      {
        type: 'h3',
        content: '3. Your rhythm',
      },
      {
        type: 'p',
        content: 'Read your best emails or messages out loud. Notice the rhythm. Are you someone who writes in short punchy bursts? Do you build slowly and land hard at the end? Do you use questions? Dashes? Lists?',
      },
      {
        type: 'p',
        content: 'That rhythm is yours. A post that breaks it will feel off to anyone who knows you, and subtly off to anyone who doesn\'t.',
      },
      {
        type: 'h3',
        content: '4. Something you actually believe',
      },
      {
        type: 'p',
        content: 'The most resonant posts contain something the writer genuinely holds as true, even if it\'s uncomfortable or unpopular. Readers can feel the difference between performed conviction and real conviction. You cannot fake it reliably.',
      },
      {
        type: 'h2',
        content: 'Why this is hard to do consistently',
      },
      {
        type: 'p',
        content: 'Knowing the elements of a good post is not the hard part. The hard part is producing them reliably, on a Tuesday morning when you have three meetings and a customer escalation.',
      },
      {
        type: 'p',
        content: 'When you\'re stretched thin, you default to safe. Safe means generic. Generic means no one stops scrolling.',
      },
      {
        type: 'p',
        content: 'The solution is not to try harder. It\'s to have a system that produces your voice even on the days you\'re not at your best. The best version of you should be the default, not the aspirational target.',
      },
      {
        type: 'h2',
        content: 'How to find your content pillars',
      },
      {
        type: 'p',
        content: 'A content pillar is a recurring topic your audience learns to expect from you. Three to five is the right number. More than that and you lose focus. Fewer and you run out of things to say.',
      },
      {
        type: 'p',
        content: 'To find yours, answer these:',
      },
      {
        type: 'ol',
        content: [
          'What do you talk about in 1-on-1 conversations that you never see written about well?',
          'What\'s the thing you believe about your industry that most people are getting wrong?',
          'What have you failed at that taught you something real?',
          'What questions do customers, investors, or other founders keep asking you?',
          'What would you write if you knew no one from your network would see it?',
        ],
      },
      {
        type: 'p',
        content: 'The answers to those questions are your pillars. They\'re specific to you. They cannot be copied.',
      },
      {
        type: 'h2',
        content: 'The shortcut most people miss',
      },
      {
        type: 'p',
        content: 'Your best LinkedIn posts already exist. Not as posts, but as conversations, emails, and messages you\'ve already written.',
      },
      {
        type: 'p',
        content: 'Look at:',
      },
      {
        type: 'ul',
        content: [
          'The email you wrote last month explaining your product strategy to an investor',
          'The Slack message where you pushed back on a bad idea from your team',
          'The voice note you left someone explaining why you made a hard decision',
          'The customer email where you apologized for a bug and explained what you were learning',
        ],
      },
      {
        type: 'p',
        content: 'All of those are LinkedIn posts. They have your voice, your specifics, your opinions. The work is mostly extraction, not creation.',
      },
      {
        type: 'quote',
        content: 'Your voice already exists. The goal is to find a system that lets you access it reliably, not to invent a new one.',
      },
      {
        type: 'h2',
        content: 'What a voice layer does differently',
      },
      {
        type: 'p',
        content: 'Most AI writing tools write for a generic founder. A voice layer writes for you, specifically.',
      },
      {
        type: 'p',
        content: 'The difference is that a voice layer is trained on who you are before it generates anything. Your stage, your industry, your content pillars, your tone, the topics you return to. Every post it generates comes from that model, not from a blank prompt.',
      },
      {
        type: 'p',
        content: 'The practical result: posts that pass the "sounds like me" test with people who know you. Not just posts that are structurally correct, but posts that are recognizably yours.',
      },
      {
        type: 'callout',
        content: 'Wrively builds your Voice Layer from 4 questions, then writes every LinkedIn post from it. Safe, Bold, or Spicy. Under 3 minutes. Free to start.',
      },
    ],
    relatedSlugs: [
      'why-chatgpt-linkedin-posts-dont-sound-like-you',
      '3-minute-linkedin-posting-system-for-founders',
    ],
  },

  // ── Article 4 (Pillar) ───────────────────────────────────────────────────────
  {
    slug: 'linkedin-for-founders',
    title: 'LinkedIn for Founders: The Complete Guide to Building Your Presence',
    description: 'A complete guide to LinkedIn for startup founders. Why it matters, what to post, how to build a voice, and the posting system that actually sticks. No fluff, no generic advice.',
    date: '2026-03-10',
    readTime: '14 min read',
    category: 'Strategy',
    intro: 'LinkedIn is the one platform where investors, early customers, potential hires, and journalists all live and pay attention. For a founder, that concentration of relevant people in one place is too valuable to ignore. And yet most founders either post erratically or not at all. This guide explains why, and what to do about it.',
    sections: [
      {
        type: 'h2',
        content: 'Why LinkedIn matters more for founders than any other platform',
      },
      {
        type: 'p',
        content: 'The platform that attracts the most professional attention from people who matter to your company is LinkedIn. Not Twitter. Not Substack. LinkedIn.',
      },
      {
        type: 'ul',
        content: [
          'Investors use it to research founders before taking a meeting',
          'Early customers follow founders they respect before buying their product',
          'Potential hires watch your content before deciding whether to apply',
          'Journalists find sources and story angles from founders they follow',
          'Partners and potential co-founders discover you through your thinking',
        ],
      },
      {
        type: 'p',
        content: 'No other single platform concentrates all of these audiences in one place. A founder who posts consistently on LinkedIn for 12 months creates an asset that does work permanently, even when they\'re not actively posting.',
      },
      {
        type: 'h2',
        content: 'What most founders get wrong',
      },
      {
        type: 'p',
        content: 'There are three common failure modes for founders on LinkedIn:',
      },
      {
        type: 'h3',
        content: '1. Posting only about wins',
      },
      {
        type: 'p',
        content: 'Press releases dressed as posts. Product launches. Funding announcements. Hiring updates. These have their place but they\'re not what builds an audience. People follow you because you help them think, not because you update them on your milestones.',
      },
      {
        type: 'h3',
        content: '2. Writing for a generic audience',
      },
      {
        type: 'p',
        content: 'The founders with the strongest LinkedIn presence are not trying to appeal to everyone. They\'re writing for a specific kind of person, often the exact same person they\'re trying to sell to. The narrower the intended audience, the more that audience responds.',
      },
      {
        type: 'h3',
        content: '3. Treating it as a megaphone, not a conversation',
      },
      {
        type: 'p',
        content: 'The fastest way to grow on LinkedIn is through comments, not posts. Leaving 10 specific, thoughtful comments on relevant posts will generate more profile views and followers than writing one post. Most founders ignore this completely.',
      },
      {
        type: 'h2',
        content: 'What actually works: the content types',
      },
      {
        type: 'p',
        content: 'Not all LinkedIn content performs equally. These are the formats that consistently generate engagement and followers for founders:',
      },
      {
        type: 'h3',
        content: 'Hard lessons',
      },
      {
        type: 'p',
        content: 'Posts that describe something that went wrong and what you learned from it. These are the highest-performing content type for founders because they\'re rare (most people only share wins), they\'re specific (they happened to you), and they\'re useful (the lesson applies to others).',
      },
      {
        type: 'h3',
        content: 'Contrarian takes',
      },
      {
        type: 'p',
        content: 'A position that challenges a commonly held belief in your industry. These generate engagement through disagreement and agreement in equal measure. The key is that you must actually believe it. Performed contrarianism is immediately obvious.',
      },
      {
        type: 'h3',
        content: 'Build in public',
      },
      {
        type: 'p',
        content: 'Sharing the decisions, trade-offs, and real-time thinking behind building your company. Not just the outcomes. The reasoning. "We decided to do X instead of Y because..." posts are rare and valuable. They show how you think, which is what makes people want to work with you.',
      },
      {
        type: 'h3',
        content: 'Customer stories',
      },
      {
        type: 'p',
        content: 'Specific stories about specific customers, with their permission. What they were trying to do, what they found, what changed for them. These are better sales content than any case study, because they\'re human and specific.',
      },
      {
        type: 'h3',
        content: 'Process reveals',
      },
      {
        type: 'p',
        content: 'How you do something that others do differently. Your hiring process. Your product prioritization framework. How you run investor updates. People who are trying to build similar things will save these posts and share them.',
      },
      {
        type: 'h2',
        content: 'Building a posting system that actually sticks',
      },
      {
        type: 'p',
        content: 'The reason most founders don\'t post consistently is not a motivation problem. It\'s a system problem.',
      },
      {
        type: 'p',
        content: 'A posting system has three components:',
      },
      {
        type: 'ol',
        content: [
          'Defined content pillars: the 3 to 5 recurring topics you return to. Defined once, not reinvented weekly.',
          'A generation method: how you go from a vague topic to a publishable post without a 45-minute ordeal.',
          'A publishing habit: a specific time and day when you review and post, not "whenever I feel inspired."',
        ],
      },
      {
        type: 'p',
        content: 'Without all three, consistency is impossible. Most founders have none of them.',
      },
      {
        type: 'h2',
        content: 'Finding your content pillars',
      },
      {
        type: 'p',
        content: 'Content pillars are the themes your audience learns to expect from you. They should come from the intersection of what you know well, what your audience cares about, and what you actually want to talk about.',
      },
      {
        type: 'p',
        content: 'To find yours:',
      },
      {
        type: 'ul',
        content: [
          'List the 5 things you know better than 95% of founders in your space',
          'List the 3 things you believe about your market that the consensus gets wrong',
          'List the 5 hardest decisions you\'ve made in the last year',
          'List the questions your customers ask you most often',
        ],
      },
      {
        type: 'p',
        content: 'From those four lists, your pillars will be obvious. They\'re the themes that appear repeatedly across multiple lists.',
      },
      {
        type: 'h2',
        content: 'Voice: the thing most people skip',
      },
      {
        type: 'p',
        content: 'The founders with the most engaged LinkedIn audiences don\'t just post about the right topics. They post with a recognizable voice. Their posts are distinguishable even without a name attached.',
      },
      {
        type: 'p',
        content: 'Voice is not tone. Tone is formal versus casual. Voice is the combination of your opinions, your examples, your rhythm, and your specific way of looking at a problem.',
      },
      {
        type: 'p',
        content: 'The shortcut to finding your voice is not to try to invent one. It\'s to notice the writing you\'ve already done that felt natural and worked. Look at your best emails, your best Slack messages, the explanation you gave a new hire about how the company works. That\'s your voice. The job is to access it consistently.',
      },
      {
        type: 'h2',
        content: 'The comment strategy most founders ignore',
      },
      {
        type: 'p',
        content: 'The fastest growth on LinkedIn comes from comments, not from posts. This is true for almost every founder who has grown an audience quickly.',
      },
      {
        type: 'p',
        content: 'The mechanism:',
      },
      {
        type: 'ol',
        content: [
          'Identify 15 to 20 accounts your target audience follows (investors, other founders, industry voices)',
          'Leave a specific, thoughtful comment on their posts every day',
          'Not "great post" but a genuine extension of the idea, a counterpoint, or a specific example',
          'Do this for 60 days without stopping',
        ],
      },
      {
        type: 'p',
        content: 'What happens: the author\'s audience sees your comment repeatedly. They click your profile. They see your posts. They follow you. Your comment is a free advertisement to an audience that already trusts the person you\'re responding to.',
      },
      {
        type: 'h2',
        content: 'The consistency math',
      },
      {
        type: 'p',
        content: 'One post per week, every week, for one year: 52 posts.',
      },
      {
        type: 'p',
        content: 'Most founders post fewer than 10 times in a year. The gap between 10 posts and 52 posts is not creative talent. It\'s system.',
      },
      {
        type: 'p',
        content: '52 posts means:',
      },
      {
        type: 'ul',
        content: [
          '52 opportunities for an investor to see you think clearly',
          '52 touch points with potential customers before they\'re ready to buy',
          '52 pieces of evidence that you\'re serious about building in public',
          '52 reasons for the right hire to choose you over another company',
        ],
      },
      {
        type: 'p',
        content: 'Consistency is a strategy. It compounds in ways that burst activity does not.',
      },
      {
        type: 'h2',
        content: 'Getting started: the first week',
      },
      {
        type: 'ol',
        content: [
          'Write down your 3 to 5 content pillars. Spend 20 minutes on this. It will shape everything else.',
          'Pick your posting day and time. Write it in your calendar as a recurring event.',
          'Find 15 accounts your target audience follows. Save them.',
          'Write your first post. Use your roughest draft. Post it. Perfection is not the goal.',
          'Leave 3 comments today. Specific ones. Not generic ones.',
        ],
      },
      {
        type: 'p',
        content: 'That\'s it for week one. The system builds from there.',
      },
      {
        type: 'quote',
        content: 'The founders who win on LinkedIn aren\'t the most creative. They\'re the most consistent. And consistency is a system problem, not a motivation problem.',
      },
      {
        type: 'callout',
        content: 'Wrively is built for exactly this system. Your Voice Layer, your content pillars, 3 post variations in under 3 minutes. Free to start, no credit card required.',
      },
    ],
    relatedSlugs: [
      '3-minute-linkedin-posting-system-for-founders',
      'why-chatgpt-linkedin-posts-dont-sound-like-you',
      'how-to-write-linkedin-post-that-sounds-like-you',
    ],
  },
  // ── Article 5 ────────────────────────────────────────────────────────────────
  {
    slug: 'linkedin-algorithm-2026-what-founders-need-to-know',
    title: 'The LinkedIn Algorithm in 2026: What Founders Actually Need to Know',
    description: 'Most LinkedIn algorithm advice is outdated or wrong. Here is what actually drives reach for founders posting original content in 2026 - based on what is working now.',
    date: '2026-03-18',
    readTime: '9 min read',
    category: 'Strategy',
    intro: 'Most LinkedIn algorithm guides were written for marketers managing brand accounts. They focus on optimal posting times, hashtag counts, and engagement pod tactics. None of that is the highest-leverage information for a founder posting as themselves. Here is what actually matters.',
    sections: [
      {
        type: 'h2',
        content: 'The one metric LinkedIn actually optimizes for',
      },
      {
        type: 'p',
        content: 'LinkedIn\'s algorithm is not trying to make your posts go viral. It is trying to keep people on LinkedIn longer. The signal it cares most about is dwell time: how long does someone spend looking at your post before scrolling away.',
      },
      {
        type: 'p',
        content: 'This changes everything about how you should write. A post that gets 200 likes but no one reads past the first three lines is less valuable to LinkedIn than a post with 40 likes where most readers spent 45 seconds. Engagement rate matters. But engagement quality matters more.',
      },
      {
        type: 'quote',
        content: 'LinkedIn does not reward virality. It rewards posts that make people stop, read, and respond.',
      },
      {
        type: 'h2',
        content: 'The first 60 to 90 minutes are everything',
      },
      {
        type: 'p',
        content: 'When you publish a post, LinkedIn shows it to a small sample of your network first. If that sample engages, it expands distribution. If it does not, the post is effectively dead.',
      },
      {
        type: 'p',
        content: 'This initial window is approximately 60 to 90 minutes. What happens in it determines whether your post reaches 500 people or 50,000. This is why posting time matters, but not the way most guides present it.',
      },
      {
        type: 'ul',
        content: [
          'Post when your most engaged followers are online, not when global LinkedIn usage peaks',
          'For most B2B founders, Tuesday through Thursday mornings (7am to 9am in your audience\'s time zone) outperform other windows',
          'Avoid Friday afternoons and weekends for original content - lower engagement in the initial window means poor distribution regardless of post quality',
          'The first comment on your own post, within the first 30 minutes, adds context and signals engagement to the algorithm',
        ],
      },
      {
        type: 'h2',
        content: 'What the algorithm rewards in 2026',
      },
      {
        type: 'p',
        content: 'LinkedIn has shifted its distribution model significantly since 2023. What worked then - hashtag optimization, tagging people in posts, posting links - no longer works the same way.',
      },
      {
        type: 'ol',
        content: [
          'Original first-person perspective. The algorithm can now detect reposted or recycled content. Original takes, personal stories, and first-person observations consistently outperform reposted content by 3 to 5x in organic reach.',
          'Comments, not just likes. A like takes 0.2 seconds. A comment takes 30 seconds. The algorithm weights comments 5 to 10x more heavily than reactions. Posts that end with a specific question get disproportionate distribution.',
          'Early saves and reposts. When someone saves your post (the bookmark icon), it signals high-quality content to the algorithm. Reposts are the strongest signal of all - they mean someone valued your content enough to attach their name to it.',
          'Native video and documents. LinkedIn is actively promoting native video and PDF carousel posts to compete with other platforms. These formats consistently reach 2 to 4x more people than text posts with the same engagement rate.',
          'Consistency signals credibility. Posting 3 times per week for 4 weeks outperforms posting 12 times in one week, then going silent. The algorithm models your account as reliable or unreliable based on posting patterns.',
        ],
      },
      {
        type: 'h2',
        content: 'What no longer works',
      },
      {
        type: 'ul',
        content: [
          'Hashtag optimization: LinkedIn has publicly stated that hashtags have minimal impact on distribution. Three or fewer, in the body (not a block at the end), is fine. More than that looks like keyword stuffing.',
          'Tagging people who are not genuinely relevant: LinkedIn penalizes engagement bait. Tagging 10 people in the hope some comment hurts more than it helps.',
          'External links in the post body: Links to outside websites reduce distribution because they pull people off LinkedIn. If you need to share a link, put it in the first comment.',
          'Engagement pods: LinkedIn has become significantly better at detecting coordinated engagement from people outside your network. Pod activity no longer drives the distribution it did in 2022.',
          'Generic AI-sounding posts: LinkedIn\'s content moderation team has confirmed they are developing classifiers for low-quality AI-generated content. Posts that contain obvious AI tells ("In today\'s fast-paced world") are already being down-ranked in testing.',
        ],
      },
      {
        type: 'h2',
        content: 'The hook is still the only thing that matters for initial reach',
      },
      {
        type: 'p',
        content: 'Every post is shown in the feed with only the first two to three lines visible. On mobile, where over 60% of LinkedIn usage happens, that is often just one line. The hook determines whether anyone reads further. The rest of the post determines whether they engage.',
      },
      {
        type: 'p',
        content: 'A strong hook creates a gap between what the reader currently knows and what they want to know. It makes a specific claim, asks a question that is answerable, or opens a story mid-action. A weak hook starts with "I want to share," "I am excited to announce," or "Today I realized."',
      },
      {
        type: 'h2',
        content: 'The founder distribution advantage',
      },
      {
        type: 'p',
        content: 'Personal accounts consistently outperform company pages on LinkedIn. Company page posts reach an average of 5 to 10% of followers. Personal posts from active accounts reach 20 to 40% of followers in the initial distribution wave.',
      },
      {
        type: 'p',
        content: 'Founders who post as themselves, not as their company, have a structural advantage in LinkedIn\'s current algorithm. The platform is actively investing in personal content because it drives more engagement than corporate content. This window will not last forever. It is open now.',
      },
      {
        type: 'callout',
        content: 'The LinkedIn algorithm in 2026 rewards originality, dwell time, and consistent posting. The founders who build audiences this year are the ones who post in their own voice, consistently, with posts that actually make people stop and read.',
      },
      {
        type: 'h2',
        content: 'What this means for your posting system',
      },
      {
        type: 'ul',
        content: [
          'Post 3 times per week minimum. One post a week is not enough to build the consistency signal.',
          'Every post needs a hook that creates a gap. Test your first line: would a stranger stop scrolling for this?',
          'End every insight post with a specific, answerable question.',
          'Put external links in the first comment, not the post body.',
          'Post at the same times each week. Consistency in timing trains your audience to expect you.',
          'Your own first comment (within 30 minutes of posting) adds context and signals engagement.',
        ],
      },
    ],
    relatedSlugs: [
      '3-minute-linkedin-posting-system-for-founders',
      'how-to-write-linkedin-post-that-sounds-like-you',
      'linkedin-for-founders',
    ],
  },

  // ── Article 6 ────────────────────────────────────────────────────────────────
  {
    slug: 'linkedin-post-hook-examples-founders',
    title: 'LinkedIn Hook Examples for Founders: Safe, Bold, and Contrarian (With Breakdowns)',
    description: 'The first line of your LinkedIn post determines whether anyone reads the rest. Here are 18 real hook examples across three styles, with a breakdown of why each one works.',
    date: '2026-03-15',
    readTime: '10 min read',
    category: 'Writing',
    intro: 'The hook is the only part of your post that everyone sees. On mobile, it is often one line before the "...more" cutoff. If it does not create a reason to keep reading, the rest of your post does not exist. Here are 18 hook examples across three styles, with a breakdown of what makes each one work.',
    sections: [
      {
        type: 'h2',
        content: 'Why the first line decides everything',
      },
      {
        type: 'p',
        content: 'LinkedIn shows posts with a two to three line preview before the "see more" fold. On mobile that is often a single sentence. A reader makes the decision to keep reading or scroll in under two seconds.',
      },
      {
        type: 'p',
        content: 'A strong hook does one of three things: it creates a gap (something the reader wants to know the answer to), it makes a claim the reader wants to verify or challenge, or it opens a story at a moment of tension. Weak hooks describe what the post is about rather than pulling the reader into it.',
      },
      {
        type: 'h2',
        content: 'Safe hooks: credibility and authority',
      },
      {
        type: 'p',
        content: 'Safe hooks build trust. They signal expertise without being confrontational. They work especially well for insight posts, frameworks, and lessons from experience.',
      },
      {
        type: 'ol',
        content: [
          '"After 47 customer interviews, I finally understand why people churn." - Specific number creates authority. "Finally understand" signals a hard-earned insight, not surface advice.',
          '"We shipped our first product in 11 days. Here is the only shortcut that actually worked." - Specific timeline. "Only shortcut" creates a knowledge gap - what is the one thing?',
          '"I have made the same hiring mistake three times. Last week I figured out why." - Admission of failure builds trust. "Last week" makes it recent and specific.',
          '"The best onboarding email I ever wrote was 4 sentences long. This is what it said." - Counterintuitive ("best" = shortest). Creates immediate curiosity about the content.',
          '"Revenue stalled for 6 weeks. This is the exact message that broke the pattern." - Problem + specific result. "Exact message" promises a tangible takeaway.',
          '"I spent $40,000 on ads before learning this one thing about our ICP." - Cost anchor establishes stakes. The lesson is now worth paying attention to.',
        ],
      },
      {
        type: 'h2',
        content: 'Bold hooks: strong opinions',
      },
      {
        type: 'p',
        content: 'Bold hooks take a clear stance. They polarize slightly - some readers will agree strongly, some will push back. Both responses drive comments, which is the highest-value engagement signal on LinkedIn.',
      },
      {
        type: 'ol',
        content: [
          '"Most LinkedIn advice is written by people who have never built a company." - Direct challenge to a category. Immediately self-identifies with the reader who has felt the same.',
          '"Raising a seed round before finding product-market fit is the worst thing that happened to us." - Counterintuitive for a founder. Challenges a widely-held assumption.',
          '"The only LinkedIn metric that matters is how many DMs you get from people who want to work with you." - Dismisses vanity metrics. Forces the reader to agree or defend their current approach.',
          '"Founders who do not post on LinkedIn in 2026 are handing their distribution to their competitors." - Stakes-based claim. Creates urgency without being aggressive.',
          '"We almost did not build the feature that became 60% of our revenue. Here is what changed our minds." - Opens at a decision point. The reader wants to know what almost happened.',
          '"Cold email is dying. Here is what is replacing it for early-stage B2B founders." - Challenge to a widespread tactic. Specific audience signals relevance.',
        ],
      },
      {
        type: 'h2',
        content: 'Contrarian hooks: challenge the consensus',
      },
      {
        type: 'p',
        content: 'Contrarian hooks challenge something most people believe. They work best when you actually have evidence or experience to back the claim up - they should feel surprising, not just provocative.',
      },
      {
        type: 'ol',
        content: [
          '"The advice to launch fast nearly killed our startup." - Direct challenge to "launch fast" orthodoxy. Immediately relevant to any founder who has heard this advice.',
          '"Your investors are not your advisors. The founders who treat them that way scale slowest." - Challenges a comfortable narrative. Founders with experience will nod; those without will want to read why.',
          '"I grew from 0 to 8,000 LinkedIn followers without posting once about our product." - Counterintuitive growth story. "Without posting about our product" creates the knowledge gap.',
          '"The best thing I did for our growth rate was stop measuring it weekly." - Paradoxical. Forces the reader to reconcile the claim with their own assumptions.',
          '"We turned down our best offer because the VC insisted on a clause we had never heard of. It was the right call." - Tension (turned down best offer) + validation (it was right). The clause creates curiosity.',
          '"Our product was better than our competitor\'s. That is exactly why we were losing." - Complete inversion of the expected logic. Begs the question: how?',
        ],
      },
      {
        type: 'h2',
        content: 'What separates the hooks that work from the ones that do not',
      },
      {
        type: 'p',
        content: 'Looking across all 18 examples, three patterns emerge in the strongest ones:',
      },
      {
        type: 'ul',
        content: [
          'Specificity signals authenticity. "47 customer interviews" beats "dozens of customer interviews." Specific numbers, dates, and amounts make a claim feel lived-in rather than generated.',
          'Tension drives reading. The best hooks have something unresolved in them. A claim that needs justification, a story that opened mid-action, a number that raises a question. The reader keeps reading to resolve the tension.',
          'The hook implies the rest of the post. A reader who sees "We turned down our best offer" already knows the post will explain why. The hook has pre-answered "should I read this?" before they even decide.',
        ],
      },
      {
        type: 'h2',
        content: 'The hook test',
      },
      {
        type: 'p',
        content: 'Before publishing, apply this test to your first line: read it out loud and ask "so what?" If the answer is obvious - if there is no tension, no gap, no reason to keep reading - the hook needs rewriting.',
      },
      {
        type: 'p',
        content: 'A second test: show the first line to someone who does not know what the post is about. Ask if they want to read more. If the answer is "sure, I guess" - rewrite it. If the answer is "yes, what happened?" - publish it.',
      },
      {
        type: 'callout',
        content: 'Wrively generates Safe, Bold, and Contrarian versions of every post - including three different hook options for each. You pick the variation that fits the day. No rewriting required.',
      },
    ],
    relatedSlugs: [
      'how-to-write-linkedin-post-that-sounds-like-you',
      '3-minute-linkedin-posting-system-for-founders',
      'linkedin-algorithm-2026-what-founders-need-to-know',
    ],
  },

  // ── Article 7 ────────────────────────────────────────────────────────────────
  {
    slug: 'i-posted-on-linkedin-every-week-for-6-months',
    title: 'I Posted on LinkedIn Every Week for 6 Months. Here Is What Actually Happened.',
    description: 'Not the polished version. The real numbers, the posts that flopped, the ones that worked, and what changed after 6 months of consistent LinkedIn posting as a founder.',
    date: '2026-03-12',
    readTime: '11 min read',
    category: 'Strategy',
    intro: 'Six months ago I committed to posting on LinkedIn three times per week. Not to go viral. Not to become an influencer. To see if consistent posting actually moved the metrics that matter for a founder: investor interest, customer inbound, and hiring pipeline. Here is the unedited version of what happened.',
    sections: [
      {
        type: 'h2',
        content: 'Why I started (and why I almost stopped after week two)',
      },
      {
        type: 'p',
        content: 'The honest reason I started was guilt. I had been telling myself LinkedIn mattered for two years and posting maybe once every six weeks. Every founder I respected seemed to have a consistent presence. I did not.',
      },
      {
        type: 'p',
        content: 'The first two weeks were discouraging. My first post got 34 impressions and 2 likes, both from people I knew personally. My second post got 61 impressions. I was posting into what felt like silence. I nearly stopped.',
      },
      {
        type: 'p',
        content: 'The thing that kept me going was a conversation with another founder who had been posting for eight months. She told me: "Nothing happens for the first four to six weeks. The algorithm does not trust new, consistent behavior yet. Then something flips." She was right.',
      },
      {
        type: 'h2',
        content: 'The numbers: before and after',
      },
      {
        type: 'ul',
        content: [
          'Month 1: Average post reach 180 impressions. 0 inbound messages from the posts. 3 new followers per week.',
          'Month 2: Average post reach 420 impressions. 2 inbound messages (both from people I already knew). 6 new followers per week.',
          'Month 3: Average post reach 1,400 impressions. 4 inbound messages, 1 from someone I had never met. 15 new followers per week.',
          'Month 4: Average post reach 3,200 impressions. 8 inbound messages per week. One was an investor who had not responded to a cold email 4 months earlier.',
          'Month 5: Average post reach 5,800 impressions. One post hit 23,000 impressions organically. 3 qualified customer inquiries from LinkedIn that month.',
          'Month 6: Average post reach 7,400 impressions. 11 inbound messages per week. Two of them converted to paid customers. One resulted in a pilot conversation with an enterprise company I had been trying to reach for 6 months.',
        ],
      },
      {
        type: 'h2',
        content: 'What types of posts actually performed',
      },
      {
        type: 'p',
        content: 'I tracked every post for six months. Here is the honest breakdown of what worked and what did not, measured by reach, saves, and actual inbound messages generated.',
      },
      {
        type: 'ol',
        content: [
          'Failure posts outperformed everything. The posts where I shared something that went wrong, a decision I regretted, or a mistake I made publicly consistently reached 3 to 5x more people than posts about wins. People share failures. They save successes.',
          'Specific numbers create credibility. Posts with real metrics ("we went from $0 to $12k MRR in 4 months, here is exactly how") outperformed vague equivalents by a significant margin.',
          'Frameworks that can be used immediately. Posts that gave readers something they could apply the same day ("the three-question framework I use before every customer call") generated more saves and more DMs than narrative posts.',
          'Behind the scenes of decisions. Posts about why we made a specific product decision, what we considered, what we almost did instead. These consistently outperformed announcement posts.',
          'Long posts beat short posts, but only when they earned it. My highest-performing posts were all over 200 words. But short posts that opened with an extremely strong hook also performed well. The pattern was: strong hook, then length is secondary.',
        ],
      },
      {
        type: 'h2',
        content: 'What flopped',
      },
      {
        type: 'ul',
        content: [
          'Generic industry takes. "AI is changing everything." "The future of work is remote." Posts that could have been written by anyone about anything consistently underperformed.',
          'Product announcements. Pure product news without a human angle, lesson, or story consistently reached fewer than 200 people regardless of how significant the update was.',
          'Posts that started with "I." Not because LinkedIn penalizes it, but because "I" hooks are almost always weaker than claim-first or story-first hooks.',
          'Recycled content from other platforms. Twitter threads pasted into LinkedIn read differently. The format, the rhythm, and the audience expectation are different. What works on Twitter often feels sparse or disconnected on LinkedIn.',
          'Posts I was proud of when I wrote them but had no tension. The posts that felt the most complete and polished often performed the worst. The posts with a raw edge, an open question, or an uncomfortable admission performed the best.',
        ],
      },
      {
        type: 'h2',
        content: 'The real outcomes after 6 months',
      },
      {
        type: 'p',
        content: 'These are the outcomes I actually care about, not the vanity metrics:',
      },
      {
        type: 'ul',
        content: [
          'Two paying customers who found us directly through LinkedIn posts. Neither had ever heard of us before.',
          'One investor relationship that started as a comment on a post, became a DM conversation, and is now an active intro into a fund I had been trying to access for a year.',
          'Three strong candidates in our hiring pipeline who applied specifically because they had been following my posts and felt they understood our culture.',
          'A partnership conversation with a company I had cold-emailed twice with no response. They replied after seeing a post. Different entry point, same outcome.',
          'A measurably stronger close rate on inbound calls from people who had seen multiple posts before we spoke. They came in with context. The calls were shorter and more likely to convert.',
        ],
      },
      {
        type: 'h2',
        content: 'What I would do differently',
      },
      {
        type: 'ul',
        content: [
          'Start earlier. The compounding starts from the first post, but the results only become visible after 3 to 4 months. Every month you delay is a month of runway you are leaving on the table.',
          'Engage with comments faster. Posts that got engagement in the first 30 minutes consistently reached more people. I was slow to respond in the first two months. It hurt distribution.',
          'Post about failures sooner. I was protective about failure posts early on and saved the polished wins for LinkedIn. The failure posts were what actually built an audience.',
          'Use a system from day one. The weeks I spent most time deciding what to post were the weeks I almost skipped. The weeks I had a clear system - a topic, a format, a variation to pick from - I never missed.',
        ],
      },
      {
        type: 'callout',
        content: 'The system I ended up using for the last three months is Wrively. Topic in, three variations out, pick one, copy, post. Under 3 minutes. That is the whole workflow. If you are still staring at a blank page, that is the problem to solve first.',
      },
      {
        type: 'h2',
        content: 'The one thing I wish someone had told me before I started',
      },
      {
        type: 'p',
        content: 'LinkedIn rewards founders who show up as a person, not as a brand. The posts that built my audience were not the ones where I had the most polished insight. They were the ones where I was the most honest. The uncomfortable decision, the mistake I made in public, the thing I believed that most people in my space disagree with.',
      },
      {
        type: 'p',
        content: 'You already have that content. You lived it. You just need to post it.',
      },
    ],
    relatedSlugs: [
      '3-minute-linkedin-posting-system-for-founders',
      'linkedin-algorithm-2026-what-founders-need-to-know',
      'linkedin-for-founders',
    ],
  },
  // ── Article 8 ────────────────────────────────────────────────────────────────
  {
    slug: 'writing-in-your-voice-on-linkedin',
    title: 'Writing in Your Voice on LinkedIn: A Practical Guide for Founders',
    description: 'A practical guide to writing in your voice on LinkedIn: what founder voice actually means, why AI gets it wrong, and how to fix it for good.',
    date: '2026-03-10',
    readTime: '12 min read',
    category: 'Writing',
    intro: 'Most LinkedIn advice tells you to "be authentic." Nobody tells you how. Writing in your voice on LinkedIn is not a personality trait you either have or don\'t. It is a set of specific, learnable decisions you make every time you sit down to write. This guide is the one I wish I had when I started.',
    sections: [
      { type: 'h2', content: 'What "founder voice" actually means (it\'s not tone)' },
      { type: 'p', content: 'Most people confuse voice with tone. Tone is surface: formal, casual, warm, direct. Voice goes deeper. Your voice is the combination of what you notice, what you believe, how you structure an argument, what you leave out, and which details you reach for when making a point.' },
      { type: 'p', content: 'Two founders can have the same tone and completely different voices. One writes short, punchy sentences and always opens with a counterintuitive claim. The other writes in long, layered paragraphs and always earns the point before stating it. Same warmth, same directness. Different people.' },
      { type: 'p', content: 'This distinction matters because it tells you what you\'re actually trying to preserve when you write. You\'re not preserving a mood. You\'re preserving a way of seeing things that is specific to you, built from your career, your failures, your obsessions, your particular view of the market you\'re in.' },
      { type: 'callout', content: 'Voice is not how you sound. It\'s how you think on the page. Tone is a setting. Voice is a fingerprint.' },
      { type: 'h2', content: 'Why most AI output doesn\'t sound like you' },
      { type: 'p', content: 'There is a clean distinction between voice and style that most AI writing tools blur. Style is reproducible: sentence length, vocabulary level, use of questions, amount of white space. Voice is not reproducible from a description. It comes from a model of who you are.' },
      { type: 'p', content: 'When you ask a generic AI to "write like me," you are asking it to reproduce your style. It can do that reasonably well if you give it examples. But it cannot reproduce your voice, because your voice includes things that are not in your writing: the customer call that changed your mind last Tuesday, the thing you believe about your industry that you have never said publicly, the opinion you hold that would surprise your investors.' },
      { type: 'p', content: 'Generic AI also suffers from a structural problem: it resets every session. Even if you write the perfect system prompt today, tomorrow you start over. The AI that wrote your best post last week has no idea it wrote your best post last week. You are always a stranger to it.' },
      { type: 'quote', content: 'Style is what the AI can copy. Voice is what it can\'t, unless it actually knows you.' },
      { type: 'h2', content: 'The 4 elements of authentic LinkedIn voice' },
      { type: 'p', content: 'After reading hundreds of founder LinkedIn profiles and the posts that actually built audiences, the same four elements show up in the ones that resonate. These are diagnostic categories: when a post falls flat, one of these four is usually missing.' },
      {
        type: 'ol',
        content: [
          'Specificity. Not "we learned a lot from our early customers." Instead: "our seventh customer told us the feature we were most proud of was the one she never used." Specific details cannot be faked. They signal that you were actually there.',
          'Opinion. Not "distribution is important for early-stage startups." Instead: "I think most B2B founders build the wrong first channel and spend 18 months correcting it." An opinion is a claim someone could disagree with. If no one could disagree with your post, it\'s not an opinion. It\'s a platitude.',
          'Rhythm. Every writer has a natural cadence: how long their sentences run before they break, how often they ask a question, whether they repeat a phrase for emphasis or vary everything. Your rhythm is partly intuitive and partly trained. The goal is not to manufacture one but to notice yours and protect it.',
          'Context. Your posts exist inside a story your audience is following. What company are you building and why? What do you believe that most people in your space don\'t? What are you figuring out right now? When readers have that context, even a short post lands harder. Without it, the same post reads as generic.',
        ],
      },
      { type: 'h2', content: 'How to find your voice: the 3-post audit' },
      { type: 'p', content: 'If you\'ve been posting for a while, your voice is already in your best work. The job is to find it and name it so you can reproduce it deliberately instead of accidentally.' },
      { type: 'p', content: 'Pull the three LinkedIn posts you\'ve written that you felt best about. Not the ones with the most likes. The ones where you reread them and thought "yes, that\'s actually what I think." Then answer these questions for each one:' },
      {
        type: 'ul',
        content: [
          'What is the one sentence that sounds most like me? Why does it sound like me?',
          'What specific detail, story, or example did I use that only I could have used?',
          'What opinion did I state that not everyone in my industry would agree with?',
          'How long are my sentences when I\'m writing at my best? Short and staccato? Long and building?',
          'What did I leave out that another founder might have included?',
        ],
      },
      { type: 'p', content: 'After doing this for three posts, you will start to see patterns. Those patterns are your voice. Write them down. Not as rules, but as observations: "I reach for specific numbers." "I tend to start with the thing I got wrong." "I always explain why I changed my mind before I tell you what I changed it to."' },
      { type: 'h2', content: 'Common voice killers: the phrases that make you sound like everyone else' },
      { type: 'p', content: 'There are phrases that appear in so many LinkedIn posts they have lost any signal. When you use them, you are borrowing someone else\'s sentence instead of writing your own.' },
      {
        type: 'ul',
        content: [
          '"Unpopular opinion:" followed by something almost everyone agrees with.',
          '"Here\'s what I wish someone had told me earlier." Followed by advice that has been told to everyone.',
          '"I\'ve been in this industry for X years and I can tell you..." The credentialism opener.',
          '"Let that sink in." After a statistic that is mildly surprising.',
          '"The truth is..." Before a claim that is either obvious or unprovable.',
          '"Most people get this wrong." Without ever saying what the right answer is.',
        ],
      },
      { type: 'p', content: 'The fix is not to avoid these sentence shapes entirely. It is to notice when you are reaching for them and ask: what am I actually trying to say here? Usually there is a more specific, more true version of the same thought that sounds more like you.' },
      { type: 'h2', content: 'Safe vs Bold vs Contrarian: using all three without losing your voice' },
      { type: 'p', content: 'Safe posts are observations or updates your audience will nod along to. They build familiarity. They are low-risk and low-reward. You need some of them.' },
      { type: 'p', content: 'Bold posts state a position that is genuinely contested in your space. Not outrageous, just specific and defensible. "I think product-led growth is the wrong default for most B2B SaaS companies under 50 employees" is bold. It will attract disagreement. That disagreement is usually the point.' },
      { type: 'p', content: 'Contrarian posts go further: they challenge a dominant belief directly. Done well, they reframe how your audience thinks about a problem. Done poorly, they read as provocation for its own sake.' },
      { type: 'callout', content: 'A rough mix that works: two safe posts, two bold posts, one contrarian post per month. The exact ratio matters less than having all three in your rotation. If you only post safe content, you become wallpaper. If you only post contrarian takes, you become noise.' },
      { type: 'h2', content: 'The persistence problem' },
      { type: 'p', content: 'Here is the practical problem with using generic AI for voice-consistent LinkedIn writing. Every session is session one. The AI does not remember that last week you wrote about a pricing mistake. It does not know you have been building in public for two years. It does not know you have a strong opinion about a specific part of your market. It does not know any of it, unless you type it in again.' },
      { type: 'p', content: 'So the process becomes: open a new chat, re-explain who you are, re-explain what you\'re building, paste in example posts, describe your tone, describe your audience, and then ask for a post. Ten minutes of setup for two minutes of writing. And the output is still an approximation, because you cannot fully describe a voice in a prompt.' },
      { type: 'quote', content: 'The real cost of generic AI for writing is not the bad output. It\'s the context tax you pay every single session to get output that\'s merely okay.' },
      { type: 'h2', content: 'Building a Voice Layer: the fix' },
      { type: 'p', content: 'A Voice Layer is a persistent model of who you are as a writer. Not a style guide, not a prompt template. A model that the AI writes from every time, without you re-explaining anything.' },
      { type: 'p', content: 'It captures the things that are hardest to describe in a prompt but easiest to demonstrate in your writing: what you notice, what you believe, what examples you reach for, how your arguments are structured, what you leave out. Built once from your actual posts and answers to a small set of focused questions, it turns every subsequent session into a continuation instead of a restart.' },
      {
        type: 'ul',
        content: [
          'You never explain your company, audience, or tone again.',
          'The AI references your real opinions and positions, not invented ones.',
          'Your writing style carries over post to post.',
          'You focus the session entirely on the idea, not the context.',
        ],
      },
      { type: 'h2', content: 'Practical exercise: write your voice brief in 5 minutes' },
      { type: 'p', content: 'Open a notes app and answer these five questions as fast as you can, without editing yourself:' },
      {
        type: 'ol',
        content: [
          'What is one thing you believe about your industry that most people in your space would push back on?',
          'What is the most specific story from the last six months of building that changed how you think about something?',
          'How would a colleague describe how you talk about your work? Not how you would describe yourself. How they would.',
          'What topic could you write ten posts about without running out of things to say?',
          'What is a sentence from something you\'ve written that made you think: "yes, that\'s actually true and I have never seen anyone else say it that way"?',
        ],
      },
      { type: 'p', content: 'Read them back. Notice what surprised you. The surprises are usually where your voice actually lives.' },
      { type: 'callout', content: 'Wrively turns these answers into a persistent Voice Layer and writes every LinkedIn post from it. No re-briefing. No starting over. Just posts that sound like you, consistently. Free to start.' },
    ],
    relatedSlugs: [
      'why-chatgpt-linkedin-posts-dont-sound-like-you',
      'linkedin-post-hook-examples-founders',
      'how-to-write-linkedin-post-that-sounds-like-you',
    ],
  },

  // ── Best AI LinkedIn Post Generators [2026] ─────────────────────────────────
  {
    slug: 'best-ai-linkedin-post-generators',
    title: 'Best AI LinkedIn Post Generators in 2026 (Honest Review)',
    description: 'We tested the top AI LinkedIn post generators so you don\'t have to. Here\'s which ones actually sound human, which ones are glorified templates, and which one remembers your voice.',
    date: '2026-04-06',
    readTime: '12 min read',
    category: 'AI Writing',
    intro: 'Every founder knows they should post on LinkedIn. Most don\'t, because every AI tool they try produces the same generic output. We tested the most popular AI LinkedIn post generators and compared them on what actually matters: voice quality, specificity, and whether the output sounds like you or like a content mill.',
    sections: [
      { type: 'h2', content: 'How we evaluated each tool' },
      { type: 'p', content: 'We gave every tool the same prompt: "Write a LinkedIn post about why talking to users early matters for startups." Then we scored the output on three things:' },
      { type: 'ol', content: [
        'Does it sound like a specific person, or could any founder have written it?',
        'Does it include concrete details, or is it vague advice?',
        'Would you actually post it without heavy editing?',
      ]},
      { type: 'p', content: 'We also looked at pricing, onboarding friction, and whether the tool learns your voice over time or starts from zero every session.' },

      { type: 'divider', content: '' },

      { type: 'h2', content: '1. Wrively — Best for founders who want posts that sound like them' },
      { type: 'p', content: 'Wrively takes a different approach from most generators. Instead of giving you a blank prompt box, it builds a "Voice Layer" during onboarding: four questions about your company, stage, audience, and personality. Every post it generates after that pulls from this model.' },
      { type: 'p', content: 'The result is noticeably more specific than other tools. When we tested it, the output referenced the founder\'s stage, mentioned the product by name, and used the kind of language a real person would use. Not perfect on every generation, but consistently closer to "sounds like me" than anything else we tested.' },
      { type: 'ul', content: [
        'Voice Layer built in 2 minutes, used on every generation',
        '3 variations per topic: safe, bold, and debate',
        'Refine controls: "too formal," "too generic," "too long," "sounds AI"',
        'Free plan: 12 posts/month, no credit card',
        'Pricing: Free, Starter $9/mo, Pro $19/mo',
      ]},
      { type: 'p', content: 'Best for: Founders and consultants who tried ChatGPT, got generic output, and want something that actually remembers who they are.' },

      { type: 'h2', content: '2. Taplio — Best for LinkedIn growth with analytics' },
      { type: 'p', content: 'Taplio is the most established tool in this space. It combines AI post generation with scheduling, analytics, and a library of 4M+ viral posts you can study for inspiration.' },
      { type: 'p', content: 'The AI generation is solid but broad. It uses GPT-4 under the hood and produces competent posts. The main value of Taplio isn\'t the generation quality; it\'s the ecosystem around it. Viral post library, engagement tracking, and auto-comment scheduling make it a full growth platform.' },
      { type: 'ul', content: [
        'AI generation + scheduling + analytics in one platform',
        'Library of 4M+ viral LinkedIn posts for inspiration',
        'Chrome extension for on-platform engagement',
        'Pricing starts at $39/mo (no free plan)',
      ]},
      { type: 'p', content: 'Best for: Power users who want an all-in-one LinkedIn growth platform and are willing to pay $39+/month.' },

      { type: 'h2', content: '3. MagicPost — Best free option for quick drafts' },
      { type: 'p', content: 'MagicPost is purpose-built for LinkedIn and offers a generous free tier. It analyzes viral post patterns and generates content using structures proven to drive engagement.' },
      { type: 'p', content: 'The output quality is decent for quick drafts. It tends toward engagement-optimized formats (numbered lists, contrarian hooks) which work on LinkedIn but can feel formulaic after a while. Good starting point if you need volume.' },
      { type: 'ul', content: [
        'Free tier available with basic generation',
        'Trained on viral LinkedIn post patterns',
        'Multiple post formats and templates',
        'Carousel generator included',
      ]},
      { type: 'p', content: 'Best for: People who want quick, engagement-optimized drafts and don\'t mind editing heavily.' },

      { type: 'h2', content: '4. RedactAI — Best for voice matching from past posts' },
      { type: 'p', content: 'RedactAI focuses on learning your writing style from your existing LinkedIn posts. You connect your profile, it analyzes your past content, and generates new posts that match your established voice.' },
      { type: 'p', content: 'This works well if you already have 20+ posts on LinkedIn. If you\'re starting from scratch, there\'s not enough data for it to learn from, and the output defaults to generic.' },
      { type: 'ul', content: [
        'Learns from your existing LinkedIn post history',
        'Generates in your established voice (if you have enough posts)',
        'Free tool available for basic generation',
        'Better for established profiles than new ones',
      ]},
      { type: 'p', content: 'Best for: People who already post regularly on LinkedIn and want AI that matches their established voice.' },

      { type: 'h2', content: '5. EasyGen — Best for data-driven creators' },
      { type: 'p', content: 'EasyGen was built specifically for LinkedIn and uses performance data to optimize content. It tracks which posts perform best and adjusts its suggestions accordingly.' },
      { type: 'p', content: 'The writing style customization is flexible, letting you adjust tone and context. The learning curve is slightly steeper than simpler tools, but the data-driven approach pays off for consistent posters.' },
      { type: 'ul', content: [
        'Writing style customization based on your preferences',
        'Performance tracking to improve generation over time',
        'Built specifically for LinkedIn (not a generic writing tool)',
        'Multiple content formats supported',
      ]},
      { type: 'p', content: 'Best for: Creators who post frequently and want data-informed content optimization.' },

      { type: 'h2', content: '6. ContentIn — Best for content inspiration' },
      { type: 'p', content: 'ContentIn focuses on helping you find topics and angles that resonate. It combines AI generation with a content discovery layer that surfaces trending topics in your niche.' },
      { type: 'p', content: 'The generation quality is average, but the ideation features are genuinely useful. If your problem is "I don\'t know what to write about" more than "my posts sound generic," ContentIn addresses that well.' },
      { type: 'ul', content: [
        'Topic discovery and trending content analysis',
        'AI generation with niche-specific angles',
        'Content calendar for planning',
        'Templates based on proven formats',
      ]},
      { type: 'p', content: 'Best for: People who struggle with topic ideation more than writing quality.' },

      { type: 'h2', content: '7. Hootsuite LinkedIn Post Generator — Best for teams already on Hootsuite' },
      { type: 'p', content: 'Hootsuite offers a free LinkedIn post generator that\'s decent for quick drafts. It\'s not specialized for founders or voice matching; it\'s a general-purpose tool that happens to have a LinkedIn template.' },
      { type: 'p', content: 'If you\'re already using Hootsuite for social scheduling, the integrated generation saves a step. But the output is generic and requires heavy editing.' },
      { type: 'ul', content: [
        'Free to use (basic generation)',
        'Integrated with Hootsuite scheduling if you\'re already a user',
        'Generic output, not personalized',
        'Best as a starting point, not a final draft',
      ]},
      { type: 'p', content: 'Best for: Teams already using Hootsuite who want a quick-draft feature within their existing workflow.' },

      { type: 'divider', content: '' },

      { type: 'h2', content: 'Comparison table' },
      { type: 'p', content: 'Here\'s how they stack up on what matters most:' },
      { type: 'ul', content: [
        'Voice personalization: Wrively (built-in voice layer) > RedactAI (learns from history) > EasyGen (style settings) > others (generic)',
        'Output specificity: Wrively > RedactAI > MagicPost > Taplio > ContentIn > Hootsuite',
        'Analytics & scheduling: Taplio > EasyGen > ContentIn > others (none)',
        'Free plan quality: MagicPost > Wrively (12 posts/mo) > Hootsuite > RedactAI > others (paid only)',
        'Founder-specific: Wrively > others (general audience)',
        'Price range: Free (Hootsuite, MagicPost basic) to $39+/mo (Taplio)',
      ]},

      { type: 'h2', content: 'The bottom line' },
      { type: 'p', content: 'If you\'re a founder who wants posts that sound like you without spending 30 minutes editing, Wrively is the best option in 2026. The Voice Layer approach means you set up once and every post pulls from your context.' },
      { type: 'p', content: 'If you want a full growth platform with analytics, scheduling, and viral content research, Taplio is worth the $39/month if you\'re posting daily.' },
      { type: 'p', content: 'If you just need quick drafts and don\'t care about voice matching, MagicPost or Hootsuite\'s free tools will get you started.' },
      { type: 'p', content: 'The worst option? ChatGPT with no context. It starts from zero every time and the output sounds like everyone else on LinkedIn. Any dedicated tool on this list beats that.' },
      { type: 'callout', content: 'Wrively builds your Voice Layer in 2 minutes and generates your first post before you reach the dashboard. Free to start, no credit card required.' },
    ],
    relatedSlugs: [
      'why-chatgpt-linkedin-posts-dont-sound-like-you',
      'how-to-write-linkedin-post-that-sounds-like-you',
    ],
  },

  // ── LinkedIn Post Ideas for Founders ────────────────────────────────────────
  {
    slug: 'linkedin-post-ideas-for-founders',
    title: '30 LinkedIn Post Ideas for Founders (With Examples)',
    description: 'Stuck on what to post? Here are 30 proven LinkedIn post ideas for founders, organized by content type, with examples you can adapt to your startup.',
    date: '2026-04-06',
    readTime: '10 min read',
    category: 'Strategy',
    intro: 'The hardest part of posting on LinkedIn isn\'t writing. It\'s figuring out what to write about. Every founder has a backlog of experiences, opinions, and lessons that would make great posts. The problem is turning those into topics on a Tuesday morning when you have 10 minutes before your next call.',
    sections: [
      { type: 'p', content: 'Here are 30 post ideas organized by type. Each one includes a prompt you can use directly, an example angle, and which post structure works best for it.' },

      { type: 'h2', content: 'Build-in-public posts (1-6)' },
      { type: 'h3', content: '1. What you shipped this week' },
      { type: 'p', content: 'Share a specific feature, fix, or decision from this week. Not a press release. A real update with context about why you built it and what you learned.' },
      { type: 'h3', content: '2. A mistake you made recently' },
      { type: 'p', content: 'Founders sharing real mistakes get 3-5x more engagement than polished announcements. Be specific: what went wrong, what you did about it, what you\'d do differently.' },
      { type: 'h3', content: '3. Your metrics (honest version)' },
      { type: 'p', content: 'Share a real number: MRR, users, churn, NPS. The number doesn\'t have to be impressive. Honesty about where you are builds more trust than vague "we\'re growing fast" claims.' },
      { type: 'h3', content: '4. Why you pivoted (or didn\'t)' },
      { type: 'p', content: 'The decision to change direction or stay the course is always interesting. Share the data or conversation that drove the decision.' },
      { type: 'h3', content: '5. A customer conversation that changed your thinking' },
      { type: 'p', content: 'The best founder posts come from real user interactions. One conversation can become a powerful post about product decisions, market understanding, or startup priorities.' },
      { type: 'h3', content: '6. Tools and workflows you actually use' },
      { type: 'p', content: 'Share your actual stack, your daily workflow, your hiring process. Tactical content performs well because it\'s immediately useful.' },

      { type: 'h2', content: 'Opinion posts (7-12)' },
      { type: 'h3', content: '7. A common industry belief you disagree with' },
      { type: 'p', content: 'Contrarian posts get the most comments on LinkedIn. Pick something most people in your industry accept as true and explain why you think they\'re wrong. Back it with your experience.' },
      { type: 'h3', content: '8. Advice you used to believe but don\'t anymore' },
      { type: 'p', content: 'What changed your mind? This format shows growth and self-awareness while delivering a non-obvious insight.' },
      { type: 'h3', content: '9. What your industry gets wrong about [topic]' },
      { type: 'p', content: 'Take a specific topic in your space and point out where the conventional wisdom fails. Use a real example from your experience.' },
      { type: 'h3', content: '10. The most overhyped trend in your space' },
      { type: 'p', content: 'Name it. Explain why. Offer what you think matters more. This takes courage but earns respect.' },
      { type: 'h3', content: '11. What you\'d tell your day-1 self' },
      { type: 'p', content: 'Hindsight posts resonate because every founder has things they wish they knew earlier. Be specific about what you\'d change.' },
      { type: 'h3', content: '12. Why you chose [approach A] over [approach B]' },
      { type: 'p', content: 'Technical decisions, hiring choices, marketing channels. The reasoning behind a decision is more interesting than the decision itself.' },

      { type: 'h2', content: 'Story posts (13-18)' },
      { type: 'h3', content: '13. Your worst day as a founder' },
      { type: 'p', content: 'Vulnerability on LinkedIn isn\'t weakness. Describing a specific hard moment and what you did about it shows resilience and earns engagement.' },
      { type: 'h3', content: '14. How you got your first 10 customers' },
      { type: 'p', content: 'Early traction stories are always compelling. Be specific about the channel, the effort, and the timeline.' },
      { type: 'h3', content: '15. A rejection that turned into something good' },
      { type: 'p', content: 'Investor rejections, customer churn, failed partnerships. The turnaround story is a proven LinkedIn format.' },
      { type: 'h3', content: '16. The moment you knew your idea would work' },
      { type: 'p', content: 'What signal convinced you? A user reaction, a metric, a conversation. Make it vivid and specific.' },
      { type: 'h3', content: '17. A conversation that changed your product direction' },
      { type: 'p', content: 'Real conversations with users, advisors, or co-founders that shifted your thinking. Quote the specific words if you can.' },
      { type: 'h3', content: '18. Before and after: how something looked 6 months ago vs now' },
      { type: 'p', content: 'Screenshots, metrics, processes. Visual progress is compelling and easy to engage with.' },

      { type: 'h2', content: 'Educational posts (19-24)' },
      { type: 'h3', content: '19. A framework you use for [decision type]' },
      { type: 'p', content: 'Founders love frameworks. Share one you actually use for hiring, prioritization, pricing, or product decisions. Keep it to 3-5 steps.' },
      { type: 'h3', content: '20. X things I learned from [specific experience]' },
      { type: 'p', content: 'The numbered-list-from-experience format consistently performs well. Keep each point to 1-2 sentences.' },
      { type: 'h3', content: '21. How to [do something specific] in your industry' },
      { type: 'p', content: 'Tactical how-to posts. The more specific the better. "How to write a cold email that gets replies from VPs" beats "tips for outreach."' },
      { type: 'h3', content: '22. The difference between [thing A] and [thing B]' },
      { type: 'p', content: 'Comparison-style educational posts clarify thinking. "Product-market fit vs product-market pull" or "co-founder chemistry vs co-founder alignment."' },
      { type: 'h3', content: '23. Resources you recommend for [topic]' },
      { type: 'p', content: 'Curated lists of books, tools, newsletters, or podcasts. Add a one-sentence note on why each one matters.' },
      { type: 'h3', content: '24. A pattern you\'ve noticed in your industry' },
      { type: 'p', content: 'Observations that connect dots others haven\'t. "Every B2B startup I\'ve seen grow past $1M ARR did this one thing differently."' },

      { type: 'h2', content: 'Engagement posts (25-30)' },
      { type: 'h3', content: '25. Ask for advice on a real decision you\'re facing' },
      { type: 'p', content: 'Genuine questions get more thoughtful responses than manufactured ones. Share the context and the two options you\'re weighing.' },
      { type: 'h3', content: '26. Celebrate a team member or collaborator' },
      { type: 'p', content: 'Tag someone. Be specific about what they did and why it mattered. Authentic recognition gets engagement and builds relationships.' },
      { type: 'h3', content: '27. React to an industry trend or news' },
      { type: 'p', content: 'Hot takes on fresh news perform well if you add your unique perspective as a founder. Don\'t just summarize; interpret.' },
      { type: 'h3', content: '28. Share a book or podcast that changed how you work' },
      { type: 'p', content: 'Not a generic recommendation. Explain the specific idea that stuck with you and how you applied it.' },
      { type: 'h3', content: '29. Respond to a post you saw this week' },
      { type: 'p', content: 'Take someone else\'s insight and build on it. Add your experience, disagree respectfully, or extend their idea. Tag them.' },
      { type: 'h3', content: '30. Your unpopular opinion about [topic]' },
      { type: 'p', content: 'The "unpopular opinion" format still works when the opinion is genuine and backed by experience. Avoid hot takes for the sake of engagement.' },

      { type: 'divider', content: '' },

      { type: 'h2', content: 'How to turn these into actual posts' },
      { type: 'p', content: 'Pick one idea. Write 2-3 sentences of rough thoughts. Then either expand it yourself or paste it into a tool that writes in your voice.' },
      { type: 'p', content: 'The key is specificity. "I learned a lot from customer calls" is weak. "A customer told me our onboarding was confusing and I realized our whole product flow was built for us, not for them" is a post.' },
      { type: 'callout', content: 'Wrively turns any rough idea into 3 LinkedIn post variations in your voice. Pick a topic from the list above, type a sentence, and get a post you\'d actually publish. Free to start.' },
    ],
    relatedSlugs: [
      'best-ai-linkedin-post-generators',
      'linkedin-post-hook-examples-founders',
      'how-to-write-linkedin-post-that-sounds-like-you',
    ],
  },

  // ── How Often Should Founders Post on LinkedIn ──────────────────────────────
  {
    slug: 'how-often-should-founders-post-on-linkedin',
    title: 'How Often Should Founders Post on LinkedIn? (Data-Backed Answer)',
    description: 'The short answer: 3 times per week. Here\'s the data behind it, why daily is overkill, and how to maintain the posting habit without it consuming your mornings.',
    date: '2026-04-06',
    readTime: '5 min read',
    category: 'Strategy',
    intro: 'Every LinkedIn guru says "post daily." Most founders who try this burn out within two weeks. The actual data tells a different story: consistency at a sustainable pace beats volume every time.',
    sections: [
      { type: 'h2', content: 'The data: what actually works' },
      { type: 'p', content: 'LinkedIn\'s own creator data shows that posting 2-4 times per week produces 90% of the engagement benefit of daily posting, with a fraction of the effort. The algorithm rewards consistency more than frequency.' },
      { type: 'p', content: 'Here\'s what we see across founders using Wrively:' },
      { type: 'ul', content: [
        '3x/week posters get roughly the same reach-per-post as daily posters',
        'The drop-off happens below 2x/week. Once-a-week posters get significantly less algorithmic push',
        'Posting at the same cadence (e.g., Mon-Wed-Fri) trains the algorithm and your audience to expect your content',
        'Gaps of 7+ days reset your momentum almost entirely',
      ]},

      { type: 'h2', content: 'Why daily posting hurts most founders' },
      { type: 'p', content: 'Daily posting requires either a content team or a founder who makes LinkedIn their primary channel. For most seed-stage founders, that\'s not realistic.' },
      { type: 'p', content: 'The failure mode is predictable: post daily for 2 weeks, run out of ideas, skip a day, guilt compounds, stop posting entirely. A sustainable cadence you can maintain for 6+ months will always beat an ambitious one you abandon after 3 weeks.' },

      { type: 'h2', content: 'The recommended schedule for founders' },
      { type: 'p', content: 'Post on Monday, Wednesday, and Friday. Here\'s why this specific rhythm works:' },
      { type: 'ul', content: [
        'Monday: Start the week with a reflection or opinion. People are in "planning" mode and engage with thoughtful content.',
        'Wednesday: Mid-week is peak LinkedIn engagement. Share something tactical or a build-in-public update.',
        'Friday: End the week with a story or a lighter take. Friday posts tend to get more personal engagement.',
      ]},
      { type: 'p', content: 'This gives you 2 rest days between posts to live your life, run your company, and not think about LinkedIn.' },

      { type: 'h2', content: 'How to maintain the habit' },
      { type: 'ul', content: [
        'Batch-write when inspiration hits. Write 3 posts in one sitting, schedule them for the week.',
        'Keep a running note of post ideas. Every customer call, team meeting, or industry article is a potential topic.',
        'Use a tool that reduces friction. If writing a post takes 30+ minutes, you won\'t do it consistently.',
        'Track your streak, not your likes. The metric that matters is "did I post 3x this week?" not "did I get 100 likes?"',
      ]},
      { type: 'callout', content: 'Wrively is built around the 3x/week posting rhythm. Open the app, pick a topic, get 3 variations in your voice. Under 3 minutes from open to post copied. Free to start.' },
    ],
    relatedSlugs: [
      'linkedin-post-ideas-for-founders',
      'best-ai-linkedin-post-generators',
    ],
  },
]

export function getArticle(slug: string): BlogArticle | undefined {
  return articles.find(a => a.slug === slug)
}

export function getRelatedArticles(slugs: string[]): BlogArticle[] {
  return slugs
    .map(slug => articles.find(a => a.slug === slug))
    .filter(Boolean) as BlogArticle[]
}
