/**
 * Playwright configuration for responsive + accessibility checks
 */
const { devices } = require('@playwright/test');

module.exports = {
  timeout: 120000,
  testDir: 'tests',
  outputDir: 'test-results/playwright',
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
};
