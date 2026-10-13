// Downloads realistic stock photos (Unsplash, free for commercial use) into
//   client/public/images/halls/<CITY>/<AREA>/<VENUE>/<basename>.jpg (+ .webp)
//   client/public/images/venues/<VENUE>/<basename>.jpg (+ .webp)
// and writes photo-credits.md listing every source + licence.
//
// Safe to re-run: files are overwritten, nothing is duplicated in data.json
// (hall image *paths* are generated in server/db.js from the hall's city/area/venue).
//
// Usage:  node scripts/download-images.js   (from the project root)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const HALLS_DIR = path.join(ROOT, 'client', 'public', 'images', 'halls');
const VENUES_DIR = path.join(ROOT, 'client', 'public', 'images', 'venues');

// ── Source pool (verified to resolve) ────────────────────────────────────
const POOL = {
  ballroom: [
    'photo-1519167758481-83f550bb49b3', // wedding ballroom, round tables
    'photo-1519225421980-715cb0215aed', // reception hall tables
    'photo-1464366400600-7168b8af9bc3', // wedding table setting
    'photo-1519741497674-611481863552', // wedding hall decor
    'photo-1517457373958-b7bdd4587205', // hall interior
    'photo-1523438885200-e635ba2c371e', // wedding ceremony venue
    'photo-1511578314322-379afb476865', // banquet round tables
  ],
  conference: [
    'photo-1540575467063-178a50c2df87', // conference theatre seating
    'photo-1568992687947-868a62a9f521', // conference audience
    'photo-1560472354-b33ff0c44a43', // presentation stage
    'photo-1542744173-8e7e53415bb0', // meeting room
    'photo-1531058020387-3be344556be6', // convention hall
    'photo-1470229722913-7c0e2dbbafd3', // stage lighting
    'photo-1505373877841-8d25f7d46678', // event stage
  ],
  banquet: [
    'photo-1511795409834-ef04bbd61622', // banquet tables
    'photo-1516450360452-9312f5e86fc7', // banquet hall
    'photo-1556125574-d7f27ec36a06', // banquet setup
    'photo-1530023367847-a683933f4172', // wedding banquet decor
    'photo-1492684223066-81342ee5ff30', // event decor
    'photo-1583939003579-730e3918a45a', // interior decor
  ],
  boardroom: [
    'photo-1497366216548-37526070297c', // boardroom
    'photo-1524758631624-e2822e304c36', // boardroom meeting
    'photo-1517502884422-41eaead166d4', // boardroom
    'photo-1588196749597-9ff075ee6b5b', // meeting room
    'photo-1497366811353-6870744d04b2', // office meeting
  ],
  garden: [
    'photo-1469371670807-013ccf25f16a', // garden wedding
    'photo-1478146896981-b80fe463b330', // lawn venue
  ],
  venueExterior: [
    'photo-1486406146926-c627a92ad1ab', // modern building
    'photo-1431540015161-0bf868a2d407', // glass building
    'photo-1449824913935-59a10b8d2000', // city building
  ],
  venueHero: [
    'photo-1542314831-068cd1dbfeeb', // hotel lobby
    'photo-1566073771259-6a8506099945', // hotel exterior
  ],
};

// hall type -> image pool
const TYPE_POOL = {
  AC: ['ballroom', 'conference', 'banquet'],
  NON_AC: ['banquet', 'garden', 'ballroom'],
  BOARD_ROOM: ['boardroom'],
};

