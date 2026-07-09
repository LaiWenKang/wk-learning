/**
 * Unpacked quotes — not fortune cookies.
 *
 * Every entry carries four parts: the line, the real context it came
 * from, what it actually means beneath the surface reading, and where
 * it fails — the same failure-mode discipline as the mental models.
 * Attributions are conservative: famous lines with disputed origins
 * are excluded. Short quotations with attribution and commentary.
 */

export type UnpackedQuote = {
  id: string;
  text: string;
  who: string;
  /** Where/when it was actually said — context changes meaning. */
  context: string;
  /** What it means past the surface reading. */
  meaning: string;
  /** Where the advice misleads. */
  failure: string;
  /** A question to turn it on yourself. */
  ask: string;
};

export const UNPACKED_QUOTES: UnpackedQuote[] = [
  {
    id: "aurelius-obstacle",
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    who: "Marcus Aurelius",
    context:
      "Private journal of a Roman emperor written during a plague and a frontier war — notes to himself, never meant for publication.",
    meaning:
      "Obstacles aren't interruptions of the work; they reveal what the work actually is. The blocked path tells you where capability must grow next.",
    failure:
      "Some obstacles are just obstacles — signals to reroute, not to push. Romanticizing every difficulty as 'the way' keeps people grinding at walls a wiser person would walk around.",
    ask: "Is the thing blocking you this week a teacher — or a signpost pointing elsewhere?",
  },
  {
    id: "seneca-busy",
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    who: "Seneca",
    context:
      "From 'On the Shortness of Life' — written by one of Rome's richest and busiest men, to a friend managing the empire's grain supply.",
    meaning:
      "Complaints about time are usually complaints about allocation. Life audited honestly contains huge tracts of borrowed, leaked and surrendered hours.",
    failure:
      "Weaponized, this becomes productivity guilt — treating rest, play and idle conversation as 'waste' when they're part of the point of being alive.",
    ask: "If you logged this week like an accountant, which hours would you refuse to fund again?",
  },
  {
    id: "epictetus-control",
    text: "Some things are up to us and some are not.",
    who: "Epictetus",
    context:
      "The opening line of the Enchiridion — taught by a former slave whose leg had been crippled by a master. He knew exactly what wasn't up to him.",
    meaning:
      "The whole Stoic operating system in nine words: sort every concern into what you control (judgments, effort, responses) and what you don't (outcomes, others, the past) — and spend yourself only on the first pile.",
    failure:
      "Read fatalistically, it excuses disengagement from hard-but-influenceable things. Most of life is a third category — partially up to us — and the sorting itself takes judgment.",
    ask: "What are you currently treating as controllable that isn't — and vice versa?",
  },
  {
    id: "feynman-fool",
    text: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    who: "Richard Feynman",
    context:
      "1974 Caltech commencement speech on 'cargo cult science', after cataloguing how careful researchers still deceived themselves.",
    meaning:
      "Integrity isn't about not lying to others; it's engineering your work so your own wishful thinking gets caught — controls, blind analysis, publishing the failures.",
    failure:
      "Radical self-doubt can tip into paralysis. The point is building error-catching *systems*, not marinating in suspicion of every conclusion you reach.",
    ask: "Where in your current work would a wrong belief of yours go completely undetected?",
  },
  {
    id: "munger-incentive",
    text: "Never, ever, think about something else when you should be thinking about the power of incentives.",
    who: "Charlie Munger",
    context:
      "From his 1995 Harvard talk on the psychology of human misjudgment — he ranked incentive-caused bias the most underrated force in the list.",
    meaning:
      "When behavior seems inexplicable, you've probably skipped the incentive analysis. People respond to their actual payoffs, not their stated values — and sincerely believe otherwise.",
    failure:
      "Pure incentive-lens thinking turns cynical fast and misses genuine conviction, craft pride and altruism — which also demonstrably move people.",
    ask: "Whose confusing behavior around you right now is perfectly explained by what they're actually paid for?",
  },
  {
    id: "munger-latticework",
    text: "You've got to have models in your head, and you've got to array your experience on this latticework of models.",
    who: "Charlie Munger",
    context:
      "1994 USC Business School speech — the origin of the 'latticework of mental models' idea this app's Learn tab is named after.",
    meaning:
      "Isolated facts don't compound; facts attached to models do. The models come from many disciplines because reality doesn't respect academic departments.",
    failure:
      "Collecting models can become a hobby that substitutes for using them. Twenty models applied beat two hundred admired.",
    ask: "Which model did you actually *use* this week — not read about, use?",
  },
  {
    id: "buffett-reputation",
    text: "It takes twenty years to build a reputation and five minutes to ruin it. If you think about that, you'll do things differently.",
    who: "Warren Buffett",
    context:
      "His standing warning to Berkshire managers, repeated in memos after the 1991 Salomon Brothers scandal nearly destroyed the firm.",
    meaning:
      "Trust is a stock built by slow deposits and destroyed by single withdrawals — the asymmetry means reputational risk deserves margin-of-safety thinking, not expected-value thinking.",
    failure:
      "Total ruin-avoidance can make you timid and political. Some five-minute risks — honest dissent, admitting an error — *build* twenty-year reputations.",
    ask: "What's the five-minute shortcut available to you right now that your twenty-year self would veto?",
  },
  {
    id: "graham-voting",
    text: "In the short run, the market is a voting machine but in the long run, it is a weighing machine.",
    who: "Benjamin Graham",
    context:
      "Paraphrased from Security Analysis (1934), written in the wreckage of the 1929 crash by the man who trained Buffett.",
    meaning:
      "Short-term prices measure popularity; long-term prices measure substance. The gap between the two is where both opportunity and self-deception live.",
    failure:
      "The long run can outlast your solvency, your career review cycle, or your patience. Voting-machine verdicts pay salaries while you wait for the scale.",
    ask: "Where in your work are you optimizing for votes this quarter over weight this decade?",
  },
  {
    id: "housel-rich",
    text: "Wealth is what you don't see.",
    who: "Morgan Housel",
    context:
      "From The Psychology of Money — the cars not bought, the upgrades skipped; visible spending is the opposite of wealth.",
    meaning:
      "Every visible luxury is a subtraction from invisible net worth. Judging wealth by what people display gets the ranking almost exactly backwards.",
    failure:
      "Taken to the extreme it becomes hoarding as identity. Money's terminal purpose is being spent on a life — eventually, deliberately, on things you value.",
    ask: "What did you not buy this year that quietly became your most valuable purchase?",
  },
  {
    id: "brooks-month",
    text: "The bearing of a child takes nine months, no matter how many women are assigned.",
    who: "Fred Brooks",
    context:
      "The Mythical Man-Month (1975), from managing IBM's OS/360 — the project that taught the industry that adding people to a late project makes it later.",
    meaning:
      "Some work has sequential dependencies that no parallelism can compress. Confusing effort (person-months) with progress is the oldest scheduling error in engineering.",
    failure:
      "Not everything is a pregnancy — plenty of work *does* partition cleanly, and Brooks's law becomes an excuse for never staffing properly or never learning to divide work well.",
    ask: "Is your current bottleneck truly sequential — or just undivided?",
  },
  {
    id: "dijkstra-testing",
    text: "Program testing can be used to show the presence of bugs, but never to show their absence.",
    who: "Edsger Dijkstra",
    context:
      "1970, 'Notes on Structured Programming' — an argument for reasoning about correctness rather than relying on test outcomes alone.",
    meaning:
      "A green test suite is evidence, not proof. Every passing run tells you only that the specific paths you thought to try behave as expected.",
    failure:
      "Used as a slogan against testing, it's backwards — tests are still the cheapest bug-detectors ever invented. The lesson is humility about coverage, not abandoning the practice.",
    ask: "What's the most important behavior in your system that no test currently exercises?",
  },
  {
    id: "knuth-optimization",
    text: "Premature optimization is the root of all evil.",
    who: "Donald Knuth",
    context:
      "1974 paper 'Structured Programming with go to Statements' — the full sentence begins 'We should forget about small efficiencies, say about 97% of the time…'",
    meaning:
      "Optimizing before measuring spends complexity on guesses. The famous line is really about *evidence*: profile first, then optimize the 3% that matters.",
    failure:
      "Quoted without the '97%' clause, it excuses ignoring performance entirely — but Knuth's same paragraph insists the critical 3% must not be passed up. Architecture-level performance can't be retrofitted.",
    ask: "Are you avoiding optimization because you measured — or because the quote gave you permission?",
  },
  {
    id: "kahneman-theory",
    text: "Nothing in life is as important as you think it is, while you are thinking about it.",
    who: "Daniel Kahneman",
    context:
      "The 'focusing illusion', from decades of well-being research — his candidate for the most important cognitive bias nobody manages.",
    meaning:
      "Attention inflates whatever it lands on. The raise, the insult, the purchase — each dominates while in focus and shrinks to almost nothing in lived experience.",
    failure:
      "Some things under focus really are that important — chest pain, a failing marriage, a security hole. The illusion is a bias, not a universal discount rate.",
    ask: "What consumed your attention last month that your life today shows no trace of?",
  },
  {
    id: "tetlock-fox",
    text: "The fox knows many things, but the hedgehog knows one big thing.",
    who: "Archilochus (via Isaiah Berlin & Philip Tetlock)",
    context:
      "An ancient Greek fragment, made operational by Tetlock's 20-year forecasting study: foxes (many small models) beat hedgehogs (one big theory) at prediction, consistently.",
    meaning:
      "Grand unifying worldviews feel powerful and predict badly. Accuracy comes from stitching many partial, even contradictory models — and holding them loosely.",
    failure:
      "Foxes make poor visionaries and poor movement-builders — hedgehog conviction is what ships bold projects. Know which game you're playing: forecasting or leading.",
    ask: "On the topic you're most confident about — are you being a fox or a hedgehog?",
  },
  {
    id: "deming-data",
    text: "In God we trust. All others must bring data.",
    who: "W. Edwards Deming (attributed)",
    context:
      "The quality-management pioneer whose statistical methods rebuilt post-war Japanese manufacturing; the line became the motto of data-driven operations.",
    meaning:
      "Opinions scale with seniority; data doesn't care. Instrumenting reality beats debating it.",
    failure:
      "Deming himself warned the loudest about this quote's abuse: 'the most important figures are unknown and unknowable.' Data-only management optimizes what's measurable and destroys what isn't.",
    ask: "What crucial thing in your work would look like zero in every dashboard you have?",
  },
  {
    id: "grove-paranoid",
    text: "Success breeds complacency. Complacency breeds failure. Only the paranoid survive.",
    who: "Andy Grove",
    context:
      "Intel's CEO, from the book named after the last three words — written after Intel nearly died missing the memory-to-microprocessor transition.",
    meaning:
      "Strategic inflection points arrive disguised as noise. The companies (and careers) that survive them are the ones scanning for disconfirming signals while things still look fine.",
    failure:
      "Institutionalized paranoia becomes thrash — reorganizing at every rumor. Grove's actual skill was distinguishing 10x forces from ordinary competitive wind.",
    ask: "What signal, if real, would obsolete your current role — and are you watching for it or away from it?",
  },
  {
    id: "kidder-soul",
    text: "Not everything worth doing is worth doing well.",
    who: "Tom West (in Tracy Kidder's The Soul of a New Machine)",
    context:
      "The maxim of the engineering leader who shipped Data General's Eagle minicomputer with a team of exhausted twenty-somethings in 1980.",
    meaning:
      "Perfectionism is an allocation error: quality budgets are finite, and spending them evenly means the critical parts get too little. Deliberate B-work in the right places funds A-work where it counts.",
    failure:
      "In firmware, some 'B-work' corrupts data or bricks fleets. The skill is knowing which corners are load-bearing — and West's team also burned itself out proving it.",
    ask: "What are you currently polishing that nobody will ever notice — and what's starving because of it?",
  },
  {
    id: "davinci-details",
    text: "Details make perfection, and perfection is not a detail.",
    who: "Leonardo da Vinci (attributed)",
    context:
      "Reflecting his working method: notebooks full of obsessive studies — hands, water eddies, hinges — behind apparently effortless paintings.",
    meaning:
      "Excellence is an accumulation of small decisions nobody individually notices. The finish that reads as 'quality' is hundreds of invisible choices done right.",
    failure:
      "Da Vinci famously left works unfinished for decades — detail-obsession without shipping discipline. Perfection that never ships perfects nothing.",
    ask: "Which small detail in your daily output, done consistently right, would compound into a reputation?",
  },
  {
    id: "franklin-diligence",
    text: "Diligence is the mother of good luck.",
    who: "Benjamin Franklin",
    context:
      "Poor Richard's Almanack — written by a printer's apprentice who became a scientist, diplomat and founder largely through systematic self-improvement routines.",
    meaning:
      "Luck is opportunity multiplied by preparation and at-bats. The diligent take more swings and are readier when a pitch arrives — which looks, from outside, like fortune.",
    failure:
      "Survivorship bias wears this quote as a costume: plenty of diligent people stay unlucky, and crediting all success to effort licenses contempt for the unlucky.",
    ask: "Are you taking enough swings for luck to find you — or perfecting one swing in an empty stadium?",
  },
  {
    id: "suntzu-victory",
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    who: "Sun Tzu",
    context:
      "The Art of War, ~5th century BC — a manual arguing the supreme skill is winning without fighting at all.",
    meaning:
      "Outcomes are mostly decided before the visible contest: in preparation, position and the choice of which battles to accept. The fight reveals the verdict; it rarely creates it.",
    failure:
      "Some arenas can't be pre-won — genuinely novel situations reward adaptation over preparation. Over-planning becomes its own defeat when conditions shift mid-battle.",
    ask: "For your next big moment — interview, qual, negotiation — what would 'winning first' concretely look like?",
  },
  {
    id: "taleb-turkey",
    text: "A turkey is fed for a thousand days by a butcher; every day confirms to its staff of analysts that butchers love turkeys.",
    who: "Nassim Nicholas Taleb",
    context:
      "The Black Swan — his retelling of Bertrand Russell's chicken, updated with analysts to mock risk models built on historical calm.",
    meaning:
      "In fat-tailed domains, absence of disaster is not evidence of safety — the confidence peaks precisely when the risk peaks. Track records measure the past's kindness, not the future's.",
    failure:
      "Not everything hides a butcher. Thin-tailed processes really are stable, and turkey-logic applied everywhere means never trusting any accumulated evidence at all.",
    ask: "Which of your reassuring track records — a system's uptime, a habit's harmlessness — might be a turkey's day 999?",
  },
  {
    id: "clear-systems",
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    who: "James Clear",
    context:
      "Atomic Habits — distilling why ambitious goals fail: winners and losers often share the same goals, so goals can't be what separates them.",
    meaning:
      "Goals set direction; systems determine outcomes. Under stress, fatigue and distraction, you get whatever your defaults produce — so engineer the defaults.",
    failure:
      "Systems without goals optimize the wrong hill efficiently. And some breakthroughs require goal-obsessed irrationality no sane 'system' would schedule.",
    ask: "If your current daily defaults ran unchanged for five years, where exactly would they deposit you?",
  },
  {
    id: "newport-rare",
    text: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
    who: "Cal Newport",
    context:
      "Deep Work (2016) — an economist's argument dressed as a productivity book: scarcity plus value equals premium.",
    meaning:
      "Distraction is an economic opportunity for whoever resists it. Long, undistracted concentration is now a tradable rarity, like literacy once was.",
    failure:
      "Some crucial work is shallow by nature — coordination, mentorship, being reachable during your team's incident. Depth-maximalism can make you brilliant and useless.",
    ask: "How many genuinely uninterrupted 90-minute blocks did you get last week — and who took the rest?",
  },
  {
    id: "goldratt-tell",
    text: "Tell me how you measure me, and I will tell you how I will behave.",
    who: "Eliyahu Goldratt",
    context:
      "The Theory of Constraints creator's standing warning to executives — usually delivered right before showing how their KPIs caused the mess.",
    meaning:
      "Metrics are instructions in disguise. Publish a measurement and you've written a behavior spec, including every loophole in it.",
    failure:
      "The dark reading — 'people only follow incentives' — underestimates professional pride. Plenty of people quietly do right things their metrics punish. Design for the gamers, but don't insult the craftsmen.",
    ask: "If a stranger read only your team's metrics, what behavior would they predict — and is that what you see?",
  },
  {
    id: "aurelius-morning",
    text: "When you wake in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous and surly.",
    who: "Marcus Aurelius",
    context:
      "Meditations 2.1 — the emperor pre-briefing himself before days spent with the Roman senate. It continues: '…and none of them can harm me.'",
    meaning:
      "A pre-mortem for equanimity: expect friction, and friction loses its power to derail you. The surprise, not the rudeness, is what actually costs you the day.",
    failure:
      "Expecting the worst of everyone can curdle into misanthropy and self-fulfilling coldness. Aurelius pairs it with 'they are my kin' — keep both halves.",
    ask: "What predictable friction ambushes you every single week — and what would pre-accepting it change?",
  },
  {
    id: "seneca-storm",
    text: "The pilot is revealed in a storm, the soldier in battle.",
    who: "Seneca",
    context:
      "From On Providence, answering why bad things happen to good people: adversity is where capability becomes visible — including to yourself.",
    meaning:
      "Calm seas can't distinguish good pilots from lucky ones. The incident, the crunch, the crisis — that's when your actual level, not your rehearsed level, shows.",
    failure:
      "Glorifying storms invites seeking them. Great engineering (and great character) mostly means *preventing* storms — the best pilots are the ones rarely tested.",
    ask: "In your last storm, what did you learn about your real level — and what did you do about it since?",
  },
  {
    id: "hamming-doors",
    text: "He who works with the door open gets all kinds of interruptions, but he also occasionally gets clues as to what the world is and what might be important.",
    who: "Richard Hamming",
    context:
      "'You and Your Research' (1986) — his Bell Labs observation that open-door scientists did more important work than smarter closed-door colleagues.",
    meaning:
      "Isolation optimizes today's problem; exposure re-aims you at tomorrow's important one. Slightly worse execution on the right problem beats perfect execution on the wrong one.",
    failure:
      "Perpetually open doors produce shallow days (see Deep Work — the two quotes fight, and both are right). Hamming worked deeply too; the door was open at chosen times.",
    ask: "When did a hallway conversation last change what you were working on — and have you made room for another?",
  },
  {
    id: "box-models",
    text: "All models are wrong, but some are useful.",
    who: "George Box",
    context:
      "A statistician's aphorism from 1976 — written about statistical models, adopted by everyone who simulates, forecasts or abstracts anything.",
    meaning:
      "The question is never whether a model is true — none are. It's whether the model's distortions matter for the decision at hand.",
    failure:
      "The quote can shield garbage models from criticism ('all models are wrong anyway!'). Box's point cuts both ways: usefulness must be demonstrated, not presumed.",
    ask: "Which model you rely on daily — mental or Monte-Carlo — is wrong in a way that's about to matter?",
  },
  {
    id: "drucker-efficiency",
    text: "There is nothing so useless as doing efficiently that which should not be done at all.",
    who: "Peter Drucker",
    context:
      "The father of modern management, on the difference between efficiency (doing things right) and effectiveness (doing right things).",
    meaning:
      "Optimization has a silent prerequisite: the thing deserves to exist. Via negativa first — delete, then improve what survives.",
    failure:
      "Everything looks deletable from far enough away. Chesterton's Fence applies: understand why the 'useless' process exists before celebrating its execution.",
    ask: "What do you do impressively well that, honestly, shouldn't be done at all?",
  },
  {
    id: "pasteur-chance",
    text: "In the fields of observation, chance favors only the prepared mind.",
    who: "Louis Pasteur",
    context:
      "1854 lecture at Lille — from the scientist whose 'lucky' observations (vaccines from spoiled cultures) kept happening to the one person ready to notice them.",
    meaning:
      "Serendipity is a collision between an anomaly and someone equipped to recognize it. The preparation *is* the luck.",
    failure:
      "Preparation without exposure prepares you for nothing — you also have to be where anomalies happen (see Hamming's open door; the quotes form a pair).",
    ask: "What anomaly crossed your logs or your life this month that a better-prepared version of you would have caught?",
  },
  {
    id: "twain-know",
    text: "It ain't what you don't know that gets you into trouble. It's what you know for sure that just ain't so.",
    who: "Attributed to Mark Twain (origin uncertain)",
    context:
      "Widely attributed, never found in his works — fittingly, a quote about false certainty whose own attribution is falsely certain.",
    meaning:
      "Known unknowns get budgets, checks and humility. Wrong certainties get load-bearing roles in your decisions — that asymmetry makes them the expensive class of error.",
    failure:
      "Auditing every certainty is paralysis; most of what you know for sure is fine. The skill is flagging the few certainties your biggest decisions actually lean on.",
    ask: "Pick your current biggest decision: which 'known fact' underneath it have you never personally verified?",
  },
  {
    id: "curie-understood",
    text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    who: "Marie Curie",
    context:
      "From the physicist who carried radium samples in her pockets and paid for the era's ignorance with her life — the quote is braver and sadder for it.",
    meaning:
      "Fear thrives in the unexamined. The engineer's response to dread — of an outage, a career shift, a diagnosis — is decomposition: understood risks become manageable ones.",
    failure:
      "Curie's own story is the caveat: understanding was incomplete, and fearlessness before full understanding is how you get hurt. Some fear is your calibration working.",
    ask: "What are you currently afraid of that you've spent zero hours actually studying?",
  },
  {
    id: "wilde-cynic",
    text: "A cynic is a man who knows the price of everything and the value of nothing.",
    who: "Oscar Wilde",
    context:
      "Lady Windermere's Fan (1892) — a one-line demolition delivered at a party, as most of Wilde's philosophy was.",
    meaning:
      "Measurement fluency can masquerade as wisdom. Knowing every cost, metric and market rate says nothing about what's worth wanting — valuation is a different skill from pricing.",
    failure:
      "The inverse failure is real too: knowing values while ignoring prices is how noble projects go bankrupt. You need both ledgers.",
    ask: "What in your life do you appraise entirely by its price because its value is harder to think about?",
  },
  {
    id: "aurelius-opinion",
    text: "Reject your sense of injury and the injury itself disappears.",
    who: "Marcus Aurelius",
    context:
      "Meditations 4.7 — journaled by a man dealing daily with betrayals, plague and a co-emperor who died on him.",
    meaning:
      "Between event and suffering sits a judgment — 'this harmed me' — and that judgment is yours to issue or withhold. Most insults survive only on imported outrage.",
    failure:
      "Applied to real harms — abuse, injustice, a safety issue — 'reject the sense of injury' becomes gaslighting yourself. Stoicism is for the 90% that's noise, not the 10% that needs action.",
    ask: "What current resentment would simply evaporate if you declined to renew its judgment today?",
  },
  {
    id: "feynman-names",
    text: "I learned very early the difference between knowing the name of something and knowing something.",
    who: "Richard Feynman",
    context:
      "From his stories about his father, who could name no birds but taught him to observe what birds actually do.",
    meaning:
      "Vocabulary is a hash key, not the value. Fluency with terms — 'FDP', 'Bayesian', 'antifragile' — can perfectly disguise having no working model underneath.",
    failure:
      "Names matter more than the quote admits: shared precise vocabulary is how teams think together. The failure is stopping at the name, not having one.",
    ask: "Pick a term you use weekly at work: could you explain the mechanism under it to a smart intern, without the word?",
  },
  {
    id: "senge-structure",
    text: "Structure influences behavior. When placed in the same system, people, however different, tend to produce similar results.",
    who: "Peter Senge",
    context:
      "The Fifth Discipline — summarizing decades of systems-dynamics findings, including the beer-distribution game that breaks every group that plays it.",
    meaning:
      "Before blaming people, read the system: incentives, delays, information flows. Replace everyone in a broken structure and the structure wins again.",
    failure:
      "Pure structuralism erases agency — people do bend systems, and some individuals fail in structures where everyone else thrives. Both levers are real.",
    ask: "What outcome does your team keep 'inexplicably' producing — and what structure would produce exactly that from anyone?",
  },
  {
    id: "archilochus-training",
    text: "We don't rise to the level of our expectations; we fall to the level of our training.",
    who: "Attributed to Archilochus (via military tradition)",
    context:
      "A soldiers' maxim of uncertain ancient origin, adopted by special forces and emergency medicine — fields where performance under stress is the whole job.",
    meaning:
      "Stress deletes improvisation. Whatever you've made automatic is what shows up at 3am during the incident — everything else stays home.",
    failure:
      "Training to rigidity fails novel situations, which is what real crises usually are. Drill the fundamentals; rehearse adapting, too.",
    ask: "If your worst on-call scenario fired tonight, which parts of your response are trained — and which are hoped?",
  },
  {
    id: "bezos-stubborn",
    text: "Be stubborn on vision, flexible on details.",
    who: "Jeff Bezos",
    context:
      "His standard formulation across shareholder letters and interviews for how Amazon survived experiments that failed and pivots that worked.",
    meaning:
      "Commitment and adaptability operate at different altitudes. Confusing the levels produces the two classic failures: pivoting the mission weekly, or dying on an implementation detail.",
    failure:
      "Some visions deserve abandoning — stubbornness at the wrong altitude just makes the failure bigger and slower. The maxim assumes the vision was right.",
    ask: "In your current main project, what belongs to the vision layer — and what are you treating as sacred that's actually a detail?",
  },
  {
    id: "confucius-stop",
    text: "It does not matter how slowly you go as long as you do not stop.",
    who: "Attributed to Confucius",
    context:
      "From the Analects tradition — a philosophy built on lifelong self-cultivation rather than sudden transformation.",
    meaning:
      "Compounding's precondition is continuity. Pace sets the exponent's speed; stopping sets it to zero. Most abandoned goals died at a pause that became permanent.",
    failure:
      "Never-stopping on the wrong road is its own tragedy (see sunk costs). Persistence is a multiplier — of whatever direction it's applied to.",
    ask: "Which paused-not-stopped project of yours quietly crossed into stopped — and does it deserve resurrection or a funeral?",
  },
  {
    id: "goethe-doing",
    text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    who: "Johann Wolfgang von Goethe",
    context:
      "From Wilhelm Meister — written by someone who ran a state, studied optics, and wrote Faust; not a man of unapplied knowledge.",
    meaning:
      "There are two gaps, not one: knowledge→intention and intention→action. Most self-improvement dies in the second gap, which no additional reading can bridge.",
    failure:
      "Action-bias without knowledge is thrash. The quote assumes the knowing is done — sometimes the missing step really is understanding.",
    ask: "What have you 'known' for over a year that has yet to change a single one of your Tuesdays?",
  },
  {
    id: "popper-error",
    text: "True ignorance is not the absence of knowledge, but the refusal to acquire it.",
    who: "Karl Popper",
    context:
      "The philosopher of falsification — science advances not by proving theories right but by trying hard to prove them wrong.",
    meaning:
      "Not-knowing is a state; refusing-to-test is a choice. The epistemically guilty act isn't being wrong — it's arranging your life so you can't find out.",
    failure:
      "Infinite obligation to acquire knowledge is impossible; attention is finite. The refusal that matters is on questions your decisions actually depend on.",
    ask: "What question relevant to your biggest commitment could you answer this week — and have chosen not to?",
  },
  {
    id: "watanabe-hurry",
    text: "Fast is fine, but accuracy is everything.",
    who: "Wyatt Earp (attributed)",
    context:
      "Attributed to the frontier lawman about gunfights: the man who rushed his shot usually lost to the man who aimed.",
    meaning:
      "Speed that misses is negative speed — you pay the time and then pay again for the miss. In deploys, migrations and answers to executives, the second shot costs more than the slow first one.",
    failure:
      "In genuinely iterative domains, volume of attempts beats per-shot accuracy — startups and A/B tests are spray-and-learn by design. Know your cost-of-miss.",
    ask: "Where did rushing cost you double last month — and was the deadline even real?",
  },
  {
    id: "meadows-dance",
    text: "We can't control systems or figure them out. But we can dance with them!",
    who: "Donella Meadows",
    context:
      "The systems scientist's late essay 'Dancing with Systems' — written after decades of watching interventions backfire, including her own.",
    meaning:
      "Complex systems reward attention, feedback and humility over command. You steer by sensing and adjusting, not by decreeing outcomes.",
    failure:
      "'You can't control systems' can excuse never trying structural fixes that plainly work (seatbelts, checklists, rate limits). Some parts of systems obey levers just fine.",
    ask: "Which system are you still trying to command — a team, a market, a teenager — that would respond better to dancing?",
  },
  {
    id: "seneca-luck",
    text: "Luck is what happens when preparation meets opportunity.",
    who: "Attributed to Seneca",
    context:
      "A paraphrase of Senecan themes (the exact wording is modern) — the Stoics held that fortune controls events but preparation controls readiness.",
    meaning:
      "You can't schedule opportunities, but you can guarantee being unready. Preparation converts random events into usable ones — it widens the target luck can hit.",
    failure:
      "It quietly implies the prepared deserve their luck and the unlucky were unprepared — survivorship bias with a toga. Opportunity is not uniformly distributed.",
    ask: "If your dream opportunity arrived next Monday, what specifically would you be unready to show?",
  },
  {
    id: "asimov-violence",
    text: "Violence is the last refuge of the incompetent.",
    who: "Isaac Asimov (Foundation)",
    context:
      "Spoken by Salvor Hardin, mayor of a city with no army, out-maneuvering armed empires through trade, religion and timing.",
    meaning:
      "Force — the shouted order, the unilateral rewrite, the escalation to management — is what remains when you've run out of cleverness. The skilled find moves that make conflict unnecessary.",
    failure:
      "Sometimes the competent thing *is* the hard confrontation — Hardin's line can dress up conflict-avoidance as sophistication while problems metastasize.",
    ask: "Where are you about to use force (authority, ultimatum, brute-force rewrite) because thinking feels slower?",
  },
  {
    id: "lao-tzu-journey",
    text: "A journey of a thousand miles begins with a single step.",
    who: "Lao Tzu (Tao Te Ching)",
    context:
      "Chapter 64 — the same passage also says 'a tower of nine storeys rises from a heap of earth'. It's about how big things are actually made.",
    meaning:
      "Scale intimidates; increments don't. The move is to make the first step so small that starting is easier than avoiding — momentum does the rest of the persuasion.",
    failure:
      "A thousand single steps in the wrong direction is a two-thousand-mile mistake. Direction-setting deserves the care that step-counting can't provide.",
    ask: "What intimidating thing on your list has a genuinely five-minute first step you could take today?",
  },
  {
    id: "roosevelt-arena",
    text: "It is not the critic who counts... The credit belongs to the man who is actually in the arena.",
    who: "Theodore Roosevelt",
    context:
      "1910 Sorbonne speech, 'Citizenship in a Republic' — delivered by a man who had been shot at, ridiculed and defeated more than his critics ever risked.",
    meaning:
      "Criticism is cheap because it stakes nothing. Building, shipping and deciding expose you to being visibly wrong — which is precisely why they deserve the credit.",
    failure:
      "Arena-worship dismisses all critics — but good critics (reviewers, auditors, red teams) improve the work and take real professional risk doing it. The target is *cost-free* criticism.",
    ask: "This quarter, where were you the critic when you could have entered the arena?",
  },
  {
    id: "simon-attention",
    text: "A wealth of information creates a poverty of attention.",
    who: "Herbert Simon",
    context:
      "1971 — a Nobel-winning economist predicting the attention economy decades before feeds existed: information consumes the attention of its recipients.",
    meaning:
      "Every new input arrives with a hidden invoice payable in your scarcest resource. Information is no longer valuable by default; filtering is.",
    failure:
      "Aggressive filtering builds echo chambers and blind spots — the anomaly that saves you often arrives dressed as noise (see Pasteur, see Hamming). Filter with a sampling valve open.",
    ask: "What did you consume yesterday that you'd refuse if it billed your attention in cash?",
  },
];

export const QUOTE_BY_ID: Map<string, UnpackedQuote> = new Map(
  UNPACKED_QUOTES.map((q) => [q.id, q]),
);
