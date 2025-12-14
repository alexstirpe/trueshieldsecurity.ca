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
        // determine whether this violation entry actually represents a failure
        // (axe sometimes includes informational nodes; for page-has-heading-one we
        // only want to count cases where the html element is targeted or the
        // failureSummary indicates a missing level-one heading)
        let isFailure = false;
        const examples = {};
        for (const node of viol.nodes || []) {
          const targets = (node.target || []).slice(0,2).join(' | ');
          // mark failure when the html root is the target or the failureSummary
          // explicitly states the page must have a level-one heading.
          if (/^html$/i.test(targets) || (node.failureSummary && /must have a level-one heading/i.test(node.failureSummary))) {
            isFailure = true;
          }
          if (targets) examples[targets] = (examples[targets] || 0) + 1;
        }
  if (!isFailure) continue;
  if (!summary.violations[id]) summary.violations[id] = { count: 0, examples: {} };
  summary.violations[id].count += 1;
        // merge examples
        for (const k of Object.keys(examples)) {
          summary.violations[id].examples[k] = (summary.violations[id].examples[k] || 0) + examples[k];
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