// ── Halls (mirrors server/db.js) ─────────────────────────────────────────
const HALLS = [
  // [cityId, areaId, venueId, hallId, type, imageCount]
  ['HYD', 'HC', 'VG1', 'VH1', 'AC', 4], ['HYD', 'HC', 'VG1', 'VH2', 'AC', 4],
  ['HYD', 'HC', 'VG1', 'VH3', 'NON_AC', 4], ['HYD', 'HC', 'VG1', 'VH4', 'BOARD_ROOM', 3],
  ['HYD', 'GC', 'VG2', 'VH5', 'AC', 3], ['HYD', 'GC', 'VG2', 'VH6', 'AC', 3], ['HYD', 'GC', 'VG2', 'VH7', 'NON_AC', 3],
  ['HYD', 'BH', 'VG3', 'VH8', 'AC', 4], ['HYD', 'BH', 'VG3', 'VH9', 'AC', 3], ['HYD', 'BH', 'VG3', 'VH10', 'BOARD_ROOM', 2],
  ['HYD', 'SS', 'VG4', 'VH11', 'AC', 3], ['HYD', 'SS', 'VG4', 'VH12', 'AC', 3], ['HYD', 'SS', 'VG4', 'VH13', 'BOARD_ROOM', 2],
  ['HYD', 'KP', 'VG5', 'VH14', 'AC', 4], ['HYD', 'KP', 'VG5', 'VH15', 'NON_AC', 3],
  ['AMR', 'TU', 'VG6', 'VH16', 'AC', 3], ['AMR', 'TU', 'VG6', 'VH17', 'AC', 3], ['AMR', 'TU', 'VG6', 'VH18', 'NON_AC', 3],
  ['AMR', 'TL', 'VG7', 'VH19', 'AC', 3], ['AMR', 'TL', 'VG7', 'VH20', 'NON_AC', 3],
  ['AMR', 'MG', 'VG8', 'VH21', 'AC', 4], ['AMR', 'MG', 'VG8', 'VH22', 'NON_AC', 3],
  ['VJA', 'BC', 'VG9', 'VH23', 'AC', 4], ['VJA', 'BC', 'VG9', 'VH24', 'AC', 3], ['VJA', 'BC', 'VG9', 'VH25', 'BOARD_ROOM', 2],
  ['VJA', 'MG', 'VG10', 'VH26', 'AC', 3], ['VJA', 'MG', 'VG10', 'VH27', 'AC', 3], ['VJA', 'MG', 'VG10', 'VH28', 'BOARD_ROOM', 2],
  ['VJA', 'GN', 'VG11', 'VH29', 'AC', 4], ['VJA', 'GN', 'VG11', 'VH30', 'NON_AC', 3],
  ['VJA', 'PA', 'VG12', 'VH31', 'AC', 4], ['VJA', 'PA', 'VG12', 'VH32', 'NON_AC', 3],
];

const HALL_NAMES = {
  VH1: 'Grand Ballroom', VH2: 'Conference Hall', VH3: 'Banquet Hall', VH4: 'Board Room',
  VH5: 'Grand Hall', VH6: 'Meeting Room', VH7: 'Lawn Garden',
  VH8: 'Banjara Ballroom', VH9: 'Conference Suite', VH10: 'Board Room',
  VH11: 'Grand Hall', VH12: 'Meeting Room', VH13: 'Board Room',
  VH14: 'Orchid Hall', VH15: 'Snowflake Hall',
  VH16: 'Central Hall', VH17: 'Conference Hall', VH18: 'Garden Hall',
  VH19: 'Crown Hall', VH20: 'Banquet Hall',
  VH21: 'Gardens Hall', VH22: 'Mangalagiri Hall',
  VH23: 'Imperial Hall', VH24: 'Conference Hall', VH25: 'Board Room',
  VH26: 'Heritage Hall', VH27: 'Conference Room', VH28: 'Board Room',
  VH29: 'Skyline Hall', VH30: 'Gannavaram Hall',
  VH31: 'Meridian Hall', VH32: 'Patamata Hall',
};

// Slugs for file names (match hall image basenames in db.js)
const SLUGS = {
  VH1: 'hitech-grand-ballroom', VH2: 'hitech-conf-hall', VH3: 'hitech-banquet', VH4: 'hitech-boardroom',
  VH5: 'gachibowli-grand', VH6: 'gachibowli-meeting', VH7: 'gachibowli-lawn',
  VH8: 'banjara-ballroom', VH9: 'banjara-conf', VH10: 'banjara-boardroom',
  VH11: 'secunderabad-grand', VH12: 'secunderabad-meeting', VH13: 'secunderabad-boardroom',
  VH14: 'kukatpally-orchid', VH15: 'kukatpally-snowflake',
  VH16: 'amaravathi-central', VH17: 'amaravathi-conf', VH18: 'amaravathi-garden',
  VH19: 'tadepalli-crown', VH20: 'tadepalli-banquet',
  VH21: 'mangalagiri-gardens', VH22: 'mangalagiri-hall',
  VH23: 'benzcircle-imperial', VH24: 'benzcircle-conf', VH25: 'benzcircle-boardroom',
  VH26: 'mgroad-heritage', VH27: 'mgroad-conf', VH28: 'mgroad-boardroom',
  VH29: 'gannavaram-skyline', VH30: 'gannavaram-hall',
  VH31: 'patamata-meridian', VH32: 'patamata-hall',
};

