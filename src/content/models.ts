/**
 * The mental-model library — the heart of the daily Mind Gym.
 *
 * Each entry is a self-contained "chapter": what the model is, why it
 * works (mechanism), a concrete example, and — most importantly — when
 * it misleads. Depth over slogans: the failure mode is where real
 * understanding lives. All content is original writing about public,
 * well-established ideas.
 */

export type ModelDomain =
  | "decisions"
  | "probability"
  | "systems"
  | "incentives"
  | "psychology"
  | "strategy";

export const MODEL_DOMAINS: ModelDomain[] = [
  "decisions",
  "probability",
  "systems",
  "incentives",
  "psychology",
  "strategy",
];

export const MODEL_DOMAIN_LABELS: Record<ModelDomain, string> = {
  decisions: "Decision-making",
  probability: "Probability & Statistics",
  systems: "Systems Thinking",
  incentives: "Incentives & Economics",
  psychology: "Psychology & Biases",
  strategy: "Strategy & Leverage",
};

/** CSS tint per domain (uses existing category hues). */
export const MODEL_DOMAIN_TINTS: Record<ModelDomain, string> = {
  decisions: "var(--cat-programming)",
  probability: "var(--cat-ai)",
  systems: "var(--cat-systems)",
  incentives: "var(--cat-finance)",
  psychology: "var(--cat-communication)",
  strategy: "var(--cat-career)",
};

export type MentalModel = {
  id: string;
  name: string;
  domain: ModelDomain;
  /** One provocative line — the reason to keep reading. */
  hook: string;
  /** Why the model works — the underlying logic. */
  mechanism: string;
  /** A concrete, vivid example of the model in action. */
  example: string;
  /** When the model misleads — the boundary of its usefulness. */
  failure: string;
  /** Active-recall question + the answer to self-grade against. */
  recall: { q: string; a: string };
  /** A prompt to apply the model to your own life today. */
  apply: string;
  related: string[];
};

