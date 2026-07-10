/**
 * Case Files — interactive judgment cases.
 *
 * A realistic scenario unfolds in steps; at each decision point you
 * commit to an option, then read the critique. Options are graded
 * (strong / defensible / weak) and the debrief names the mental models
 * that were doing the real work. Cases are authored, linear-with-
 * critique: your choice doesn't change the story, it changes what you
 * learn about your own instincts.
 */

export type OptionQuality = "strong" | "ok" | "weak";

export type CaseOption = {
  text: string;
  quality: OptionQuality;
  critique: string;
};

export type CaseStep = {
  situation: string;
  prompt: string;
  options: CaseOption[];
};

export type CaseFile = {
  id: string;
  title: string;
  setting: string;
  steps: CaseStep[];
  debrief: string;
  /** Latticework models this case exercises. */
  models: string[];
};

export const CASE_FILES: CaseFile[] = [
  {
    id: "flaky-qual",
    title: "The Flaky Qual",
    setting:
      "Thursday, 4pm. Your enterprise customer's qualification run — the one gating a design win — reports 3 failures out of 2,000 drives on an overnight mixed-workload test. The failures are read timeouts, all on different drives, all in different hours of the night. The program manager wants a verdict by tomorrow morning: is this a firmware bug, and does the qual continue?",
    steps: [
      {
        situation:
          "Your first hour. The logs from the three failing drives are large, and the temptation is to dive into the first one immediately.",
        prompt: "What do you actually do first?",
        options: [
          {
            text: "Deep-dive the first failing drive's logs end to end — root cause comes from depth.",
            quality: "ok",
            critique:
              "Defensible but premature: with n=3 across 2,000 drives, the most valuable early information is what the failures share, not what one of them contains. Depth-first on drive #1 risks an hour spent on what might be that drive's private quirk.",
          },
          {
            text: "Diff the three failures against each other first: same firmware build? Same die revision? Same rack, same host, same hour, same command mix?",
            quality: "strong",
            critique:
              "The right opening. Correlation across failures is the cheapest, highest-signal test available — one shared factor collapses the hypothesis space before you've opened a single log body. This is base-rate thinking applied to debugging: characterize the class before the case.",
          },
          {
            text: "Ask the qual team to restart the failing test immediately to see if it reproduces.",
            quality: "weak",
            critique:
              "You just spent your most perishable asset — the failed state — for a coin flip. A 3-in-2,000 event won't meaningfully reproduce overnight, and restarting destroys evidence (drive state, host logs, thermal history) you can never get back. Preserve first, reproduce later.",
          },
        ],
      },
      {
        situation:
          "The diff comes back: all three drives are the same die revision (B1), which makes up 30% of the qual population. All three failures occurred between 2am and 4am. Nothing else obviously shared. A colleague says: 'B1 die issue, case closed — tell the PM.'",
        prompt: "Is it the B1 die?",
        options: [
          {
            text: "Probably — three out of three on a 30% subpopulation is a strong signal. Report a suspected die issue.",
            quality: "weak",
            critique:
              "Check the math before the story: if failures were random, P(all three on B1) = 0.3³ ≈ 2.7%. Suggestive, yes — but 1-in-37 coincidences happen constantly across the many quals you run (this is the Texas sharpshooter risk: you noticed B1 because it matched, not because you predicted it). And it ignores the OTHER shared factor: the 2–4am window.",
          },
          {
            text: "Treat B1 as one hypothesis of at least two — the 2–4am clustering is equally shared. Ask what happens between 2 and 4am in that lab.",
            quality: "strong",
            critique:
              "Correct: two shared factors means two live hypotheses, and the time cluster is the more mechanically specific one. (What runs at night? Backup jobs on the hosts, background media scans on the drives, HVAC setback in the lab, log rotation on the test harness…) Holding both open costs one more day; anchoring on B1 costs a wrong verdict to a customer.",
          },
          {
            text: "Pull B1 drives from the qual population now as a precaution while you investigate.",
            quality: "ok",
            critique:
              "Cautious, but it edits the experiment mid-run — a qual with a silently modified population is a qual the customer can later reject wholesale. Containment decisions on customer-facing runs belong with the PM and the customer, made explicitly, not quietly.",
          },
        ],
      },
      {
        situation:
          "You check the lab: at 2:30am the test harness rotates and compresses logs on the host — a burst of host-side I/O and CPU. On a hunch, you check the three failures' exact timestamps: each is within 90 seconds of a log-rotation burst on its host. The read timeouts may be host-induced, not drive-induced.",
        prompt: "The PM meeting is in an hour. What's your verdict?",
        options: [
          {
            text: "'It's the harness, not the drives — the qual results stand, minus these three false failures.'",
            quality: "weak",
            critique:
              "You've swapped one confident story for another. A 90-second correlation with log rotation is strong circumstantial evidence, but you haven't shown the mechanism (does the timeout originate host-side or drive-side?) — and declaring your own test harness guilty is exactly the conclusion a motivated engineer would love. That should raise your own suspicion (incentive-caused bias points at you too).",
          },
          {
            text: "'Evidence points to a harness interaction: three failures each within 90s of log rotation. Tonight we reproduce deliberately — rotation storm against 50 drives including B1 — and I'll have a mechanism-level answer tomorrow.'",
            quality: "strong",
            critique:
              "This is the answer that survives scrutiny: states the evidence with its timestamps, names it as correlation not verdict, and converts the hypothesis into a designed experiment with a deadline. Note what changed since step 1 — NOW is the time to reproduce, because now you know which conditions to reproduce.",
          },
          {
            text: "Ask for a week to be thorough — a design win is too important to rush.",
            quality: "ok",
            critique:
              "Thoroughness is a virtue, but an unscoped week reads as 'no idea' to a PM holding a customer commitment. You have a specific, testable hypothesis — the professional move is a scoped experiment with a checkpoint, not an open-ended delay. Slow is smooth; stalled is not.",
          },
        ],
      },
      {
        situation:
          "The overnight experiment: with deliberate rotation storms, 4 of 50 drives show the same read timeout — including two non-B1 drives. Mechanism found: the harness's log burst starves the host's I/O queues; the 'drive timeout' is the host giving up, not the drive failing. The customer asks: 'So your drives are fine and your test was broken. Why should we trust the rest of the qual?'",
        prompt: "That's a fair question. Your answer?",
        options: [
          {
            text: "'The failing component was our harness, not the product — the drive results are valid.'",
            quality: "ok",
            critique:
              "True but tone-deaf: it answers the technical question and ignores the trust question. The customer isn't asking what broke; they're asking why they should believe your other measurements. Defensiveness here spends the credibility the good debugging just earned.",
          },
          {
            text: "'Fair challenge. Here's the blast-radius analysis: rotation bursts occur at known timestamps; we've re-audited every measurement within ±5 minutes of one — 41 data points, all within spec except the 3 you saw. And we've fixed the harness and added a canary that would catch this class of interference in any future run.'",
            quality: "strong",
            critique:
              "This is what turns an incident into a relationship asset: you treated their doubt as legitimate, bounded the contamination with data, and showed the systemic fix. Customers don't expect zero defects in test infrastructure — they expect exactly this response when there is one.",
          },
          {
            text: "Offer to re-run the full 2,000-drive qual from scratch to remove all doubt.",
            quality: "weak",
            critique:
              "Generous and wasteful: it costs weeks, delays their program too, and implicitly concedes the whole dataset was untrustworthy — which the blast-radius analysis disproves. Over-remediation isn't integrity; it's spending both parties' time to avoid a hard conversation you were equipped to win.",
          },
        ],
      },
    ],
    debrief:
      "The case is a chain of classic debugging judgment calls: characterize the class before the case (base rates), preserve perishable evidence, hold multiple hypotheses when multiple factors are shared (the B1 anchor was a 1-in-37 coincidence wearing a story), suspect conclusions you're incentivized to like, reproduce only once you know what to reproduce, and answer trust questions with bounded evidence rather than defensiveness. Notice where you were tempted to be confident early — that's the instinct calibration training exists to fix.",
    models: ["base-rates", "anchoring", "confirmation-bias", "incentives", "law-of-small-numbers"],
  },
  {
    id: "counteroffer",
    title: "The Counteroffer",
    setting:
      "A competitor offers you a senior validation role: +35% pay, a team lead title, and a product area (automotive storage) you've never touched. When you resign, your current employer counters within 48 hours: +30%, a promised promotion 'in the next cycle', and your director says 'we had big plans for you.' You have one week to decide.",
    steps: [
      {
        situation:
          "Your first instinct matters. Friends are split between 'never accept a counteroffer' and 'loyalty is rewarded'.",
        prompt: "How do you frame the decision?",
        options: [
          {
            text: "Compare the two total-comp numbers — the rest is sentiment.",
            quality: "weak",
            critique:
              "Comp is the most legible variable, which is exactly why it over-anchors decisions. A 5% comp difference is noise against the variables that compound: skill growth, scope, manager quality, and which option's trajectory is steeper in 3 years. You're pricing the sticker, not the asset.",
          },
          {
            text: "Ask what each path looks like in 3 years, not next month — then work backwards.",
            quality: "strong",
            critique:
              "Right frame. Jobs are compounding instruments: the year-one delta is dwarfed by trajectory differences. Automotive storage (functional safety, ISO 26262, different failure economics) is a genuinely new curve; the counteroffer is your current curve with a raise. Neither is automatically better — but that's the comparison that matters.",
          },
          {
            text: "Reject the counteroffer on principle — statistics say most counteroffer-accepters leave within a year anyway.",
            quality: "ok",
            critique:
              "The statistic is real but it's a base rate contaminated by selection: people who get counteroffers were already unhappy enough to interview. If you were leaving for growth rather than escape, the base rate applies to you weakly. Use the outside view as a prior, not a verdict.",
          },
        ],
      },
      {
        situation:
          "You dig into the counteroffer's promotion promise: 'next cycle' turns out to mean a committee decision in 8 months, with no written commitment. The new role's title is real but the team is 2 people and the automotive product line is 18 months from its first qual.",
        prompt: "How do you weigh promises against facts?",
        options: [
          {
            text: "Treat both offers by their written terms only: +30% now with promotion-maybe vs +35% and a title on day one.",
            quality: "strong",
            critique:
              "Correct discipline: promises made under duress (you resigning IS the duress) carry the incentive structure of the moment. Once you've withdrawn your resignation, the urgency that produced the promise evaporates — the committee in 8 months faces different incentives entirely. Written terms are what both parties actually agreed to.",
          },
          {
            text: "Trust the director — a relationship of years outweighs paperwork.",
            quality: "weak",
            critique:
              "Your director may be entirely sincere and still unable to deliver: promotion committees, budget freezes and reorgs are outside one person's control. This isn't cynicism about people; it's accuracy about systems. Sincerity is not capacity.",
          },
          {
            text: "Ask your director to put the promotion timeline in writing before deciding.",
            quality: "ok",
            critique:
              "Reasonable test — the response is informative either way. But know what you're testing: a refusal reveals constraints, while a yes still binds weakly (comp letters bind; 'intent to promote' memos mostly don't). Useful signal, not a resolution.",
          },
        ],
      },
      {
        situation:
          "You realize you've been avoiding the deepest question: the new role means leaving NAND/enterprise SSD — where five years of your expertise lives — for automotive, where you'd be junior in domain knowledge while senior in title.",
        prompt: "How do you think about the expertise reset?",
        options: [
          {
            text: "Expertise resets are pure loss — five years of read-retry lore and OCP fluency doesn't transfer.",
            quality: "weak",
            critique:
              "The domain facts reset; the meta-skills don't. Your test-design instincts, statistical literacy, debugging discipline and vendor-negotiation scar tissue transfer at nearly full value — and automotive storage desperately needs exactly that maturity. Confusing knowledge (resets) with judgment (compounds) undervalues yourself.",
          },
          {
            text: "It's a barbell decision: the meta-skills are the safe 90%, the domain reset is a bounded-downside bet on a growing field.",
            quality: "strong",
            critique:
              "Well-framed. Automotive/embedded storage is structurally growing, safety-critical validation commands a premium, and worst case — the field disappoints — a validation lead with two domains is more valuable than one with one. The downside is a slower year one; the upside is a genuinely differentiated profile. Asymmetry favors the move IF the 3-year picture from step 1 agreed.",
          },
          {
            text: "Stay in NAND: depth in one domain always beats breadth — that's what 10,000 hours means.",
            quality: "ok",
            critique:
              "Depth is real leverage, and staying can be right — but 'always' overstates it. Depth pays in kind, stable domains; careers are wicked. And NAND expertise from five years ago is already partially obsolete (the field moved under you — 3D scaling, FDP, PLC). Even staying put, you're re-learning constantly; the question is only which curriculum.",
          },
        ],
      },
      {
        situation:
          "Decision day. You've concluded the new role wins the 3-year comparison, the counteroffer's promises bind weakly, and the expertise bet is asymmetric in your favor. But your current team is mid-qual and your departure will genuinely hurt them — and the guilt is real.",
        prompt: "How do you leave?",
        options: [
          {
            text: "Delay the new role's start by a month to land the qual, and spend the notice period writing down everything only you know.",
            quality: "strong",
            critique:
              "The professional exit: it converts guilt into concrete transfer — a handover doc, trained successors, a landed milestone. It costs you a month and buys a reputation that follows you between companies for decades (the industry is smaller than it looks). Note it also honestly prices the guilt: a month, not a career.",
          },
          {
            text: "Guilt is a sunk-cost cousin — the team's staffing is the company's problem, not yours. Start immediately.",
            quality: "ok",
            critique:
              "Technically true — bus-factor risk is a management failure, and companies conduct layoffs without guilt. But 'not my problem' and 'not worth a month of transition' are different claims. Relationships and reputation are assets you're choosing to write down; at least price them consciously.",
          },
          {
            text: "This guilt is a sign — withdraw the resignation and stay.",
            quality: "weak",
            critique:
              "Deciding a career by the most recent emotion is the loss-aversion trap wearing a conscience costume: the vivid, immediate loss (team's pain, awkward conversations) outweighs the abstract, distant one (your trajectory) exactly as prospect theory predicts. You did the analysis; guilt gets a month of mitigation, not a veto.",
          },
        ],
      },
    ],
    debrief:
      "Career decisions are where every bias you've trained against shows up wearing a suit: comp anchors, promises made under duress (incentives), the expertise-reset frame (loss aversion), the counteroffer base rate (outside view, used correctly as a prior), and the barbell logic of domain switches (asymmetry). The strongest single move in the whole case is the first one: refusing to decide next month's question and deciding the 3-year question instead.",
    models: ["opportunity-cost", "incentives", "asymmetry", "loss-aversion", "base-rates", "sunk-cost"],
  },
  {
    id: "2am-incident",
    title: "The 2am Incident",
    setting:
      "2:07am. Your phone: a hyperscaler customer's fleet monitoring flags rising read-latency p99s on ~400 of your drives across two datacenters, climbing for 3 hours. No data errors. Their storage lead is in the bridge call, terse: 'Latency SLO breach in 5 hours at this rate. What do we do?' You're the firmware duty engineer.",
    steps: [
      {
        situation:
          "First minutes on the bridge. You have dashboards, drive telemetry, and a tense audience. The customer suggests mass-rebooting the affected drives 'to reset whatever state they're in'.",
        prompt: "First move?",
        options: [
          {
            text: "Agree to a staged reboot of a small canary group — it's their fleet and reboots often help.",
            quality: "ok",
            critique:
              "A small canary limits blast radius, which is right — but you're reaching for an action before a diagnosis, and reboots destroy the drives' in-memory state (the evidence). If you must act, canary + full telemetry capture BEFORE the reboot is the version that doesn't burn the crime scene.",
          },
          {
            text: "Buy 15 minutes: pull telemetry from 5 affected + 5 healthy drives, diff their internal states, and check what the affected set shares (firmware version, age, workload, position in write cycle).",
            quality: "strong",
            critique:
              "The disciplined open. 400 affected out of a much larger fleet is a natural experiment begging for a case/control diff — and 'no data errors, rising latency' smells like a background process (GC pressure, media scan, thermal) that telemetry will show directly. Fifteen minutes of diagnosis converts guesses into a mechanism; the customer's own SREs will respect exactly this move.",
          },
          {
            text: "Recommend immediately failing traffic away from all 400 drives to protect the SLO while you investigate.",
            quality: "weak",
            critique:
              "You've just recommended the customer amputate 400 drives on the strength of zero diagnosis. Mass drain operations have their own risks (rebalancing storms, capacity margins) and — critically — if the root cause is fleet-wide (their new kernel? your last firmware push?) the drained load lands on drives about to develop the same problem. Containment before characterization can amplify.",
          },
        ],
      },
      {
        situation:
          "Telemetry diff: affected drives show elevated internal GC activity and are all >85% full; healthy ones average 60%. The affected drives also all received last week's firmware update — but so did the entire fleet. The customer's lead: 'So it's your new firmware.'",
        prompt: "Is it the firmware?",
        options: [
          {
            text: "'The whole fleet has the new firmware but only full drives are affected — fullness is the trigger, firmware may be the enabler. The pair matters, not either alone.'",
            quality: "strong",
            critique:
              "Precisely right, and said without defensiveness. The update is a constant across affected AND healthy drives — it cannot alone discriminate. The interaction hypothesis (new firmware changed GC behavior in ways that only bite above ~85% fullness) fits every observation and is immediately testable: find drives crossing 85% tonight and watch them.",
          },
          {
            text: "'The firmware shipped to everyone and most drives are fine — it's not the firmware, it's your fleet running too full.'",
            quality: "weak",
            critique:
              "Deflection with a customer-blaming flourish — and logically wrong the same way their claim was: fullness is also present on some healthy-history fleets. Worse, 'you run your fleet too full' picks a fight about their ops during their incident. Even if fullness is the trigger, your firmware changed the response to it last week.",
          },
          {
            text: "Commit to rolling back the firmware fleet-wide as the safest response to any post-update regression.",
            quality: "ok",
            critique:
              "Rollback is a legitimate lever, but fleet-wide rollback of storage firmware is itself a major operation with its own risk profile (bugs fixed by the update come back; rollback paths get 1% of the testing forward paths do). It might be the right call — after the interaction hypothesis is checked, scoped to affected drives first.",
          },
        ],
      },
      {
        situation:
          "Confirmed: the update's revised GC scheduler defers work more aggressively to boost benchmark performance, and above ~85% fullness the deferred debt comes due in exactly these latency waves. A fix needs a week. It's 4am. The SLO breach is now 3 hours out. The customer needs a mitigation NOW.",
        prompt: "What do you offer?",
        options: [
          {
            text: "A mechanism-targeted mitigation: they trim/rebalance the fullest drives below 80% starting with the affected 400, while you ship a config knob that restores the old GC cadence — canary in 24h, no full rollback.",
            quality: "strong",
            critique:
              "This is incident command done right: the mitigation attacks the confirmed mechanism from both sides (their lever: fullness; your lever: GC cadence), it's proportionate (no fleet-wide rollback), staged (canary), and it converts the 'week for a fix' into 'relief tonight, fix next week'. Mechanism-first mitigations also fail safely — if latency doesn't respond, the diagnosis is wrong and you learn that immediately.",
          },
          {
            text: "Hold position: the fix needs a week and hasty mitigations create new risks. They should manage the SLO breach with customer-side traffic engineering meanwhile.",
            quality: "weak",
            critique:
              "Technically conservative, relationally catastrophic. 'Your SLO, your problem, see you next week' after your firmware's behavior change triggered the event is how supplier scorecards get red boxes and dual-sourcing gets funded. Refusing all mitigation to avoid all risk is itself the riskiest option available.",
          },
          {
            text: "Give them the config knob tonight, fleet-wide, immediately — the old GC cadence is well-tested and speed matters most.",
            quality: "ok",
            critique:
              "Fast and probably fine — the old cadence IS battle-tested. But 'probably fine, fleet-wide, at 4am, untested in this combination' is how single incidents become double incidents. The canary costs three hours against a five-hour deadline; the affected drives can be knob-flipped first. Urgency justifies compressing stages, not deleting them.",
          },
        ],
      },
      {
        situation:
          "Mitigation works; latency recovers by 6am; SLO holds. Post-incident, the customer asks for your incident report. Your director privately suggests the report 'emphasize the fleet-fullness factor' since 'it was genuinely their operational choice too.'",
        prompt: "How do you write it?",
        options: [
          {
            text: "Write the mechanism straight: the update changed GC deferral; above 85% fullness this produces latency waves; here's why our validation missed it (no sustained >85% mixed-workload soak in the release suite) and the test we've added.",
            quality: "strong",
            critique:
              "The report that builds decade-long trust: mechanism without spin, the honest miss in your own validation coverage, and the systemic fix. Note this is also strategically optimal — the customer's engineers already know the mechanism from the bridge call; a report that shades it would be recognized instantly, and 'their report matches what we saw' is the highest compliment a supplier gets.",
          },
          {
            text: "Follow the director's suggestion — it IS true that fullness triggered it, and the relationship with your director matters too.",
            quality: "weak",
            critique:
              "Both-things-true is how spin works: selecting emphasis to redistribute blame. The customer will read the emphasis (they always do), your credibility spends down, and you've taught your director you'll shade reports under pressure — which changes what gets asked of you next time. Push back privately; the report has your name on the analysis.",
          },
          {
            text: "Write two documents: a neutral technical RCA and a separate commercial letter where the account team can frame shared responsibility.",
            quality: "ok",
            critique:
              "A workable compromise that keeps the RCA clean — engineers own facts, account teams own framing, and separating the documents is legitimate. Just ensure the RCA is the one of record and the letter never contradicts it; parallel truths converge badly during the next incident.",
          },
        ],
      },
    ],
    debrief:
      "Incident judgment is mostly the discipline of sequencing: diagnose before acting (but timebox it), treat shared factors correctly (a constant can't discriminate — the fleet-wide update alone proved nothing), attack confirmed mechanisms from every available lever, compress stages under pressure without deleting them, and write the truth when incentives whisper otherwise. The 2am version of you falls to the level of what you've practiced — which is what this case is for.",
    models: ["second-order", "bayes-updating", "incentives", "margin-of-safety", "chestertons-fence"],
  },
];

export const CASE_BY_ID: Map<string, CaseFile> = new Map(
  CASE_FILES.map((c) => [c.id, c]),
);
