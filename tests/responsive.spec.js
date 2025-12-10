const { test, devices } = require('@playwright/test');
// Using axe-core directly for reliable injection across environments
const axe = require('axe-core');
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
          // Clone device descriptor and swap viewport for landscape to avoid runtime API differences
          const deviceDesc = Object.assign({}, devices[vp.device]);
          if (vp.orientation === 'landscape' && deviceDesc.viewport) {
            deviceDesc.viewport = { width: deviceDesc.viewport.height, height: deviceDesc.viewport.width };
            // swap isMobile flag if necessary (keep isMobile same)
          }
          context = await browser.newContext(deviceDesc);
        } else {
          context = await browser.newContext({ viewport: vp.viewport });
        }

        const page = await context.newPage();
        await page.goto(`http://localhost:8080${pagePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const fileBase = safeName(vp.name);
        await page.screenshot({ path: path.join(outDir, `${fileBase}.png`), fullPage: true });

        // Accessibility: inject axe-core and run axe.run inside the page context
        try {
          // add axe-core script to the page
          await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
          const results = await page.evaluate(async () => {
            // eslint-disable-next-line no-undef
            return await axe.run();
          });
          try { fs.writeFileSync(path.join(outDir, `${fileBase}_a11y.json`), JSON.stringify(results || {}, null, 2)); } catch (e) {}
        } catch (e) {
          try { fs.writeFileSync(path.join(outDir, `${fileBase}_a11y_error.txt`), String(e)); } catch (e) {}
        }

        await context.close();
      });
    }
  }
});
