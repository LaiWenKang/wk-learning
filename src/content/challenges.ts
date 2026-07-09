/**
 * Daily challenge bank — the third act of the Mind Gym session.
 *
 * Three rotating formats:
 *  - Fallacy hunt: a realistic scenario hiding one reasoning error (MCQ).
 *  - Paradox: a counterintuitive result — commit to an instinct, then
 *    read the resolution.
 *  - Fermi problem: estimate something absurd from first principles,
 *    then compare against a step-by-step walkthrough.
 */

export type FallacyChallenge = {
  id: string;
  kind: "fallacy";
  scenario: string;
  question: string;
  options: string[];
  answerIdx: number;
  explain: string;
};

export type ParadoxChallenge = {
  id: string;
  kind: "paradox";
  name: string;
  setup: string;
  /** The question to commit an instinct to before revealing. */
  prompt: string;
  resolution: string;
};

export type FermiChallenge = {
  id: string;
  kind: "fermi";
  q: string;
  unit: string;
  /** Central estimate. */
  answer: number;
  /** Accepted band — inside it counts as a hit. */
  low: number;
  high: number;
  /** The reasoning chain, step by step. */
  walkthrough: string;
};

export type Challenge = FallacyChallenge | ParadoxChallenge | FermiChallenge;

/* ------------------------- Fallacy hunts ------------------------- */

