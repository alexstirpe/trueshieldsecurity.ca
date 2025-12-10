// Puppeteer-based visual test runner
// Usage: (after npm install) `node tools/visual-test.js`
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUT_DIR = path.resolve(__dirname, '..', 'visual-snapshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { url: 'http://localhost:8000/index.html', name: 'index' },
  { url: 'http://localhost:8000/about.html', name: 'about' },
  { url: 'http://localhost:8000/contact.html', name: 'contact' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  for (const p of PAGES) {
    const page = await browser.newPage();
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      console.log(`Capturing ${p.name} @ ${vp.name}`);
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const out = path.join(OUT_DIR, `${p.name}-${vp.name}.png`);
      await page.screenshot({ path: out, fullPage: true });
    }
    await page.close();
  }
  await browser.close();
  console.log('Screenshots saved to', OUT_DIR);
})();
