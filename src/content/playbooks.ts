/**
 * Playbooks — dense checklists for recurring professional moments.
 * The RedNote/Xiaohongshu "save-worthy guide" energy, aimed at an SSD
 * firmware test engineer's actual life. Each step earns its place.
 */

export type Playbook = {
  id: string;
  title: string;
  when: string;
  steps: Array<{ do: string; why?: string }>;
};

export const PLAYBOOKS: Playbook[] = [
  {
    id: "bug-triage",
    title: "A bug triage that doesn't ramble",
    when: "A failure lands on you with ten people watching and zero context.",
    steps: [
      { do: "Write the one-line symptom first: what observed, on what build, how often.", why: "Forces separation of observation from theory — most triages die by mixing them." },
      { do: "Reproduce or rate reproducibility (1/1? 1/100?) before touching theories.", why: "Repro rate decides the entire strategy: deterministic bugs get bisection, rare ones get instrumentation." },
      { do: "Diff the world: what changed since it last passed — build, config, die revision, host, temperature.", why: "Most 'mysteries' are an unlisted change." },
      { do: "List 3 hypotheses ranked by likelihood, each with its cheapest killing experiment.", why: "Three forces breadth; cheapest-first prevents week-long detours proving the favorite theory." },
      { do: "Timebox the first experiment and set the escalation criterion now ('if not root-caused by Thu, we…').", why: "Escalation decided in advance is information; decided late it's an apology." },
      { do: "Log the dead ends in the ticket as you go.", why: "The dead ends are the RCA's skeleton — and the next engineer's map." },
    ],
  },
  {
    id: "spec-diff",
    title: "Reading a spec revision in 20 minutes",
    when: "OCP/NVMe/JEDEC dropped a new revision and you need the test-plan delta, not a reading week.",
    steps: [
      { do: "Read the change log / revision history first — never the body.", why: "The authors already wrote your diff; the body is for disputes." },
      { do: "Grep for 'shall' in changed sections; each new/modified shall is a candidate test case.", why: "'Shall' is the only verb that becomes a qual failure." },
      { do: "Sort the shalls into: new behavior / tightened tolerance / clarified ambiguity.", why: "Each maps differently: new tests / updated limits / check-your-assumptions." },
      { do: "Check deprecations and removals against your existing test plans.", why: "Tests asserting retired behavior create false failures that erode trust in the whole suite." },
      { do: "Write the 5-line summary for your team before the details fade: what changed, what it hits, what to do by when.", why: "The summary you write in minute 20 is worth ten forwarded PDFs." },
    ],
  },
  {
    id: "pre-qual",
    title: "The night-before-qual checklist",
    when: "A customer qualification run starts tomorrow and reruns cost weeks.",
    steps: [
      { do: "Verify the exact firmware hash, config set, and drive population against the qual plan — character by character.", why: "The most expensive qual failures are clerical: right test, wrong build." },
      { do: "Run the smoke suite on the actual fixtures, not the lab spares.", why: "Fixture drift (cables, retimers, thermal pads) fails more quals than firmware does." },
      { do: "Confirm log capture, telemetry, and power-trace recording actually write to disk with space to spare.", why: "A failure you can't debug afterwards costs the rerun anyway." },
      { do: "Pre-stage the failure playbook: who gets paged, what data to grab before power-cycling, what's sacred.", why: "The first 10 minutes after a qual failure decide whether the evidence survives." },
      { do: "Check environmental holds — chamber schedule, thermal profile, facility work orders.", why: "The chamber shared with another team is a dependency; treat it like one." },
      { do: "Sleep. Seriously.", why: "Tomorrow's judgment calls are the actual qual instrument." },
    ],
  },
  {
    id: "incident-update",
    title: "The incident update people trust",
    when: "Something broke, it's not fixed yet, and stakeholders need words now.",
    steps: [
      { do: "Lead with impact and current state in one sentence — no history yet.", why: "Readers triage on impact; making them dig for it reads as evasion." },
      { do: "State what is known, what is suspected, and what is ruled out — as three labeled lists.", why: "The labels are the trust: confusing suspected with known is how credibility dies." },
      { do: "Give the next concrete action, its owner, and the time of the next update.", why: "'Investigating' is not an action. 'Bisecting builds 4411–4418, update by 15:00, WK' is." },
      { do: "Never promise a fix time before root cause; promise the next checkpoint instead.", why: "Missed fix promises compound; kept checkpoint promises accumulate." },
      { do: "Keep every update in the same thread/doc, newest on top.", why: "The thread is the incident's memory — and your RCA's first draft." },
    ],
  },
  {
    id: "raise-case",
    title: "Making the case for a raise or promotion",
    when: "Review season is coming and your work has been speaking quietly for itself.",
    steps: [
      { do: "Collect receipts for the whole period now: shipped work, prevented disasters, quals passed, people unblocked — with numbers where honest.", why: "Recency bias means undocumented Q1 wins don't exist by Q4." },
      { do: "Translate each receipt into the business's language: risk retired, schedule protected, escapes prevented.", why: "Test engineering's value is invisible precisely when it works; name the counterfactual." },
      { do: "Map receipts against the next level's written expectations, not your current level's.", why: "Promotions reward already operating at the level, and the mapping does the arguing for you." },
      { do: "Ask your manager what would need to be true, months before you need the answer — then close those gaps visibly.", why: "This converts your manager from judge into coach, and reviews into checkpoints." },
      { do: "Rehearse the 90-second version out loud once.", why: "The case gets made in a calibration meeting you won't attend; give your manager the exact words to carry." },
    ],
  },
  {
    id: "new-domain",
    title: "Ramping a new spec or codebase fast",
    when: "You've been handed a subsystem, a spec, or a firmware area you've never touched.",
    steps: [
      { do: "Get one end-to-end trace first: follow a single command/request through the whole thing before studying any part deeply.", why: "The skeleton makes every later detail attachable; parts studied without it evaporate." },
      { do: "Write your own map as you go — one page, boxes and arrows, updated daily.", why: "The act of drawing is the learning; the artifact recruits correctors ('actually, that arrow is wrong…')." },
      { do: "Find the three invariants everything assumes ('this table is always sorted', 'PS4 exit always re-inits X').", why: "Invariants are where the bugs live and what the tests must guard." },
      { do: "Fix or test something trivial in week one.", why: "Nothing teaches structure like the review comments on your first change." },
      { do: "Interview the veteran with your map on the table: 'what does everyone get wrong about this?'", why: "That question extracts folklore that lives in no document — the real spec." },
    ],
  },
];

export const PLAYBOOK_BY_ID: Map<string, Playbook> = new Map(
  PLAYBOOKS.map((p) => [p.id, p]),
);
