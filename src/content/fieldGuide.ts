/**
 * The Storage Field Guide — deep domain briefs for an SSD firmware
 * test engineer. Each brief follows one discipline: what this is,
 * what changed recently, why it matters *to your work*, and what to
 * watch next.
 *
 * These are authored landscape chapters (state of play as of early
 * 2026), not live news — the Pulse provides the live layer on top.
 * All content summarizes public information.
 */

export type FieldArea =
  | "nand"
  | "controller"
  | "interface"
  | "enterprise"
  | "validation"
  | "market";

export const FIELD_AREAS: FieldArea[] = [
  "nand",
  "controller",
  "interface",
  "enterprise",
  "validation",
  "market",
];

export const FIELD_AREA_LABELS: Record<FieldArea, string> = {
  nand: "NAND & Media",
  controller: "Controllers & Firmware",
  interface: "Interfaces & Protocols",
  enterprise: "Enterprise & Customers",
  validation: "Test & Validation",
  market: "Market Forces",
};

export const FIELD_AREA_TINTS: Record<FieldArea, string> = {
  nand: "var(--cat-semiconductor)",
  controller: "var(--cat-firmware)",
  interface: "var(--cat-programming)",
  enterprise: "var(--cat-systems)",
  validation: "var(--cat-ai)",
  market: "var(--cat-finance)",
};

export type FieldBrief = {
  id: string;
  title: string;
  area: FieldArea;
  /** State of play — what this is and where it stands. */
  what: string;
  /** What changed recently (as of early 2026). */
  changed: string;
  /** Why it matters to an SSD firmware test engineer specifically. */
  matters: string;
  /** Concrete signals to watch next. */
  watch: string[];
};

