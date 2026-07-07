/**
 * Generates the PWA icons (PNG) and favicon (SVG) without any image
 * library: a deep-dark rounded tile with ambient blue/violet glows and a
 * "WK" monogram inked in a blue→violet gradient with a soft luminous halo
 * and a spark accent — encoded as PNG by hand via zlib.
 *
 * Run: npx tsx scripts/generate-icons.ts
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(import.meta.dirname, "../public/icons");

/* ---------- PNG encoding ---------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBytes, Buffer.from(data)]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size: number, rgba: Uint8Array): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba
      .subarray(y * size * 4, (y + 1) * size * 4)
      .forEach((v, i) => (raw[y * (size * 4 + 1) + 1 + i] = v));
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", new Uint8Array(0)),
  ]);
}

/* ---------- Drawing ---------- */

type Seg = [number, number, number, number]; // x1,y1,x2,y2 in 0..1

const MONOGRAM: Seg[] = [
  // W
  [0.175, 0.26, 0.25, 0.55],
  [0.25, 0.55, 0.318, 0.33],
  [0.318, 0.33, 0.386, 0.55],
  [0.386, 0.55, 0.46, 0.26],
  // K
  [0.565, 0.26, 0.565, 0.55],
  [0.565, 0.425, 0.76, 0.26],
  [0.628, 0.38, 0.775, 0.55],
];
const STROKE = 0.048;
const GLOW_R = 0.085;

// Open book beneath the monogram — the learning motif. Pages drawn as
// shallow polyline "wings" meeting at a short spine.
const BOOK: Seg[] = [
  // spine
  [0.5, 0.7, 0.5, 0.815],
  // left page
  [0.5, 0.7, 0.19, 0.64],
  [0.19, 0.64, 0.19, 0.755],
  [0.19, 0.755, 0.5, 0.815],
  // right page (mirror)
  [0.5, 0.7, 0.81, 0.64],
  [0.81, 0.64, 0.81, 0.755],
  [0.81, 0.755, 0.5, 0.815],
];
const BOOK_STROKE = 0.032;
const BOOK_GLOW = 0.06;

// Spark above the K — a thin four-point star.
const SPARK: Seg[] = [
  [0.79, 0.115, 0.79, 0.215],
  [0.74, 0.165, 0.84, 0.165],
];
const SPARK_STROKE = 0.02;
const SPARK_GLOW = 0.06;

// Gradient ink: blue (left) → violet (right)
const INK_A = [88, 148, 255];
const INK_B = [168, 133, 255];
const SPARK_INK = [234, 241, 255];

// Ambient glows on the dark tile
const BG = [12, 14, 20];
const GLOW_BLUE = { cx: 0.2, cy: 0.08, r: 0.85, color: [63, 116, 235], peak: 0.2 };
const GLOW_VIOLET = { cx: 0.92, cy: 0.96, r: 0.9, color: [122, 92, 245], peak: 0.18 };

function distToSeg(px: number, py: number, [x1, y1, x2, y2]: Seg): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  const t =
    lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/** Ink coverage (0..1 core) + halo strength (0..1) for a stroke set. */
function inkAt(
  nx: number,
  ny: number,
  segs: Seg[],
  stroke: number,
  glowR: number,
  aa: number,
): { core: number; halo: number } {
  let minD = Infinity;
  for (const seg of segs) {
    const d = distToSeg(nx, ny, seg);
    if (d < minD) minD = d;
  }
  const half = stroke / 2;
  let core = 0;
  if (minD < half) core = 1;
  else if (minD < half + aa) core = 1 - (minD - half) / aa;
  let halo = 0;
  if (minD < half + glowR) {
    const t = 1 - Math.max(0, minD - half) / glowR;
    halo = t * t;
  }
  return { core, halo };
}

