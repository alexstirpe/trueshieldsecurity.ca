const { test, devices } = require('@playwright/test');
const { injectAxe, checkA11y } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const pages = ['/', '/index.html', '/home.html', '/contact.html', '/services.html'];

const viewports = [
  { name: 'iPhone 12 - portrait', device: 'iPhone 12', orientation: 'portrait' },
  { name: 'iPhone 12 - landscape', device: 'iPhone 12', orientation: 'landscape' },
  { name: 'Pixel 5 - portrait', device: 'Pixel 5', orientation: 'portrait' },
  { name: 'Pixel 5 - landscape', device: 'Pixel 5', orientation: 'landscape' },
  { name: 'Tablet - landscape', viewport: { width: 1024, height: 768 } },
  { name: 'Desktop 1280x800', viewport: { width: 1280, height: 800 } }
];

function safeName(s) {
  return String(s).replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
}

test.describe('Responsive + Accessibility checks', () => {
  for (const pagePath of pages) {
    for (const vp of viewports) {
      const testName = `${pagePath} - ${vp.name}`;
      test(testName, async ({ browser }) => {
        const outDir = path.join('test-results', pagePath === '/' ? 'root' : safeName(pagePath));
        fs.mkdirSync(outDir, { recursive: true });

        let context;
        if (vp.device && devices[vp.device]) {
          context = await browser.newContext(devices[vp.device]);
          if (vp.orientation === 'landscape') {
            const v = context.viewportSize || devices[vp.device].viewport;
            await context.setViewportSize({ width: v.height, height: v.width });
          }
        } else {
          context = await browser.newContext({ viewport: vp.viewport });
        }

        const page = await context.newPage();
        await page.goto(`http://localhost:8080${pagePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const fileBase = safeName(vp.name);
        await page.screenshot({ path: path.join(outDir, `${fileBase}.png`), fullPage: true });

        // Accessibility
        await injectAxe(page);
        try {
          const results = await checkA11y(page, undefined, { detailedReport: true });
          try { fs.writeFileSync(path.join(outDir, `${fileBase}_a11y.json`), JSON.stringify(results || {}, null, 2)); } catch(e){}
        } catch (e) {
          // write error to file for debugging
          try { fs.writeFileSync(path.join(outDir, `${fileBase}_a11y_error.txt`), String(e)); } catch(e){}
        }

        await context.close();
      });
    }
  }
});
