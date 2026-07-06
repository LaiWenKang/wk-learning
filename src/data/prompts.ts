/**
 * Rotating daily content for the Today tab. Deterministic per day so the
 * whole day shows the same prompt. Everything here is generic and public.
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
];

/** Deterministic index for a given date key, offset per list so the
 * combinations vary day to day. */
export function dailyPick<T>(items: T[], dateKey: string, salt = 0): T {
  let hash = salt;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length];
}
