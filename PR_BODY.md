Title: Accessibility: semantic headings, landmark fixes, and contrast utility cleanup

Summary:
- Added missing top-level <h1> to `about.html` and normalized heading levels across key pages (`home.html`, `services.html`) to resolve heading-order and page-has-heading-one violations.
- Marked aside region as `role="complementary"` on contact-related markup; added aria-label to an empty button used for layout to provide accessible name.
- Removed the weak contrast utility `.fix-contrast-dark` from `css/styles.css` and `assets/css/style.css` and retained a stronger `.fix-contrast-dark-strong` helper to prevent accidental low-contrast usage.
- Stabilized hero overlay for short landscape viewports.
- Playwright + axe responsive tests added earlier in this branch produced 30 passing runs locally and wrote a11y JSON artifacts to `test-results/`.

Recent updates in this PR:
- Tests: `tests/responsive.spec.js` now waits for a visible `h1` before injecting axe to avoid timing-related false positives.
- Parser: `scripts/parse-a11y.js` was tightened to only count true missing-H1 failures (avoids counting informational nodes).
- Markup: `home.html` hero HTML adjusted so the site H1 is not inside an aria-hidden container and is visible to AT.

Files changed (high level):
- about.html — added page-level H1 and adjusted semantics
- home.html — fixed malformed markup and promoted card headings to H2
- services.html — promoted card headings to H2
- css/styles.css — removed weak contrast utility, kept strong utility
- assets/css/style.css — same cleanup as above
- tests/responsive.spec.js, scripts/parse-a11y.js, playwright.config.js — test infra (already present in branch)

How to review:
1. Run a local static server: `npm run serve` (or `npx http-server -p 8080 ./`).
2. Run the responsive/a11y script: `npm run test:responsive` which starts the server, launches Playwright tests, and writes results to `test-results/`.
3. Inspect `test-results/a11y-summary.json` or individual `*_a11y.json` files for remaining violations.

Notes & follow-ups:
- The parser still reports several `page-has-heading-one` occurrences originating from duplicate/empty staging pages in `true-shield-security-website/`. I recommend removing or synchronizing that folder with the canonical pages to avoid noisy a11y reports.
- Small contrast refinements may still be required site-wide; I removed the weak utility to prevent future misuse and applied targeted stronger fixes only where low-risk.
- CI will run Playwright tests on PR creation (workflow is included in branch); please allow the PR check to complete and review the Playwright artifacts in `test-results/`.

Validation performed:
- Playwright responsive matrix: 30 passed locally.
- Parser wrote `test-results/a11y-summary.json` summarizing violations after changes.

If you want, I can open the PR using the GitHub API/CLI — let me know if you want me to attempt that next, or paste the PR body into the GitHub UI using the link above: https://github.com/alexstirpe/trueshieldsecurity.ca/pull/new/accessibility/fixes
