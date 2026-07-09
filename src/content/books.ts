/**
 * The Bookshelf — whole books compressed with honesty.
 *
 * Each distillation is original synthesis: the thesis, the load-bearing
 * ideas, a couple of short attributed quotes, and — the part summary
 * services skip — a steelman of the book's critics. Public-domain
 * classics get fuller treatment; modern works get brief quotes plus
 * commentary (ordinary fair-use review territory).
 */

export type BookArea =
  | "thinking"
  | "engineering"
  | "career"
  | "finance"
  | "classics"
  | "industry";

export const BOOK_AREAS: BookArea[] = [
  "thinking",
  "engineering",
  "career",
  "finance",
  "classics",
  "industry",
];

export const BOOK_AREA_LABELS: Record<BookArea, string> = {
  thinking: "Thinking & Judgment",
  engineering: "Engineering",
  career: "Career & Craft",
  finance: "Money",
  classics: "Classics",
  industry: "Your Industry",
};

export const BOOK_AREA_TINTS: Record<BookArea, string> = {
  thinking: "var(--cat-ai)",
  engineering: "var(--cat-programming)",
  career: "var(--cat-career)",
  finance: "var(--cat-finance)",
  classics: "var(--cat-communication)",
  industry: "var(--cat-semiconductor)",
};

export type BookDistillation = {
  id: string;
  title: string;
  author: string;
  year: string;
  area: BookArea;
  /** The whole book in one paragraph. */
  thesis: string;
  /** The load-bearing ideas. */
  ideas: Array<{ name: string; text: string }>;
  /** Short attributed quotes with a note on why they matter. */
  quotes: Array<{ text: string; note: string }>;
  /** Steelman of the book's critics. */
  critics: string;
  /** If you remember one thing. */
  oneThing: string;
  /** Latticework links (mental model ids). */
  related: string[];
};