export const FALLACY_CHALLENGES: FallacyChallenge[] = [
  {
    id: "f-sunk-project",
    kind: "fallacy",
    scenario:
      "A steering committee reviews a struggling platform migration. The lead argues: 'We've invested eight months and $2M. Walking away now would mean all of that was wasted. We owe it to the work already done to push through.'",
    question: "What's the reasoning error?",
    options: [
      "Sunk cost fallacy — past spend can't justify future spend",
      "Appeal to authority — deferring to the lead's seniority",
      "False dilemma — assuming only two options exist",
      "Survivorship bias — only looking at successful migrations",
    ],
    answerIdx: 0,
    explain:
      "The $2M and eight months are gone on every branch of the decision tree — they're identical whether the project continues or stops, so they can't differentiate the options. The only valid question is forward-looking: given what we now know, is the *remaining* cost worth the expected benefit? 'Honoring past investment' is loss aversion wearing a duty costume.",
  },
  {
    id: "f-unicorn-habits",
    kind: "fallacy",
    scenario:
      "A popular business book profiles 30 billion-dollar startups and finds that 90% of their founders dropped everything to pursue a single idea obsessively. The book concludes: 'Going all-in on one idea is the key to building a unicorn.'",
    question: "What's the reasoning error?",
    options: [
      "Anchoring — the number 30 sets an arbitrary reference",
      "Survivorship bias — the failed all-in founders were never counted",
      "Gambler's fallacy — assuming success is 'due' after failures",
      "Straw man — misrepresenting cautious founders' actual strategy",
    ],
    answerIdx: 1,
    explain:
      "The sample contains only winners. Thousands of founders also went all-in and failed invisibly — if 90% of *those* did the same thing, 'all-in obsession' predicts nothing (and might even predict failure). Any 'what winners have in common' claim is empty until you check whether the losers had it in common too.",
  },
  {
    id: "f-baserate-hire",
    kind: "fallacy",
    scenario:
      "A hiring manager says: 'This candidate aced our toughest system-design interview — the last person who did that became our best engineer. I'm certain this one will be a top performer too.'",
    question: "What's the reasoning error?",
    options: [
      "Post hoc — assuming the interview caused the performance",
      "Appeal to authority — trusting the interviewer's prestige",
      "The law of small numbers — generalizing confidently from n=1",
      "Sunk cost — over-weighting time invested in interviews",
    ],
    answerIdx: 2,
    explain:
      "One previous case is noise, not a pattern. Interview-to-job correlation is famously weak, and a single prior success can't establish that this interview predicts anything. Small samples produce vivid, convincing, wrong conclusions — the confidence ('certain') is exactly what n=1 cannot support.",
  },
  {
    id: "f-posthoc-deploy",
    kind: "fallacy",
    scenario:
      "Traffic dropped 12% the day after Friday's release, so the team spends the weekend rolling it back. Monday's retro concludes: 'The release caused the drop — it recovered after the rollback.' Nobody mentions that the drop began Saturday morning and traffic always dips on weekends.",
    question: "What's the reasoning error?",
    options: [
      "Post hoc ergo propter hoc — 'after it, therefore because of it'",
      "Confirmation bias — only reading logs that support the theory",
      "False dilemma — assuming rollback was the only safe option",
      "Texas sharpshooter — drawing targets around random clusters",
    ],
    answerIdx: 0,
    explain:
      "Sequence isn't causation: the drop following the release (and recovery following the rollback) is exactly what the weekend pattern would produce with no release at all. The control question — 'what does this metric do on normal weekends?' — was never asked. Post hoc reasoning is how teams build confident folklore about harmless changes.",
  },
  {
    id: "f-sharpshooter-metrics",
    kind: "fallacy",
    scenario:
      "A growth lead reviews 40 dashboard metrics after a campaign and reports: 'Signups from Chrome users aged 25–34 in three cities rose 40% — the campaign clearly resonated with young urban professionals. Here's the deck.'",
    question: "What's the reasoning error?",
    options: [
      "Base-rate neglect — ignoring how often signups fluctuate",
      "Texas sharpshooter — finding a pattern first, drawing the target after",
      "Appeal to authority — leaning on the lead's growth expertise",
      "Loss aversion — overreacting to a small decline elsewhere",
    ],
    answerIdx: 1,
    explain:
      "Slice 40 metrics by browser, age, and city and you get hundreds of segments — several will show '40% lifts' by pure chance. Picking the winning segment afterward and narrating it as the campaign's 'target audience' is painting the bullseye around the bullet holes. A real test states the hypothesis before looking.",
  },
  {
    id: "f-gambler-market",
    kind: "fallacy",
    scenario:
      "After six months of market declines, an investor moves his emergency fund into equities: 'Markets have fallen six months straight — statistically, a rebound is overdue. The odds of a seventh down month are tiny.'",
    question: "What's the reasoning error?",
    options: [
      "Survivorship bias — studying only investors who timed it right",
      "Anchoring — fixating on the market's previous high",
      "Sunk cost — refusing to accept losses already taken",
      "Gambler's fallacy — treating independent events as self-correcting",
    ],
    answerIdx: 3,
    explain:
      "Markets don't remember that they 'owe' anyone a rebound — the streak doesn't change next month's probabilities the way a roulette wheel doesn't warm up. (If anything, momentum can extend streaks.) The deeper error: betting the *emergency fund* on any market view confuses 'probably' with 'safely'.",
  },
  {
    id: "f-authority-architect",
    kind: "fallacy",
    scenario:
      "In a debate about database choice, an engineer closes the discussion: 'Our principal architect — who built two of the most admired systems in the industry — says document stores are the future. That settles it.'",
    question: "What's the reasoning error?",
    options: [
      "Appeal to authority — substituting prestige for evidence on this case",
      "False dilemma — framing it as documents vs relational only",
      "Post hoc — crediting the architect for systems that succeeded anyway",
      "Social proof — following what admired companies do",
    ],
    answerIdx: 0,
    explain:
      "Expertise is evidence, but it doesn't 'settle' anything — especially about *this* system's specific access patterns, which the slogan 'the future' never examined. Authority fails exactly when it replaces case-specific analysis. The respectful move is asking the architect *why*, then testing whether the reasons apply here.",
  },
  {
    id: "f-dilemma-rewrite",
    kind: "fallacy",
    scenario:
      "A tech lead pitches: 'We either rewrite this service from scratch or we accept that it slowly kills our velocity forever. Those are the choices. I say we rewrite.'",
    question: "What's the reasoning error?",
    options: [
      "Slippery slope — assuming decay must continue forever",
      "False dilemma — presenting two options when a spectrum exists",
      "Sunk cost — protecting the effort already invested in the service",
      "Appeal to authority — leaning on the lead's title",
    ],
    answerIdx: 1,
    explain:
      "'Rewrite or rot' hides the middle: strangler-fig incremental replacement, targeted refactors of the hottest paths, better tests around the scariest modules, or even just documenting it. False dilemmas win debates by deleting the reasonable options — and rewrites pitched this way famously die in the valley between old and new.",
  },
  {
    id: "f-strawman-review",
    kind: "fallacy",
    scenario:
      "A proposal suggests adding one approval step for schema changes. A reviewer responds: 'So we want to become the kind of company where every line of code needs a committee? Where nothing ships without five signatures? That culture kills startups.'",
    question: "What's the reasoning error?",
    options: [
      "Straw man — attacking an exaggerated version of the proposal",
      "Appeal to authority — invoking startup culture as sacred",
      "Base-rate neglect — ignoring how often approvals catch issues",
      "Confirmation bias — recalling only bureaucracy horror stories",
    ],
    answerIdx: 0,
    explain:
      "The proposal was one step for one risky change type; the rebuttal demolishes 'five signatures on every line' — a position nobody holds. Straw men feel like winning while guaranteeing the actual trade-off (is *this* approval worth *this* friction?) never gets discussed. The tell: the rebuttal is easier to attack than anything anyone said.",
  },
  {
    id: "f-correlation-tests",
    kind: "fallacy",
    scenario:
      "An internal study finds teams with higher test coverage ship fewer production incidents. Leadership mandates 90% coverage for all teams: 'The data proves coverage prevents incidents.'",
    question: "What's the reasoning error?",
    options: [
      "Correlation mistaken for causation — a third factor may drive both",
      "The law of small numbers — too few teams in the study",
      "Post hoc — incidents fell after coverage rose",
      "Texas sharpshooter — cherry-picking the one metric that correlates",
    ],
    answerIdx: 0,
    explain:
      "Disciplined teams likely produce both high coverage *and* careful releases — engineering maturity drives both ends of the correlation. Mandating the *number* without the discipline invites Goodhart's law: assertion-free tests that satisfy the dashboard and prevent nothing. The study observed a marker of quality, then mandated the marker.",
  },
  {
    id: "f-regression-manager",
    kind: "fallacy",
    scenario:
      "A sales team has its worst quarter in years. A turnaround coach is hired; next quarter, numbers bounce back to normal. The VP concludes: 'The coaching program works — look at the recovery. We're rolling it out company-wide.'",
    question: "What's the reasoning error?",
    options: [
      "Ignoring regression to the mean — extremes drift back on their own",
      "Survivorship bias — only surveying reps who stayed",
      "False dilemma — assuming coaching or decline were the only paths",
      "Anchoring — comparing against the worst quarter as baseline",
    ],
    answerIdx: 0,
    explain:
      "The intervention was triggered *by* an extreme — the exact moment when chance alone predicts improvement, since a worst-in-years quarter is partly bad luck that won't repeat. Any action taken at rock bottom 'works'. The honest test needs a comparison: similar slumping teams *without* the coach. Most recover too.",
  },
  {
    id: "f-slippery-exception",
    kind: "fallacy",
    scenario:
      "An engineer requests a one-week deadline extension after a family emergency. Their manager refuses: 'If I bend the deadline for you, next everyone will want extensions, then deadlines mean nothing, and eventually we'll be a company that never ships.'",
    question: "What's the reasoning error?",
    options: [
      "Slippery slope — assuming one step forces a slide to the extreme",
      "Sunk cost — protecting the original plan because it took effort",
      "Appeal to authority — invoking managerial power as justification",
      "Gambler's fallacy — expecting past discipline to guarantee future",
    ],
    answerIdx: 0,
    explain:
      "Each step in the chain (one exception → everyone demands one → deadlines meaningless → never ship) is asserted, not argued — real organizations grant documented exceptions constantly without collapsing. Slippery slopes smuggle in the assumption that no distinctions can ever be drawn. 'Emergency, documented, first time' *is* a drawable line.",
  },
];

