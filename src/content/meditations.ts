/**
 * Meditations, serialized — a 30-day run through Marcus Aurelius.
 *
 * One passage per day, unlocked sequentially (miss a day and you resume
 * where you left off — no falling behind). Each instalment is an
 * original modern-language rendering of a public-domain passage, with
 * the source reference and one question to carry into the day.
 */

export type SerialInstalment = {
  idx: number;
  ref: string;
  title: string;
  text: string;
  question: string;
};

export const MEDITATIONS_SERIAL: SerialInstalment[] = [
  {
    idx: 0,
    ref: "Book 2, §1",
    title: "The morning briefing",
    text: "Start the day by telling yourself: today I will meet people who are pushy, ungrateful, arrogant, dishonest, envious, and rude. They are like this because they can't tell good from evil. But I have seen what good and evil actually are, and I know these people are my kin — not by blood, but by sharing in the same mind. None of them can truly harm me, and I cannot be angry at my own kind, or hate them. We were born to work together, like feet, like hands, like eyelids.",
    question: "Who will predictably test you today — and what changes if you expect it now, at breakfast, instead of discovering it at 3pm?",
  },
  {
    idx: 1,
    ref: "Book 2, §5",
    title: "Do this one thing",
    text: "At every hour, give your full attention — as a Roman, as a human being — to doing the task in front of you with precise and unaffected dignity, with care for others, with freedom, with justice. Give yourself relief from every other thought. You will find relief if you perform each act of your life as if it were your last: free of carelessness, free of passionate resistance to reason, free of theatrics, free of self-love and complaint about your share.",
    question: "What would today's main task look like if it were performed 'as if it were your last' — not morbidly, but with that level of presence?",
  },
  {
    idx: 2,
    ref: "Book 2, §14",
    title: "You can only lose the present",
    text: "Even if you were to live three thousand years, or thirty thousand, remember: no one loses any life other than the one they are living now, and no one lives any life other than the one they are losing. The longest life and the shortest come to the same thing — the present moment is equal for everyone, and what slips away is only ever this instant. You cannot lose the past (it is already gone) or the future (you don't have it yet).",
    question: "How much of today's anxiety is about time you don't actually possess — the already-gone or the not-yet-yours?",
  },
  {
    idx: 3,
    ref: "Book 3, §5",
    title: "Stand upright, not held upright",
    text: "Work neither unwillingly, nor selfishly, nor without examination, nor pulled in every direction. Don't dress your thoughts in fancy clothing; be neither a chatterer nor a schemer. Let the god within be the guardian of a real human being: mature, engaged in the common good, a Roman, a ruler — someone at their post, waiting for the signal to leave life without needing an oath or a witness. And above all: cheerfulness that needs no outside help, and no comfort supplied by others. Stand upright — not held upright.",
    question: "Where in your life are you currently 'held upright' by external validation that you could learn to stand without?",
  },
  {
    idx: 4,
    ref: "Book 4, §3",
    title: "The retreat you carry",
    text: "People seek retreats — country houses, beaches, mountains — and you too have longed for such escapes. But this is unphilosophical, when at any hour you can retreat into yourself. Nowhere is there a quieter, more untroubled refuge than your own soul, especially one furnished with principles that produce instant calm on inspection. Give yourself this retreat constantly, and renew yourself there. Keep the principles short and fundamental — enough to wash the mind clean and send you back without resentment to what you must do.",
    question: "What two or three principles, if truly internalized, would let you find calm in a two-minute retreat at your desk?",
  },
  {
    idx: 5,
    ref: "Book 4, §7",
    title: "Delete the opinion",
    text: "Reject the opinion 'I have been harmed', and the harm itself is deleted. Delete the sense of injury, and the injury disappears. What doesn't make a person worse than they were cannot make their life worse either — it cannot damage them from outside or inside. The event is what it is; the harm lives entirely in the judgment you attach to it, and that judgment is yours to withhold.",
    question: "Name one current resentment. What exactly remains of it if you decline — just for today — to renew the judgment that feeds it?",
  },
  {
    idx: 6,
    ref: "Book 4, §43",
    title: "The river",
    text: "Time is a river of events, and its current is violent. As soon as a thing is seen, it is swept past, and another takes its place, and that too will be carried away. Everything you see will change almost as you look at it, and then be gone. Whoever keeps this in view will not rate the temporary as permanent, nor grip what is already flowing through their fingers.",
    question: "What are you currently gripping — a role, a system you built, a version of yourself — that the river has already begun to move?",
  },
  {
    idx: 7,
    ref: "Book 5, §1",
    title: "The work of a human being",
    text: "At dawn, when you can't get out of bed, have this thought ready: I am rising to do the work of a human being. Why am I sulking, if I'm about to do the things I was born for, the things I was brought into the world to do? Or was I made for this — to lie warm under blankets? 'But it's more pleasant.' So you were born for pleasure? Look at the plants, the birds, the ants, the spiders, the bees — each doing their work, each putting the world in order as far as they can. And you refuse to do the human work? Nature has its limits for you as for them; you're going beyond them — but not beyond what you could accomplish.",
    question: "What is 'the human work' you're actually for — and did the snooze button negotiate with it this morning?",
  },
  {
    idx: 8,
    ref: "Book 5, §16",
    title: "The mind takes the color of its thoughts",
    text: "Your mind will be like its habitual thoughts, for the soul is dyed the color of its thoughts. Dye it, then, with a continuous series of thoughts like these: wherever living is possible, living well is possible. Life is short: the fruit of this life is a good character and acts for the common good. If a thing is hard for you personally, do not assume it impossible for everyone — and if a thing is possible for anyone and proper to them, consider it within your own reach too.",
    question: "If your mind takes the color of its most repeated thoughts, what color are you dyeing yours with this month — and who chose the dye?",
  },
  {
    idx: 9,
    ref: "Book 5, §20",
    title: "The obstacle becomes the way",
    text: "In one sense, other people are our proper business — we are made to do them good and to bear with them. But when they block your proper action, they become as indifferent to you as sun or wind or a wild animal: obstacles to a particular act, not to your purpose. For the mind converts and turns every hindrance to its own use: the impediment to action advances action, and what stands in the way becomes the way.",
    question: "Take your biggest current blocker: what capability, relationship, or route would you build if you treated it as the assignment rather than the interruption?",
  },
  {
    idx: 10,
    ref: "Book 6, §13",
    title: "Strip things bare",
    text: "When you have fine food before you, tell yourself: this is a dead fish, a dead bird, a dead pig. This vintage wine is grape juice. This purple robe is sheep's wool stained with shellfish blood. Such perceptions reach the thing itself and pierce through it, so you see what it actually is. Apply this to your whole life: where things appear most worthy of your approval, lay them bare, see their cheapness, strip off the story by which they magnify themselves. Pretension is a terrible sophist, and it fools you most exactly when you think you're dealing with what matters.",
    question: "Choose one thing that impresses or intimidates you — a title, a brand, an important meeting. What is it, stripped bare?",
  },
  {
    idx: 11,
    ref: "Book 6, §21",
    title: "Corrected gladly",
    text: "If someone can show me — and prove to me — that I think or act wrongly, I will gladly change. I seek the truth, which never yet harmed anyone. What harms us is persisting in self-deception and ignorance. I follow reason where it leads; to be corrected is not to be defeated.",
    question: "When were you last shown wrong and genuinely glad about it? If you can't remember one, is that because you're never wrong — or never showable?",
  },
  {
    idx: 12,
    ref: "Book 6, §39 & 48",
    title: "Fit yourself to your lot",
    text: "Adapt yourself to the things fate has woven for you; love the people fate has given you as companions — but love them truly, not as a performance. And when you want to gladden your heart, think of the excellences of those who live with you: this one's energy, that one's modesty, another's generosity. Nothing gladdens like the images of virtues shining in the character of the people around us, gathered where we can see them. Keep them ready.",
    question: "List three specific excellences of the people you work and live with. When did you last actually look for them?",
  },
  {
    idx: 13,
    ref: "Book 7, §59",
    title: "Dig inside",
    text: "Dig inside yourself. Inside is the fountain of good, and it can always gush forth — if you always dig. Look within: within is where the source lies, ready to flow the moment you clear the way to it.",
    question: "You look outward for energy — coffee, feeds, praise. What did the last inward dig — real rest, reflection, honest work — actually yield?",
  },
  {
    idx: 14,
    ref: "Book 7, §61",
    title: "Wrestling, not dancing",
    text: "The art of living is more like wrestling than dancing: you must stand ready and unshaken against every attack, even the unforeseen ones. Dancing rewards the rehearsed; wrestling rewards balance itself — the recovery, the footing that survives what no choreography predicted.",
    question: "Your plans rehearse the dance. What would training the wrestling look like — the balance for what nobody scheduled?",
  },
  {
    idx: 15,
    ref: "Book 8, §36",
    title: "One thing at a time",
    text: "Don't let the picture of your whole life confuse you: don't sum up all the many painful things that have happened and may yet happen. Ask instead, at each present difficulty: what is actually unbearable in this? You'll be ashamed to answer. Then remind yourself that neither past nor future weighs on you — only the present, always the present, which shrinks to almost nothing the moment you draw a circle around it alone.",
    question: "The dread you feel is a sum. What is the actual size of today's single term in that series?",
  },
  {
    idx: 16,
    ref: "Book 8, §47",
    title: "The pain is your verdict",
    text: "If you suffer because of something external, it is not the thing that troubles you but your judgment of it — and that judgment you can erase right now. If what pains you is something in your own character, who prevents you from correcting it? And if you suffer because you're not doing what seems sound to you, why not do it rather than suffer? 'Something too strong stands in the way.' Then don't be distressed — the reason for inaction isn't yours. 'But life isn't worth living with this undone.' Then depart from life sincerely and gently — like one who dies with the work at peace.",
    question: "Sort today's discomfort: external verdict to erase, character flaw to correct, or right action to finally take — which is it, honestly?",
  },
  {
    idx: 17,
    ref: "Book 9, §4",
    title: "The wrongdoer wounds himself",
    text: "Whoever does wrong, wrongs himself. Whoever is unjust, is unjust to himself — he makes himself worse. The injury lands first and deepest in the doer's own character; what reaches you is secondary, and often optional. This is not softness about wrongdoing; it is accuracy about where the damage actually settles.",
    question: "Recall someone who wronged you. Can you see the ledger from their side — what the act cost them in what they became?",
  },
  {
    idx: 18,
    ref: "Book 9, §6",
    title: "Enough, right now",
    text: "Your present judgment grounded in understanding, your present action for the common good, your present disposition of contentment with whatever happens from causes outside you — this is enough. You don't need the whole staircase visible; these three, held this hour, are the complete practice.",
    question: "Judgment, contribution, acceptance — of the three, which one is weakest in your current hour, and what would restore it?",
  },
  {
    idx: 19,
    ref: "Book 10, §16",
    title: "Stop debating goodness",
    text: "Waste no more time arguing about what a good person should be. Be one. The debate itself has become the evasion — theory as the most respectable form of postponement.",
    question: "What quality have you researched, discussed and admired far longer than you have practiced it?",
  },
  {
    idx: 20,
    ref: "Book 10, §29",
    title: "The test of each act",
    text: "As you do each separate thing, pause and ask yourself: is death a terrible thing because it deprives me of this? Run the test honestly across your day — the scrolling, the grudge-keeping, the busywork, and also the good conversations, the craft, the care. The question sorts a life's contents with embarrassing speed.",
    question: "Which three activities from yesterday pass the test — and which occupied the most hours?",
  },
  {
    idx: 21,
    ref: "Book 11, §18 (part)",
    title: "Nine remedies for anger",
    text: "When someone offends you, consider first: we were born for one another, and I for them, as a guardian. Second: consider what they are at their table, in their bed, under their pressures. Third: if they act rightly, you have no grievance; if wrongly, it's involuntary — from ignorance, as all souls miss truth unwillingly. Fourth: you too go wrong, often — and where you avoid wrongdoing, is it virtue or just fear of consequences? Fifth: you often don't even know the full context; a life must be understood before it can be judged.",
    question: "Take your freshest irritation at someone. Which of the five considerations dissolves the most of it?",
  },
  {
    idx: 22,
    ref: "Book 11, §18 (cont.)",
    title: "Gentleness as strength",
    text: "And when anger rises, remember: it is not manly to be angry. Mildness and gentleness are more human, and therefore more masculine — the gentle person has strength, sinew and courage; the one boiling with rage does not. Anger is as much a mark of weakness as pain is; both have been wounded, and both have surrendered to the wound.",
    question: "Where have you been mistaking your anger for strength — and what would the genuinely stronger response look like?",
  },
  {
    idx: 23,
    ref: "Book 12, §4",
    title: "The strange privilege of self-regard",
    text: "It has always amazed me: we each love ourselves more than anyone else, yet we weigh our own opinion of ourselves less than the opinion of others. If a god or a wise teacher ordered you to speak aloud every thought the instant you had it, you couldn't endure a single day. So it is that we respect what the neighbors think of us more than what we think of ourselves.",
    question: "In today's calendar, which items exist because you value them — and which exist because of what removal would look like to others?",
  },
  {
    idx: 24,
    ref: "Book 12, §17",
    title: "If it's not right, don't do it",
    text: "If it is not right, do not do it; if it is not true, do not say it. Keep your impulse under your own command. The rule fits on a thumbnail, and its whole difficulty is that there is nothing further to understand — only the doing remains.",
    question: "What's the small not-quite-right thing you've scheduled a justification for this week?",
  },
  {
    idx: 25,
    ref: "Book 3, §10",
    title: "Small is the whole of it",
    text: "Throw away everything else and hold only these few things. Remember: each of us lives only this present, indivisible instant; the rest is either already lived or is invisible. Small is what each of us lives; small the corner of earth we live it in; small even the longest fame afterwards — passed along a relay of little people who will soon die too, who never knew themselves, let alone someone long gone.",
    question: "If the arena is truly this small, what does that shrink to its right size — and what does it leave standing at full height?",
  },
  {
    idx: 26,
    ref: "Book 4, §49",
    title: "The promontory",
    text: "Be like the headland on which the waves break continually: it stands firm, and the boiling water goes to sleep around it. 'Unlucky me, that this happened.' No — lucky me, that though this happened, I continue unhurt, neither crushed by the present nor afraid of what comes. The event could have happened to anyone; not everyone could have remained unbruised by it. Why call the first a misfortune rather than the second a fortune?",
    question: "Rewrite your most recent 'unlucky me' in the promontory's grammar: 'lucky me, that though this happened…' — what completes the sentence?",
  },
  {
    idx: 27,
    ref: "Book 6, §6",
    title: "The best revenge",
    text: "The best way to avenge yourself is not to become like the wrongdoer. Retaliation is imitation — a tribute paid in the exact currency of the offense. The only revenge that costs the offender something and you nothing is remaining what they failed to be.",
    question: "Someone lowered the standard on you recently. Where are you being tempted to pay them back in their own currency?",
  },
  {
    idx: 28,
    ref: "Book 7, §69",
    title: "Perfection of character",
    text: "Perfection of character is this: to live each day as if it were your last — without frenzy, without apathy, without pretense. The three disqualifiers matter as much as the maxim: not the panic of urgency, not the sleep of indifference, not the theater of appearing to live well. Just the day, fully attended.",
    question: "Of the three failure modes — frenzy, torpor, performance — which one is your default disguise for not quite living the day?",
  },
  {
    idx: 29,
    ref: "Book 12, §36",
    title: "Leave the stage graciously",
    text: "You have lived as a citizen in this great city of the world. What difference whether for five years or fifty? The laws apply equally to all. Why is it hard, then, if the city that brought you in now sends you out — not a tyrant, not an unjust judge, but the same nature that hired the actor now dismissing him from the stage? 'But I have only played three of the five acts.' Yes — but in life, three acts can be the whole play. The one who decides its completeness is not you. Depart satisfied, for the one who releases you is satisfied.",
    question: "Thirty days of an emperor's private notebook end here. Which single instalment changed an actual day of yours — and is it worth rereading tomorrow morning?",
  },
];
