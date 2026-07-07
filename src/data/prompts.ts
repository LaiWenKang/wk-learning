/**
 * Rotating daily content for the Today tab. Selection is a deterministic
 * no-repeat rotation (see dailyRotation below): every item in a pool
 * appears exactly once per cycle, in an order reshuffled each cycle, and
 * the same item never shows on two consecutive days. Everything here is
 * generic and public.
 */

export const MINDSET_PROMPTS: string[] = [
  "Before replying to anything difficult today, write the one-sentence version first. Clarity is a professional courtesy.",
  "Reliability is built in small units: close one open loop completely before opening a new one.",
  "When you disagree, state the strongest version of the other side first. It sharpens your own argument.",
  "Estimate, then measure. The gap between the two is where your judgement improves.",
  "Say 'I don't know yet, here is how I'll find out' instead of guessing under pressure.",
  "Write status updates for the reader, not the writer: lead with the outcome, then the risk, then the ask.",
  "The mature response to a mistake is a timeline, an impact statement, and a prevention step — not an apology loop.",
  "Slow is smooth, smooth is fast: re-read the requirement once more before you start building.",
  "Treat every handover as if you will be on leave tomorrow. Would the next person be fine?",
  "Ask one clarifying question in every meeting today. Precision beats assumed understanding.",
  "Your calendar is a budget. Spend one hour today on something that compounds.",
  "Escalate early with data, not late with excuses.",
  "Praise publicly, question privately, and document decisions where everyone can see them.",
  "A senior engineer's superpower is boring consistency: same quality on a Tuesday afternoon as in a demo.",
  "Disagree with ideas, never with people. Repeat the idea back before you counter it.",
  "The best time to write the doc is right after you struggled — while the confusion is still fresh.",
  "If a task feels vague, the professional move is to make it concrete, not to avoid it.",
  "Under-promise by one day, deliver on time, and say why. Trust compounds faster than speed.",
  "Read the whole error message. Then read it again. Most 'mysteries' are impatience.",
  "When someone is wrong in a meeting, ask the question that lets them discover it themselves.",
  "Your reputation is the sum of your smallest commitments — the 'I'll send it by lunch' ones.",
  "Never bring a problem without one proposed option, even a bad one. It moves the discussion forward.",
  "Silence in a meeting is not agreement. Ask the quietest person what they see.",
  "Fix the process quietly; credit the team loudly.",
  "End every working day by writing tomorrow's first task. Morning-you will thank evening-you.",
  "Being calm under pressure is a skill you practice in low-stakes moments, not a trait you're born with.",
  "One honest 'this will slip' today is worth ten optimistic forecasts.",
  "The question 'what would make this a non-issue in a year?' usually finds the real work.",
];

export const THINKING_CHALLENGES: string[] = [
  "A test passes locally but fails in CI. List three hypotheses ranked by likelihood, and the cheapest experiment to test each.",
  "You must cut scope by 30% this week. Which cut preserves the most user value, and how would you justify it in two sentences?",
  "A metric moved 10% overnight. Before investigating, write down what evidence would convince you it's a measurement artifact.",
  "Design a retry policy for a flaky network call. What are the failure modes of the retry itself?",
  "Pick a system you use daily. Where is its single point of failure, and what is the cheapest mitigation?",
  "You inherit a script nobody understands. What are the first three safety steps before changing a line?",
  "A stakeholder asks for a deadline you can't estimate yet. Draft the reply that buys time without losing trust.",
  "Two services disagree about the same data. Whose record wins, and what invariant would prevent the disagreement?",
  "Write the rollback plan for your current project in three bullet points. If you can't, that's the finding.",
  "What is one assumption your current work depends on that you have never actually verified? How would you verify it today?",
  "A change is 'small and safe'. Argue the opposite case for two minutes: what state, timing, or environment could break?",
  "Explain a technical concept you know well in exactly three sentences a non-engineer would follow.",
  "A bug appears only in production, never locally. List the environmental differences in order of suspicion.",
  "You have one hour to review a 2,000-line change. What do you read first, and what do you consciously skip?",
  "Estimate how many requests per second your favourite app's backend handles. Show the chain of reasoning.",
  "A teammate's fix works but you don't understand why. What question separates 'works' from 'correct'?",
  "Design the alert you'd want at 3am for a slow memory leak. What threshold avoids both noise and surprise?",
  "If your current task were suddenly 10x the data volume, what breaks first: CPU, memory, I/O, or a human process?",
  "Pick a recent decision and write its pre-mortem: it's six months later and it failed — what went wrong?",
  "A dashboard says everything is green but users are complaining. List three ways monitoring can lie.",
  "What is the difference between the root cause and the trigger in the last incident you remember? Write one line for each.",
  "You can add one integration test or ten unit tests. Which do you pick for a payment flow, and why?",
  "Take a queue-based design and ask: what happens when the consumer is down for an hour? Where does the backlog live?",
  "Name a 'temporary' workaround you know about. What would making it permanent-quality cost, and what does keeping it cost?",
];