/* --------------------------- Paradoxes --------------------------- */

export const PARADOX_CHALLENGES: ParadoxChallenge[] = [
  {
    id: "p-monty-hall",
    kind: "paradox",
    name: "The Monty Hall Problem",
    setup:
      "Three doors: one hides a car, two hide goats. You pick door 1. The host — who knows where the car is — opens door 3, revealing a goat. He offers: stick with door 1, or switch to door 2?",
    prompt: "Does switching improve your odds, and if so to what?",
    resolution:
      "Switching wins 2/3 of the time. Your first pick was right 1/3 of the time — nothing the host does changes that. The other 2/3 of the time the car is behind a door you didn't pick, and the host, forced to open a goat door, has just eliminated the wrong one *for you*: switching collects that entire 2/3. The intuition trap is thinking 'two doors left = 50/50' — but the host's choice wasn't random; it injected information. When Marilyn vos Savant published this, thousands of letters — many from PhDs — insisted she was wrong. Simulation settles it in twenty lines of code.",
  },
  {
    id: "p-birthday",
    kind: "paradox",
    name: "The Birthday Paradox",
    setup:
      "A room contains just 23 random people. Consider the chance that at least two of them share a birthday (same day and month).",
    prompt: "Is it closer to 5%, 20%, or 50%?",
    resolution:
      "It's 50.7% — a coin flip at only 23 people, and 99.9% by 70 people. Intuition fails because you imagine comparisons against *yourself* (23 chances to match *you* — indeed small). But the room contains 23×22/2 = 253 *pairs*, and every pair is a chance. Combinatorics explodes quadratically while intuition counts linearly. This is why hash collisions, duplicated IDs, and 'impossible coincidences' happen constantly: the number of pairs in any system is vastly larger than the number of things.",
  },
  {
    id: "p-simpson",
    kind: "paradox",
    name: "Simpson's Paradox",
    setup:
      "A hospital tests a treatment. Among mild cases, treated patients do better. Among severe cases, treated patients also do better. But pooling all patients together, treated patients do *worse* overall.",
    prompt: "How can a treatment win in every group yet lose in total?",
    resolution:
      "Because the treatment was given mostly to *severe* cases (doctors reserve intervention for the sick), and severe cases have worse outcomes regardless. The pooled comparison mixes 'treatment effect' with 'who got treated'. This is real: the classic UC Berkeley admissions data showed apparent bias against women overall, yet within each department women were admitted at equal or higher rates — women had applied to the most competitive departments. Lesson: an aggregate can reverse every one of its parts whenever group sizes differ. Always ask what the total is averaging over.",
  },
  {
    id: "p-friendship",
    kind: "paradox",
    name: "The Friendship Paradox",
    setup:
      "Researchers confirm it across every social network studied: on average, your friends have more friends than you do. This holds for almost everyone — not just the lonely.",
    prompt: "How can nearly everyone's friends be above average?",
    resolution:
      "Sampling bias built into friendship itself: highly-connected people appear on *many* people's friend lists, so when you enumerate 'my friends', the popular are over-represented — you're sampling people in proportion to their connectedness. The same math means your gym feels crowded (you disproportionately visit when others do), and your co-authors are more cited than you. Practical use: to find flu outbreaks early, monitor people's *friends* — they're systematically closer to the network's center than randomly chosen people.",
  },
  {
    id: "p-braess",
    kind: "paradox",
    name: "Braess's Paradox",
    setup:
      "A city adds a new superhighway connecting two congested routes, at huge cost. Traffic engineers then observe average commute times get *worse* — and when the road is later closed, commutes improve.",
    prompt: "How can adding capacity slow everyone down?",
    resolution:
      "Each driver individually gains by using the new shortcut, but the shortcut funnels everyone through the same two bottleneck segments, overloading them. Individually rational route choices settle into a collective equilibrium worse than the one without the road — a real phenomenon observed in Seoul (removing the Cheonggyecheon highway improved traffic) and New York. The general lesson reaches beyond roads: in systems of self-interested agents, adding options or capacity can degrade the equilibrium. More is not automatically better when everyone reacts to it.",
  },
  {
    id: "p-berkson",
    kind: "paradox",
    name: "Berkson's Paradox",
    setup:
      "A talent-spotter notices that among the startups she tracks, the ones with brilliant technology tend to have weak business models, and the strong-business ones tend to have mediocre tech. She concludes great tech and great business rarely coexist.",
    prompt: "What if the negative correlation isn't real — where would it come from?",
    resolution:
      "Her *tracking list* created it. Startups need to clear some bar to get noticed: great tech OR great business (or both). Ventures weak on both never enter the sample — and that missing corner manufactures a negative correlation among the visible. The same selection effect explains why 'attractive people seem less kind' (dating pools filter on total appeal) and why hospitals find odd disease correlations (admission itself filters). Whenever you observe a trade-off, first ask: was this sample selected on the sum of the two traits?",
  },
  {
    id: "p-stpetersburg",
    kind: "paradox",
    name: "The St. Petersburg Paradox",
    setup:
      "A casino offers a game: flip a fair coin until heads appears. Pot starts at $2 and doubles each flip — tails, tails, heads pays $8. The expected value of this game is mathematically *infinite*.",
    prompt: "How much would you actually pay to play — and why so much less than infinity?",
    resolution:
      "Most people won't pay more than $10–$20, and they're right. The infinite expectation comes from astronomically rare, astronomically large payouts — but you play once, the casino has finite money, and your millionth dollar is worth far less to you than your first (diminishing marginal utility, Bernoulli's resolution). The paradox exposes expected value's blind spot: when the mean is driven by outcomes you'll never survive to collect (or that can't be paid), the mean is not a price. Fat-tailed bets need utility and survivability analysis, not averages.",
  },
  {
    id: "p-abilene",
    kind: "paradox",
    name: "The Abilene Paradox",
    setup:
      "A family sits comfortably at home. Someone suggests a 100-km drive to Abilene for dinner. One by one, each agrees. The trip is hot, the food bad. Afterwards, every single person admits they never wanted to go — including the one who suggested it.",
    prompt: "How does a group unanimously choose what no member wants?",
    resolution:
      "Each person privately disagreed but assumed the others were keen, and went along to avoid friction — manufacturing false consensus out of politeness. Unlike groupthink (where members genuinely converge), Abilene is a failure of *communication*: the information to stop the trip existed in every head and never surfaced. Teams take this trip constantly — projects nobody believes in, features everyone privately doubts. The cheapest fix: someone asks 'has anyone actually...?', or a leader collects private opinions *before* revealing any.",
  },
  {
    id: "p-jevons",
    kind: "paradox",
    name: "The Jevons Paradox",
    setup:
      "Engines become dramatically more coal-efficient. Economist William Jevons observes the result in 1865: Britain's total coal consumption *rises* sharply. The same pattern later repeats with fuel-efficient cars, LED lighting, and cloud computing.",
    prompt: "Why does using a resource more efficiently increase its total use?",
    resolution:
      "Efficiency drops the *cost per use*, and cheaper use invites more of it — more engines become profitable, people light spaces they never would have lit, teams spin up servers they'd never have bought. When demand is elastic enough, the rebound overwhelms the savings. The lesson generalizes uncomfortably: 'efficiency' rarely shrinks totals by itself (see also: adding a lane to a highway, making meetings easier to schedule, faster CI enabling more builds). To actually reduce consumption, the constraint must bind somewhere — a cap, a budget, a price.",
  },
  {
    id: "p-prosecutor",
    kind: "paradox",
    name: "The Prosecutor's Fallacy",
    setup:
      "A suspect matches DNA found at a crime scene. The expert testifies: 'The probability of a random person matching is 1 in a million.' The prosecutor tells the jury: 'So there's only a 1-in-a-million chance he's innocent.'",
    prompt: "The two statements sound identical. What's the difference?",
    resolution:
      "They're opposite conditionals: P(match | innocent) = 1/1,000,000 is NOT P(innocent | match). In a city of 10 million, about 10 innocent people match by chance — if the suspect was found by *searching a database*, he's just one of ~11 matches, and the chance he's innocent is closer to 10/11 than 1-in-a-million. The inversion requires base rates (Bayes). Real people have been convicted on this fallacy — and it runs quieter versions everywhere: 'only 1% of healthy people test positive' does not mean 'you're 99% sick'.",
  },
  {
    id: "p-benford",
    kind: "paradox",
    name: "Benford's Law",
    setup:
      "Collect naturally-occurring numbers — river lengths, stock prices, populations, invoice amounts. Look only at each number's first digit. Intuition says digits 1–9 should each lead about 11% of the time.",
    prompt: "What actually happens?",
    resolution:
      "1 leads about 30% of the time, 2 about 18%, declining to under 5% for 9 — a logarithmic pattern. Why: quantities that grow multiplicatively spend far longer traversing '1xx' territory (100→200 is +100%) than '9xx' (900→1000 is +11%); on a logarithmic ruler, the digit-1 zone is simply widest. The stunning application: fraudsters inventing numbers spread first digits evenly — so accountants and election auditors run Benford tests to flag books that are 'too uniform'. People have been caught because their fake invoices didn't start with enough 1s.",
  },
  {
    id: "p-potato",
    kind: "paradox",
    name: "The Potato Paradox",
    setup:
      "You have 100 kg of potatoes that are 99% water. You leave them out overnight and some water evaporates — they're now 98% water.",
    prompt: "How much do the potatoes weigh now?",
    resolution:
      "50 kg. The dry matter — 1 kg — never changes; only its *share* does. At 99% water, 1 kg of solids is 1% of the total (100 kg). At 98% water, that same 1 kg must be 2% of the total, so the total is 50 kg. A one-percentage-point shift hid a halving. The general trap: reasoning about percentages of a *changing* base. It's why 'a 50% drop then a 50% gain' loses money, why market-share moves mislead when the market shrinks, and why you should always ask a percentage: '…of what, exactly?'",
  },
];

