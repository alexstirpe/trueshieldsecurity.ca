const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'test-results');

function findFiles(dir, pattern = /_a11y\.json$/i) {
  const out = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...findFiles(p, pattern));
    else if (pattern.test(item.name)) out.push(p);
  }
  return out;
}

function summarize() {
  const files = findFiles(resultsDir);
  const summary = { totalReports: files.length, violations: {} };

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const j = JSON.parse(raw);
      const v = j.violations || [];
      for (const viol of v) {
        const id = viol.id || 'unknown';
        if (!summary.violations[id]) summary.violations[id] = { count: 0, examples: {} };
        summary.violations[id].count += 1;
        // collect a few example targets
        for (const node of viol.nodes || []) {
          const targets = (node.target || []).slice(0,2).join(' | ');
          if (!targets) continue;
          summary.violations[id].examples[targets] = (summary.violations[id].examples[targets] || 0) + 1;
        }
      }
    } catch (e) {
      // ignore malformed files
      console.error('Failed to parse', file, e.message);
    }
  }

  // convert examples to arrays sorted by freq
  for (const id of Object.keys(summary.violations)) {
    const ex = summary.violations[id].examples;
    const arr = Object.keys(ex).map(k => ({ selector: k, count: ex[k] }));
    arr.sort((a,b)=>b.count-a.count);
    summary.violations[id].examples = arr.slice(0,10);
  }

  const outPath = path.join(resultsDir, 'a11y-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log('Wrote summary to', outPath);
  console.log('Top violations:');
  const sorted = Object.keys(summary.violations).map(id=>({id,count:summary.violations[id].count})).sort((a,b)=>b.count-a.count);
  for (const s of sorted.slice(0,20)) console.log(s.id, s.count);
}

summarize();
