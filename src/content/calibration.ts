/**
 * Calibration question bank — daily estimation training.
 *
 * Each question has a single positive numeric answer, so accuracy can be
 * graded on ratio (within 2×, within 10×). Values are well-established
 * public facts; anything that drifts over time says so in its context
 * line. The point isn't trivia — it's learning what your own confidence
 * is worth.
 */

export type CalibrationCategory =
  | "space"
  | "earth"
  | "life"
  | "body"
  | "tech"
  | "civilization";

export const CALIBRATION_CATEGORY_LABELS: Record<CalibrationCategory, string> = {
  space: "Space & Physics",
  earth: "Earth & Geography",
  life: "The Living World",
  body: "The Human Body",
  tech: "Technology",
  civilization: "Civilization",
};

export type CalibrationQuestion = {
  id: string;
  q: string;
  /** The true value (always positive — grading is ratio-based). */
  answer: number;
  unit: string;
  /** One-line context that makes the answer memorable. */
  explain: string;
  category: CalibrationCategory;
};

export const CALIBRATION_QUESTIONS: CalibrationQuestion[] = [
  /* ---------------- Space & Physics ---------------- */
  {
    id: "moon-distance",
    q: "How far is the Moon from Earth, on average?",
    answer: 384400,
    unit: "km",
    explain:
      "384,400 km — about 30 Earths side by side. Light makes the trip in 1.3 seconds.",
    category: "space",
  },
  {
    id: "light-speed",
    q: "What is the speed of light in a vacuum?",
    answer: 299792,
    unit: "km/s",
    explain:
      "299,792 km/s — seven and a half times around Earth in one second.",
    category: "space",
  },
  {
    id: "sun-distance",
    q: "How far is Earth from the Sun, on average?",
    answer: 149600000,
    unit: "km",
    explain:
      "149.6 million km — one 'astronomical unit'. Sunlight needs 8.3 minutes to reach us.",
    category: "space",
  },
  {
    id: "iss-altitude",
    q: "At what altitude does the International Space Station orbit?",
    answer: 400,
    unit: "km",
    explain:
      "About 400 km up — roughly the distance of a Singapore–Kuala Lumpur drive, pointed straight up.",
    category: "space",
  },
  {
    id: "iss-speed",
    q: "How fast does the International Space Station travel?",
    answer: 27600,
    unit: "km/h",
    explain:
      "About 27,600 km/h — one full orbit of Earth every ~92 minutes; astronauts see 16 sunrises a day.",
    category: "space",
  },
  {
    id: "sun-surface",
    q: "How hot is the surface of the Sun?",
    answer: 5500,
    unit: "°C",
    explain: "About 5,500 °C — the core is ~15 million °C, nearly 3,000× hotter.",
    category: "space",
  },
  {
    id: "lightning-temp",
    q: "How hot is a lightning bolt's channel?",
    answer: 30000,
    unit: "°C",
    explain:
      "Around 30,000 °C — roughly five times hotter than the surface of the Sun, for a few microseconds.",
    category: "space",
  },
  {
    id: "sound-speed",
    q: "What is the speed of sound in air at room temperature?",
    answer: 343,
    unit: "m/s",
    explain:
      "343 m/s — about 1,235 km/h. Count seconds between lightning and thunder: 3 s ≈ 1 km away.",
    category: "space",
  },
  {
    id: "sunlight-time",
    q: "How many minutes does sunlight take to reach Earth?",
    answer: 8.3,
    unit: "minutes",
    explain:
      "8.3 minutes — if the Sun vanished right now, you'd have 8 blissful minutes of not knowing.",
    category: "space",
  },
  {
    id: "moon-orbit",
    q: "How many days does the Moon take to orbit Earth once?",
    answer: 27.3,
    unit: "days",
    explain:
      "27.3 days relative to the stars — the lunar cycle you see (full moon to full moon) is 29.5 days because Earth moves too.",
    category: "space",
  },
  {
    id: "voyager-distance",
    q: "How far from Earth is Voyager 1, the most distant human-made object (as of 2024)?",
    answer: 24000000000,
    unit: "km",
    explain:
      "About 24 billion km — over 160× the Earth–Sun distance. Its radio signal takes ~22.5 hours to arrive.",
    category: "space",
  },
  {
    id: "atmosphere-pressure",
    q: "What is standard atmospheric pressure at sea level, in pascals?",
    answer: 101325,
    unit: "Pa",
    explain:
      "101,325 Pa — about 1 kg pressing on every cm² of you, all the time. You just never notice.",
    category: "space",
  },

  /* ---------------- Earth & Geography ---------------- */
  {
    id: "everest-height",
    q: "How tall is Mount Everest?",
    answer: 8849,
    unit: "m",
    explain:
      "8,849 m (2020 survey) — commercial jets cruise only ~2 km above its summit.",
    category: "earth",
  },
  {
    id: "ocean-deepest",
    q: "How deep is the deepest point of the ocean (Challenger Deep)?",
    answer: 10920,
    unit: "m",
    explain:
      "About 10,920 m — drop Everest in and its peak would still be over 2 km underwater.",
    category: "earth",
  },
  {
    id: "earth-circumference",
    q: "What is Earth's circumference at the equator?",
    answer: 40075,
    unit: "km",
    explain:
      "40,075 km — the metre was originally defined so this would be 40,000 km. They were 0.2% off.",
    category: "earth",
  },
  {
    id: "nile-length",
    q: "How long is the Nile river?",
    answer: 6650,
    unit: "km",
    explain: "About 6,650 km — roughly Singapore to Tokyo and back.",
    category: "earth",
  },
  {
    id: "sahara-area",
    q: "What is the area of the Sahara desert?",
    answer: 9200000,
    unit: "km²",
    explain:
      "9.2 million km² — nearly the size of China, and it was green savanna just 6,000 years ago.",
    category: "earth",
  },
  {
    id: "pacific-area",
    q: "What is the area of the Pacific Ocean?",
    answer: 165000000,
    unit: "km²",
    explain:
      "About 165 million km² — bigger than every piece of land on Earth combined.",
    category: "earth",
  },
  {
    id: "freshwater-share",
    q: "What percentage of Earth's water is freshwater?",
    answer: 2.5,
    unit: "%",
    explain:
      "Only ~2.5% — and two-thirds of that is locked in ice. All rivers, lakes and groundwater share the rest.",
    category: "earth",
  },
  {
    id: "antarctica-freshwater",
    q: "What percentage of the world's freshwater is locked in the Antarctic ice sheet?",
    answer: 60,
    unit: "%",
    explain:
      "About 60% — if it all melted, sea level would rise roughly 58 metres.",
    category: "earth",
  },
  {
    id: "deepest-mine",
    q: "How deep is the deepest mine on Earth (Mponeng gold mine)?",
    answer: 4000,
    unit: "m",
    explain:
      "About 4 km down — rock-face temperatures hit 60 °C; ice slurry is pumped down to make work possible.",
    category: "earth",
  },
  {
    id: "kinabalu-height",
    q: "How tall is Mount Kinabalu in Malaysia?",
    answer: 4095,
    unit: "m",
    explain:
      "4,095 m — the highest peak between the Himalayas and New Guinea, and it's still rising ~5 mm a year.",
    category: "earth",
  },
  {
    id: "singapore-area",
    q: "What is Singapore's land area?",
    answer: 735,
    unit: "km²",
    explain:
      "About 735 km² — up ~25% from 580 km² in the 1960s through land reclamation.",
    category: "earth",
  },
  {
    id: "amazon-discharge",
    q: "How much water does the Amazon river discharge into the ocean per second?",
    answer: 209000,
    unit: "m³/s",
    explain:
      "About 209,000 m³ every second — more than the next seven largest rivers combined; ~80 Olympic pools per second.",
    category: "earth",
  },
  {
    id: "marathon-distance",
    q: "How long is a marathon?",
    answer: 42.195,
    unit: "km",
    explain:
      "42.195 km — the odd number was fixed in 1921, matching the 1908 London course stretched so it could start at Windsor Castle.",
    category: "earth",
  },

  /* ---------------- The Living World ---------------- */
  {
    id: "trees-earth",
    q: "How many trees are there on Earth?",
    answer: 3000000000000,
    unit: "trees",
    explain:
      "About 3 trillion (2015 Nature study) — 8× more than previously thought, but ~46% fewer than before human civilization.",
    category: "life",
  },
  {
    id: "cheetah-speed",
    q: "What is a cheetah's top speed?",
    answer: 110,
    unit: "km/h",
    explain:
      "Around 110 km/h in short bursts — 0 to 100 km/h in about 3 seconds, matching a sports car.",
    category: "life",
  },
  {
    id: "blue-whale-weight",
    q: "How much does an adult blue whale weigh?",
    answer: 150,
    unit: "tonnes",
    explain:
      "Around 150 tonnes (up to ~200) — the heaviest animal to ever exist, heavier than any known dinosaur.",
    category: "life",
  },
  {
    id: "whale-heart",
    q: "How much does a blue whale's heart weigh?",
    answer: 180,
    unit: "kg",
    explain:
      "About 180 kg — the size of a small piano, beating as slow as 2 times per minute on deep dives.",
    category: "life",
  },
  {
    id: "bee-honey",
    q: "How many grams of honey does one worker bee produce in its whole life?",
    answer: 0.4,
    unit: "g",
    explain:
      "About 0.4 g — a twelfth of a teaspoon. A 500 g jar is the life's work of over a thousand bees.",
    category: "life",
  },
  {
    id: "fruitfly-neurons",
    q: "How many neurons are in a fruit fly's brain?",
    answer: 140000,
    unit: "neurons",
    explain:
      "About 140,000 — fully mapped in 2024, the first complete adult brain wiring diagram ever produced.",
    category: "life",
  },
  {
    id: "olympic-pool",
    q: "How many litres of water fill an Olympic swimming pool?",
    answer: 2500000,
    unit: "litres",
    explain:
      "2.5 million litres (50 m × 25 m × 2 m) — a lifetime of drinking water for ~45 people.",
    category: "life",
  },
  {
    id: "ant-strength",
    q: "How many times its own body weight can a typical ant carry?",
    answer: 50,
    unit: "× body weight",
    explain:
      "Around 50× — small bodies have huge strength-to-weight ratios because muscle strength scales with area, weight with volume.",
    category: "life",
  },

  /* ---------------- The Human Body ---------------- */
  {
    id: "bones-adult",
    q: "How many bones does an adult human have?",
    answer: 206,
    unit: "bones",
    explain:
      "206 — babies start with ~300; many fuse as we grow. Over half are in the hands and feet.",
    category: "body",
  },
  {
    id: "brain-neurons",
    q: "How many neurons are in the human brain?",
    answer: 86000000000,
    unit: "neurons",
    explain:
      "About 86 billion — with roughly 100 trillion connections between them.",
    category: "body",
  },
  {
    id: "heartbeats-day",
    q: "How many times does your heart beat per day?",
    answer: 100000,
    unit: "beats",
    explain:
      "About 100,000 (70 bpm × 60 × 24) — pumping ~7,500 litres of blood daily.",
    category: "body",
  },
  {
    id: "blood-volume",
    q: "How many litres of blood does an adult have?",
    answer: 5,
    unit: "litres",
    explain:
      "About 5 litres — it completes a full loop of your body roughly every minute at rest.",
    category: "body",
  },
  {
    id: "human-cells",
    q: "How many cells make up a human body?",
    answer: 37000000000000,
    unit: "cells",
    explain:
      "Roughly 37 trillion — replaced at different speeds: gut lining in days, skeleton over ~10 years.",
    category: "body",
  },
  {
    id: "body-bacteria",
    q: "How many bacterial cells live in and on your body?",
    answer: 38000000000000,
    unit: "cells",
    explain:
      "About 38 trillion — slightly outnumbering your own cells. You are, by count, about half microbe.",
    category: "body",
  },
  {
    id: "dna-length",
    q: "If you stretched out the DNA in a single human cell, how long would it be?",
    answer: 2,
    unit: "m",
    explain:
      "About 2 m — packed into a nucleus 0.006 mm wide. All your cells' DNA end-to-end would span the solar system.",
    category: "body",
  },
  {
    id: "genome-basepairs",
    q: "How many base pairs (letters) are in the human genome?",
    answer: 3100000000,
    unit: "base pairs",
    explain:
      "About 3.1 billion — read aloud at one letter per second, it would take ~98 years.",
    category: "body",
  },
  {
    id: "breaths-day",
    q: "How many breaths do you take per day?",
    answer: 20000,
    unit: "breaths",
    explain:
      "About 20,000 — roughly 11,000 litres of air moved every day, almost all of it on autopilot.",
    category: "body",
  },
  {
    id: "hair-growth",
    q: "How many centimetres does scalp hair grow in a year?",
    answer: 15,
    unit: "cm",
    explain:
      "About 15 cm — 1.25 cm a month, or ~0.4 mm a day. Waist-length hair is a 6-year project.",
    category: "body",
  },
  {
    id: "skin-area",
    q: "What is the surface area of an adult's skin?",
    answer: 1.8,
    unit: "m²",
    explain:
      "About 1.8 m² — your largest organ, about the size of a single bed sheet, weighing ~4 kg.",
    category: "body",
  },
  {
    id: "sleep-share",
    q: "What percentage of your life do you spend asleep?",
    answer: 33,
    unit: "%",
    explain:
      "About 33% — by 75 you'll have slept ~25 years. Memory consolidation happens there, so it's not wasted.",
    category: "body",
  },

  /* ---------------- Technology ---------------- */
  {
    id: "wikipedia-articles",
    q: "How many articles does English Wikipedia have (as of 2024)?",
    answer: 6800000,
    unit: "articles",
    explain:
      "About 6.8 million — written and maintained almost entirely by unpaid volunteers.",
    category: "tech",
  },
  {
    id: "phone-transistors",
    q: "How many transistors are in a flagship smartphone chip (as of 2024)?",
    answer: 19000000000,
    unit: "transistors",
    explain:
      "About 19 billion (Apple A17 Pro) — more switches than there are people on Earth, in your pocket, ×2.",
    category: "tech",
  },
  {
    id: "google-searches",
    q: "How many Google searches happen per day (estimated, mid-2020s)?",
    answer: 8500000000,
    unit: "searches",
    explain:
      "About 8.5 billion — roughly one per human per day, ~99,000 every second.",
    category: "tech",
  },
  {
    id: "emails-day",
    q: "How many emails are sent per day worldwide (estimated, mid-2020s)?",
    answer: 350000000000,
    unit: "emails",
    explain:
      "About 350 billion — over 40 per person per day; the majority is automated or spam.",
    category: "tech",
  },
  {
    id: "first-harddrive",
    q: "How many megabytes did the first hard drive (IBM, 1956) store?",
    answer: 3.75,
    unit: "MB",
    explain:
      "3.75 MB — it weighed almost a tonne and was moved by forklift. One phone photo wouldn't fit.",
    category: "tech",
  },
  {
    id: "apollo-ram",
    q: "How many kilobytes of RAM did the Apollo 11 guidance computer have?",
    answer: 4,
    unit: "KB",
    explain:
      "About 4 KB — a modern phone has ~2 million times more, and it flew people to the Moon.",
    category: "tech",
  },
  {
    id: "undersea-share",
    q: "What percentage of intercontinental internet traffic travels through undersea cables?",
    answer: 99,
    unit: "%",
    explain:
      "About 99% — not satellites. Roughly 1.4 million km of cable, laid by a fleet of ~60 ships.",
    category: "tech",
  },
  {
    id: "mp3-size",
    q: "How many megabytes is a typical 4-minute song as a standard MP3?",
    answer: 4,
    unit: "MB",
    explain:
      "About 4 MB at 128 kbps — the compression discards sounds your ear mostly can't perceive anyway.",
    category: "tech",
  },

  /* ---------------- Civilization ---------------- */
  {
    id: "world-population",
    q: "What is the world's population (as of 2024)?",
    answer: 8100000000,
    unit: "people",
    explain:
      "About 8.1 billion — it was 2.5 billion in 1950. Growth is now slowing; the peak is projected near 10 billion.",
    category: "civilization",
  },
  {
    id: "singapore-population",
    q: "What is Singapore's population (as of 2024)?",
    answer: 5900000,
    unit: "people",
    explain:
      "About 5.9 million — on 735 km², one of the highest population densities of any country.",
    category: "civilization",
  },
  {
    id: "malaysia-population",
    q: "What is Malaysia's population (as of 2024)?",
    answer: 34000000,
    unit: "people",
    explain: "About 34 million — having roughly doubled since 1990.",
    category: "civilization",
  },
  {
    id: "great-wall",
    q: "How long is the Great Wall of China (all sections, official survey)?",
    answer: 21196,
    unit: "km",
    explain:
      "21,196 km including all branches (2012 survey) — over half Earth's circumference. The famous Ming wall alone is ~8,850 km.",
    category: "civilization",
  },
  {
    id: "titanic-people",
    q: "How many people were aboard the Titanic?",
    answer: 2224,
    unit: "people",
    explain:
      "About 2,224 — lifeboat capacity was 1,178, and even those left partly empty. Regulations changed forever after.",
    category: "civilization",
  },
  {
    id: "loc-books",
    q: "How many catalogued books does the US Library of Congress hold?",
    answer: 25000000,
    unit: "books",
    explain:
      "About 25 million books (of 170+ million total items) — reading one a day would take 68,000 years.",
    category: "civilization",
  },
  {
    id: "pyramid-height",
    q: "How tall was the Great Pyramid of Giza when built?",
    answer: 147,
    unit: "m",
    explain:
      "About 147 m — the world's tallest structure for over 3,800 years, until a 14th-century cathedral spire.",
    category: "civilization",
  },
  {
    id: "colosseum-capacity",
    q: "How many spectators could the Roman Colosseum hold?",
    answer: 50000,
    unit: "people",
    explain:
      "About 50,000 (estimates up to 80,000) — with numbered gates and tickets; crowd exit took ~15 minutes, rivaling modern stadiums.",
    category: "civilization",
  },
  {
    id: "adult-vocabulary",
    q: "How many words does a typical adult native English speaker know?",
    answer: 42000,
    unit: "words",
    explain:
      "About 42,000 lemmas by age 20 (2016 study) — learned at an average rate of ~6 new words a day since birth.",
    category: "civilization",
  },
  {
    id: "seconds-year",
    q: "How many seconds are in a year?",
    answer: 31536000,
    unit: "seconds",
    explain:
      "31.5 million — 'a billion seconds' is ~31.7 years. Millionaires and billionaires differ the same way.",
    category: "civilization",
  },
  {
    id: "eiffel-height",
    q: "How tall is the Eiffel Tower?",
    answer: 330,
    unit: "m",
    explain:
      "330 m with antennas — it grows ~15 cm taller on hot summer days as the iron expands.",
    category: "civilization",
  },
  {
    id: "burj-height",
    q: "How tall is the Burj Khalifa?",
    answer: 828,
    unit: "m",
    explain:
      "828 m — you can watch sunset at the base, take the lift up, and watch the same sunset again.",
    category: "civilization",
  },
  {
    id: "petronas-height",
    q: "How tall are the Petronas Towers in Kuala Lumpur?",
    answer: 452,
    unit: "m",
    explain:
      "452 m — the world's tallest buildings from 1998 to 2004, still the tallest twin towers ever built.",
    category: "civilization",
  },
  {
    id: "boeing-speed",
    q: "What is the typical cruising speed of a Boeing 747?",
    answer: 900,
    unit: "km/h",
    explain:
      "About 900 km/h (Mach 0.85) — jets have barely gotten faster in 60 years; they've gotten radically more efficient instead.",
    category: "civilization",
  },
  {
    id: "cruise-altitude",
    q: "At what altitude do commercial jets typically cruise?",
    answer: 10700,
    unit: "m",
    explain:
      "About 10,700 m (35,000 ft) — above most weather, where thin air cuts fuel burn dramatically.",
    category: "civilization",
  },
  {
    id: "paper-thickness",
    q: "How thick is a sheet of standard printer paper, in millimetres?",
    answer: 0.1,
    unit: "mm",
    explain:
      "About 0.1 mm — fold it 42 times (if you could) and the stack would reach the Moon. Doubling is violent.",
    category: "civilization",
  },
];

export const CALIBRATION_BY_ID: Map<string, CalibrationQuestion> = new Map(
  CALIBRATION_QUESTIONS.map((q) => [q.id, q]),
);
