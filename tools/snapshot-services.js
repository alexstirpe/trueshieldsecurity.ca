const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

(async () => {
  const outBase = path.resolve(__dirname, '..', 'test-results', 'services.html');
  fs.mkdirSync(outBase, { recursive: true });

  const viewports = [
    { name: 'desktop_1366x768', width: 1366, height: 768 },
    { name: 'tablet_768x1024', width: 768, height: 1024 },
    { name: 'iphone_12_portrait', width: 390, height: 844 },
    { name: 'pixel_5_portrait', width: 393, height: 852 }
  ];

  const browser = await chromium.launch();
  // Two modes: 'css-only' (no DOM change) and 'bg-image' (convert <img> to background-image)
  const modes = [
    { name: 'css-only', transform: null },
    { name: 'bg-image', transform: async (page) => {
      // Convert each .card-media img into a background-image on its parent .card-media
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.services-grid > .card'));
        for (const card of cards) {
          const media = card.querySelector('.card-media');
          if (!media) continue;
          const img = media.querySelector('img');
          if (!img) continue;
          const src = img.getAttribute('src') || img.currentSrc || img.src;
          if (!src) continue;
          // apply background styles to the media container
          media.style.backgroundImage = `url(${src})`;
          media.style.backgroundSize = 'cover';
          media.style.backgroundPosition = 'center top';
          media.style.backgroundRepeat = 'no-repeat';
          // ensure the media container uses a reasonable height so the bg displays
          media.style.minHeight = media.offsetHeight ? media.offsetHeight + 'px' : '180px';
          img.style.display = 'none';
        }
      });
    } }
  ];

  for (const mode of modes) {
    const outDir = path.join(outBase, mode.name);
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const url = `http://127.0.0.1:8080/services.html`;
      console.log('Opening', url, 'at', vp.name, 'mode:', mode.name);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForSelector('.services-grid');

      // apply transform when needed
      if (mode.transform) {
        await mode.transform(page);
        // give browser a tick to reflow
        await page.waitForTimeout(120);
      }

      const cards = await page.$$('.services-grid > .card');
      console.log('Found', cards.length, 'cards');

      let i = 1;
      const viewport = page.viewportSize() || { width: vp.width, height: vp.height };
      for (const card of cards) {
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        if (!box || box.width < 2 || box.height < 2) {
          console.warn('Card', i, 'has invalid bounding box, skipping');
          i++;
          continue;
        }

        // clamp to viewport to avoid out-of-bounds clip errors
        const x = Math.max(0, Math.floor(box.x));
        const y = Math.max(0, Math.floor(box.y));
        const w = Math.min(Math.ceil(box.width), viewport.width - x);
        const h = Math.min(Math.ceil(box.height), viewport.height - y);
        if (w <= 0 || h <= 0) {
          console.warn('Card', i, 'clipped to zero size, skipping');
          i++;
          continue;
        }

        const file = path.join(outDir, `card-${i}-${vp.name}.png`);
        await page.screenshot({ path: file, clip: { x, y, width: w, height: h } });
        console.log('Saved', file);
        i++;
      }
      await context.close();
    }
  }

  await browser.close();
  console.log('Done. Screenshots in', outBase);
})();
