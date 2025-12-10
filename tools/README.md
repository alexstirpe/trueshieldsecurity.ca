This folder contains scripts to perform local visual testing using Puppeteer.

Prerequisites
1. Node.js (>=16) and npm installed.
2. From the project root run:

```bash
npm install
```

Run visual tests
1. Start a local static server in the repo root, e.g.:

```bash
python3 -m http.server 8000
```

2. In another terminal, run:

```bash
node tools/visual-test.js
```

Screenshots will be written to `visual-snapshots/` as PNG files.

Notes
- Puppeteer downloads a Chromium binary; ensure you have network access when running `npm install`.
- If your environment blocks Puppeteer, you can open each page in a regular browser and take manual screenshots.