export const LEARNING_ACTIONS: string[] = [
  "Pick one signal from today's pulse, read it for 15 minutes, and capture one key takeaway as a concept note.",
  "Turn yesterday's learning note into a flashcard — front: question, back: the crisp answer.",
  "Review three flashcards you rated confidence 1–2. Re-rate them honestly.",
  "Write a five-line summary of something you learned this week, as if teaching it to a colleague.",
  "Find the original source (paper, docs, RFC) behind something you only know second-hand. Skim the abstract.",
  "Take one item from your learning queue and either read it now or archive it. Queues are for deciding, not hoarding.",
  "Spend 10 minutes on the fundamentals of a tool you use daily — one docs page you have never opened.",
  "Convert one 'I should look into that' thought into a queue item with a concrete next action.",
  "Re-read your last RCA or decision matrix. Would you decide the same way today? Note why.",
  "Learn one keyboard shortcut or CLI flag that removes a daily friction. Use it three times today.",
  "Explain one concept from your queue out loud in 60 seconds. Where you stumble is what you don't know yet.",
  "Find a diagram of a system you use (database, browser, CPU cache). Redraw it from memory, then compare.",
  "Take the hardest flashcard in your deck and split it into two easier ones.",
  "Read the changelog or release notes of a tool you depend on. One new capability, one deprecation.",
  "Write down a question you were embarrassed not to know the answer to this week. Queue it.",
  "Pick one acronym you use daily and check you can expand it and explain each word.",
  "Skim the table of contents of a classic book in your field. Queue the one chapter that pulls at you.",
  "Take a note older than a month and rewrite its takeaway in half the words.",
  "Trace one request end-to-end through a system you work with, naming every hop. Note the hop you're least sure about.",
  "Set a 20-minute timer and clear the smallest three items in your learning queue — read, decide, archive.",
];

/** Micro-drills for the Thinking Gym — one per day, tied to a tool. */
export const THINK_WARMUPS: string[] = [
  "Warm-up: take the last bug you saw and run one quick 5 Whys pass — even two levels deep counts.",
  "Warm-up: score a decision you're sitting on in the Decision Matrix with just two criteria. Rough beats postponed.",
  "Warm-up: write down one thing you believe about your current project, then open the Assumption Checker on it.",
  "Warm-up: run the Risk Scanner on whatever you plan to ship next. Two minutes, tap through all nine.",
  "Warm-up: draft an RCA title for the most annoying thing that happened this week — filling one field is enough to start.",
  "Warm-up: pick a past decision that went well and check in the matrix — would the numbers have predicted it?",
  "Warm-up: name one assumption a teammate is making that nobody has verified. Note it in the Assumption Checker.",
  "Warm-up: think of a system that failed you recently (app, process, commute). Do a two-level 5 Whys on it.",
  "Warm-up: scan yesterday's plan for the risk you ignored. Which of the nine checklist items was it?",
  "Warm-up: turn one 'we should probably…' from your week into a decision matrix with a deadline criterion.",
  "Warm-up: recall the last incident you heard about. What would the prevention action have been? One sentence.",
  "Warm-up: pick the riskiest item in your queue and write only the 'what could go wrong' field.",
  "Warm-up: find a claim in something you read today and list what evidence would change your mind about it.",
  "Warm-up: run 5 Whys on a good outcome — why did it work? Success has root causes too.",
  "Warm-up: add one criterion you always forget (maintenance cost? reversibility?) to your next decision.",
  "Warm-up: what did you rule out too early this week? Give it one honest re-check in a tool of your choice.",
];

