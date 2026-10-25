/**
 * India's states, districts and PIN codes for the site's forms, from India Post's All India
 * Pincode Directory (data.gov.in, GODL-India licence), the same file Orina Grid imports:
 *
 *   node scripts/build-geo.mjs [path/to/pincodes.csv]   (default ../OrinaBackend/data/pincodes.csv)
 *
 *   src/data/districts.json   { state: [district, …] }, sorted: the pickers (sent to the browser)
 *   src/data/pins.json        { pin: [district, state] }: PIN → place, read on the server only
 *
 * Names are tidied the way Grid tidies them ("SABARKANTHA" → "Sabarkantha"), so a district
 * picked here reads the same as the partner's district in Grid.
 */
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const ROOT = join(import.meta.dirname, '..');
const CSV = process.argv[2] ?? join(ROOT, '..', 'OrinaBackend', 'data', 'pincodes.csv');
const OUT = join(ROOT, 'src', 'data');

const SMALL = new Set(['and', 'of', 'the']);
/** "SABARKANTHA" → "Sabarkantha", "JAMMU AND KASHMIR" → "Jammu and Kashmir". */
const tidy = (s) =>
  s
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(
      /(^|[\s(\-./])([a-z]+)/g,
      (_m, before, word) =>
        before + (before === ' ' && SMALL.has(word) ? word : word[0].toUpperCase() + word.slice(1)),
    );
const missing = (v) => /^(na|n\/a)?$/i.test(v.trim());

/** One CSV line → fields (quoted fields may hold commas). */
function fields(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const lines = createInterface({ input: createReadStream(CSV, 'utf8'), crlfDelay: Infinity });
let col;
/** pin → "district|state" → offices */
const byPin = new Map();
for await (const line of lines) {
  const f = fields(line);
  if (!col) {
    col = Object.fromEntries(f.map((name, i) => [name.trim(), i]));
    continue;
  }
  const pin = f[col.pincode]?.trim();
  const district = f[col.district] ?? '';
  const state = f[col.statename] ?? '';
  if (!/^[1-9]\d{5}$/.test(pin ?? '') || missing(district) || missing(state)) continue;
  const place = `${tidy(district)}|${tidy(state).replace(/^The /, '')}`;
  const counts = byPin.get(pin) ?? new Map();
  counts.set(place, (counts.get(place) ?? 0) + 1);
  byPin.set(pin, counts);
}

const pins = {};
const districts = {};
for (const [pin, counts] of [...byPin].sort(([a], [b]) => a.localeCompare(b))) {
  // a PIN across two districts (rare): the one most of its offices are in
  const [place] = [...counts].sort((a, b) => b[1] - a[1])[0];
  const [district, state] = place.split('|');
  pins[pin] = [district, state];
  for (const [p] of counts) {
    const [d, s] = p.split('|');
    (districts[s] ??= new Set()).add(d);
  }
}
const sorted = Object.fromEntries(
  Object.keys(districts)
    .sort((a, b) => a.localeCompare(b))
    .map((s) => [s, [...districts[s]].sort((a, b) => a.localeCompare(b))]),
);

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'districts.json'), JSON.stringify(sorted));
await writeFile(join(OUT, 'pins.json'), JSON.stringify(pins));
const n = Object.values(sorted).reduce((a, d) => a + d.length, 0);
console.log(`${Object.keys(sorted).length} states, ${n} districts, ${Object.keys(pins).length} PIN codes`);