function renderIcon(size: number, opaqueSquare: boolean): Uint8Array {
  const rgba = new Uint8Array(size * size * 4);
  const radius = opaqueSquare ? 0 : size * 0.22;
  const aa = 1.2 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const nx = x / size;
      const ny = y / size;

      // Rounded-rect coverage
      let alpha = 255;
      if (radius > 0) {
        const cx = Math.max(radius - x, x - (size - 1 - radius), 0);
        const cy = Math.max(radius - y, y - (size - 1 - radius), 0);
        const d = Math.hypot(cx, cy);
        if (d > radius) {
          alpha = d - radius > 1.5 ? 0 : Math.round(255 * (1 - (d - radius) / 1.5));
        }
      }

      // Dark base + ambient radial glows
      let r = BG[0];
      let g = BG[1];
      let b = BG[2];
      for (const gl of [GLOW_BLUE, GLOW_VIOLET]) {
        const d = Math.hypot(nx - gl.cx, ny - gl.cy);
        const f = Math.max(0, 1 - d / gl.r);
        const s = f * f * gl.peak;
        r += gl.color[0] * s;
        g += gl.color[1] * s;
        b += gl.color[2] * s;
      }

      // Monogram: gradient ink + luminous halo
      const mono = inkAt(nx, ny, MONOGRAM, STROKE, GLOW_R, aa);
      if (mono.halo > 0) {
        const t = Math.max(0, Math.min(1, (nx - 0.14) / 0.68));
        const ir = INK_A[0] + (INK_B[0] - INK_A[0]) * t;
        const ig = INK_A[1] + (INK_B[1] - INK_A[1]) * t;
        const ib = INK_A[2] + (INK_B[2] - INK_A[2]) * t;
        // halo adds light; core paints the ink brightened toward white
        const haloS = mono.halo * 0.4 * (1 - mono.core);
        r += ir * haloS;
        g += ig * haloS;
        b += ib * haloS;
        if (mono.core > 0) {
          const cr = ir + (255 - ir) * 0.25;
          const cg = ig + (255 - ig) * 0.25;
          const cb = ib + (255 - ib) * 0.25;
          r = r * (1 - mono.core) + cr * mono.core;
          g = g * (1 - mono.core) + cg * mono.core;
          b = b * (1 - mono.core) + cb * mono.core;
        }
      }

      // Book: same gradient ink, slightly dimmer than the monogram
      const book = inkAt(nx, ny, BOOK, BOOK_STROKE, BOOK_GLOW, aa);
      if (book.halo > 0) {
        const t = Math.max(0, Math.min(1, (nx - 0.14) / 0.68));
        const ir = INK_A[0] + (INK_B[0] - INK_A[0]) * t;
        const ig = INK_A[1] + (INK_B[1] - INK_A[1]) * t;
        const ib = INK_A[2] + (INK_B[2] - INK_A[2]) * t;
        const haloS = book.halo * 0.3 * (1 - book.core);
        r += ir * haloS;
        g += ig * haloS;
        b += ib * haloS;
        if (book.core > 0) {
          const dim = 0.88;
          const cr = (ir + (255 - ir) * 0.14) * dim;
          const cg = (ig + (255 - ig) * 0.14) * dim;
          const cb = (ib + (255 - ib) * 0.14) * dim;
          r = r * (1 - book.core) + cr * book.core;
          g = g * (1 - book.core) + cg * book.core;
          b = b * (1 - book.core) + cb * book.core;
        }
      }

      // Spark: bright white-blue with a strong small halo
      const spark = inkAt(nx, ny, SPARK, SPARK_STROKE, SPARK_GLOW, aa);
      if (spark.halo > 0) {
        const haloS = spark.halo * 0.55 * (1 - spark.core);
        r += SPARK_INK[0] * haloS * 0.55;
        g += SPARK_INK[1] * haloS * 0.55;
        b += SPARK_INK[2] * haloS * 0.55;
        if (spark.core > 0) {
          r = r * (1 - spark.core) + SPARK_INK[0] * spark.core;
          g = g * (1 - spark.core) + SPARK_INK[1] * spark.core;
          b = b * (1 - spark.core) + SPARK_INK[2] * spark.core;
        }
      }

      rgba[i] = Math.min(255, Math.round(r));
      rgba[i + 1] = Math.min(255, Math.round(g));
      rgba[i + 2] = Math.min(255, Math.round(b));
      rgba[i + 3] = alpha;
    }
  }
  return rgba;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, size, square] of [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["apple-touch-icon.png", 180, true], // iOS applies its own corner mask
] as const) {
  writeFileSync(resolve(OUT_DIR, name), encodePng(size, renderIcon(size, square)));
  console.log(`wrote icons/${name}`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="ga" cx="20%" cy="8%" r="85%">
      <stop offset="0" stop-color="#3f74eb" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#3f74eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gb" cx="92%" cy="96%" r="90%">
      <stop offset="0" stop-color="#7a5cf5" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#7a5cf5" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6ea6ff"/>
      <stop offset="1" stop-color="#bda2ff"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.6" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100" height="100" rx="22" fill="#0c0e14"/>
  <rect width="100" height="100" rx="22" fill="url(#ga)"/>
  <rect width="100" height="100" rx="22" fill="url(#gb)"/>
  <g stroke="url(#ink)" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow)">
    <path d="M17.5 26 25 55 31.8 33 38.6 55 46 26"/>
    <path d="M56.5 26 V55 M56.5 42.5 76 26 M62.8 38 77.5 55"/>
  </g>
  <g stroke="url(#ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85" filter="url(#glow)">
    <path d="M50 70 19 64 V75.5 L50 81.5 81 75.5 V64 L50 70 V81.5"/>
  </g>
  <g stroke="#eaf1ff" stroke-width="2" stroke-linecap="round" filter="url(#glow)">
    <path d="M79 11.5v10M74 16.5h10"/>
  </g>
</svg>
`;
writeFileSync(resolve(OUT_DIR, "icon.svg"), svg);
console.log("wrote icons/icon.svg");
