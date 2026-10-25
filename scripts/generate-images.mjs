/**
 * Makes the site's photographs with MiniMax (image-01) into src/assets/photos/<name>.jpg
 * (src/lib/photos.ts imports them).
 *
 *   node scripts/generate-images.mjs                every image not made yet
 *   node scripts/generate-images.mjs hero install   only these, again
 *   node scripts/generate-images.mjs --takes=3 hero three of each (hero.1.jpg…) to choose from
 *
 * Needs MINIMAX_API_KEY; the one in .env.local wins over one set in the shell. Pictures of no real place or person: nothing on the site says they are
 * an Orina installation. Swap in real partner photographs as they come.
 */
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseEnv } from 'node:util';

const OUT = join(import.meta.dirname, '..', 'src', 'assets', 'photos');
const STYLE =
  'Premium commercial photograph for a solar energy brand campaign, shot on location in India on a full-frame camera ' +
  'with a 35mm lens, soft natural light, clean and well-kept surroundings, true-to-life colours, gentle contrast, real ' +
  'textures. Authentic and believable, like a real photo shoot: not CGI, not a 3D render, not illustrated, no plastic ' +
  'skin, no text, no logos, no watermark.';

/** name → [width, height, what it shows]. Faces stay small or turned away: they give AI away first. */
const IMAGES = {
  hero: [
    2048,
    880,
    'Elevated view from a terrace over a well-kept Indian residential neighbourhood at golden hour, soft warm light. ' +
      'In the foreground a clean modern flat rooftop with two long rows of new black monocrystalline solar panels, every ' +
      'panel showing its cell grid and silver aluminium frame, tilted on a galvanised steel structure. Beyond it, tidy two- ' +
      'and three-storey houses with more rooftop solar arrays and green trees. A clear, pale warm sky fills the top third.',
  ],
  home: [
    1600,
    1200,
    'A well-kept modern Indian home terrace at golden hour: a neat row of new black solar panels on a steel frame, potted ' +
      'plants, a swing chair. A father and his young daughter, seen from behind, stand by the parapet looking at the sunset ' +
      'over the neighbourhood.',
  ],
  society: [
    1600,
    1200,
    'Drone view of the flat roof of a modern Indian housing society tower: a large neat array of new black solar panels in ' +
      'long rows between lift rooms and water tanks, other residential towers and greenery around, clear late-afternoon light.',
  ],
  business: [
    1600,
    1200,
    'Low drone view of a clean modern factory shed in an Indian industrial park: its large metal roof completely covered with ' +
      'long rows of black solar panels, clearly visible, a loading bay and a parked truck below, bright clear day.',
  ],
  survey: [
    1600,
    1200,
    'A solar technician in a light blue work shirt, seen from the side, kneeling on a weathered flat concrete roof and ' +
      'stretching a yellow measuring tape, a tablet and a clipboard beside him, water tank and parapet behind, morning light.',
  ],
  quote: [
    1600,
    1200,
    'Over-the-shoulder view at a home dining table in India: two people reading a printed two-page solar quotation, a pen, ' +
      'two cups of tea and a phone on the table, warm window light. Hands and papers in focus, faces out of frame.',
  ],
  install: [
    1600,
    1200,
    'Two installers in helmets and safety harnesses, mid-distance, lifting a black solar panel onto a galvanised steel ' +
      'mounting frame on a flat roof in India, spanners and cable bundles on the roof, bright clear day.',
  ],
  meter: [
    1600,
    1200,
    'Close-up of a technician’s gloved hands fitting a new digital bidirectional net meter on a clean wall board beside a new ' +
      'MCB box, neat cables in white conduit, an Indian home’s entrance, soft daylight.',
  ],
  inverter: [
    1536,
    1024,
    'A new white wall-mounted solar inverter with a small display, neatly installed with grey conduit and a DC isolator below ' +
      'it on a clean painted wall of an Indian home’s utility area, daylight from a window, a phone on a shelf showing an energy graph.',
  ],
  panel: [
    1536,
    1024,
    'Close detail of new black monocrystalline solar panels on a rooftop, fine cell lines and silver frame edges, warm ' +
      'low sun glinting across the glass, blue sky reflected, shallow depth of field.',
  ],
  partner: [
    2048,
    1152,
    'A bright, modern small office of an Indian solar installation company: the owner and two staff around a desk with ' +
      'a laptop showing a customer list, seen from the side and behind, a solar panel sample and a boxed inverter by the wall, ' +
      'large window with daylight, plants.',
  ],
  team: [
    1600,
    1200,
    'A young solar company salesman in a neat shirt, seen from behind and the side, standing by his scooter on a clean ' +
      'Indian residential street, checking his phone; houses with rooftop solar panels above, warm morning light.',
  ],
};

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const RATE_LIMITED = 1002;

async function make(name, [width, height, scene], takes = 1, tries = 4) {
  const res = await fetch('https://api.minimax.io/v1/image_generation', {
    method: 'POST',
    headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'image-01',
      prompt: `${scene} ${STYLE}`,
      width,
      height,
      n: takes,
      response_format: 'base64',
      prompt_optimizer: false,
    }),
  });
  const body = await res.json();
  const images = body?.data?.image_base64 ?? [];
  if (!images.length && body?.base_resp?.status_code === RATE_LIMITED && tries > 1) {
    await pause(20_000);
    return make(name, [width, height, scene], takes, tries - 1);
  }
  if (!images.length) throw new Error(`${name}: ${JSON.stringify(body?.base_resp ?? body).slice(0, 200)}`);
  // one take is the image; several are name.1.jpg, name.2.jpg… to choose from
  for (const [i, b64] of images.entries()) {
    const file = takes > 1 ? `${name}.${i + 1}.jpg` : `${name}.jpg`;
    await writeFile(join(OUT, file), Buffer.from(b64, 'base64'));
    console.log(`made ${file}`);
  }
}

const ENV_FILE = join(import.meta.dirname, '..', '.env.local');
const KEY =
  (existsSync(ENV_FILE) && parseEnv(readFileSync(ENV_FILE, 'utf8')).MINIMAX_API_KEY) ||
  process.env.MINIMAX_API_KEY;
if (!KEY) throw new Error('Set MINIMAX_API_KEY (in .env.local)');
await mkdir(OUT, { recursive: true });
const args = process.argv.slice(2);
const takes = Number(args.find((a) => a.startsWith('--takes='))?.slice(8) ?? 1);
const asked = args.filter((a) => !a.startsWith('--'));
const names = asked.length ? asked : Object.keys(IMAGES).filter((n) => !existsSync(join(OUT, `${n}.jpg`)));
for (const name of names) {
  if (!IMAGES[name]) throw new Error(`No image called ${name}`);
  await make(name, IMAGES[name], takes).catch((e) => console.error(e.message));
  await pause(4000);
}
