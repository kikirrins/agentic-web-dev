// Shared helpers for the ops scripts: paths, dates, JSON files, CLI flags, seeded PRNG.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const OPS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DIRS = {
  data: path.join(OPS_DIR, "data"),
  reports: path.join(OPS_DIR, "reports"),
  proposals: path.join(OPS_DIR, "proposals"),
  logs: path.join(OPS_DIR, "logs"),
};

export const config = JSON.parse(await readFile(path.join(OPS_DIR, "config.json"), "utf8"));

/** CLI: `--flag` booleans plus positional args. */
export function parseArgs(argv = process.argv.slice(2)) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")).map((a) => a.slice(2)));
  const positional = argv.filter((a) => !a.startsWith("--"));
  return { flags, positional };
}

/** YYYY-MM-DD of a date in the store's timezone. */
export function localDate(date = new Date(), tz = config.timezone) {
  return new Date(date).toLocaleDateString("en-CA", { timeZone: tz });
}

/** Add n days to a YYYY-MM-DD string. */
export function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const DAY_MS = 24 * 60 * 60 * 1000;

export async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2) + "\n");
  return file;
}

export async function writeText(file, text) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
  return file;
}

/** Most recent `<prefix>YYYY-MM-DD.json` in a folder (or the one for `date`). */
export async function findLatest(dir, prefix, date) {
  if (date) return path.join(dir, `${prefix}${date}.json`);
  const re = new RegExp(`^${prefix}(\\d{4}-\\d{2}-\\d{2})\\.json$`);
  const files = (await readdir(dir).catch(() => [])).filter((f) => re.test(f)).sort();
  if (!files.length) throw new Error(`No hay archivos ${prefix}*.json en ${path.relative(process.cwd(), dir)}`);
  return path.join(dir, files.at(-1));
}

export const round2 = (n) => Math.round(n * 100) / 100;

export function money(n, currency = config.currency) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n);
}

/** Deterministic PRNG (mulberry32) so mock data is reproducible. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
  };
}

/** Numeric seed from a string (e.g. the date) so each day is different but reproducible. */
export function hashSeed(...parts) {
  let h = 2166136261;
  for (const ch of parts.join("|")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