/* ------------------------- Fermi problems ------------------------- */

export const FERMI_CHALLENGES: FermiChallenge[] = [
  {
    id: "fe-heartbeats",
    kind: "fermi",
    q: "How many times will your heart beat in an 80-year life?",
    unit: "beats",
    answer: 3000000000,
    low: 1500000000,
    high: 6000000000,
    walkthrough:
      "~70 beats/min × 60 min = 4,200/hour → ×24 ≈ 100,000/day → ×365 ≈ 37 million/year → ×80 years ≈ 3 billion beats. Athletes' resting rates near 50 bpm shave off nearly a billion — the heart's budget is one of the few numbers exercise actually *stretches*.",
  },
  {
    id: "fe-bedroom-air",
    kind: "fermi",
    q: "How much does the air in a typical bedroom weigh?",
    unit: "kg",
    answer: 48,
    low: 20,
    high: 120,
    walkthrough:
      "Room ≈ 4 m × 4 m × 2.5 m = 40 m³. Air density ≈ 1.2 kg/m³ at sea level. 40 × 1.2 ≈ 48 kg — the weight of a person, floating invisibly around you. Most people guess grams. Air only feels weightless because it pushes equally in every direction.",
  },
  {
    id: "fe-cloud-weight",
    kind: "fermi",
    q: "How much does a typical cumulus cloud weigh?",
    unit: "tonnes",
    answer: 500,
    low: 100,
    high: 2000,
    walkthrough:
      "A fair-weather cumulus is roughly 1 km × 1 km × 1 km = 1 billion m³. Liquid water content ≈ 0.5 g/m³. That's 500 million grams = 500 tonnes — about 100 elephants, floating. It stays up because the droplets are microscopic and the warm rising air beneath outweighs their drift downward.",
  },
  {
    id: "fe-lifetime-walk",
    kind: "fermi",
    q: "How far does a person walk in a lifetime?",
    unit: "km",
    answer: 110000,
    low: 50000,
    high: 250000,
    walkthrough:
      "~6,000 steps/day (mix of active and sedentary years) × 0.75 m/step ≈ 4.5 km/day → ×365 ≈ 1,650 km/year → ×75 years ≈ 120,000 km. Call it ~110,000 km — nearly three times around the Earth, one unremarkable step at a time. Compounding wears sneakers.",
  },
  {
    id: "fe-words-spoken",
    kind: "fermi",
    q: "How many words does a typical person speak per day?",
    unit: "words",
    answer: 16000,
    low: 6000,
    high: 40000,
    walkthrough:
      "Studies with wearable recorders found ~16,000 words/day on average (and, surprisingly, no significant gender gap). Sanity-check: ~2 hours of actual talking/day × ~130 words/min ≈ 15,600. A year of your speech ≈ 5.8 million words — about 70 novels, mostly about lunch.",
  },
  {
    id: "fe-rice-grains",
    kind: "fermi",
    q: "How many grains of rice are in a 1 kg bag?",
    unit: "grains",
    answer: 50000,
    low: 25000,
    high: 100000,
    walkthrough:
      "One grain of rice ≈ 20 mg (a paperclip is ~1 g ≈ 50 grains). 1 kg = 1,000,000 mg ÷ 20 ≈ 50,000 grains. The classic chessboard legend: doubling one grain per square hits ~9.2 × 10¹⁸ grains by square 64 — about 180 trillion of these bags, more rice than Earth has ever grown.",
  },
  {
    id: "fe-lifetime-water",
    kind: "fermi",
    q: "How many litres of water will you drink in your lifetime?",
    unit: "litres",
    answer: 55000,
    low: 25000,
    high: 120000,
    walkthrough:
      "~2 litres/day (all beverages count) × 365 ≈ 730 L/year → ×75 years ≈ 55,000 litres. That's about 22 Olympic-pool-lanes' worth — or one full road tanker truck, sipped one glass at a time.",
  },
  {
    id: "fe-seconds-30",
    kind: "fermi",
    q: "How many seconds old is a 30-year-old?",
    unit: "seconds",
    answer: 946000000,
    low: 700000000,
    high: 1200000000,
    walkthrough:
      "1 year ≈ 31.5 million seconds (60 × 60 × 24 × 365 = 31,536,000). ×30 ≈ 946 million. A 30-year-old hasn't yet lived a billion seconds — that milestone lands at 31.7 years. 'A million seconds' is 11.6 days; 'a billion' is a third of a lifetime. Scale words hide scale.",
  },
  {
    id: "fe-trees-person",
    kind: "fermi",
    q: "How many trees are there per person on Earth?",
    unit: "trees",
    answer: 375,
    low: 150,
    high: 800,
    walkthrough:
      "Earth holds ~3 trillion trees (2015 satellite + ground survey). Divide by ~8 billion people: 3,000,000,000,000 ÷ 8,000,000,000 ≈ 375 trees each. Before agriculture it was roughly double. Humanity removes a net ~10 billion trees a year — a little over one per person.",
  },
  {
    id: "fe-walk-equator",
    kind: "fermi",
    q: "Walking nonstop at normal pace, how many days would it take to circle the Earth?",
    unit: "days",
    answer: 334,
    low: 200,
    high: 600,
    walkthrough:
      "Equator ≈ 40,075 km. Walking pace ≈ 5 km/h × 24 h = 120 km/day. 40,075 ÷ 120 ≈ 334 days — under a year without sleep. At a human 8 hours/day of walking, it's ~2.7 years. Several people have actually done versions of it; it takes them ~4–11 years with oceans in the way.",
  },
  {
    id: "fe-books-left",
    kind: "fermi",
    q: "Reading one book a week from age 30, how many books will you finish by 90?",
    unit: "books",
    answer: 3100,
    low: 2000,
    high: 5000,
    walkthrough:
      "52 books/year × 60 years ≈ 3,100 books. Sounds huge — until you notice it's a fixed budget: every mediocre book you push through costs a slot from a shockingly finite shelf. This estimate is the strongest argument ever made for quitting bad books on page 50.",
  },
  {
    id: "fe-career-hours",
    kind: "fermi",
    q: "How many working hours are in a 40-year career?",
    unit: "hours",
    answer: 80000,
    low: 50000,
    high: 120000,
    walkthrough:
      "40 hours/week × 50 weeks ≈ 2,000 hours/year → ×40 years = 80,000 hours. That's the famous '80,000 hours' — enough to get world-class at several things (the 10,000-hour figure fits 8 times). Where those hours point matters more than how hard any single week is rowed.",
  },
];

export const CHALLENGE_KINDS = ["fallacy", "paradox", "fermi"] as const;
export type ChallengeKind = (typeof CHALLENGE_KINDS)[number];
