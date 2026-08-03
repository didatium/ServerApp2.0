const { query } = require('../src/db/pool');

async function runDryRun() {
  console.log('DRY RUN: Migrate SoDauBai candidates from Vipham (only read, no writes)');

  // Select rows where name_student looks like a JSON array (starts with '[' after optional whitespace)
  const rows = await query("SELECT vpm_id, week_id, class_id, quantity, name_student, create_by, create_at FROM Vipham WHERE name_student IS NOT NULL AND TRIM(name_student) LIKE '[%';");

  const candidates = [];
  const parseFailures = [];

  for (const r of rows) {
    const raw = (r.name_student || '').trim();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      parseFailures.push({ vpm_id: r.vpm_id, week_id: r.week_id, class_id: r.class_id, error: err.message, snippet: raw.slice(0,200) });
      continue;
    }

    // ensure parsed is an array (periods data expected to be an array)
    if (!Array.isArray(parsed)) {
      parseFailures.push({ vpm_id: r.vpm_id, week_id: r.week_id, class_id: r.class_id, error: 'Parsed value is not an array', snippet: raw.slice(0,200) });
      continue;
    }

    candidates.push({ vpm_id: r.vpm_id, week_id: r.week_id, class_id: r.class_id, quantity: r.quantity, periods_data: parsed, create_by: r.create_by, create_at: r.create_at });
  }

  // total
  console.log('\nSummary');
  console.log('-------');
  console.log(`Total Vipham rows inspected with name_student LIKE '[%': ${rows.length}`);
  console.log(`Total recognized as SoDauBai candidates (valid JSON array): ${candidates.length}`);
  console.log(`Total parse failures or non-array values: ${parseFailures.length}`);

  // list candidates
  if (candidates.length > 0) {
    console.log('\nCandidates to be migrated (vpm_id, week_id, class_id, quantity):');
    for (const c of candidates) {
      console.log(`- vpm_id=${c.vpm_id}, week_id=${c.week_id}, class_id=${c.class_id}, quantity=${c.quantity}`);
    }
  } else {
    console.log('\nNo candidates found.');
  }

  // detect duplicates by week_id+class_id
  const dupMap = new Map();
  for (const c of candidates) {
    const key = `${c.week_id}||${c.class_id}`;
    if (!dupMap.has(key)) dupMap.set(key, []);
    dupMap.get(key).push(c.vpm_id);
  }

  const duplicates = [];
  for (const [key, arr] of dupMap.entries()) {
    if (arr.length > 1) {
      const [week_id, class_id] = key.split('||');
      duplicates.push({ week_id, class_id, vpm_ids: arr });
    }
  }

  if (duplicates.length > 0) {
    console.log('\nPotential UNIQUE constraint conflicts (week_id, class_id) with multiple Vipham rows:');
    for (const d of duplicates) {
      console.log(`- week_id=${d.week_id}, class_id=${d.class_id}, vpm_ids=[${d.vpm_ids.join(',')}]`);
    }
  } else {
    console.log('\nNo duplicate (week_id,class_id) conflicts detected among candidates.');
  }

  // parse failures
  if (parseFailures.length > 0) {
    console.log('\nParse failures / invalid JSON entries:');
    for (const f of parseFailures) {
      console.log(`- vpm_id=${f.vpm_id}, week_id=${f.week_id}, class_id=${f.class_id}, error=${f.error}, snippet=${f.snippet}`);
    }
  }

  console.log('\nDRY RUN complete. No changes were made to the database.');
}

runDryRun().catch(err => {
  console.error('DRY RUN failed:', err);
  process.exit(1);
});