/** Timeless personal-finance principles — education, not advice. */
export const MONEY_PRINCIPLES: string[] = [
  "Time in the market compounds; timing the market mostly compounds stress.",
  "Your savings rate is the only lever fully under your control — returns are weather, contributions are climate.",
  "Fees compound exactly like returns, just against you. A 1% fee over 30 years can eat a quarter of a portfolio.",
  "Lifestyle inflation is the silent counterforce to every raise. Bank the difference before you feel it.",
  "An emergency fund isn't an investment — it's what stops you selling investments at the worst moment.",
  "Volatility is the price of admission for long-term returns. The band on your projection chart is normal, not a flaw.",
  "Automate the transfer on payday. Willpower is a terrible recurring payment method.",
  "Diversification means always owning something that's underperforming — that's it working, not failing.",
  "The first 100k is the hardest: early on, contributions dominate. Later, compounding takes over the rowing.",
  "Risk tolerance is measured in bear markets, not questionnaires. Size positions so you can sleep.",
  "Insurance is for catastrophes you can't absorb, not inconveniences you can.",
  "A budget isn't a cage — it's just your values written in numbers. If it embarrasses you, that's information.",
  "Comparing your beginning to someone else's middle is the fastest way to make a bad financial decision.",
  "Every purchase has two prices: the sticker, and what the money would have become. Pay whichever you prefer, knowingly.",
  "Simple portfolios survive their owners. Complexity mostly adds ways to make a mistake.",
  "Net worth is a scoreboard, not a self-worth board. Check it monthly, live daily.",
];

/* ------------------------------------------------------------------ */

const DAY_MS = 86400000;

function daysSinceEpoch(dateKey: string): number {
  return Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / DAY_MS);
}

/** Deterministic Fisher–Yates over 0..n-1 seeded with a 32-bit LCG. */
function seededOrder(n: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let s = (seed ^ 0x9e3779b9) >>> 0;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * No-repeat daily rotation:
 * - days are grouped into cycles of `items.length`;
 * - each cycle uses its own deterministic shuffle, so every item appears
 *   exactly once per cycle (nothing repeats until the whole pool is used);
 * - at cycle boundaries, if the new cycle would open with the item that
 *   closed the previous cycle, the first two picks are swapped, so the
 *   same item never shows on two consecutive days.
 */
export function dailyRotation<T>(items: T[], dateKey: string, salt = 0): T {
  const n = items.length;
  if (n === 0) throw new Error("dailyRotation: empty pool");
  if (n === 1) return items[0];

  const day = daysSinceEpoch(dateKey);
  const cycle = Math.floor(day / n);
  const pos = ((day % n) + n) % n;

  const orderFor = (c: number): number[] => {
    const order = seededOrder(n, Math.imul(c, 2654435761) + salt);
    const prevLast = seededOrder(n, Math.imul(c - 1, 2654435761) + salt)[n - 1];
    if (order[0] === prevLast) [order[0], order[1]] = [order[1], order[0]];
    return order;
  };

  return items[orderFor(cycle)[pos]];
}