export const MENTAL_MODELS: MentalModel[] = [
  /* ---------------- Decision-making ---------------- */
  {
    id: "inversion",
    name: "Inversion",
    domain: "decisions",
    hook: "You don't need to be brilliant — you just need to reliably avoid being stupid.",
    mechanism:
      "Many problems are easier solved backwards. Instead of asking 'how do I succeed?', ask 'what would guarantee failure?' and then avoid those things. Failure modes are usually fewer, more concrete, and more knowable than success paths, so working from the failure end gives you a sharper checklist than working from the success end.",
    example:
      "Instead of asking 'how do we make this launch go well?', a team lists what would make it a disaster: no rollback plan, an unannounced breaking change, one person holding all the context, launching on a Friday. Each item becomes a cheap preventive action — and the launch goes smoothly not because of genius, but because the obvious failure paths were closed.",
    failure:
      "Inversion protects the downside but never generates the upside. A career, product, or portfolio built only on avoiding mistakes converges to mediocrity — you also need a positive thesis. Use inversion as the safety net, not the whole strategy.",
    recall: {
      q: "What question does inversion tell you to ask instead of 'how do I succeed?'",
      a: "'What would guarantee failure?' — then systematically avoid those things, because failure modes are more concrete and enumerable than success paths.",
    },
    apply:
      "Take one goal you're working toward this week. Write three things that would guarantee it fails — and check whether you're accidentally doing any of them.",
    related: ["pre-mortem", "margin-of-safety", "via-negativa"],
  },
  {
    id: "second-order",
    name: "Second-Order Thinking",
    domain: "decisions",
    hook: "First-order thinking is why the smartest people make the same mistakes as everyone else.",
    mechanism:
      "Every action has consequences, and those consequences have consequences. First-order thinking stops at the immediate effect ('this feels good / solves it now'). Second-order thinking asks 'and then what?' — repeatedly. Because most people stop at the first order, the second order is where both hidden risks and overlooked opportunities concentrate.",
    example:
      "A company cuts its training budget and saves money this quarter (first order). Then its engineers slowly fall behind on tooling, senior people leave for places that invest in them, and hiring costs balloon two years later (second and third order). The 'saving' was real; it was also the most expensive decision of the year.",
    failure:
      "Chains of hypothetical consequences get speculative fast — you can talk yourself out of anything by imagining fourth-order disasters. Discipline it with probabilities: trace two orders deep with honest likelihoods, not ten orders deep with vivid stories.",
    recall: {
      q: "What is the core question of second-order thinking, and why does it pay off?",
      a: "'And then what?' — because most people stop at immediate consequences, the second-order effects are systematically underpriced: that's where hidden risks and opportunities sit.",
    },
    apply:
      "Take a decision you made recently. Write its first-order effect, then honestly ask 'and then what?' twice. Does the decision still look the same?",
    related: ["feedback-loops", "incentives", "goodharts-law"],
  },
  {
    id: "opportunity-cost",
    name: "Opportunity Cost",
    domain: "decisions",
    hook: "The real price of anything is what you gave up to get it — and it never appears on the receipt.",
    mechanism:
      "Every yes is a hidden no to everything else you could have done with the same time, money, or attention. Because the forgone alternative is invisible — it never happens — our brains ignore it, and we systematically overvalue what's in front of us. Making the best alternative explicit turns a vague choice into an honest comparison.",
    example:
      "A team spends three months building an internal dashboard nobody asked for. The visible cost is three months of salaries. The invisible cost is the customer-facing feature those same engineers didn't build — which a competitor shipped that quarter. The dashboard didn't fail; it just cost more than anyone priced in.",
    failure:
      "Taken obsessively, opportunity-cost thinking makes every choice feel like a loss and leads to paralysis or constant switching — chasing the marginally better option and never compounding on anything. Big decisions deserve the comparison; small ones deserve a fast default.",
    recall: {
      q: "Why do we systematically ignore opportunity costs?",
      a: "Because the forgone alternative is invisible — it never actually happens — so the mind doesn't register it as a cost. You have to deliberately name the best alternative to see the real price.",
    },
    apply:
      "Name the biggest block of time you'll spend this week. What is the single best alternative use of that time? Is the trade still worth it?",
    related: ["sunk-cost", "marginal-thinking", "compounding"],
  },
  {
    id: "reversibility",
    name: "One-Way vs Two-Way Doors",
    domain: "decisions",
    hook: "Most decisions deserve less deliberation than you give them — and a few deserve far more.",
    mechanism:
      "Decisions differ in reversibility. Two-way doors can be undone cheaply: walk through, look around, walk back. One-way doors lock you in: choose wrong and you live with it. Matching deliberation to reversibility — fast on two-way doors, slow and careful on one-way doors — beats treating every choice with uniform caution, which wastes speed where it's free and rushes where it's fatal.",
    example:
      "Trying a new note-taking format is a two-way door: switch back tomorrow if it fails. Signing a two-year apartment lease, choosing a database that will hold all your production data, or making a public commitment under your own name — those are one-way doors. The mistake isn't caution or speed; it's applying the wrong one.",
    failure:
      "Doors change type when you're not looking: a 'temporary' workaround becomes load-bearing, a trial tool accumulates two years of data, a quick hire shapes the culture. Re-check reversibility as things scale — what was two-way at the start is often one-way by the time you'd want to reverse it.",
    recall: {
      q: "How should deliberation time relate to reversibility?",
      a: "Decide fast on reversible (two-way door) choices and reserve slow, careful analysis for irreversible (one-way door) choices — and re-check the type, because two-way doors quietly become one-way as commitments accumulate.",
    },
    apply:
      "Look at the decision you've been postponing longest. Is it actually a two-way door? If you could undo it in a week, decide it today.",
    related: ["margin-of-safety", "expected-value", "asymmetry"],
  },
  {
    id: "expected-value",
    name: "Expected Value",
    domain: "decisions",
    hook: "A good decision can have a bad outcome — and most people can't tell the difference.",
    mechanism:
      "The value of an uncertain choice is each outcome weighted by its probability. This separates decision quality from outcome quality: a 90%-odds bet that fails was still a good bet; a lottery ticket that wins was still a bad one. Judging by outcomes alone teaches you the wrong lessons; judging by expected value lets you improve the only thing you control — the decision process.",
    example:
      "An engineer must choose: a safe migration path (100% chance of a 2-day cost) or a risky shortcut (80% chance of saving 2 days, 20% chance of a 10-day incident). The shortcut's expected cost is 0.8×0 + 0.2×10 = 2 days — no better than the safe path, with far worse tail pain. The math takes thirty seconds and disagrees with the gut, which sees only the 80%.",
    failure:
      "Expected value assumes you can absorb the loss and play repeatedly. For rare, ruinous, or unrepeatable bets — health, reputation, all your savings — the average across parallel universes is irrelevant, because you only live one path. There, survival constraints beat expectation (see Fat Tails and Margin of Safety).",
    recall: {
      q: "How does expected value separate decision quality from outcome quality?",
      a: "A decision's quality is the probability-weighted value of all its outcomes at the time it was made — so a well-priced bet that happened to fail was still good, and a reckless bet that happened to win was still bad.",
    },
    apply:
      "Take one risk you're weighing. Write the outcomes, assign honest probabilities, multiply. Does the number agree with your gut? Which one do you trust more, and why?",
    related: ["fat-tails", "base-rates", "asymmetry"],
  },
  {
    id: "pre-mortem",
    name: "Pre-Mortem",
    domain: "decisions",
    hook: "Imagining your project has already failed makes you 30% better at seeing why it will.",
    mechanism:
      "Before committing, assume the plan has already failed spectacularly, and write the story of what went wrong. This 'prospective hindsight' works because it flips social and cognitive incentives: doubts become contributions instead of disloyalty, and the concreteness of 'it failed — explain it' surfaces specific risks that abstract 'any concerns?' never does.",
    example:
      "A team about to ship a migration runs a ten-minute pre-mortem: 'It's six months later and the migration was a disaster — what happened?' Answers pour out: the long tail of legacy clients nobody inventoried, the rollback that was never actually tested, the one engineer who understands the old system leaving mid-project. Three cheap mitigations follow — none of which appeared in weeks of planning meetings.",
    failure:
      "A pre-mortem generates vivid risks, and vividness is not probability. Without a second pass to rank by likelihood and cost, the team may burn its margin defending against cinematic failures while ignoring the boring, likely ones. Generate with imagination; prioritize with cold numbers.",
    recall: {
      q: "Why does 'assume it already failed' surface more risks than 'any concerns?'",
      a: "Prospective hindsight makes failure concrete (you must explain a specific disaster, not vaguely worry) and makes voicing doubts socially safe — it's the assignment, not disloyalty.",
    },
    apply:
      "Run a two-minute pre-mortem on your current main project: it's three months later and it failed — write the first three sentences of that story.",
    related: ["inversion", "availability-heuristic", "margin-of-safety"],
  },
  {
    id: "satisficing",
    name: "Satisficing",
    domain: "decisions",
    hook: "For most decisions, 'good enough, decided now' beats 'optimal, decided never'.",
    mechanism:
      "Optimizing means searching until you find the best option; satisficing means defining 'good enough' in advance and taking the first option that clears the bar. Since search has real costs — time, attention, missed compounding while you dither — and option quality has diminishing returns, a clear threshold usually maximizes actual outcomes even though it feels like settling.",
    example:
      "Choosing a laptop, an apartment, or a JSON library: the satisficer writes three must-haves, picks the first candidate that meets them, and spends the saved weekend actually building. The optimizer reads reviews for two weeks, picks something 3% better, and has also trained themselves to re-open every settled decision whenever a new option appears.",
    failure:
      "Satisficing is wrong for decisions that are rare, irreversible, and high-variance — choosing a co-founder, a spouse, a database for a decade of data. There, the difference between good and best compounds for years, and search costs are trivial by comparison. Know which regime you're in before you set the bar.",
    recall: {
      q: "When does satisficing beat optimizing, and when does it fail?",
      a: "It wins when search is costly and options have diminishing returns — most everyday decisions. It fails for rare, irreversible, high-variance choices, where the good-vs-best gap compounds for years and search costs are comparatively trivial.",
    },
    apply:
      "Pick something you've been researching too long. Write three must-have criteria, then commit to the first option that meets all three.",
    related: ["opportunity-cost", "reversibility", "local-optima"],
  },

  /* ---------------- Probability & Statistics ---------------- */
  {
    id: "base-rates",
    name: "Base Rates",
    domain: "probability",
    hook: "The most informative fact about your situation is usually what happened to everyone else in it.",
    mechanism:
      "Before examining the details of your specific case (the 'inside view'), ask how cases like this usually turn out (the 'outside view'). The base rate compresses thousands of trials — including all the failure modes nobody anticipated — into one number. Details feel more relevant, but the reference class is usually a better predictor, because your case is rarely as special as it feels from inside.",
    example:
      "A team estimates a rewrite will take three months, based on a detailed task breakdown. The outside view: the last four rewrites at the company each took seven to twelve months — and each of those teams also had a detailed plan saying three. Starting from 'rewrites here take ~9 months, why would ours differ?' produces a forecast the inside view never will.",
    failure:
      "Base rates mislead when your case genuinely differs from the reference class in a causally relevant way, or when the class is drawn too broadly ('startups fail' tells a biotech little). The skill is picking the tightest honest reference class — then demanding strong evidence before believing you're the exception.",
    recall: {
      q: "What is the 'outside view' and why does it usually beat the inside view?",
      a: "Start from how similar cases generally turned out (the base rate) rather than from your case's details — the reference class embeds all the failure modes nobody plans for, and your case is rarely the exception it feels like.",
    },
    apply:
      "For your current biggest goal: what's the honest base rate of people in your situation achieving it? What specifically makes you different — and is that evidence or hope?",
    related: ["bayes-updating", "survivorship-bias", "regression-to-mean"],
  },
  {
    id: "bayes-updating",
    name: "Bayesian Updating",
    domain: "probability",
    hook: "Strong opinions are fine. Refusing to price new evidence is how they become expensive.",
    mechanism:
      "Treat beliefs as probabilities, not verdicts. When evidence arrives, ask: how likely is this evidence if I'm right, versus if I'm wrong? The ratio tells you how far to move. Evidence that's equally likely either way should move you not at all — no matter how dramatic it feels — while evidence that's hard to explain under your view should move you a lot, no matter how small it looks.",
    example:
      "You believe a service is healthy. One user reports slowness — that happens weekly even when healthy; barely update. Then the p99 latency doubles on a quiet Sunday — that almost never happens when things are fine; update hard, even though 'one graph moved' sounds less dramatic than 'a user complained'. The diagnostic value of evidence is in the likelihood ratio, not the drama.",
    failure:
      "Garbage priors plus perfect updating still converge slowly, and humans under-update from priors they're attached to (and call it 'conviction'). Also beware double-counting: hearing the same rumor from three people who all read the same tweet is one piece of evidence, not three.",
    recall: {
      q: "What single question tells you how much a piece of evidence should move your belief?",
      a: "'How likely is this evidence if my belief is true, versus if it's false?' — the likelihood ratio. Equally likely either way = no update; hard to explain under your view = large update.",
    },
    apply:
      "Pick a belief you hold firmly about your work. What evidence, if you saw it this month, should move you to 50/50? Would you actually notice it?",
    related: ["base-rates", "confirmation-bias", "law-of-small-numbers"],
  },
  {
    id: "regression-to-mean",
    name: "Regression to the Mean",
    domain: "probability",
    hook: "The scolded pilot flies better and the praised pilot flies worse — and it has nothing to do with the feedback.",
    mechanism:
      "Any outcome that mixes skill and luck will, after an extreme result, tend back toward the average — because extreme results require extreme luck, and luck doesn't persist. The trap: we act right after extremes (celebrating peaks, intervening at troughs), then credit whatever we did with the inevitable drift back. This manufactures false lessons constantly.",
    example:
      "A flight instructor notices that praising a great landing is 'followed by' a worse one, while yelling after a bad landing is 'followed by' improvement — concluding that yelling works. But landings after an extreme were always going to drift toward that pilot's average, feedback or none. The same illusion certifies gurus hired at rock bottom and blames managers hired at peaks.",
    failure:
      "Not everything regresses — outcomes with strong feedback loops (compounding skill, network effects, addiction) can keep trending. The question is the luck share: the more luck in the outcome, the stronger the regression. Sports and quarterly numbers regress hard; deliberately practiced skills much less.",
    recall: {
      q: "Why do interventions right after extreme results look like they work?",
      a: "Because extreme results are partly luck, the next result drifts back toward average regardless — and whatever you did in between (yelling, celebrating, hiring a consultant) steals the credit.",
    },
    apply:
      "Find one 'lesson' you learned right after an unusually good or bad result. Could plain regression explain what happened next, instead of your intervention?",
    related: ["law-of-small-numbers", "base-rates", "hindsight-bias"],
  },
  {
    id: "survivorship-bias",
    name: "Survivorship Bias",
    domain: "probability",
    hook: "The missing bullet holes were the answer: study the planes that didn't come back.",
    mechanism:
      "When you learn only from survivors — successful companies, returning planes, popular advice — you're studying a filtered sample, and the filter is the most informative part. The failures, which would tell you what actually kills, are invisible precisely because it killed them. Every 'what do winners have in common?' analysis is corrupted until you ask what the losers had in common too.",
    example:
      "In WWII, analysts mapped bullet holes on returning bombers and proposed armoring those spots. Statistician Abraham Wald inverted it: the returning planes show where a bomber can be shot and survive — armor where the survivors are clean, because planes hit there never came back. The data wasn't wrong; the sample was.",
    failure:
      "Inverting into pure failure-study has its own trap: failures are also a filtered sample, and 'avoid everything any failure did' bans things winners did too (most failed startups worked hard; so did the successes). The fix is comparing both groups on the same trait, not worshipping either sample.",
    recall: {
      q: "Why did Wald armor the spots with no bullet holes?",
      a: "Returning planes could only show survivable hits — planes shot in the clean spots (engines, cockpit) never returned to be counted. The invisible failures, not the visible survivors, located the fatal weakness.",
    },
    apply:
      "Take one piece of success advice you follow. How many people did the same thing and failed invisibly? Where would you even find them?",
    related: ["base-rates", "law-of-small-numbers", "availability-heuristic"],
  },
  {
    id: "law-of-small-numbers",
    name: "The Law of Small Numbers",
    domain: "probability",
    hook: "Small samples don't whisper weak truths — they shout convincing lies.",
    mechanism:
      "Small samples produce extreme results far more often than large ones, purely by chance — but our pattern-hungry minds read every extreme as signal. Three great hires from one university, two crashes after one deploy, a 5-user survey where 80% agree: each feels like a pattern and is mostly noise. The smaller the sample, the wilder the swings, and the more confident the wrong conclusion.",
    example:
      "US counties with the lowest kidney-cancer rates are mostly small rural ones — and so are the counties with the highest rates. Small populations swing to extremes in both directions by chance alone. Any explanation you invent for the 'healthy rural lifestyle' must also survive explaining the sick counties next door.",
    failure:
      "Waiting for large samples has costs too — sometimes n=3 is all you'll ever get (major launches, career moves), and a weak signal beats none. The discipline is holding conclusions with sample-sized confidence: act on small n if you must, but don't let three data points overwrite a lifetime prior.",
    recall: {
      q: "Why do both the best and worst kidney-cancer counties turn out to be small ones?",
      a: "Chance variation is much larger in small samples, so small counties swing to extremes in both directions — the extremes reflect sample size, not rural health or sickness.",
    },
    apply:
      "Find one belief you hold from fewer than five data points. Write the sample size next to it. How confident does it deserve to be?",
    related: ["regression-to-mean", "survivorship-bias", "bayes-updating"],
  },
  {
    id: "distributional-thinking",
    name: "Thinking in Distributions",
    domain: "probability",
    hook: "The forecast wasn't wrong — your decision to treat '70%' as 'certain' was.",
    mechanism:
      "Point estimates ('it'll take 6 weeks') hide the shape of what could happen; distributions ('4–10 weeks, long tail to 16') expose it. The shape changes decisions: a plan that's fine on the median but fatal at the 90th percentile is a bad plan if you can't survive the tail. Asking 'what's the range, and what happens at the edges?' converts false precision into honest uncertainty you can engineer around.",
    example:
      "Two projects both 'take 6 weeks on average'. One is 5–7 weeks with near certainty; the other is usually 4 but occasionally 20 when a legacy integration bites. Same average, completely different contracts to sign, buffers to hold, and promises to make. The single number '6 weeks' erased everything that mattered.",
    failure:
      "Full distributions are overkill for small, reversible choices — ranges everywhere become analysis theater. And invented distributions can be worse than none: drawing a neat bell curve over a process with fat tails (see Fat Tails) manufactures confidence in exactly the estimates that will kill you.",
    recall: {
      q: "Why can two projects with the same average duration deserve completely different plans?",
      a: "Because the distributions differ: a tight 5–7 week spread and a '4 weeks usually, 20 sometimes' shape have the same mean but totally different tail risk — and plans live or die in the tails, not the average.",
    },
    apply:
      "Take your current top estimate (time, cost, growth). Rewrite it as a 10th–90th percentile range. Does the plan survive the 90th percentile?",
    related: ["fat-tails", "expected-value", "margin-of-safety"],
  },
  {
    id: "fat-tails",
    name: "Fat Tails",
    domain: "probability",
    hook: "In some worlds the average is a lie: one day of 2008 outweighed a decade of Tuesdays.",
    mechanism:
      "In thin-tailed domains (heights, dice) extremes are impossible enough to ignore: no human is 40 meters tall. In fat-tailed domains (markets, viral content, wars, outages) a single extreme can exceed the sum of everything ever observed. There, averages and 'typical cases' are decision-poison: history under-samples the tail, and the tail is where the money, the ruin, and the meaning live.",
    example:
      "A strategy earns steadily for nine years — 'proven, low-risk, look at the track record' — then loses more in one month than it made in nine years. Nothing was hidden; the tail event simply hadn't happened yet, and the average of the observed past said nothing about it. Book royalties, startup returns, and security breaches follow the same math: the rare case is the whole story.",
    failure:
      "Seeing fat tails everywhere is its own failure: most operational, biological, and manufacturing quantities are thin-tailed, and refusing to use averages there discards good information. The first diagnostic question is 'can one observation dominate the total?' — if no, normal statistics are your friend.",
    recall: {
      q: "What's the one-question test for whether you're in a fat-tailed domain?",
      a: "'Can a single observation dominate the sum of all others?' If yes (markets, outages, viral hits), averages and past track records are unreliable guides; if no (heights, dice), normal statistics work fine.",
    },
    apply:
      "List your top three risks (financial, professional, technical). For each: is it thin-tailed (bounded) or fat-tailed (one event can dominate)? Are you using averages on a fat-tailed one?",
    related: ["distributional-thinking", "expected-value", "margin-of-safety"],
  },

  /* ---------------- Systems Thinking ---------------- */
  {
    id: "feedback-loops",
    name: "Feedback Loops",
    domain: "systems",
    hook: "Systems don't do what their parts want — they do what their loops demand.",
    mechanism:
      "A reinforcing loop amplifies: growth begets growth, decline begets decline (compound interest, viral spread, tech debt attracting hacks). A balancing loop stabilizes: deviation triggers correction back toward a set point (thermostats, hunger, on-call escalation). Most puzzling system behavior — explosions, collapses, stubborn plateaus — stops being puzzling once you name the loops and ask which one currently dominates.",
    example:
      "A team slips a deadline, so they skip tests to catch up. Bugs increase, firefighting eats the week, they fall further behind, so they skip more tests — a reinforcing loop wearing a 'temporary catch-up' costume. Nobody in the loop is irrational; the loop itself is the villain. Breaking it requires slack (see Slack), not exhortations to hurry.",
    failure:
      "Loops have delays, and delays make them lie: a reinforcing loop can look flat for months (compounding is invisible early), and a balancing loop with lag oscillates — you overcorrect before the first correction lands. Reading a system by its current trend, without its loop structure and delays, is how you panic at bottoms and celebrate at tops.",
    recall: {
      q: "What's the difference between reinforcing and balancing loops, and why do delays matter?",
      a: "Reinforcing loops amplify deviations (growth/collapse); balancing loops push back toward a set point. Delays hide reinforcing loops early and make balancing loops oscillate through overcorrection.",
    },
    apply:
      "Name one reinforcing loop in your life right now (helpful or harmful) and one balancing loop. Which one is winning this month?",
    related: ["compounding", "stocks-and-flows", "slack"],
  },
  {
    id: "bottlenecks",
    name: "Bottlenecks",
    domain: "systems",
    hook: "An hour saved anywhere except the bottleneck is an hour saved nowhere.",
    mechanism:
      "Every flow — a factory, a hiring pipeline, your own output — is limited by exactly one constraint at a time. Throughput equals the bottleneck's capacity, period. Improving anything else adds inventory, idle capacity, or polish, but not output. The method: find the constraint, squeeze everything from it, subordinate the rest of the system to it, then elevate it — and when it moves, start over.",
    example:
      "A team ships slowly, so management hires more engineers. Code piles up faster in front of the true constraint — one overloaded reviewer with sole domain context — and delivery actually slows as coordination overhead grows. Adding capacity off-bottleneck made the system worse. The fix cost nothing: spread review authority, protect the reviewer's calendar.",
    failure:
      "Bottleneck logic assumes a linear flow with one constraint. In multi-product systems, the constraint depends on mix; in complex orgs, the constraint may be trust, information, or decision rights — invisible on any process chart. And after you fix a bottleneck, yesterday's map is wrong: the constraint has moved, and so must your attention.",
    recall: {
      q: "Why can adding engineers slow a team down?",
      a: "If the constraint is elsewhere (e.g., one overloaded reviewer), extra capacity just piles work in front of the bottleneck and adds coordination overhead — throughput is set by the constraint alone.",
    },
    apply:
      "What is the single constraint on your output this week — one meeting, one person, one skill, one decision? What would 'subordinating everything else to it' look like for three days?",
    related: ["slack", "leverage-points", "local-optima"],
  },
  {
    id: "stocks-and-flows",
    name: "Stocks and Flows",
    domain: "systems",
    hook: "You don't have a savings problem or a burnout problem — you have a flow problem you're reading as a stock.",
    mechanism:
      "A stock is an accumulation (money, trust, energy, tech debt); a flow is its rate of change (income/spending, deposits/withdrawals of trust, rest/strain). Stocks change only through flows, and slowly — which is why they lag, buffer, and deceive. Most frustration with 'nothing is changing' is impatience with a big stock and a small net flow; most sudden 'collapses' are stocks that were draining quietly for years.",
    example:
      "A manager 'spends a week rebuilding trust' after a year of micro-managing. But trust is a stock drained by a hundred small withdrawals; one deposit barely moves the level. The same math runs fitness, savings, codebase health, and reputation: the level today is the integral of years of flows, not the response to last week's gesture.",
    failure:
      "Pure stock-flow accounting misses phase changes: some stocks don't drain linearly but collapse at thresholds (a burned-out engineer doesn't gradually slow — they quit; a levee holds until it doesn't). Track the level, but learn where the cliff is — the flow view won't show it.",
    recall: {
      q: "Why does one big gesture fail to fix a drained stock like trust or health?",
      a: "Stocks change only through accumulated flows over time — a level drained by years of small withdrawals can't be refilled by one deposit, no matter its size or sincerity.",
    },
    apply:
      "Pick one stock you care about (savings, energy, a relationship, code quality). What are its actual inflows and outflows this month? Is the net flow even positive?",
    related: ["feedback-loops", "compounding", "slack"],
  },
  {
    id: "emergence",
    name: "Emergence",
    domain: "systems",
    hook: "No neuron understands the sentence it's helping you read.",
    mechanism:
      "System-level behavior arises from interactions between parts, not from the parts themselves — wetness isn't in a water molecule, a traffic jam isn't in any car, culture isn't in any employee. This means you can't fix system behavior by fixing components, and you can't predict it by studying components in isolation. The interactions — incentives, protocols, feedback — are the real design surface.",
    example:
      "Every individual in a standup is honest, yet the meeting reliably produces optimistic status. No one lies: small roundings-up compound across the chain, bad news waits for private channels, and the format rewards fluency over accuracy. Firing 'the dishonest person' fixes nothing — there isn't one. Changing the interaction (written updates, explicit risk section) changes everything.",
    failure:
      "'It's emergent' can become a fatalistic excuse to stop analyzing — most system failures still have tractable structure (loops, incentives, bottlenecks) if you look. Emergence says the analysis unit is interactions rather than parts; it doesn't say the system is beyond understanding or that no one is responsible.",
    recall: {
      q: "Why can a team of honest individuals reliably produce dishonest status reports?",
      a: "The distortion emerges from interactions — small roundings-up compounding across a reporting chain and formats that reward smoothness — not from any lying individual. Fix the interaction pattern, not a person.",
    },
    apply:
      "Name one frustrating behavior of a group you're in. Instead of blaming a person, write down the interaction pattern that would produce it even with good people.",
    related: ["incentives", "feedback-loops", "chestertons-fence"],
  },
  {
    id: "chestertons-fence",
    name: "Chesterton's Fence",
    domain: "systems",
    hook: "The fence looks pointless precisely because it's working.",
    mechanism:
      "Before removing something whose purpose you can't see — a rule, a code path, a ritual — find out why it exists. Long-lived things in evolved systems usually earn their keep in non-obvious ways, and their benefits are often invisible while they operate (the outage that doesn't happen, the dispute that never arises). 'I can't see why this exists' is a fact about your knowledge, not about the fence.",
    example:
      "A new engineer deletes a 'pointless' 30-second delay in a job pipeline. Two weeks later, a race condition that the delay had been papering over starts corrupting records — the original author had discovered the race the hard way, patched it crudely, and left no comment. The fence was ugly, undocumented, and load-bearing: the classic triple.",
    failure:
      "The fence principle demands understanding, not permanence — otherwise it becomes the patron saint of cruft, protecting genuinely dead rules because 'someone might have had a reason'. Time-box the investigation; if a real search finds no purpose and removal is cheap to reverse, remove it and watch. Fences deserve inquiry, not worship.",
    recall: {
      q: "What does Chesterton's Fence require before removing something, and what does it NOT require?",
      a: "It requires understanding why the thing exists before removing it — long-lived parts usually have invisible functions. It does not require keeping everything forever: after honest investigation, reversible removal is fine.",
    },
    apply:
      "Find one rule or process you consider pointless. Spend ten minutes finding its origin story before your next complaint about it.",
    related: ["second-order", "emergence", "via-negativa"],
  },
  {
    id: "goodharts-law",
    name: "Goodhart's Law",
    domain: "systems",
    hook: "Tell people exactly how you'll measure them, and you'll stop learning anything from the measurement.",
    mechanism:
      "When a measure becomes a target, it stops being a good measure. A metric correlates with the goal under normal behavior — but making it a target changes behavior, and people optimize the number through whatever path is cheapest, which is rarely the path that serves the goal. The correlation you selected the metric for is destroyed by the act of targeting it.",
    example:
      "A support team is targeted on 'average handle time'. Calls get shorter: agents rush, transfer hard cases, and mark issues resolved prematurely. Handle time improves every quarter while actual resolution — the thing the metric once tracked — quietly degrades and callbacks climb. Nobody cheated; everybody optimized.",
    failure:
      "Goodhart is an argument for careful targets, not for no targets — unmeasured work drifts too, just invisibly. Mitigations: pair each target with a counter-metric that breaks if it's gamed (speed + callback rate), rotate metrics before gaming matures, and keep some evaluation deliberately human and holistic.",
    recall: {
      q: "Why does targeting a metric destroy the very correlation that made it a good metric?",
      a: "The metric tracked the goal under natural behavior. Targeting it changes behavior: people reach the number by the cheapest path, not the goal-serving path, so the number improves while the goal doesn't.",
    },
    apply:
      "Take one number you're measured on (or measure yourself on). What's the cheapest way to game it? Are you already slightly doing that? What counter-metric would catch it?",
    related: ["incentives", "second-order", "principal-agent"],
  },
  {
    id: "slack",
    name: "Slack",
    domain: "systems",
    hook: "The 100%-utilized system isn't efficient — it's one bad Tuesday from collapse.",
    mechanism:
      "Spare capacity looks like waste but is what absorbs variance, enables response to surprise, and leaves room to improve. Queueing theory makes it brutal: as utilization approaches 100%, wait times grow without bound — small hiccups cascade into system-wide seizure because nothing can flex. A system with zero slack can't handle change; it can only handle the exact present, forever.",
    example:
      "A team scheduled at full capacity hits a production incident. There's no slack, so the incident work displaces planned work, which creates rushed fixes, which create the next incident — the death spiral of the fully-booked. The 'inefficient' team next door, running at 80%, absorbs its incident, does the root-cause fix properly, and gets faster every quarter.",
    failure:
      "Slack can rot into genuine waste when nothing periodically consumes it — buffers grow to fill whatever exists (see Parkinson's dynamics), and 'keeping capacity for surprises' becomes cover for low standards. Healthy slack is deliberate and visible: sized to measured variance, defended on purpose, occasionally spent.",
    recall: {
      q: "Why do wait times explode as utilization approaches 100%?",
      a: "With no spare capacity, any variance queues: each small delay lands on a system that can't flex, so hiccups cascade and compound. Queueing math makes waits grow without bound near full utilization.",
    },
    apply:
      "Where are you running at ~100% (calendar, budget, emotional bandwidth)? What would deliberately reclaiming 15% slack cost — and what has the missing slack already cost you?",
    related: ["bottlenecks", "margin-of-safety", "feedback-loops"],
  },

  /* ---------------- Incentives & Economics ---------------- */
  {
    id: "incentives",
    name: "Incentives",
    domain: "incentives",
    hook: "Never ask the barber whether you need a haircut.",
    mechanism:
      "People respond to incentives — not always consciously, not always cynically, but reliably and at scale. When behavior confuses you, trace who gains what from it; the puzzle usually dissolves. And incentives shape more than actions: they bend attention, memory, and sincere belief, which is why good people in bad incentive structures produce bad outcomes while feeling honest throughout ('it is difficult to get a man to understand something when his salary depends on not understanding it').",
    example:
      "Wells Fargo paid branch staff on accounts opened; employees opened millions of fake accounts. Soviet factories paid on tonnage produced; they made absurdly heavy furniture and useless giant nails. Consultants paid by the hour find problems that take hours. None of this needs villains — it needs only ordinary people plus time plus a gradient.",
    failure:
      "Naive incentive design backfires two ways: crude metrics get gamed (see Goodhart's Law), and extrinsic rewards can crowd out intrinsic motivation — pay children to read and they stop reading for pleasure; fine parents for late pickup and lateness increases (the fine became a price). Incentives are powerful, which is exactly why blunt ones are dangerous.",
    recall: {
      q: "Why don't incentive problems require dishonest people?",
      a: "Incentives bend attention and sincere belief, not just deliberate action — ordinary people gradually and honestly see the world in the way their pay depends on seeing it, so bad structures produce bad outcomes without villains.",
    },
    apply:
      "Pick one behavior that frustrates you (a colleague's, an institution's, your own). Write down what the actor is actually rewarded for. Does the behavior still confuse you?",
    related: ["principal-agent", "goodharts-law", "moral-hazard"],
  },
  {
    id: "principal-agent",
    name: "Principal–Agent Problem",
    domain: "incentives",
    hook: "Your advisor, your contractor, and your fund manager all work hard — the question is for whom.",
    mechanism:
      "Whenever someone acts on your behalf (agent) with interests that aren't fully yours (principal), their choices drift toward their interests — especially where you can't observe or evaluate their work. The drift is usually quiet: not fraud, but which options get shown to you, which risks get emphasized, which effort gets spent. The gap between what you'd choose with their knowledge and what they choose with their incentives is the agency cost you pay.",
    example:
      "A real-estate agent selling their own home leaves it on the market notably longer and sells for more than when selling clients' homes. For a client, the agent's cut of extra negotiation is pennies per hour of effort; for their own house, they capture all of it. Same person, same skills, different principal — different outcome.",
    failure:
      "Assuming pure self-interest everywhere is as wrong as assuming none: professional pride, reputation, and identity make many agents serve principals well beyond their incentives, and treating them as mercenaries poisons exactly that motivation. Use the model to design alignments and checks — not to preemptively insult your dentist.",
    recall: {
      q: "Why do real-estate agents' own homes sell for more than their clients' homes?",
      a: "Agents capture only a sliver of the extra price on a client's home but all of it on their own — so the effort-vs-reward calculation quietly shifts. Same skills, different alignment of interests.",
    },
    apply:
      "List the three most important people acting on your behalf (advisor, doctor, manager, agent). For each: where exactly do their incentives diverge from your interests?",
    related: ["incentives", "moral-hazard", "goodharts-law"],
  },
  {
    id: "moral-hazard",
    name: "Moral Hazard",
    domain: "incentives",
    hook: "People don't take risks because they're brave — they take risks because someone else is holding the bill.",
    mechanism:
      "When actors are insulated from the consequences of their risks — insured, bailed out, guaranteed, anonymized — they take more risk. Not through conscious villainy: the feedback that normally calibrates caution simply never arrives at the person choosing. Skin in the game is nature's risk regulator; every layer of insulation between decision and consequence loosens it.",
    example:
      "Banks that expect bailouts take on more leverage than those that expect to die by their mistakes — heads they win, tails the public loses. In miniature: the engineer paged at 3am for their own service writes very different code from one whose failures page a separate ops team. Both respond to where consequences land, not to lectures about care.",
    failure:
      "The cure can cost more than the disease: insurance and safety nets exist because unshared risk makes people ruinously cautious — nobody starts a company or prescribes an aggressive treatment if one bad outcome ends them. The design question isn't 'eliminate moral hazard' but 'how much consequence must stay attached to keep decisions honest?' (deductibles, equity vesting, on-call rotations).",
    recall: {
      q: "What is moral hazard, and what's the classic mitigation pattern?",
      a: "Insulation from consequences increases risk-taking because calibrating feedback never reaches the decision-maker. Mitigation: reattach some skin in the game — deductibles, vesting, being on-call for your own code — without destroying useful risk-sharing.",
    },
    apply:
      "Where in your life are you most insulated from the consequences of your own decisions? Would your choices change if you weren't?",
    related: ["incentives", "principal-agent", "asymmetry"],
  },
  {
    id: "tragedy-of-commons",
    name: "Tragedy of the Commons",
    domain: "incentives",
    hook: "Everyone acted rationally, and that's exactly why the pasture is dead.",
    mechanism:
      "When a shared resource is free to use but costly to maintain, each user captures the full benefit of using more while the cost spreads across everyone. Individually rational overuse, multiplied by all users, destroys the resource — with no villain anywhere. The structure, not the people, produces the ruin, which is why exhortation ('please be considerate!') reliably fails while structural fixes (ownership, quotas, rules with teeth) work.",
    example:
      "A shared test environment: each team gains by grabbing it now and skipping cleanup, while the resulting flakiness is everyone's problem. Within months it's permanently broken, and every team is furious at 'the others'. The same math runs overfished seas, meeting-calendar sprawl, on-call quality, and any codebase where 'someone should refactor this'.",
    failure:
      "'Privatize or regulate' isn't the whole menu: Elinor Ostrom documented communities managing commons for centuries through local monitoring, graduated sanctions, and participatory rules. And beware fake tragedies — actors with power sometimes declare a commons 'doomed' to justify enclosing a resource that users were managing fine.",
    recall: {
      q: "Why does asking people to be considerate fail to save a commons?",
      a: "The structure rewards each user fully for overuse while spreading the cost thin across all — individual rationality points at ruin regardless of goodwill. Only structural changes (ownership, quotas, monitored rules) shift the equilibrium.",
    },
    apply:
      "Name one commons you share (environment, channel, on-call, fridge). Is it degrading? What structural rule — not plea — would fix it?",
    related: ["incentives", "emergence", "slack"],
  },
  {
    id: "marginal-thinking",
    name: "Marginal Thinking",
    domain: "incentives",
    hook: "The question is never 'is it worth it?' — it's 'is the next one worth it?'",
    mechanism:
      "Decisions happen at the margin: not 'is exercise good?' but 'is the fifth gym session this week better than what that hour otherwise buys?' Averages and totals hide this — a project with great average returns can have a worthless next dollar, and category thinking ('education is valuable') funds specific choices the margin would reject. Comparing marginal cost to marginal benefit, at today's levels, is the sharpest knife in economics.",
    example:
      "A streaming service 'costs almost nothing per extra viewer' — until viewers require new content, then new infrastructure. A student takes 'one more year of school' because education-in-general pays, without asking what this specific year adds versus a year of work. Both errors: pricing the category or the average when only the increment is being bought.",
    failure:
      "Pure marginalism erodes commitments and thresholds: each skipped workout, each small compromise is individually defensible at the margin, yet the sum is a collapsed habit or reputation — some choices are better made as policies than as per-instance calculations. And watch for cliffs: margins aren't smooth where the 'one more' user tips a system past capacity.",
    recall: {
      q: "What's wrong with deciding by averages or categories instead of margins?",
      a: "You're only ever buying the increment. Average returns can be great while the next unit is worthless (or vice versa), so 'is X good?' misleads where 'is the NEXT X worth its cost?' decides correctly.",
    },
    apply:
      "Take something you do 'because it's valuable' (meetings, courses, saving habits). Evaluate only the next unit: what does one more actually add, and cost?",
    related: ["opportunity-cost", "sunk-cost", "local-optima"],
  },
  {
    id: "sunk-cost",
    name: "Sunk Costs",
    domain: "incentives",
    hook: "You've already paid for your past mistakes. Refusing to quit them is how you pay twice.",
    mechanism:
      "Money, time, and effort already spent are gone no matter what you choose next — so they're irrelevant to the choice. Only future costs and benefits count. But loss-averse minds treat quitting as 'making the loss real' and persisting as keeping hope alive, so we finish bad movies, defend failing projects, and stay in wrong careers to honor investments that can never be recovered either way.",
    example:
      "Britain and France kept funding Concorde long after it was commercially hopeless — the sunk billions made stopping feel like admitting waste, so they multiplied the waste for decades. Every organization runs mini-Concordes: the two-year migration nobody believes in anymore, kept alive because 'we've come too far to stop'.",
    failure:
      "'Ignore sunk costs' can be weaponized into serial abandonment — quitting every hard thing at the first dip and calling it rationality (persistence through predicted difficulty is not the sunk-cost fallacy). And reputations complicate the math: sometimes visibly finishing what you start buys future trust worth more than the remaining project loss.",
    recall: {
      q: "Why are already-spent resources irrelevant to what you should do next?",
      a: "They're identical across all your options — gone whether you continue or quit — so they can't differentiate choices. Only future costs and benefits differ between paths, and only differences can decide.",
    },
    apply:
      "Name your most likely Concorde: something you're continuing mainly because of what it already cost. If you woke up tomorrow free of the history, would you start it today?",
    related: ["marginal-thinking", "loss-aversion", "opportunity-cost"],
  },
  {
    id: "comparative-advantage",
    name: "Comparative Advantage",
    domain: "incentives",
    hook: "Even if you're better at everything, you should still let someone worse do most of it.",
    mechanism:
      "Trade pays based on relative, not absolute, skill. If a lawyer types faster than her assistant, she should still delegate typing — every typing hour costs her a lawyering hour, and lawyering is where her edge is largest. Both sides gain when each does what they're relatively best at, even when one side is absolutely better at everything. Opportunity cost, not talent comparison, decides who should do what.",
    example:
      "A senior engineer who is the team's best coder AND best reviewer shouldn't do all of both: an hour of her review unlocks five people; an hour of her coding is just one great hour. The junior codes 'worse' — yet total output rises when she reviews and he codes, because output follows relative advantage, not absolute ranking.",
    failure:
      "Specializing fully in today's comparative advantage can trap you: it optimizes the present mix while starving skills you'll need when conditions shift (the classic critique of resource economies — and of engineers who never learn to communicate). Hold some deliberate practice outside your current edge as an option on futures.",
    recall: {
      q: "Why should the lawyer who types fastest still delegate all her typing?",
      a: "Because her typing hour costs a lawyering hour — her largest relative edge. Work should flow by opportunity cost (relative advantage), not by who's absolutely better at each task; both sides gain from the trade.",
    },
    apply:
      "What task do you keep because you're 'better at it', even though your edge is bigger elsewhere? What would happen if you traded it away this week?",
    related: ["opportunity-cost", "bottlenecks", "circle-of-competence"],
  },

  /* ---------------- Psychology & Biases ---------------- */
  {
    id: "confirmation-bias",
    name: "Confirmation Bias",
    domain: "psychology",
    hook: "You don't see the evidence and form a belief — you hold a belief and go shopping for evidence.",
    mechanism:
      "Minds test hypotheses by seeking confirmation: we notice, remember, interpret, and google what agrees with us, and cross-examine only what doesn't. Each step is small; compounded over years and amplified by feeds that learn what we like, it builds unshakeable certainty from filtered input. The bias is worst exactly where you're smartest — skilled reasoners are better at constructing support for what they already believe.",
    example:
      "An investor bullish on a stock reads ten articles: three positive ones get careful attention, seven negative ones get skimmed for flaws. A engineer sure the bug is in the network checks network logs repeatedly while barely glancing at their own recent commit. Both experience themselves as 'doing research'. Both are collecting, not testing.",
    failure:
      "Knowing about confirmation bias mostly doesn't fix it — it becomes one more weapon ('YOUR view is confirmation bias'). What works is structural: write your view down first, then actively generate what would disprove it, assign someone the counter-case, or track predictions where reality can grade you. Introspection loses; procedure wins.",
    recall: {
      q: "Why doesn't knowing about confirmation bias protect you from it?",
      a: "The bias operates in what you notice, remember, and find flaws in — below introspection. Awareness just adds a rhetorical weapon; only external procedure (pre-registered views, assigned counter-arguments, graded predictions) actually counters it.",
    },
    apply:
      "Take your strongest current opinion. Spend ten minutes genuinely constructing the best case against it — not the strawman, the version its smartest defender would give.",
    related: ["bayes-updating", "social-proof", "hindsight-bias"],
  },
  {
    id: "availability-heuristic",
    name: "Availability Heuristic",
    domain: "psychology",
    hook: "You're afraid of sharks and relaxed about staircases. Staircases kill a thousand times more people.",
    mechanism:
      "We judge likelihood by how easily examples come to mind. Ease of recall tracks vividness, recency, and media coverage — not frequency — so dramatic rare risks (crashes, attacks) feel common while boring common risks (falls, sedentary years) feel negligible. Whoever controls what's vivid in your memory controls your probability estimates, and the news is optimized for vivid.",
    example:
      "After a plane crash dominates headlines, people drive instead of fly — and driving is vastly deadlier per kilometer. At work: last week's outage dominates this quarter's roadmap while the slow, silent risk (an unmaintained dependency, one person holding all context) gets nothing, because nothing memorable has happened yet. Availability allocates the budget.",
    failure:
      "Sometimes availability is honest signal: if you recall many examples from your own direct experience, frequency may really be high — the heuristic evolved because it often works. The failure mode is specifically mediated vividness: examples that are easy to recall because they were broadcast, not because they were common. Ask where your examples came from.",
    recall: {
      q: "Why do we fear rare dramatic risks more than common boring ones?",
      a: "Probability gets judged by ease of recall, and recall tracks vividness and coverage rather than frequency — so broadcast disasters feel common while statistically dominant risks (falls, inactivity) stay invisible.",
    },
    apply:
      "What risk are you currently worried about? Trace it: is it vivid from your own repeated experience, or from coverage? Now name a boring risk you've never budgeted for.",
    related: ["survivorship-bias", "pre-mortem", "base-rates"],
  },
  {
    id: "anchoring",
    name: "Anchoring",
    domain: "psychology",
    hook: "The first number spoken in a negotiation is doing more work than every argument after it.",
    mechanism:
      "Estimates form by adjusting from a starting point — and adjustment reliably stops too early, leaving the final answer tethered to the anchor. It works even when the anchor is absurd or known to be random: spin a wheel before estimating and the wheel moves your answer. First offers, list prices, 'previous version took 4 weeks', and yesterday's stock price all quietly set the range within which 'reasonable' gets negotiated.",
    example:
      "In studies, experienced judges rolled dice before sentencing a (hypothetical) shoplifter: high rolls produced sentences months longer than low rolls — from professionals, with the dice in plain view. Retail runs on the same physics: the '$120' crossed out above '$79' exists purely to be an anchor. So does the aggressive first offer in every negotiation you'll ever join.",
    failure:
      "Anchors are also legitimate tools: a well-chosen reference class ('similar projects took 6–9 months') is an anchor that adds information, and in negotiation, declining to anchor first often just gifts the anchor to the other side. The skill isn't avoiding anchors — it's choosing whose number starts the adjustment.",
    recall: {
      q: "What did the dice-rolling judges demonstrate about anchoring?",
      a: "Even visibly random, irrelevant numbers drag professional judgments toward them — adjustment from any starting point stops too early, so whoever (or whatever) sets the first number shapes the outcome.",
    },
    apply:
      "In your next estimate or negotiation, write your number down before hearing anyone else's. Then notice how hard the first spoken number pulls at yours.",
    related: ["bayes-updating", "loss-aversion", "base-rates"],
  },
  {
    id: "social-proof",
    name: "Social Proof",
    domain: "psychology",
    hook: "In an unfamiliar situation, you don't decide what to do — you look around and copy.",
    mechanism:
      "When uncertain, we treat others' behavior as evidence about what's correct — usually a great shortcut (the crowded restaurant probably is better). But it creates information cascades: early movers act on little information, later movers copy the visible behavior rather than sharing their private doubts, and soon everyone is following everyone while nobody is actually looking. The scary part: each participant's reasoning feels independent from inside.",
    example:
      "In the classic smoke-filled-room experiment, people alone reported the smoke 75% of the time; seated with calm actors, only 10% did — each glancing around, seeing calm, and concluding it must be fine, while providing the same false calm to everyone else. Every mediocre 'best practice', bubble, and unchallenged bad plan in a meeting runs this loop.",
    failure:
      "Reflexive contrarianism is not the escape — the crowd is right about most things (that's why copying evolved), and 'everyone believes it, so it's wrong' loses far more often than it wins. The discipline is knowing when the crowd's judgment embeds real information versus when it's a cascade of people copying each other's silence.",
    recall: {
      q: "What makes information cascades dangerous compared to genuine consensus?",
      a: "In a cascade, later actors copy visible behavior instead of contributing their private information — so apparent unanimous agreement can rest on almost no actual evidence, while feeling independently reasoned to everyone inside it.",
    },
    apply:
      "Find one thing you believe or do mainly because your group does. Ask: what's the actual evidence underneath — and have I ever checked, or only copied?",
    related: ["confirmation-bias", "availability-heuristic", "emergence"],
  },
  {
    id: "loss-aversion",
    name: "Loss Aversion",
    domain: "psychology",
    hook: "Losing $100 hurts about twice as much as winning $100 feels good — and that ratio quietly runs your life.",
    mechanism:
      "Losses loom roughly twice as large as equivalent gains, and 'loss' is defined relative to an arbitrary reference point — usually the status quo. This asymmetry makes us overpay to avoid small losses, cling to what we hold (the endowment effect), and reject positive-expected-value bets that involve any chance of loss. Crucially, reframing the same choice as loss or gain flips decisions without changing any facts.",
    example:
      "Employees rarely leave a mediocre job (the salary is 'theirs' to lose; the upside is abstract), investors sell winners and cling to losers (selling a loser makes the loss 'real'), and teams keep failing features because removal feels like destroying something owned. Meanwhile 'keep 90% of patients alive' gets approved where 'lose 10%' gets rejected — same number, different reference point.",
    failure:
      "Loss aversion is adaptive when losses are genuinely irreversible or ruinous — near survival thresholds, asymmetric caution is correct math, not bias (see Fat Tails). The failure is applying survival-grade caution to trivial, recoverable, repeated stakes: a portfolio rebalance, a difficult conversation, a career experiment your future self can easily absorb.",
    recall: {
      q: "How does the reference point turn loss aversion into a framing weapon?",
      a: "Losses are defined relative to a movable baseline — describe the same outcome as 'keeping 90%' vs 'losing 10%' and decisions flip, because the loss frame triggers roughly double-weighted aversion.",
    },
    apply:
      "Name a change you're avoiding. Rewrite it with a shifted reference point: not 'what I'd give up' but 'what I'm currently losing every month by staying'. Does it read differently?",
    related: ["sunk-cost", "anchoring", "asymmetry"],
  },
  {
    id: "fundamental-attribution",
    name: "Fundamental Attribution Error",
    domain: "psychology",
    hook: "When you're late, it's traffic. When they're late, it's who they are.",
    mechanism:
      "Explaining others' behavior, we over-weight character and under-weight circumstance — they see actors on a stage but not the stage. For ourselves, we do the reverse, since our own situational pressures are vividly felt. The result: a systematic uncharitable bias toward everyone else, and organizations that replace 'people in a broken process' with new people who then behave identically.",
    example:
      "The driver who cuts you off is 'a jerk' — when you cut someone off, you were avoiding a merge disaster. The teammate who misses a deadline 'lacks commitment' — your missed deadline had three legitimate blockers. Incident reviews run the same error at scale: 'human error' closes the case, so the situation that made the error easy stays live, waiting for the next human.",
    failure:
      "Over-correcting dissolves accountability — some behavior IS disposition, and 'the system made them do it' can excuse repeated bad-faith patterns. The tell is consistency across situations: one miss in a chaotic quarter is circumstance; the same behavior across varied contexts and years is character. Judge patterns, not incidents.",
    recall: {
      q: "What asymmetry defines the fundamental attribution error?",
      a: "We explain others' behavior by their character but our own by our circumstances — because we feel our situational pressures and can't see theirs. Fix: ask what situation would make this behavior reasonable from a good person.",
    },
    apply:
      "Recall the last time someone annoyed you. Write the situational story that would fully explain their behavior with zero character flaws. How plausible is it, honestly?",
    related: ["emergence", "incentives", "hindsight-bias"],
  },
  {
    id: "hindsight-bias",
    name: "Hindsight Bias",
    domain: "psychology",
    hook: "The moment you learn the outcome, you lose the ability to remember not knowing it.",
    mechanism:
      "Once an outcome is known, memory silently rewrites: the signs now look obvious, your past uncertainty shrinks, and 'I had a feeling' replaces the fog you actually stood in. This corrupts learning at the source — every review conducted with outcome knowledge overestimates what was knowable, judges reasonable decisions as stupid (or reckless ones as brilliant), and teaches the lesson 'be more certain', which is exactly backwards.",
    example:
      "After a market crash, everyone sees the 'obvious' warning signs — the same signs that were present in ten non-crash years and indistinguishable at the time. After an incident, the review asks 'how was this missed?!' about a log line that was one among ten thousand. The only honest defense is contemporaneous records: a decision journal writes down the fog before the outcome burns it away.",
    failure:
      "Anti-hindsight discipline can slide into 'nothing is ever anyone's fault — it was all unknowable', which kills accountability and learning just as thoroughly. Some outcomes WERE foreseeable with the information held at the time; the decision journal cuts both ways, sometimes proving you did know better and chose badly anyway.",
    recall: {
      q: "Why does hindsight bias corrupt post-mortems and performance reviews?",
      a: "Outcome knowledge rewrites memory of what was knowable — signs look obvious retroactively, so reviewers judge decisions against information nobody had, and the process teaches false lessons like 'the warning was clear'.",
    },
    apply:
      "Before your next non-trivial decision, write three lines: what you expect, your confidence, and what you're most unsure about. Seal it. That's your defense against your future self's rewriting.",
    related: ["pre-mortem", "confirmation-bias", "regression-to-mean"],
  },

  /* ---------------- Strategy & Leverage ---------------- */
  {
    id: "circle-of-competence",
    name: "Circle of Competence",
    domain: "strategy",
    hook: "The size of your circle doesn't matter. Knowing exactly where its edge is, is everything.",
    mechanism:
      "In domains where you have genuine, feedback-tested expertise, your judgment beats defaults; outside it, your confidence keeps working while your accuracy quietly stops. Since the feeling of understanding extends far past actual understanding, the boundary must be mapped deliberately — by tracked predictions, honest mistakes, and asking 'have I ever been graded in this domain?' The perimeter, not the area, is what protects you.",
    example:
      "Buffett skipped the entire dot-com boom — 'we don't understand it' — absorbed years of mockery, and avoided the crash. The same discipline in reverse: doctors giving portfolio advice, engineers redesigning org charts, anyone with expertise in X mistaking it for expertise in adjacent-sounding Y. Skill creates confidence; confidence doesn't respect domain boundaries.",
    failure:
      "A circle treated as a cage forfeits growth — the point is operating differently outside it (small stakes, borrowed expertise, explicit learning mode), not never leaving. And circles rot: markets, tech, and fields shift under you, so competence earned a decade ago may be a memory wearing the badge of a skill. Re-test the edge periodically.",
    recall: {
      q: "Why is knowing the boundary of your competence worth more than expanding its area?",
      a: "Because confidence extends past competence invisibly — the expensive mistakes happen just outside the edge, made with inside-the-edge confidence. A known boundary routes those decisions to learning mode or better experts.",
    },
    apply:
      "Draw your circle: in which specific domains have your predictions actually been graded by reality? Name one decision you're currently making outside it — with inside confidence.",
    related: ["base-rates", "satisficing", "comparative-advantage"],
  },
  {
    id: "margin-of-safety",
    name: "Margin of Safety",
    domain: "strategy",
    hook: "Engineers make bridges hold five times the expected load — not because they can't calculate, but because they can't calculate everything.",
    mechanism:
      "Every estimate carries error, and reality delivers surprises beyond any model. A margin of safety — buying below value, building past spec, scheduling under capacity — is deliberately purchased slack against your own ignorance. It converts 'my analysis must be right' into 'my analysis can be substantially wrong and I'm still fine', which is the only honest posture toward an uncertain world.",
    example:
      "Two teams promise a feature: one estimates 6 weeks and commits to 6; the other estimates 6 and commits to 9. Same skill, same estimate — but the second team absorbs a surprise dependency without breaking its word, while the first burns a weekend and trust. Graham's investing version: only buy a dollar of value for sixty cents, so being 30% wrong still leaves profit.",
    failure:
      "Margins cost real money and speed — a bridge built to 50× load never gets built, and a team that pads every estimate 3× loses to competitors and gets its padding slashed by management. Size the margin to the stakes and the error bars: thick where failure is ruinous or estimates are shaky, thin where iteration is cheap.",
    recall: {
      q: "What is a margin of safety actually protection against?",
      a: "Your own estimation error and genuine surprises — it's slack purchased so that being meaningfully wrong still leaves you fine, replacing 'the analysis must be right' with a survivable posture.",
    },
    apply:
      "Where's the thinnest margin in your current commitments — the estimate that must be exactly right? What would buying 30% more margin cost, versus what a miss would?",
    related: ["fat-tails", "slack", "inversion"],
  },
  {
    id: "compounding",
    name: "Compounding",
    domain: "strategy",
    hook: "The eighth wonder pays in the last few years — which is why almost nobody stays for it.",
    mechanism:
      "When growth builds on prior growth, progress is exponential — and exponentials are brutally back-loaded: for years the curve looks flat and disappointing, then most of the total arrives in the final stretch. This shape defeats intuition (which extrapolates lines) and patience (which quits during the flat part). It also compounds negatively: small recurring costs, tiny quality debts, and 1% daily erosions build the same hockey stick, inverted.",
    example:
      "Buffett's fortune: roughly 95%+ of it arrived after age 60 — not because his returns improved, but because that's where the curve puts the money after decades of staying in. The same math runs trust (deposits for years, withdrawn in one lie), skills (the tenth year of writing unlocks what the second couldn't), and tech debt (each hack makes the next one 'necessary').",
    failure:
      "Not everything compounds — most efforts are linear (an hour gives an hour's value) and some decay, and mislabeling them 'compounding' justifies terrible patience with things that will never inflect. The test: does this period's output become next period's input? If nothing feeds back, the exponential story is a hope, not a mechanism.",
    recall: {
      q: "Why does compounding systematically defeat human intuition and patience?",
      a: "Exponentials are back-loaded: years of near-flat progress precede the steep payoff, while intuition extrapolates straight lines — so people quit in the flat zone, right before the curve pays.",
    },
    apply:
      "Sort your regular activities: which actually compound (output feeds next input), which are linear, which decay? Are your best hours going to the compounding ones?",
    related: ["feedback-loops", "stocks-and-flows", "opportunity-cost"],
  },
  {
    id: "via-negativa",
    name: "Via Negativa",
    domain: "strategy",
    hook: "The sculpture was always inside the marble — improvement was removal.",
    mechanism:
      "Systems accrete: features, rules, meetings, habits, beliefs. Addition is how everyone tries to improve things, so subtraction stays systematically underpriced — yet removing a harm is usually more certain than adding a benefit (you know what the meeting costs; you're guessing what the new one delivers). Asking 'what should we remove?' before 'what should we add?' exploits a market inefficiency in improvement itself.",
    example:
      "A team's velocity problem 'needs' a new process, a tracking tool, a coordination role. The via-negativa pass instead deletes: two standing meetings, an approval step nobody could justify, three flaky tests everyone re-runs. Nothing was added; throughput jumps. Health runs the same asymmetry — removing smoking beats adding any supplement ever studied.",
    failure:
      "Subtraction has its own failure modes: removal feels decisive even when the removed thing was load-bearing (see Chesterton's Fence — understand before deleting), and pure via negativa never builds anything new. It's the first pass, not the whole philosophy: subtract the harmful, then add the valuable.",
    recall: {
      q: "Why is removing a harm usually a safer bet than adding a benefit?",
      a: "The harm's cost is observed fact; the addition's benefit is a forecast. Since everyone's instinct is to add, subtraction opportunities accumulate unexploited — asking 'what should go?' first harvests them.",
    },
    apply:
      "Improve one area of your life this week using only subtraction: no new tools, habits, or commitments — only removals. What are the first three candidates?",
    related: ["inversion", "chestertons-fence", "slack"],
  },
  {
    id: "asymmetry",
    name: "Asymmetric Bets",
    domain: "strategy",
    hook: "The goal isn't being right more often — it's making being wrong cheap and being right enormous.",
    mechanism:
      "Outcomes = frequency × magnitude, and magnitude is the neglected half: a strategy that's usually wrong but caps losses while leaving gains uncapped beats one that's usually right with the reverse shape. Seek convex positions — bounded downside, open-ended upside (options, experiments, publishing, asking) — and flee concave ones that harvest small steady wins against rare ruin. The shape of the payoff matters more than the hit rate.",
    example:
      "Sending a cold email to someone you admire: downside, one ignored email; upside, a changed career. Writing in public: downside, few readers; upside, compounding reputation and inbound opportunity. Venture portfolios industrialize this — most bets die, one 100× pays for all. Meanwhile 'picking up pennies in front of a steamroller' (steady small gains, rare total loss) is the same math, inverted, wearing a safety costume.",
    failure:
      "Cheap-downside bets aren't free: each consumes time, focus, and reputation, and a life of infinite dabbling never compounds anything (see Compounding). And downside estimates lie — 'capped' losses correlate and cascade in crises. The discipline: honestly price the true worst case, including the opportunity cost of scattered attention.",
    recall: {
      q: "Why can a strategy that's wrong most of the time still be excellent?",
      a: "Because payoff = frequency × magnitude: with capped downside and uncapped upside, many small losses are overwhelmed by rare huge wins — the payoff's shape beats the hit rate.",
    },
    apply:
      "Name one asymmetric bet available to you right now — bounded downside, open upside — that you haven't taken. What's actually stopping you, given the shape?",
    related: ["expected-value", "fat-tails", "loss-aversion"],
  },
  {
    id: "leverage-points",
    name: "Leverage Points",
    domain: "strategy",
    hook: "Everyone pushes where pushing is easy. Systems move where pushing is right.",
    mechanism:
      "In any system, intervention points differ enormously in power. Donella Meadows' hierarchy runs roughly: parameters (budgets, headcounts — weak), buffers and flows, feedback loops (who learns what, how fast), information access, rules of the game, goals, and finally paradigms — the shared story of what the system is for (strongest). Most effort goes to parameters because they're visible and adjustable; most change comes from the levels above, where less force moves more.",
    example:
      "To improve code quality, the parameter move is 'mandate 80% coverage' (gamed by lunch). The feedback move: every engineer gets paged for their own code — quality transforms without a single mandate. The goal-level move: leadership genuinely treating reliability as the product. Same system, three rungs, orders-of-magnitude different force-to-change ratios.",
    failure:
      "High leverage points are high resistance: paradigms and goals fight back through everyone invested in the current story, and 'goal-level change' pitched by someone with no trust just fails loudly. Meadows' own warning cuts deepest: the higher the leverage, the more likely you push in the wrong direction — humility scales with altitude.",
    recall: {
      q: "Why do parameter changes (budgets, targets, headcounts) usually disappoint?",
      a: "Parameters are the lowest-leverage rung — the system's loops, information flows, rules, and goals reassert the old behavior around new numbers. Real shifts come from changing feedback, rules, or what the system is trying to be.",
    },
    apply:
      "Take a system you want to change. Write one intervention at each level: a parameter, a feedback loop, a rule, the goal. Which are you currently trying — and is that choice courage or convenience?",
    related: ["feedback-loops", "goodharts-law", "bottlenecks"],
  },
  {
    id: "local-optima",
    name: "Local vs Global Optima",
    domain: "strategy",
    hook: "You can be at the top of a hill and the bottom of your potential at the same time.",
    mechanism:
      "Improve-a-little-each-step climbs the nearest hill — and strands you there, because every direction from a local peak looks like decline, including the paths toward far higher peaks. Escaping requires deliberately getting worse for a while: the retraining dip, the rewrite trough, the salary cut into a better trajectory. Hill-climbing can't see across valleys; only accepted temporary loss crosses them.",
    example:
      "A self-taught typist plateaus at 50wpm with hunt-and-peck: every incremental tweak of the current technique is exhausted. Touch-typing means dropping to 20wpm for weeks — worse before better — which is why most people stay on their small hill forever. Careers, architectures, and business models all have the same topology: the comfortable peak is the trap.",
    failure:
      "'It's a local optimum, we must leap' can justify reckless resets — most rewrites-from-scratch die in the valley, because valleys cost real resources and the far peak was imagined taller than it is. Before descending: estimate the crossing cost, confirm the higher peak with evidence (others standing on it), and keep retreat possible.",
    recall: {
      q: "Why does steady incremental improvement eventually become a trap?",
      a: "Incremental steps only climb the current hill — at a local peak, every direction looks worse, including paths to higher peaks. Reaching them requires accepting a temporary decline that pure improvement logic will always veto.",
    },
    apply:
      "Where are you at a comfortable local peak — good enough that leaving means getting worse first? What's the honest crossing cost to the next hill, and is the hill real?",
    related: ["satisficing", "compounding", "sunk-cost"],
  },
];

/** Fast lookup by id. */
export const MODEL_BY_ID: Map<string, MentalModel> = new Map(
  MENTAL_MODELS.map((m) => [m.id, m]),
);