export const FIELD_BRIEFS: FieldBrief[] = [
  {
    id: "nand-layer-race",
    title: "The 300+ Layer Race",
    area: "nand",
    what: "3D NAND scaling is now vertical: density comes from stacking more word-line layers, not shrinking cells. All majors ship 200+ layer NAND, built as two (moving to three) stacked decks, with peripheral logic bonded under or onto the array (CMOS-under-array, and increasingly wafer-to-wafer hybrid bonding).",
    changed:
      "As of early 2026 the leading edge sits around 290–320+ layers: SK hynix has 321-layer in production, Samsung's V9 generation is in the ~290-layer class, Micron's G9 around 276, and YMTC keeps pace using its Xtacking bonded architecture. Interface speeds have pushed toward 3,600 MT/s (Toggle/ONFI 6-class) to keep massive dies fed, and vendors talk openly about 400–500 layers by decade's end — with hybrid bonding as the enabling technology.",
    matters:
      "Every layer-count jump reshapes your test matrix: more decks mean more program/erase timing variance between layers, deck-to-deck interference, new read-retry tables, and heavier ECC dependence. String stacking multiplies the corner cases where word-line position affects retention and disturb behavior. Firmware read-level tracking and media management get more states to manage — and more states means more state-machine bugs to hunt.",
    watch: [
      "First 400-layer-class announcements and whether three-deck stacking ships",
      "Hybrid-bonding yield stories — it changes cost curves and die availability",
      "NAND interface speed roadmap (ONFI 6.x / Toggle 6+) vs controller PHY readiness",
      "Layer-dependent error-rate data appearing in FMS/ISSCC papers",
    ],
  },
  {
    id: "qlc-mainstream",
    title: "QLC Goes Enterprise, PLC Looms",
    area: "nand",
    what: "QLC (4 bits/cell) has crossed from 'cheap client storage' to the default media for enterprise capacity tiers. The old objection — endurance — was managed with bigger SLC caches, smarter wear leveling, zoned/placement interfaces, and workloads that are read-dominant anyway (AI data lakes, content serving).",
    changed:
      "The 61 TB and 122 TB-class QLC drives (Solidigm, Kioxia, Samsung and peers) became the workhorses of AI storage buildouts, with 200+ TB-class drives on public roadmaps. PLC (5 bits/cell) moved from lab talk to serious roadmap discussion, leaning on techniques like partial-block management and even colder data placement. Meanwhile QLC write performance narrowed the gap to TLC enough that 'QLC-first' designs stopped being controversial.",
    matters:
      "Each added bit per cell roughly halves the margin between voltage states: read-retry ladders deepen, retention windows shrink (especially hot-temperature retention), read-disturb accumulates faster, and open-block policies get pickier. Your validation cost concentrates exactly where margins are thinnest — SLC-to-QLC folding paths, cache-full cliff behavior, late-life retention at high temperature, and the interaction of all three. PLC will make today's QLC test plans look gentle.",
    watch: [
      "PLC demos with real endurance/retention numbers (not just density claims)",
      "How 122 TB+ drives handle full-drive rebuild and background scan times",
      "SLC-cache sizing strategies as QLC write perf improves",
      "JEDEC endurance spec updates (JESD218/219 workloads vs AI-era reality)",
    ],
  },
  {
    id: "capacity-race",
    title: "The Ultra-Capacity Drive Era",
    area: "nand",
    what: "AI clusters need warm data lakes too big for DRAM and too hot for HDD, which created a new product category: maximum-capacity SSDs (61 → 122 → 245 TB-class) where $/TB, power-per-TB and rack density beat raw latency.",
    changed:
      "What changed is that hyperscalers started buying these at volume for AI pipelines — training-data staging, checkpoint storage, retrieval corpora, KV-cache spill. Vendors responded with capacity-optimized designs (QLC, high die-stack counts, sometimes lower DWPD ratings) and the 'nearline SSD' conversation — SSDs eating the top of the HDD market — became a mainstream analyst position rather than a provocation.",
    matters:
      "Capacity changes firmware scale limits before it changes anything else: FTL metadata that fit comfortably in controller DRAM starts needing compression, paging, or host memory; garbage collection horizons stretch; a single die failure inside a 122 TB drive raises blast-radius questions (die-level RAID, rebuild-in-place). For test, everything that scales with capacity — format time, full-drive writes, background scans, power-loss recovery table rebuilds — becomes a schedule problem: a single full-drive-write cycle is now a multi-day event. Test-time-per-terabyte is quietly becoming a competitive metric.",
    watch: [
      "245 TB-class drive quals and their DWPD/warranty terms",
      "Die-level redundancy schemes and their failure-mode disclosures",
      "Power-loss-protection behavior at extreme metadata scale",
      "Whether 'nearline SSD' pricing actually crosses HDD TCO lines",
    ],
  },
  {
    id: "fdp-vs-zns",
    title: "Data Placement: FDP Wins the Argument",
    area: "interface",
    what: "Host-guided data placement attacks write amplification at its source: if the host tells the drive which data dies together, the FTL stops mixing unrelated lifetimes into the same NAND blocks. Two NVMe approaches competed — ZNS (strict zones, host does the heavy lifting) and FDP (hints via placement identifiers, drive keeps the FTL).",
    changed:
      "FDP effectively won the hyperscaler argument: it's backward-compatible (a drive ignores hints and still works), Google and Meta pushed it into OCP requirements, and software enablement (cachelib, RocksDB plugins, io_uring paths) matured. ZNS retreated toward niche deployments that can afford host-software surgery. By early 2026, FDP support moved from 'differentiator' to 'checkbox' in enterprise RFQs.",
    matters:
      "FDP multiplies your test surface quietly: the same drive must behave correctly with no hints, good hints, bad hints, and adversarial hints — and 'correctly' includes not just data integrity but the WAF the customer was promised. Placement-ID exhaustion, reclaim-unit accounting, and interaction with background GC create corner cases that only show up under long mixed workloads. Expect customer quals to demand WAF evidence per workload class, which means your fleet needs long-horizon endurance-style tests with placement patterns, not just synthetic 4K random writes.",
    watch: [
      "OCP Datacenter NVMe SSD spec revisions tightening FDP conformance language",
      "Public WAF case studies (Meta/cachelib-style) becoming qual requirements",
      "FDP + QLC combinations — placement is what makes QLC endurance math work",
      "Whether NVMe adds richer placement semantics beyond current FDP",
    ],
  },
  {
    id: "pcie-gen6",
    title: "PCIe Gen5 Is the Floor, Gen6 Is Arriving",
    area: "interface",
    what: "Enterprise SSDs standardized on PCIe Gen5 (x4 ≈ 14+ GB/s real throughput), and the ecosystem is preparing the jump to Gen6 (64 GT/s with PAM4 signaling and FLIT-based link layer) — a bigger electrical and protocol change than any previous PCIe generation.",
    changed:
      "Controller vendors announced and demoed Gen6 SSD silicon (26+ GB/s class sequential reads), with enterprise deployment expected to follow the AI-server refresh cycles that crave GPU-adjacent storage bandwidth. PAM4 brings forward-error-correction into the link itself, changing error statistics and recovery behavior. Meanwhile Gen5 client drives finally tamed their thermal reputation through better process nodes and DRAM-less designs.",
    matters:
      "Every PCIe generation multiplies your electrical-adjacent test load: link-training corners across retimers and backplanes, L1/L2 power-state transitions under traffic, thermal throttle laddering at sustained bandwidth, and reset storms (FLR, hot-reset, link-down mid-write) at speeds where buffers drain in microseconds. Gen6's PAM4+FEC changes the error-injection story — some errors the PHY now silently corrects, others surface differently — so inherited Gen5 error-path tests will need rethinking, not just re-running.",
    watch: [
      "First Gen6 enterprise drive quals and their thermal/power envelopes",
      "PCIe 7.0 spec milestones (the treadmill isn't slowing)",
      "FEC behavior disclosures — what error patterns escape correction",
      "Liquid-cooled server designs changing drive thermal assumptions",
    ],
  },
  {
    id: "cxl-boundary",
    title: "CXL and the Memory–Storage Boundary",
    area: "interface",
    what: "CXL lets devices share coherent memory with CPUs, promising memory pooling and tiering. For storage people the question was always: does CXL eat NVMe's lunch, ignore it, or create a new tier between DRAM and SSD?",
    changed:
      "The answer settled into 'a new tier, slowly': CXL memory expansion shipped in real servers (mostly DRAM-behind-CXL for capacity), while 'CXL flash' and memory-semantic SSDs stayed mostly in research and demos. The AI boom actually slowed CXL's momentum — HBM and GPU-attached memory absorbed the urgency — but memory tiering software matured, and NAND vendors keep prototyping flash-backed CXL devices for capacity-hungry, latency-tolerant workloads.",
    matters:
      "Near-term, CXL matters to you as context rather than test surface: it defines where NVMe's latency obligations end. If warm tiers move to CXL-attached memory, SSD workloads skew even more toward capacity and throughput (favoring QLC and placement features you do test). If flash-backed CXL devices ever productize, an entirely new validation discipline appears — coherent-protocol error handling on NAND-backed media, with failure modes neither memory nor storage test traditions fully cover. Worth tracking before it's urgent.",
    watch: [
      "CXL 3.x fabric deployments beyond memory expansion",
      "Any vendor moving flash-backed CXL from demo to product",
      "How NVMe positions itself (e.g., computational storage, memory commands)",
      "Latency-tier software (tiering daemons, kernel support) maturing",
    ],
  },
  {
    id: "controller-shifts",
    title: "Controller Architecture Shifts",
    area: "controller",
    what: "SSD controllers are where NAND physics meets product economics: cores (often heterogeneous, increasingly RISC-V), hardware accelerators for ECC/crypto/compression, DRAM or its absence (HMB designs), and firmware that turns all of it into an NVMe device.",
    changed:
      "Three visible shifts: RISC-V displaced proprietary/Arm cores in several major controller lines (cost and customization); hyperscalers deepened in-house or co-designed controller programs rather than buying purely merchant silicon; and power became the binding constraint — Gen5/Gen6 PHYs plus 2000+ MT/s NAND channels forced aggressive power-state engineering, LPDDR adoption, and thermal-aware firmware throttling as a first-class feature rather than an afterthought.",
    matters:
      "Architecture churn is firmware-bug season. New cores mean new toolchains, new race conditions, new cache-coherency corners between firmware subsystems. HMB (host memory buffer) designs put FTL state across a PCIe link that can reset under you — power-loss and surprise-removal testing gets genuinely harder. Thermal-aware throttling interacts with QoS promises: a drive that throttles 'correctly' can still fail a customer's p99 latency clause. If your test plans still assume steady-state performance, the interesting failures are happening in the transitions.",
    watch: [
      "RISC-V controller announcements and their firmware ecosystem maturity",
      "HMB usage growing in DRAM-less enterprise-adjacent designs",
      "Throttle-behavior disclosure requirements in customer specs",
      "Compression/dedupe accelerators returning in capacity-tier controllers",
    ],
  },
  {
    id: "ocp-requirements",
    title: "OCP: Your Customers' Requirements, Published",
    area: "enterprise",
    what: "The Open Compute Project's Datacenter NVMe SSD specification is the closest thing to a public transcript of what hyperscalers demand from drive firmware: telemetry, error reporting, latency monitoring, firmware-update behavior, security, and dozens of 'shall' clauses that turn into qual test cases.",
    changed:
      "The spec kept absorbing what used to be vendor-specific: standardized latency monitoring (histogram log pages), richer telemetry with defined string formats, device-initiated media scans, stricter firmware-activation-without-reset expectations, and hardware root-of-trust alignment (Caliptra) with attestation (SPDM). Cloud buyers increasingly write RFQs as 'OCP spec vX plus our deltas', which means the public document previews your next qual cycle regardless of which customer signs it.",
    matters:
      "This is the highest-leverage document an enterprise SSD test engineer can know deeply: every revision diff is literally a change list for your test plans, months before a customer qual asks for it. Latency-monitor log pages need value-level verification (are the histograms *right*, not just present); firmware update paths — activation without reset, rollback protection, downgrade rules — are among the most failure-prone and most-audited behaviors; telemetry formats get parsed by customer fleet tooling, so a malformed field that 'works in the lab' becomes a field escalation.",
    watch: [
      "Each OCP Datacenter NVMe SSD spec revision (diff the 'shall' clauses)",
      "Caliptra/attestation requirements moving from optional to mandatory",
      "Hyperscaler talks at OCP Global Summit on SSD fleet pain points",
      "Error-recovery and 'fail predictably' language tightening",
    ],
  },
  {
    id: "ai-demand-shock",
    title: "AI's Demand Shock on NAND",
    area: "market",
    what: "The AI buildout rewired storage demand: training clusters need fast staging and checkpoints, inference needs read-heavy corpus and cache tiers, and everyone discovered that GPUs idle when storage stalls. At the same time, memory makers shifted capex toward HBM — constraining NAND supply investment.",
    changed:
      "NAND swung from a brutal 2023 oversupply into an AI-driven demand cycle: enterprise SSD became the profitable segment, capacity drives sold out quarters ahead, and prices firmed while HBM ate the capex that would have built new NAND fabs. KV-cache offload to SSD (holding LLM attention state on flash) went from paper idea to shipping inference stacks, hinting at a genuinely new, latency-sensitive enterprise workload for drives.",
    matters:
      "Market forces set your priorities more than any spec does: when enterprise QLC capacity drives are the money-makers, that's where firmware teams staff up and where qual schedules compress. Supply cycles also shape test fleets — NAND allocation decides which die revisions you actually receive, and die-revision churn under supply pressure is a classic source of 'the B1 die behaves differently' surprises. KV-cache workloads, if they stick, bring read-latency QoS demands into capacity drives that were never tuned for them.",
    watch: [
      "Enterprise SSD share of NAND bits (analyst quarterly data)",
      "KV-cache/inference-offload features appearing in drive datasheets",
      "New fab announcements vs HBM capex — the 2027 supply picture",
      "Whether 'nearline SSD' demand survives an AI spending pause",
    ],
  },
  {
    id: "ai-validation",
    title: "AI-Driven Validation: Hype vs Leverage",
    area: "validation",
    what: "Your own discipline is being reshaped: LLMs generating test cases and scripts, ML models triaging failures and clustering logs across test farms, coverage-guided fuzzing of NVMe command surfaces, and anomaly detection over telemetry from thousands of drives under test.",
    changed:
      "The credible wins as of early 2026 are unglamorous and real: log triage and failure clustering (cutting duplicate-debug time), LLM-assisted test-script authoring against well-specified command sets, and fuzzers that use protocol grammars rather than random bytes. The overclaimed part: fully autonomous 'AI finds all your bugs' platforms — state-dependent firmware bugs (power-loss timing, GC races) still resist black-box generation because the interesting states take hours to reach. Digital-twin approaches (simulating drive state machines to guide test selection) moved from papers into vendor R&D.",
    matters:
      "This is a career-shaping fork: test engineers who wield these tools multiply their coverage; those who compete against them on volume lose. The highest-leverage skills look specific: encoding NVMe/FDP/OCP semantics into fuzzing grammars, building failure-signature databases that make clustering work, and — most durable — designing the *oracles* (what does 'correct' mean under this workload?) that any AI tooling still needs a human to define. Your domain knowledge of where firmware actually breaks is the scarce input; the AI is the amplifier.",
    watch: [
      "Protocol-grammar fuzzers for NVMe going open-source or productized",
      "Test-farm log-clustering results published at test conferences",
      "LLM agents wired to drive-test harnesses (with real found-bug counts)",
      "Digital-twin/state-model test selection appearing in vendor talks",
    ],
  },
  {
    id: "security-pqc",
    title: "Drive Security: Attestation and the Post-Quantum Clock",
    area: "controller",
    what: "SSD security has three layers: data-at-rest encryption (TCG Opal/Ruby, SED), platform integrity (secure boot, signed firmware, rollback protection, hardware root of trust), and supply-chain attestation (SPDM, Caliptra) proving to the host that the drive runs what it claims.",
    changed:
      "Two clocks started ticking: hyperscalers pushed attestation from nice-to-have toward qual requirement (Caliptra-aligned RoT, SPDM measurement exchange), and post-quantum migration became concrete — NIST finalized ML-KEM/ML-DSA/SLH-DSA standards, and CNSA 2.0 guidance targets quantum-resistant firmware signing in this decade, which for long-lived storage products means design-in now. Firmware signing chains, not user-data encryption, are the urgent PQC surface: drives shipped today will still be fielded when the deadlines land.",
    matters:
      "Security features are the least forgiving test surface you own: a data-path bug corrupts data, but a secure-boot or rollback-protection bug can brick fleets or void a customer's compliance story. PQC signatures are large and verification-heavy — boot-time budgets, update-package formats, and A/B slot logic all feel the size difference, and 'hybrid' (classical+PQC) schemes double the state space. Attestation adds a new class of negative testing: proving the drive *refuses* correctly — wrong measurements, stale nonces, downgraded firmware — under every reset and power-loss timing you can inject.",
    watch: [
      "CNSA 2.0 timeline enforcement in enterprise/government RFQs",
      "Caliptra adoption announcements from controller vendors",
      "PQC-signed firmware update sizes vs current OTA/update budgets",
      "TCG spec evolution (Opal successors, key-per-IO granularity)",
    ],
  },
  {
    id: "form-factors",
    title: "Form Factors and the Power Envelope",
    area: "enterprise",
    what: "Enterprise drives migrated from U.2 (2.5\" legacy) toward EDSFF: E1.S for dense compute nodes, E3.S/E3.L for mainstream servers and capacity, with connector, thermal and power definitions designed for flash rather than inherited from hard drives.",
    changed:
      "E3.S became the default in new server platforms, U.2 entered its long tail, and power ceilings climbed — 25W-class E3.S is routine, with higher envelopes specified for performance tiers. Liquid-cooled AI servers changed drive thermal assumptions (cold plates, airflow starvation in GPU-dense chassis), and 'performance per watt per rack unit' replaced raw IOPS in most enterprise pitch decks.",
    matters:
      "Form factor sounds mechanical but lands in firmware: thermal throttle curves are tuned per-envelope, power-state transitions (PS0–PS4, and the timing of entry/exit) are customer-visible behavior, and E1.S's tight envelopes make sustained-write thermal soak a primary test rather than a corner. Every new chassis integration brings the classic triad — inrush current at hot-plug, link behavior during brownout, and thermal behavior when the drive next to you is the hot one. If your soak tests still model U.2 airflow, they're testing a retired world.",
    watch: [
      "E3 revision updates and higher-power performance-tier slots",
      "Liquid-cooled server drive-bay thermal specs",
      "Hot-plug/surprise-removal behavior requirements in EDSFF deployments",
      "PCIe Gen6 power delivery pushing envelope revisions",
    ],
  },
  {
    id: "fw-architecture",
    title: "Firmware Architecture: The Host Moves Closer",
    area: "controller",
    what: "The FTL's job — pretending NAND is a disk — keeps being renegotiated with the host. Placement hints (FDP), host-managed caching, HMB, and userspace host stacks (SPDK, io_uring passthrough) all shift responsibility across the bus; inside the drive, firmware splits across more cores with stricter real-time budgets.",
    changed:
      "The 'host knows best' direction consolidated: FDP for placement, richer telemetry so hosts can schedule around drive states, and hosts increasingly bypassing kernel block layers entirely (SPDK, io_uring) — meaning drives now see command patterns no filesystem would ever generate. Computational storage cooled to niche status; the wins went to standardized hints instead of pushing compute into drives. Internally, zoned-flash-style FTL techniques (append-heavy layouts, larger mapping granularity for cold data) spread quietly even in conventional drives.",
    matters:
      "Host-stack diversity is a test-coverage problem: the same drive faces ext4 through a kernel, SPDK's raw queue-pair pounding, and io_uring passthrough with exotic queue depths — each exposing different firmware timing windows. Bypass stacks are ruthless: no kernel retries or elevator smoothing to hide your microsecond-scale hiccups, so QoS bugs invisible under filesystems become customer-visible. And mapping-granularity tricks inside the FTL create data-integrity corners (partial overwrites of large-granule cold data) that generic workloads rarely touch — your workload generators need to speak these patterns deliberately.",
    watch: [
      "io_uring/SPDK adoption in mainstream databases and storage engines",
      "FDP-aware filesystems and cache layers maturing",
      "Mapping-granularity/metadata-compression techniques in teardowns",
      "Any computational-storage revival via standardized NVMe commands",
    ],
  },
  {
    id: "reliability-science",
    title: "Reliability Science: From Specs to Fleet Reality",
    area: "validation",
    what: "Drive reliability lives in the gap between spec math (UBER targets, DWPD ratings, MTBF) and fleet behavior (real AFRs, firmware-caused failure clusters, wear-out curves). Public fleet studies and hyperscaler telemetry keep showing that firmware and integration issues — not NAND wear — dominate real-world failures.",
    changed:
      "Fleet-scale telemetry turned reliability from an extrapolation exercise into a data discipline: standardized OCP telemetry feeds ML models predicting failure days ahead, latency-histogram monitoring catches degradation before errors, and published fleet studies keep confirming that failures cluster by firmware version and batch far more than by written terabytes. The test-time implication got named openly: accelerated-life models built for HDD-era failure physics fit flash-plus-firmware systems poorly.",
    matters:
      "This reframes what your testing is *for*: if fleet failures cluster on firmware versions, then regression depth per release matters more than heroic media-wear campaigns. Statistical literacy becomes a test-design skill — sample sizes for rare-event detection (how many drive-hours to see a 1-in-10k power-loss bug?), Weibull thinking for burn-in duration, and honest confidence intervals on 'we found nothing'. The strongest career move in this area: connect your RDT/ORT data to field-return RCA, because closing that loop is what customers increasingly audit.",
    watch: [
      "Published fleet studies (hyperscaler papers, Backblaze-style reports)",
      "Predictive-failure model requirements entering customer specs",
      "Telemetry-driven qual: customers asking for your test *data*, not just results",
      "Rare-event statistics showing up in qual sample-size negotiations",
    ],
  },
];

export const FIELD_BRIEF_BY_ID: Map<string, FieldBrief> = new Map(
  FIELD_BRIEFS.map((b) => [b.id, b]),
);