export const BOOKS: BookDistillation[] = [
  {
    id: "poor-charlies-almanack",
    title: "Poor Charlie's Almanack",
    author: "Charlie Munger (ed. Kaufman)",
    year: "2005",
    area: "thinking",
    thesis:
      "Worldly wisdom comes from mastering the big ideas of the big disciplines — psychology, economics, math, engineering — and arraying experience on that latticework of models, because a mind with one framework bends every problem to fit it. Munger's talks apply this to investing, but the method is domain-general: think in checklists of models, invert problems, and spend your life avoiding standard stupidities rather than seeking brilliance.",
    ideas: [
      {
        name: "The latticework",
        text: "Roughly a hundred models from across disciplines cover most of practical reality. Facts hung on models compound; loose facts evaporate. The models must come from many fields because problems don't respect department walls — and 'to the man with a hammer, everything looks like a nail.'",
      },
      {
        name: "Invert, always invert",
        text: "Borrowed from mathematician Jacobi: hard problems often solve backwards. Instead of 'how to help X', ask 'what would ruin X?' and avoid it. Munger claims most of his success came from systematically dodging idiocy, not from genius.",
      },
      {
        name: "The psychology of misjudgment",
        text: "His famous checklist of ~25 cognitive tendencies — incentive-caused bias, social proof, consistency, deprival super-reaction — with the crucial addendum that they hit hardest in combination ('lollapalooza effects'), which is why cults, bubbles and auctions work.",
      },
      {
        name: "Sit-on-your-hands investing",
        text: "Opportunity is lumpy: a few great chances per decade, recognized because the latticework is loaded and the checklist is run. In between, the discipline is doing nothing — the hardest activity in finance.",
      },
      {
        name: "Deserved trust",
        text: "The highest form a civilization can reach is a seamless web of deserved trust — systems built on it (marriages, partnerships, hospitals) beat systems built on procedure. Earn trust; grant it carefully; treasure institutions that run on it.",
      },
    ],
    quotes: [
      {
        text: "Take a simple idea and take it seriously.",
        note: "The anti-cleverness principle: his fortunes came from compounding and incentives, ideas a teenager can state.",
      },
      {
        text: "I never allow myself to have an opinion on anything that I don't know the other side's argument better than they do.",
        note: "The steelman rule — the working definition of earning your opinions.",
      },
    ],
    critics:
      "The fair critique: it's a rich man's commonplace book, not a method — Munger names models but never teaches the selection discipline, and survivorship questions (would this latticework have saved a less lucky investor?) go unasked. The psychology chapter predates the replication crisis, and some cited effects have weakened. Read it as a map of what to learn, not a course that teaches it.",
    oneThing:
      "Multidisciplinary models, deliberately collected and actually used as checklists, are the closest thing to a general-purpose intelligence upgrade an adult can buy.",
    related: ["inversion", "incentives", "circle-of-competence", "social-proof"],
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: "2011",
    area: "thinking",
    thesis:
      "Judgment runs on two systems: a fast, automatic, associative one that produces most of your thoughts, and a slow, effortful one that mostly rubber-stamps them while believing itself in charge. The systematic errors — anchoring, availability, loss aversion, overconfidence — aren't random noise but predictable features of the fast system, which means they can be anticipated, designed around, and exploited (by others, if not managed by you).",
    ideas: [
      {
        name: "System 1 writes the first draft of everything",
        text: "Impressions, intuitions and feelings arrive unbidden and become beliefs unless actively challenged. The lazy System 2 endorses far more than it examines — 'thinking' is often just the press office of conclusions already reached.",
      },
      {
        name: "What You See Is All There Is",
        text: "The fast system builds the most coherent story possible from available evidence and never flags what's missing. Confidence tracks the story's coherence, not the evidence's completeness — which is why the least-informed opinions often feel the most certain.",
      },
      {
        name: "Anchors, availability, substitution",
        text: "Numbers drag estimates toward them even when random; vividness impersonates frequency; and hard questions get silently swapped for easier ones ('is this investment good?' becomes 'do I like this CEO?'). Three mechanisms explain half the bad meetings you've attended.",
      },
      {
        name: "Prospect theory",
        text: "Choices weigh changes, not states; losses about twice as heavily as gains; reference points are arbitrary and movable. The framing of an option — keep 90% vs lose 10% — changes decisions with no change in facts. Nobel-winning, and every pricing page you've seen knows it.",
      },
      {
        name: "The outside view",
        text: "The planning fallacy is incurable from inside a project. The fix is the reference class: how did similar cases actually turn out? Kahneman's own textbook project — forecast 2 years, took 8 — is the book's most honest exhibit.",
      },
    ],
    quotes: [
      {
        text: "Nothing in life is as important as you think it is, while you are thinking about it.",
        note: "The focusing illusion — his own pick for the most consequential bias.",
      },
      {
        text: "The confidence that individuals have in their beliefs depends mostly on the quality of the story they can tell about what they see.",
        note: "Confidence is a feeling about coherence, not a measurement of accuracy — the core of calibration training.",
      },
    ],
    critics:
      "Parts haven't survived the replication crisis — priming studies in particular collapsed, and Kahneman himself publicly conceded he over-trusted underpowered research. Critics like Gigerenzer argue 'biases' are often rational responses to real environments, and the two-systems frame is a metaphor that data doesn't cleanly support. The core results (anchoring, loss aversion, planning fallacy) stand; hold the rest loosely — as the book itself would advise.",
    oneThing:
      "Your confidence is a property of the story in your head, not of the world — treat felt certainty as a signal to check, not a license to act.",
    related: ["anchoring", "availability-heuristic", "loss-aversion", "base-rates", "hindsight-bias"],
  },
  {
    id: "superforecasting",
    title: "Superforecasting",
    author: "Philip Tetlock & Dan Gardner",
    year: "2015",
    area: "thinking",
    thesis:
      "Forecasting skill is real, measurable and learnable. In a multi-year IARPA tournament, ordinary volunteers using good technique beat intelligence analysts with classified access. The technique is unglamorous: break questions down, start from base rates, update in small increments, keep score in granular probabilities, and treat beliefs as hypotheses to test rather than possessions to defend.",
    ideas: [
      {
        name: "Keep score or keep dreaming",
        text: "Vague forecasts ('significant risk of conflict') can never be wrong, so pundits stay confident forever. Brier scores — squared error on probabilistic predictions — turn judgment into a trainable skill with feedback. What isn't scored doesn't improve.",
      },
      {
        name: "Fermi-ize, then outside view",
        text: "Superforecasters decompose questions into estimable parts, anchor on the reference class ('how often do incumbent regimes survive protests this size?'), and only then adjust for the case's specifics. Inside-view first is the amateur signature.",
      },
      {
        name: "Many small updates",
        text: "The best forecasters change their minds constantly — by 5%, not 50%. Big swings mean the prior was theater; zero updates mean identity has fused with the belief. Granularity matters too: people who distinguish 60% from 65% outperform people who think in thirds.",
      },
      {
        name: "Perpetual beta",
        text: "The single best psychological predictor of forecasting skill was a growth mindset about the craft itself — try, fail, analyze, adjust. Brains helped less than the habit of treating every miss as tuition.",
      },
      {
        name: "Teams that disagree well",
        text: "Groups beat individuals only when dissent is engineered — precision questioning, assigned devil's advocates, no premature consensus. Otherwise groups amplify confidence faster than accuracy.",
      },
    ],
    quotes: [
      {
        text: "Beliefs are hypotheses to be tested, not treasures to be guarded.",
        note: "The whole epistemic stance in one line.",
      },
      {
        text: "What you think is much less important than how you think.",
        note: "Ideology was a negative predictor of accuracy across the tournament.",
      },
    ],
    critics:
      "The tournament measured questions resolvable within ~18 months — exactly the horizon where technique shines and where the stakes are lowest. For the questions that matter most (decade-scale, fat-tailed, reflexive), Taleb's critique bites: calibration on the frequent says little about the catastrophic. And 'superforecasters' were selected post hoc from thousands — some regression to the mean has since shown up. The method is still the best available; just know its jurisdiction.",
    oneThing:
      "Write probabilities down and score yourself — the single practice from which every other judgment improvement follows.",
    related: ["base-rates", "bayes-updating", "distributional-thinking", "confirmation-bias"],
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    year: "2020",
    area: "finance",
    thesis:
      "Financial outcomes are driven less by intelligence than by behavior — and behavior is driven by personal history, ego, envy and time horizons. Doing well with money is a soft skill: reasonable beats rational, survival beats optimization, and the highest dividend money pays is control over your own time.",
    ideas: [
      {
        name: "No one is crazy",
        text: "Everyone's money decisions make sense to someone who lived their life — the Depression survivor hoarding cash, the lottery-playing poor buying the only hope on sale. Judging others' finances without their history is a category error; so is assuming your own lens is neutral.",
      },
      {
        name: "Luck and risk are siblings",
        text: "Every outcome has both, in unknowable proportions — Gates had one of the world's only high-school computers; his equally-brilliant friend died young. Corollary: copy broad patterns, never specific people, and judge decisions by process, not results.",
      },
      {
        name: "Never enough",
        text: "The hardest financial skill is getting the goalpost to stop moving. Comparison is unwinnable (someone is always richer), and risking what you have and need for what you don't have and don't need is how the already-rich go broke.",
      },
      {
        name: "Tails drive everything",
        text: "A handful of days, decisions and holdings produce most lifetime returns — which means being wrong often is compatible with winning big, and the essential skill is staying in the game long enough for tails to arrive.",
      },
      {
        name: "Freedom is the real dividend",
        text: "Controlling your time is the highest form of wealth. Past a modest threshold, money's marginal utility is almost entirely optionality — the ability to say no, wait, quit, or choose.",
      },
    ],
    quotes: [
      {
        text: "Wealth is what you don't see.",
        note: "Visible spending is subtracted wealth — the ranking most people run is inverted.",
      },
      {
        text: "Save like a pessimist, invest like an optimist.",
        note: "Short-run fragility and long-run compounding are both true; hold both.",
      },
    ],
    critics:
      "It's philosophy, not a manual — no asset allocation, no tax strategy, and the anecdotes are curated for elegance (survivorship in a book about survivorship). Some chapters restate the same idea in new clothes. But criticizing it for missing mechanics misses its aim: it fixes the behavior layer where most plans actually die. Pair it with a boring index-fund how-to and it's complete.",
    oneThing:
      "Define 'enough' in writing before the goalposts learn to walk.",
    related: ["compounding", "fat-tails", "asymmetry", "survivorship-bias", "loss-aversion"],
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    year: "2018",
    area: "career",
    thesis:
      "Behavior change fails at the goal level and succeeds at the system level: make good habits obvious, attractive, easy and satisfying (and their opposites invisible, unattractive, hard and unsatisfying). Small behaviors compound because each repetition is also a vote for an identity — and identity, once shifted, maintains the behavior for free.",
    ideas: [
      {
        name: "1% compounding",
        text: "Habits are the compound interest of self-improvement: tiny gains, repeated, produce absurd totals — and tiny slippages the same. The corollary nobody likes: trajectories matter more than current positions.",
      },
      {
        name: "Identity before outcomes",
        text: "The strongest change runs 'I am a runner' → running, not 'I want to run a marathon' → running. Each action is a vote for a self-image; enough votes and the image starts casting the votes for you.",
      },
      {
        name: "Environment beats willpower",
        text: "Behavior is a function of person and environment, and the environment is the editable term. Put the guitar on the stand, the phone in the drawer, the fruit at eye level. Design beats discipline every week of the year.",
      },
      {
        name: "The two-minute rule",
        text: "Scale any habit down to a two-minute version ('read one page'). The point isn't the two minutes — it's that showing up is the habit; volume comes later. Never miss twice is the companion rule.",
      },
      {
        name: "Make it satisfying now",
        text: "Brains discount delayed rewards brutally, so bridge the gap: habit tracking, immediate small celebrations, streaks. What gets rewarded this minute gets repeated this month.",
      },
    ],
    quotes: [
      {
        text: "You do not rise to the level of your goals. You fall to the level of your systems.",
        note: "The book's thesis in one line — winners and losers share goals, so goals can't be the difference.",
      },
      {
        text: "Every action you take is a vote for the type of person you wish to become.",
        note: "The identity mechanism that makes habits self-maintaining.",
      },
    ],
    critics:
      "Scientifically it's a synthesis of older work (BJ Fogg, Duhigg, behavioral econ) packaged better than its sources; the '1% better every day = 37x' math is marketing, not measurement, since life's gains don't compound like interest. Habits also can't carry everything — deep skills need deliberate practice, not just repetition, and hard life problems don't yield to environmental cues. As habit mechanics, though, it's the cleanest manual in print.",
    oneThing:
      "Design the environment so the right action is the lazy action — willpower is for emergencies, not architecture.",
    related: ["compounding", "feedback-loops", "marginal-thinking", "via-negativa"],
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    year: "2016",
    area: "career",
    thesis:
      "Long, undistracted concentration on cognitively demanding tasks is becoming rare exactly as it becomes the primary source of professional value — so cultivating it is arbitrage. Depth must be scheduled and defended like a scarce production resource, because attention residue from every glance at the inbox degrades the hours around it.",
    ideas: [
      {
        name: "The deep work hypothesis",
        text: "Two abilities now decide knowledge-work value: quickly mastering hard things and producing at an elite level — and both are functions of concentration intensity. High-quality output = time × intensity, and intensity is the term everyone's leaking.",
      },
      {
        name: "Attention residue",
        text: "Every switch leaves a residue: the previous task keeps running in the background, dulling the next one. A 'quick check' of chat costs far more than its seconds — it downgrades the following twenty minutes. Fragmented days are shallow by physics, not by weakness.",
      },
      {
        name: "Rituals and rhythms",
        text: "Depth doesn't happen by intention; it happens by appointment — same hours, same place, clear shutdown. The shutdown ritual matters as much as the start: open loops written down stop colonizing the evening (and the sleep).",
      },
      {
        name: "Embrace boredom",
        text: "Concentration is trainable and de-trainable. A mind that reaches for the phone at every red light is practicing distraction, and will find depth physically unpleasant. Schedule the distraction, not the focus.",
      },
      {
        name: "Drain the shallows",
        text: "Quantify the depth of every recurring obligation, budget shallow work explicitly, and make whoever wants your attention pay a small cost (office hours, async docs). Shallow work expands to fill undefended calendars.",
      },
    ],
    quotes: [
      {
        text: "Clarity about what matters provides clarity about what does not.",
        note: "Depth is downstream of deciding — most 'focus problems' are actually priority problems.",
      },
      {
        text: "Efforts to deepen your focus will struggle if you don't simultaneously wean your mind from a dependence on distraction.",
        note: "The gym analogy: you can't be focused four hours a day and distracted the other twelve.",
      },
    ],
    critics:
      "The book underweights collaboration — much high-value work (mentoring, incident response, alignment) is interrupt-driven by nature, and Hamming's open door produced Nobel-adjacent work Newport's rules would forbid. It's also written from a tenured professor's control over his calendar; an on-call engineer or a manager can't 'quit social media and disappear'. Steal the mechanics (blocks, rituals, shutdown), skip the monasticism.",
    oneThing:
      "Schedule depth like a meeting with someone important, because it is — and protect the edges, since that's where it dies.",
    related: ["opportunity-cost", "bottlenecks", "compounding", "slack"],
  },
  {
    id: "the-goal",
    title: "The Goal",
    author: "Eliyahu Goldratt",
    year: "1984",
    area: "engineering",
    thesis:
      "Told as a novel about a failing factory, it teaches the Theory of Constraints: every system has exactly one binding constraint, throughput is set by it alone, and improving anything else is an illusion of progress. The method — identify, exploit, subordinate, elevate, repeat — plus its scandalous corollaries (idle non-bottleneck resources are fine; local efficiencies are the enemy) transfer directly from factory floors to test farms and engineering teams.",
    ideas: [
      {
        name: "The goal is throughput",
        text: "Not efficiency, not utilization, not busy-ness — money (or value) actually flowing out the end. Every metric that can improve while throughput falls is an invitation to organizational self-harm, and most classic metrics qualify.",
      },
      {
        name: "Five focusing steps",
        text: "Identify the constraint; squeeze everything from it as-is; subordinate every other decision to it; only then invest to elevate it; and when it moves — start over, fighting the inertia of rules built for the old constraint.",
      },
      {
        name: "An hour lost at the bottleneck is an hour lost forever",
        text: "Bottleneck time is system time: it should never wait, never process defects, never do work that isn't needed. Meanwhile an hour saved elsewhere is worthless — it just grows the queue in front of the constraint.",
      },
      {
        name: "Balanced plants are broken plants",
        text: "Matching every resource's capacity to demand feels efficient and guarantees chaos: statistical fluctuations plus dependent events mean variance accumulates and can never be recovered. Non-constraints need spare capacity — slack is protective, not wasteful.",
      },
      {
        name: "Drum-buffer-rope",
        text: "Pace the whole system to the constraint's drum, protect it with a small time buffer, and rope new work releases to its rhythm — releasing work faster than the constraint can process it creates inventory, latency and panic, not output. (Every WIP-limited kanban board is this idea wearing software clothes.)",
      },
    ],
    quotes: [
      {
        text: "Tell me how you measure me, and I will tell you how I will behave.",
        note: "Goodhart's law from the shop floor, a decade before software discovered it.",
      },
      {
        text: "A plant in which everyone is working all the time is very inefficient.",
        note: "The most counterintuitive sentence in operations — and the most reliably true.",
      },
    ],
    critics:
      "The novel format means one idea stretched across 300 pages of wooden dialogue and a subplot about a marriage. TOC's 'one constraint' assumption fits linear flows better than complex knowledge work, where constraints are fuzzy (trust, decision rights) and mobile. Lean/systems people note Goldratt rediscovered and rebranded older queueing insights. All true — and the book still fixes more real teams than most methodology shelves combined.",
    oneThing:
      "Find your one bottleneck and stop improving everything else — an hour anywhere else is an hour saved nowhere.",
    related: ["bottlenecks", "slack", "goodharts-law", "leverage-points"],
  },
  {
    id: "mythical-man-month",
    title: "The Mythical Man-Month",
    author: "Fred Brooks",
    year: "1975",
    area: "engineering",
    thesis:
      "Software projects fail on schedule arithmetic that treats people and months as interchangeable. Communication overhead grows quadratically with team size, some work is irreducibly sequential, and thus Brooks's Law: adding manpower to a late project makes it later. Half a century on, the essays' half-life keeps embarrassing newer methodologies.",
    ideas: [
      {
        name: "Brooks's Law",
        text: "New people subtract before they add: they need training from the productive, they multiply communication paths (n(n−1)/2), and repartitioned work adds coordination that didn't exist. The only honest cures for lateness are cutting scope or slipping the date.",
      },
      {
        name: "The surgical team",
        text: "Ten mediocre programmers produce coordination, not code. Brooks proposes small teams built around one exceptional mind with specialized support — conceptual integrity preserved by drastically limiting who designs. (Every 'two-pizza team' and tech-lead model descends from this.)",
      },
      {
        name: "Conceptual integrity",
        text: "A system designed by one coherent mind beats a richer system designed by committee — users experience consistency as quality. Architecture should therefore be separated from implementation and guarded jealously.",
      },
      {
        name: "The second-system effect",
        text: "A designer's second system is the most dangerous one they'll ever build: every idea shelved during the disciplined first system gets crammed into the sequel. Recognize the pattern in yourself around your second rewrite, second framework, second startup.",
      },
      {
        name: "No silver bullet",
        text: "The 1986 companion essay: software's hardness is essential (arbitrary complexity, changeability, invisibility), not accidental — so no single technique will ever deliver an order-of-magnitude gain. Forty years of silver-bullet marketing later, the argument stands unrefuted.",
      },
    ],
    quotes: [
      {
        text: "The bearing of a child takes nine months, no matter how many women are assigned.",
        note: "Sequential constraints don't parallelize — scheduling's oldest and most-repeated error.",
      },
      {
        text: "How does a project get to be a year late? One day at a time.",
        note: "Slippage is invisible daily and catastrophic quarterly — the case for milestones that can't lie.",
      },
    ],
    critics:
      "It describes 1960s mainframe development: modern tooling, CI and modularity genuinely weaken Brooks's Law at the margins (open source coordinates thousands of strangers). The surgical-team model concentrates bus-factor risk and reads uncomfortably hierarchical now. But every generation that declared it obsolete then shipped a late project by hiring into it has re-validated the core.",
    oneThing:
      "Effort and progress are different quantities — never let anyone schedule as if person-months were real.",
    related: ["bottlenecks", "emergence", "second-order", "chestertons-fence"],
  },
  {
    id: "soul-new-machine",
    title: "The Soul of a New Machine",
    author: "Tracy Kidder",
    year: "1981",
    area: "industry",
    thesis:
      "A Pulitzer-winning embed with the Data General team that built the Eagle minicomputer in eighteen months — the truest book ever written about how hardware actually ships: through debugging at 2am, 'signing up' (voluntary total commitment), managers who protect teams from the org, and the strange fact that the reward for shipping a machine is mostly the person you became while doing it.",
    ideas: [
      {
        name: "Signing up",
        text: "West's team ran on voluntary overcommitment — engineers who 'signed up' owned outcomes, not tasks. It shipped the machine and burned out half the team: the book is honest that the mechanism and the damage are the same thing.",
      },
      {
        name: "The mushroom theory of management",
        text: "West shielded his team from corporate politics so completely they didn't know the project was a backup plan ('keep them in the dark, feed them...'). Protection-as-management works — and information asymmetry as a motivational tool hasn't aged as well.",
      },
      {
        name: "Debugging as the real work",
        text: "The Eagle's story is mostly the microcode and hardware debug grind — two kids with logic analyzers chasing a flaky NAND gate at midnight. Kidder saw what industry outsiders never do: design is brief; verification is the job. Your job.",
      },
      {
        name: "Not everything worth doing is worth doing well",
        text: "West's maxim for shipping: allocate perfectionism to load-bearing corners only. The team's constant triage between 'right' and 'done' is the permanent condition of real engineering.",
      },
      {
        name: "The game as the reward",
        text: "When Eagle finally shipped, the team felt mostly emptiness — the meaning had lived in the chase. 'Pinball: the reward for winning is you get to play again.' Plan for that hollow week after your next big qual ships.",
      },
    ],
    quotes: [
      {
        text: "Not everything worth doing is worth doing well.",
        note: "Deliberate B-work in the right places funds A-work where it counts.",
      },
      {
        text: "The reward for a job well done is you get to play again.",
        note: "The pinball theory of engineering careers — truer than any promotion ladder.",
      },
    ],
    critics:
      "It romanticizes a labor practice — uncompensated crunch sold as meaning — that the industry spent decades learning to regret; the sequel nobody writes is the team's divorces and departures (most left within a year). The all-male 1970s culture it documents is described, not questioned. Read it as both the best portrait of engineering flow ever written and a cautionary tale wearing a hero's jacket.",
    oneThing:
      "Verification is the work; and the meaning lives in the chase — so choose chases worth being changed by.",
    related: ["bottlenecks", "sunk-cost", "incentives", "slack"],
  },
  {
    id: "chip-war",
    title: "Chip War",
    author: "Chris Miller",
    year: "2022",
    area: "industry",
    thesis:
      "Semiconductors are the oil of the 21st century, and their supply chain — EUV machines only ASML can build, leading-edge fabs concentrated in Taiwan, design software and tools dominated by the US — is history's most complex and most chokepointed industrial system. The US-China technology conflict is, at bottom, a war over this supply chain, and your industry's daily weather (allocations, export rules, fab subsidies) is its front line.",
    ideas: [
      {
        name: "Chokepoints, not markets",
        text: "The industry looks global but runs through single points of failure: one EUV lithography supplier (ASML), one dominant leading-edge foundry (TSMC), a handful of design-tool vendors. Whoever controls a chokepoint controls everyone downstream — the core logic of export controls.",
      },
      {
        name: "The Taiwan concentration",
        text: "The majority of advanced logic is fabricated on an island claimed by a superpower — a geographic risk with no historical parallel. Every fab subsidy program (US, Japan, EU) is priced against this single scenario.",
      },
      {
        name: "Memory's brutal economics",
        text: "DRAM and NAND consolidation — from dozens of players to three-and-a-bit — came through capital-intensity wars where losers lost billions. Memory is cyclical, commoditized and strategic all at once, which is why your NAND allocation moves with geopolitics as much as demand.",
      },
      {
        name: "Weaponized interdependence",
        text: "Export controls on tools and chips turn commercial dependencies into leverage — and trigger the targeted country's crash program to build domestic alternatives. Both dynamics (chokepoint enforcement, forced indigenization) are reshaping the NAND landscape you test within.",
      },
      {
        name: "Talent as infrastructure",
        text: "Repeatedly, the decisive resource is people, not machines — Morris Chang was one hire away from TSMC never existing. National chip strategies succeed or fail on whether engineers actually move.",
      },
    ],
    quotes: [
      {
        text: "The rivalry between the United States and China may well be determined by computing power.",
        note: "The book's thesis, which every subsequent export-control round has reinforced.",
      },
      {
        text: "No other facet of the economy is so dependent on so few firms.",
        note: "The chokepoint map in one sentence — and the risk register of your whole industry.",
      },
    ],
    critics:
      "It's history and geopolitics, thin on technology itself — you'll learn who controls EUV, not how it works — and its US-centric frame reads the industry as a strategic asset first, a human enterprise second. Events since publication (AI demand shock, expanded controls, China's memory advances) already date specific chapters. As the industry map on your wall, though, nothing else comes close.",
    oneThing:
      "Your industry's supply chain is a geopolitical instrument — read allocation changes and roadmap shifts through that lens, not just market logic.",
    related: ["leverage-points", "fat-tails", "incentives", "tragedy-of-commons"],
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    year: "~170 AD",
    area: "classics",
    thesis:
      "The private notebook of the most powerful man alive, coaching himself to stay decent, calm and useful under plague, war and betrayal. Its power is the genre: not philosophy argued but philosophy practiced — repeated self-instructions on controlling judgments, accepting what happens, and doing the day's duty as if it might be the last. It survives because the problems haven't changed.",
    ideas: [
      {
        name: "Judgments, not events",
        text: "Nothing external harms the ruling mind except through the opinion it forms — 'reject your sense of injury and the injury itself disappears.' The gap between event and response is the entire jurisdiction of freedom.",
      },
      {
        name: "The morning premeditatio",
        text: "Pre-brief the day's friction (meddling, ingratitude, arrogance) so it arrives expected and powerless. A pre-mortem for equanimity, run daily for two thousand years before software discovered the technique.",
      },
      {
        name: "The view from above",
        text: "Zoom out — the city, the empire, the centuries of people who worried exactly as you do and are now names on stones. Not nihilism: perspective as a solvent for urgency's false claims.",
      },
      {
        name: "The present is all you own",
        text: "Past is gone, future isn't yours yet; the only life you can lose is the one you're living in this instant. Anxiety is mostly unauthorized time travel.",
      },
      {
        name: "Work as a human being",
        text: "'At dawn, when you have trouble getting out of bed: I am rising to do the work of a human being.' Duty framed not as burden but as function — a bee doesn't negotiate with the morning.",
      },
    ],
    quotes: [
      {
        text: "The impediment to action advances action. What stands in the way becomes the way.",
        note: "The line the entire modern obstacle-is-the-way industry is built on.",
      },
      {
        text: "Waste no more time arguing about what a good man should be. Be one.",
        note: "Book 10 — the shortest possible critique of self-improvement content, written inside some.",
      },
    ],
    critics:
      "It's repetitive by design (self-reminders, not chapters) and can read as emotional suppression — modern psychology would flag the line between reframing and denial. The emperor preaching acceptance also owned slaves and waged wars; the philosophy never questioned the system it made bearable. And Stoicism's 'nothing external harms you' has a jurisdiction: it's for the noise, not for injustices that demand action.",
    oneThing:
      "You don't control events; you fully control the judgment you issue about them — and that judgment is where your suffering or steadiness is manufactured.",
    related: ["pre-mortem", "circle-of-competence", "via-negativa", "hindsight-bias"],
  },
  {
    id: "antifragile",
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    year: "2012",
    area: "thinking",
    thesis:
      "Beyond robust: some things gain from disorder — muscles, immune systems, evolution, tinkering economies — and Taleb builds a worldview around engineering exposure so volatility helps you. Cap downsides, open upsides (the barbell), prefer options to predictions, distrust fragilistas who transfer hidden risks to others, and let small stressors teach systems what forecasts never can.",
    ideas: [
      {
        name: "The triad",
        text: "Everything is fragile (harmed by volatility), robust (indifferent), or antifragile (helped). The question 'what happens to this if things get chaotic?' sorts portfolios, careers, codebases and countries more usefully than any forecast of whether chaos will come.",
      },
      {
        name: "The barbell",
        text: "Combine extreme safety in most of the position (90% cash-like, boring day job, stable core system) with small, unbounded-upside bets on the rest. The middle — moderately risky everything — carries hidden tail risk priced as safety.",
      },
      {
        name: "Optionality beats prediction",
        text: "With capped downside and open upside, you profit from volatility without forecasting it. Tinkering, cheap experiments, and asymmetric exposures are intelligence you don't have to possess.",
      },
      {
        name: "Skin in the game",
        text: "Judge advice by the advisor's exposure: fragilistas (forecasters, some executives, pundits) collect upside while others hold their downside. Via negativa is the honest sibling — removing fragility is surer than adding cleverness.",
      },
      {
        name: "Naive intervention",
        text: "Suppressing small volatility (forest fires, market corrections, minor team conflicts) stores it for one catastrophic release. Systems need small stressors the way bones need load — overprotection is a fragilizer.",
      },
    ],
    quotes: [
      {
        text: "Wind extinguishes a candle and energizes fire.",
        note: "The whole book in nine words: the same disorder, opposite exposures — be the fire.",
      },
      {
        text: "If you see fraud and do not say fraud, you are a fraud.",
        note: "Skin in the game applied to speech — Taleb's ethics are inseparable from his risk math.",
      },
    ],
    critics:
      "The style is half the product and half the problem: bullying, repetitive, contemptuous of nearly everyone, with anecdotes doing work that evidence should. 'Antifragility' at system level often means individuals absorb the pain (restaurants fail so the restaurant scene learns). And barbell advice is easiest to follow with Taleb's wealth — a paycheck-dependent engineer can only approximate it. The core asymmetry insight, though, survives every stylistic objection.",
    oneThing:
      "Stop asking 'what do I predict?' and start asking 'what is my exposure if I'm wrong?' — then shape the exposure, not the prediction.",
    related: ["asymmetry", "fat-tails", "margin-of-safety", "via-negativa", "moral-hazard"],
  },
];

export const BOOK_BY_ID: Map<string, BookDistillation> = new Map(
  BOOKS.map((b) => [b.id, b]),
);
