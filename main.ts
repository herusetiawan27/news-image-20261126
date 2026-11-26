// main.ts — news-image-20261126 entry
//
// What this does, in plain terms:
//   1. Reads the entry image "entry.png" from MAKEFUN_BOT_DIR
//      (default /bot).
//   2. Checks it really is a PNG: within the 1 MiB entry limit,
//      starts with the PNG magic bytes, and has a readable IHDR
//      chunk — width, height and CRC-32 verified (parsed by hand —
//      no image library).
//   3. Copies it byte-for-byte to MAKEFUN_OUTPUT_DIR/entry.png
//      (default /output).
//   4. Reads the copy back and compares every byte with the source.
//   5. Prints a short report.
//
// Any problem aborts with exit code 1 and a clear error message.
//
// makefun anchor 34c69a5e83711893dcac3cdb4bc586977c2fd8ef round 34286902

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The eight magic bytes every PNG file starts with:
// 89 50 4E 47 0D 0A 1A 0A  (".PNG" plus line-ending/control bytes).
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// The competition caps the entry image at 1 MiB; a larger file would
// be rejected at judging, so fail here instead of shipping it.
const MAX_ENTRY_BYTES = 1_048_576;

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_NAME = "entry.png";

/** Print an error and stop with a non-zero exit code. */
function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// CRC-32 (IEEE) lookup table, built once at startup: each entry is
// the remainder of one byte value under polynomial 0xEDB88320.
const CRC32_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table.push(c >>> 0);
  }
  return table;
})();

/** CRC-32 (IEEE) of the given bytes, as an unsigned 32-bit integer. */
function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const sourcePath = join(BOT_DIR, ENTRY_NAME);
const outputPath = join(OUTPUT_DIR, ENTRY_NAME);

// --- 1. Read the source image -------------------------------------------
if (!existsSync(sourcePath)) {
  fail(`entry image not found: ${sourcePath}`);
}

let source: Buffer;
try {
  source = readFileSync(sourcePath);
} catch (err) {
  fail(`could not read entry image ${sourcePath}: ${(err as Error).message}`);
}

if (source.length === 0) {
  fail(`entry image is empty: ${sourcePath}`);
}
if (source.length > MAX_ENTRY_BYTES) {
  fail(`entry image is too large: ${source.length} bytes exceeds the 1 MiB limit: ${sourcePath}`);
}

// --- 2. Validate it is a PNG and read its dimensions ---------------------
// A PNG begins with the 8-byte signature, then its first chunk, IHDR:
//   bytes  8..11  chunk data length (must be 13 for IHDR)
//   bytes 12..15  chunk type, the ASCII letters "IHDR"
//   bytes 16..19  image width, big-endian
//   bytes 20..23  image height, big-endian
if (source.length < 8 || !source.subarray(0, 8).equals(PNG_SIGNATURE)) {
  fail(`entry image is not a PNG (bad magic bytes): ${sourcePath}`);
}
if (source.length < 24) {
  fail(`entry image is too short to hold a PNG header: ${sourcePath}`);
}
if (source.readUInt32BE(8) !== 13 || source.toString("ascii", 12, 16) !== "IHDR") {
  fail(`entry image has no valid IHDR chunk: ${sourcePath}`);
}
const width = source.readUInt32BE(16);
const height = source.readUInt32BE(20);
if (width === 0 || height === 0) {
  fail(`entry image has invalid dimensions ${width}x${height}: ${sourcePath}`);
}
// The IHDR chunk ends with a CRC-32 over its type and data (bytes
// 12..28); the stored CRC sits right after them, at bytes 29..32.
// A mismatch means those header bytes were altered or corrupted.
if (source.length < 33) {
  fail(`entry image is too short to hold a complete IHDR chunk: ${sourcePath}`);
}
if (crc32(source.subarray(12, 29)) !== source.readUInt32BE(29)) {
  fail(`entry image has a corrupt IHDR chunk (CRC mismatch): ${sourcePath}`);
}

// --- 3. Copy it byte-identically to the output directory ------------------
try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (err) {
  fail(`could not create output directory ${OUTPUT_DIR}: ${(err as Error).message}`);
}
try {
  writeFileSync(outputPath, source);
} catch (err) {
  fail(`could not write output image ${outputPath}: ${(err as Error).message}`);
}

// --- 4. Read the copy back and compare every byte -------------------------
let copied: Buffer;
try {
  copied = readFileSync(outputPath);
} catch (err) {
  fail(`could not read back output image ${outputPath}: ${(err as Error).message}`);
}
if (!copied.equals(source)) {
  fail(`copy mismatch: ${outputPath} differs from ${sourcePath}`);
}

// --- 5. Report --------------------------------------------------------------
console.log(`source: ${sourcePath}`);
console.log(`size: ${source.length} bytes`);
console.log(`dimensions: ${width}x${height}`);
console.log(`output: ${outputPath}`);
console.log("byte-identical: yes");