const VENUES = [
  ['HYD', 'HC', 'VG1', 'frcc-grand-hitech'],
  ['HYD', 'GC', 'VG2', 'frcc-gachibowli-palace'],
  ['HYD', 'BH', 'VG3', 'frcc-banjara-royale'],
  ['HYD', 'SS', 'VG4', 'frcc-secunderabad-pavilion'],
  ['HYD', 'KP', 'VG5', 'frcc-kukatpally-orchid'],
  ['AMR', 'TU', 'VG6', 'frcc-amaravathi-central'],
  ['AMR', 'TL', 'VG7', 'frcc-tadepalli-crown'],
  ['AMR', 'MG', 'VG8', 'frcc-mangalagiri-gardens'],
  ['VJA', 'BC', 'VG9', 'frcc-benz-circle-imperial'],
  ['VJA', 'MG', 'VG10', 'frcc-mg-road-heritage'],
  ['VJA', 'GN', 'VG11', 'frcc-gannavaram-skyline'],
  ['VJA', 'PA', 'VG12', 'frcc-patamata-meridian'],
];

const CREDITS = []; // { file, url, author, licence }
let downloaded = 0;

async function fetchBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

async function save(photoId, outFileBase, opts = {}) {
  // 16:9 for cards
  const { w = 1200, h = 675, cropVariant = 0 } = opts;
  const query = `auto=format&fit=crop&w=${w}&h=${h}&q=80${cropVariant ? `&crop=${cropVariant}` : ''}`;
  const jpgUrl = `https://images.unsplash.com/${photoId}?${query}&fm=jpg`;
  const webpUrl = `https://images.unsplash.com/${photoId}?${query}&fm=webp`;
  fs.mkdirSync(path.dirname(outFileBase), { recursive: true });
  const jpg = await fetchBuf(jpgUrl);
  const webp = await fetchBuf(webpUrl);
  fs.writeFileSync(`${outFileBase}.jpg`, jpg);
  fs.writeFileSync(`${outFileBase}.webp`, webp);
  downloaded += 2;
  CREDITS.push({
    file: path.relative(ROOT, `${outFileBase}.jpg`).replace(/\\/g, '/'),
    source: `https://unsplash.com/photos/${photoId.replace('photo-', '')}`,
    licence: 'Unsplash License (free for commercial use, no attribution required)',
  });
}

async function main() {
  console.log('Downloading hall photos…');
  for (const [city, area, venue, hallId, type, count] of HALLS) {
    const poolKeys = TYPE_POOL[type];
    const flat = poolKeys.flatMap(k => POOL[k]);
    const slug = SLUGS[hallId];
    const dir = path.join(HALLS_DIR, city, area, venue);
    for (let i = 0; i < count; i++) {
      const photoId = flat[(flat.length * 0 + i + HALLS.indexOf(HALLS.find(h => h[3] === hallId))) % flat.length];
      // actually pick offset by hall index for variety across halls
      const hallIdx = HALLS.findIndex(h => h[3] === hallId);
      const pick = flat[(i + hallIdx * 3) % flat.length];
      await save(pick, path.join(dir, `${slug}-${i + 1}`));
    }
    process.stdout.write(`  ${slug}: ${count} photos\n`);
  }

  console.log('Downloading venue hero/exterior photos…');
  for (const [city, area, venue, vendSlug] of VENUES) {
    const dir = path.join(VENUES_DIR, venue);
    const vi = VENUES.findIndex(v => v[2] === venue);
    await save(POOL.venueHero[vi % POOL.venueHero.length], path.join(dir, `${vendSlug}-hero`));
    await save(POOL.venueExterior[vi % POOL.venueExterior.length], path.join(dir, `${vendSlug}-exterior`));
    process.stdout.write(`  ${vendSlug}: hero + exterior\n`);
  }

  // Write photo credits
  const lines = [
    '# Photo Credits',
    '',
    'All photos are from **[Unsplash](https://unsplash.com)** — the Unsplash License grants free',
    'commercial and non-commercial use without attribution (attribution appreciated).',
    'Each image is served locally as `.webp` (primary) with a `.jpg` fallback. 16:9 crops are used on',
    'cards; detail views crop the same assets to 4:3.',
    '',
    '| File | Source | Licence |',
    '| --- | --- | --- |',
    ...CREDITS.map(c => `| ${c.file} | ${c.source} | ${c.licence} |`),
    '',
  ];
  fs.writeFileSync(path.join(ROOT, 'photo-credits.md'), lines.join('\n'));
  console.log(`Done. ${downloaded} files written, ${CREDITS.length} unique image slots (photo-credits.md updated).`);
}

main().catch(e => { console.error('FAILED:', e); process.exit(1); });
