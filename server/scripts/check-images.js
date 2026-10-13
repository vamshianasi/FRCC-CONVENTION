const fs = require('fs');
const path = require('path');

const { readDb } = require('../db');

const DB_PATH = path.join(__dirname, 'data.json');

function checkImages() {
  const db = readDb();
  const missing = [];
  const checked = [];

  // Check venue images
  for (const venue of db.venues) {
    const venueDir = path.join(__dirname, '..', '..', 'client', 'public', 'images', 'venues', venue.id);
    if (fs.existsSync(venueDir)) {
      const files = fs.readdirSync(venueDir);
      if (files.length === 0) {
        missing.push({ type: 'venue', id: venue.id, name: venue.name, reason: 'No image files found' });
      } else {
        checked.push({ type: 'venue', id: venue.id, name: venue.name, count: files.length });
      }
    } else {
      missing.push({ type: 'venue', id: venue.id, name: venue.name, reason: 'Directory not found' });
    }
  }

  // Check hall images
  for (const hall of db.halls) {
    const hallDir = path.join(__dirname, '..', '..', 'client', 'public', 'images', 'halls', hall.cityId, hall.areaId, hall.venueId);
    if (fs.existsSync(hallDir)) {
      const files = fs.readdirSync(hallDir);
      if (files.length === 0) {
        missing.push({ type: 'hall', id: hall.id, name: hall.name, venue: hall.venueName, reason: 'No image files found' });
      } else {
        checked.push({ type: 'hall', id: hall.id, name: hall.name, venue: hall.venueName, count: files.length });
      }
    } else {
      missing.push({ type: 'hall', id: hall.id, name: hall.name, venue: hall.venueName, reason: 'Directory not found' });
    }
  }

  console.log('\n=== IMAGE CHECK REPORT ===');
  console.log(`Total checked: ${checked.length}`);
  console.log(`Missing: ${missing.length}\n`);

  if (missing.length > 0) {
    console.log('MISSING IMAGES:');
    for (const m of missing) {
      console.log(`  - ${m.type.toUpperCase()} ${m.id} (${m.name}): ${m.reason}`);
    }
  }

  if (checked.length > 0) {
    console.log('\nFOUND IMAGES:');
    for (const c of checked) {
      console.log(`  - ${c.type.toUpperCase()} ${c.id} (${c.name}): ${c.count} files`);
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Venues with images: ${checked.filter(c => c.type === 'venue').length} / ${db.venues.length}`);
  console.log(`Halls with images: ${checked.filter(c => c.type === 'hall').length} / ${db.halls.length}`);

  if (missing.length > 0) {
    console.log('\n❌ Some images are missing');
    process.exit(1);
  } else {
    console.log('\n✅ All images present');
    process.exit(0);
  }
}

if (require.main === module) {
  checkImages();
}

module.exports = { checkImages };