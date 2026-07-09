/**
 * Book Duels — books that disagree, staged fairly.
 *
 * The Reddit-thread experience without the noise: two serious books
 * argue opposite positions, you commit to a side before reading the
 * synthesis, and the resolution names where each book is right and
 * the question that decides which applies to your situation.
 */

export type BookDuel = {
  id: string;
  topic: string;
  a: { book: string; author: string; thesis: string };
  b: { book: string; author: string; thesis: string };
  /** The question you commit an answer to. */
  question: string;
  /** Where each is right + the deciding question. */
  synthesis: string;
};

export const BOOK_DUELS: BookDuel[] = [
  {
    id: "range-vs-grit",
    topic: "Specialize or generalize?",
    a: {
      book: "Grit",
      author: "Angela Duckworth",
      thesis:
        "Sustained passion and perseverance toward one long-term goal beats talent. High performers pick a direction early and compound relentlessly — quitting when things get hard is the signature of mediocrity, and effort counts twice (skill = talent × effort; achievement = skill × effort).",
    },
    b: {
      book: "Range",
      author: "David Epstein",
      thesis:
        "In complex, changing domains, generalists win: broad sampling periods, late specialization, and analogies imported from other fields beat head-start specialists. Tiger Woods is the exception; Roger Federer (who sampled many sports late) is the rule. Early grit toward the wrong match is expensive lock-in.",
    },
    question: "For your next five years — double down on your specialty, or deliberately broaden?",
    synthesis:
      "Both describe real regimes. Grit wins in 'kind' domains — stable rules, fast feedback, effort maps to skill (golf, chess, mastering a NAND spec). Range wins in 'wicked' domains — shifting rules, delayed or misleading feedback, where transfer and match quality dominate (careers as a whole, research directions, industry bets). Duckworth herself concedes passion must be developed by exploration before perseverance applies; Epstein concedes specialists win once the match is right. The deciding question: is your environment kind or wicked — and are you still searching for your match, or compounding within it? For an SSD test engineer: the craft is kind (grit pays daily), but the career is wicked (keep sampling adjacent skills — AI tooling, systems, communication — like an options portfolio).",
  },
  {
    id: "zero-vs-lean",
    topic: "Vision or iteration?",
    a: {
      book: "Zero to One",
      author: "Peter Thiel",
      thesis:
        "Great companies are built on secrets — definite, contrarian visions executed with monopoly ambition. Iteration and 'listening to customers' produces incremental copies (1 to n); the valuable act is creating something new (0 to 1), which requires conviction that looks wrong to everyone else. Competition is for losers; plan boldly.",
    },
    b: {
      book: "The Lean Startup",
      author: "Eric Ries",
      thesis:
        "Visions are hypotheses, and most are wrong. Build-measure-learn loops, minimum viable products, and validated learning beat grand plans because reality holds information no founder's head contains. The waste isn't building small — it's building anything nobody wants. Pivot early, pivot cheap.",
    },
    question: "Your next big project: commit to the bold spec, or ship the smallest testable slice?",
    synthesis:
      "They argue about different uncertainties. Lean methods excel when the risk is market/demand uncertainty — will anyone want this? — and experiments are cheap relative to conviction. Thiel's approach fits when the risk is execution of something structurally hard — SpaceX couldn't MVP its way to orbit, and true 0-to-1 bets can't be A/B tested into existence. Lean's failure mode is local-optimum products iterated into blandness; Thiel's is confident irreversible wrongness. The deciding questions: how cheap is a real experiment, and does the value require crossing a threshold that iteration can't reach? Most work is Lean territory; know when you're genuinely in the other regime — and notice both books agree on the rarest input: talking to reality early.",
  },
  {
    id: "deepwork-vs-opendoor",
    topic: "Close the door or keep it open?",
    a: {
      book: "Deep Work",
      author: "Cal Newport",
      thesis:
        "Undistracted concentration is the scarcest professional asset. Attention residue from every interruption degrades the surrounding hours, so depth must be scheduled and defended monastically — the open office, the quick question, and the always-on chat are how careers dissolve into shallow fragments.",
    },
    b: {
      book: "You and Your Research (Hamming's talk, book-length spirit)",
      author: "Richard Hamming",
      thesis:
        "The open-door scientists at Bell Labs did the important work. Isolation optimizes today's problem while losing the plot on which problems matter; hallway noise carries the clues about what the field actually needs. Slightly worse execution on the right problem beats perfect execution on the wrong one.",
    },
    question: "This month, is your bigger risk shallow work — or working deeply on the wrong thing?",
    synthesis:
      "The fight dissolves on timescales. Hamming's openness operates at the level of problem selection (weeks-months): exposure decides WHAT deserves depth. Newport's depth operates at execution (hours-days): concentration decides HOW WELL it gets done. Hamming himself worked with ferocious focus once aimed — 'great thoughts time' on Friday afternoons was scheduled depth. The real failure modes are crossing the wires: open-door execution (never finishing anything) and closed-door selection (brilliantly solving obsolete problems). Audit yourself quarterly: if your last three deep projects mattered, defend the door harder; if they landed with a shrug, open it and walk the halls.",
  },
  {
    id: "kahneman-vs-gigerenzer",
    topic: "Are your instincts broken or brilliant?",
    a: {
      book: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      thesis:
        "Intuition is systematically biased: anchored, availability-driven, loss-averse, overconfident. The heuristics that generate snap judgments misfire in predictable ways, so important decisions need slow deliberation, outside views, and structural debiasing — trust the checklist, not the gut.",
    },
    b: {
      book: "Gut Feelings / Risk Savvy",
      author: "Gerd Gigerenzer",
      thesis:
        "Heuristics aren't bugs — they're ecologically rational adaptations that outperform complex models in uncertain environments (simple rules generalize; optimization overfits). The 'biases' literature manufactures errors with trick questions; real experts' fast judgments encode valid experience. Trust trained intuition, especially under uncertainty.",
    },
    question: "Your gut says the new firmware build 'feels risky'. Weight it heavily, or demand the data?",
    synthesis:
      "Klein and Kahneman co-wrote the resolution ('Conditions for intuitive expertise'): intuition is trustworthy exactly when the environment is regular enough to learn AND you've had prolonged practice with fast, clear feedback. A test engineer's 'this build feels off' after years of tight feedback loops is real signal (Gigerenzer wins). The same person's gut about markets, hiring, or one-off strategic bets is noise dressed as wisdom (Kahneman wins) — no regularity, no feedback, no learning. The deciding questions: did this domain give you thousands of graded reps? Is the environment stable? Yes+yes: trust the gut, then verify. Either no: run the checklist and take the outside view.",
  },
];

export const DUEL_BY_ID: Map<string, BookDuel> = new Map(
  BOOK_DUELS.map((d) => [d.id, d]),
);
