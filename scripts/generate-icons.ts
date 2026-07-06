/**
 * Generates the PWA icons (PNG) and favicon (SVG) without any image
 * library: a rounded-square gradient tile with a "WK" monogram drawn from
 * line segments, encoded as PNG by hand via zlib.
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
  // filter byte 0 per scanline
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
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
  [0.17, 0.34, 0.25, 0.66],
  [0.25, 0.66, 0.325, 0.42],
  [0.325, 0.42, 0.4, 0.66],
  [0.4, 0.66, 0.48, 0.34],
  // K
  [0.585, 0.34, 0.585, 0.66],
  [0.585, 0.52, 0.8, 0.34],
  [0.655, 0.47, 0.82, 0.66],
];
const STROKE = 0.052;

function distToSeg(px: number, py: number, [x1, y1, x2, y2]: Seg): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function renderIcon(size: number, opaqueSquare: boolean): Uint8Array {
  const rgba = new Uint8Array(size * size * 4);
  const radius = opaqueSquare ? 0 : size * 0.22;
  // background gradient stops (deep navy -> blue)
  const top = [30, 41, 66];
  const bottom = [47, 111, 237];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // rounded-rect coverage
      let alpha = 255;
      if (radius > 0) {
        const cx = Math.max(radius - x, x - (size - 1 - radius), 0);
        const cy = Math.max(radius - y, y - (size - 1 - radius), 0);
        const d = Math.hypot(cx, cy);
        if (d > radius) {
          alpha = d - radius > 1.5 ? 0 : Math.round(255 * (1 - (d - radius) / 1.5));
        }
      }
      const t = y / size;
      let r = top[0] + (bottom[0] - top[0]) * t;
      let g = top[1] + (bottom[1] - top[1]) * t;
      let b = top[2] + (bottom[2] - top[2]) * t;

      // monogram (anti-aliased by distance)
      const nx = x / size;
      const ny = y / size;
      let ink = 0;
      for (const seg of MONOGRAM) {
        const d = distToSeg(nx, ny, seg);
        if (d < STROKE / 2) {
          ink = 1;
          break;
        }
        const edge = STROKE / 2 + 1.2 / size;
        if (d < edge) ink = Math.max(ink, 1 - (d - STROKE / 2) / (edge - STROKE / 2));
      }
      if (ink > 0) {
        r = r + (245 - r) * ink;
        g = g + (247 - g) * ink;
        b = b + (250 - b) * ink;
      }

      rgba[i] = Math.round(r);
      rgba[i + 1] = Math.round(g);
      rgba[i + 2] = Math.round(b);
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
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e2942"/>
      <stop offset="1" stop-color="#2f6fed"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#g)"/>
  <g stroke="#f5f7fa" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M17 34 25 66 32.5 42 40 66 48 34"/>
    <path d="M58.5 34 V66 M58.5 52 80 34 M65.5 47 82 66"/>
  </g>
</svg>
`;
writeFileSync(resolve(OUT_DIR, "icon.svg"), svg);
console.log("wrote icons/icon.svg");
