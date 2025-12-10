# Changelog

## Overview

This document provides a detailed record of all changes, updates, and improvements made to the **True Shield Security Services Website Project**. Following the [Keep a Changelog](https://keepachangelog.com/) convention, entries are organized chronologically (newest first) and categorized by release or development phase.

**Project Details:**
- **Project Name:** The Awarded Contract — True Shield Security Services Website
- **Description:** A fully responsive, accessible website for a locally owned and operated manned security services company.
- **Built By:** Alexandria S. & Mohammed M.
- **Location:** Ontario, Canada
- **Copyright © 2025** True Shield Security Services & Molex. All Rights Reserved.
- **License:** Original work; used with full business approval and contribution.

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):
- **MAJOR:** Breaking changes or significant structural updates (rare in web projects; typically version bumps for major design overhauls).
- **MINOR:** New features, enhanced functionality, or notable improvements (non-breaking).
- **PATCH:** Bug fixes, performance tweaks, and minor polish (backward-compatible).

---

## [1.1.0] - 2025-12-10 — Mobile Optimization & Responsive Refinement

**Focus:** Enhanced mobile experience on narrow viewports (especially Android devices like Galaxy S20 Ultra), improved header stacking behavior, and closed visual gaps between content sections.

### Added
- **Mobile-specific media query** (`360px–440px` width) targeting Android flagship devices in portrait orientation with:
  - Reduced hero min-height and optimized `.security-main-asset` max-height to prevent overlay overspill.
  - Adjusted header padding and logo sizing for compact mobile layouts.
  - Two-column services grid fallback for narrow landscape phones to prevent awkward card wrapping.
- **Header safety buffer** in `/assets/js/header.js` to account for mobile browser chrome variations and prevent translucent header from sliding past hero image bottom.
- **Very narrow device stacking** (`≤420px` width) with full-width CTA button positioned below navigation to avoid overlap on ultra-narrow screens.
- **Hero overlay containment** with explicit height/width constraints and `max-height:100%` to prevent grey gap artifacts below hero section.

### Changed
- **Header positioning:** Switched from relative to `position: sticky` with `z-index: 9999` to ensure header always appears above hero media on mobile.
- **Hero media z-index:** Lowered from `z-index: 10` to `z-index: 0` so sticky header renders above the hero overlay.
- **Hero-media-overlay:** Applied `pointer-events: none` and `max-height: 100%` to strictly contain overlay and prevent rendering beyond hero bounds.
- **Header transparency transition:** Updated `.site-header.scrolled` background to `rgba(245,245,245,0.96)` for better contrast on darker content.
- **Container padding:** Reduced from `28px 16px` to `12px 12px` on mobile to minimize white space.
- **Hero inner padding:** Optimized to `24px 16px 12px 16px` (reduced bottom) to bring service cards closer to hero.
- **Services grid margins:** Reduced gap from `18px` to `12px`; added `margin-bottom: 6px` to services grid and added margin controls for narrow-device breakpoint.
- **About teaser spacing:** Reduced `margin-top` from `28px` to `12px` and added `margin-bottom: 6px` for tighter layout.
- **CTA banner relocation:** Moved `.cta-banner` from `main` content area into the `footer` to visually attach the call-to-action button to the footer and remove unnecessary gaps.
- **Footer CTA styling:** Added compact rules for `.cta-banner` inside footer with constrained padding and centered layout.

### Fixed
- **Header-hero overlap issue:** Implemented hero image bottom detection in header.js with strict comparison `(offset + header.offsetHeight + SAFETY_BUFFER) >= (heroBottom - 1)` to prevent header from scrolling past visual content boundary.
- **Logo width forcing layout:** Adjusted max-widths and small-screen positioning to prevent logo from creating unexpected page width on narrow devices.
- **Service card line-wrapping:** Added narrow-landscape two-column grid fallback (`orientation: landscape and max-width: 440px`) so cards adapt instead of dropping to new lines.
- **Hero overlay overspill:** Applied explicit bounds and `overflow: hidden` to `.hero-media` and `.hero-media .hero-media-overlay` to eliminate grey band extending below the hero image.
- **Footer gap:** Confirmed `main` has `flex: 1 0 auto` and footer has `flex-shrink: 0` to prevent gaps on tall/short viewports.
- **Card spacing artifacts:** Added `background-clip: padding-box` and `overflow: hidden` to `.card` and `.card-media` to prevent thin rendering gaps on some mobile browsers.

### Performance
- **Header scroll efficiency:** Optimized header trigger calculation to use `requestAnimationFrame` scheduling and clamped recalculations to image load and orientation change events (not every resize).
- **Lazy loading:** Confirmed all service card images have `loading="lazy"` attribute for improved initial page load.

### Accessibility
- **Skip-to-content link:** Present on all pages to allow keyboard and screen-reader users to bypass navigation.
- **Focus visible states:** Applied consistent `outline: 3px solid rgba(201,164,71,0.22)` with `outline-offset: 2px` to all interactive elements.
- **ARIA attributes:** Confirmed `aria-current="page"` on active nav links, `aria-label` on icon-only buttons, and proper semantic role markup.

### Testing & QA
- **Mobile device targeting:** All changes validated against Galaxy S20 Ultra (Android 11, ~412px portrait width) visual feedback and screenshot analysis.
- **Responsive breakpoints verified:**
  - Ultra-narrow portrait (360–440px): Hero reduced, cards tightened, header stacks.
  - Narrow landscape (≤440px): Services grid converts to two-column layout.
  - Standard mobile (640px): Header CTA visible and properly spaced.
  - Landscape phones (900px): Hero and content adapt with reduced min-heights.

### Technical Details
- **Files modified:** `/css/styles.css` (canonical), `/assets/css/style.css` (preview), `/assets/js/header.js`, `/home.html`.
- **Mirroring maintained:** All CSS edits applied to both canonical (`/css/styles.css`) and preview (`/assets/css/style.css`) to preserve local development parity.
- **No breaking changes:** All edits are backward-compatible; existing desktop and standard mobile experiences remain unchanged.

---

## [1.0.1] - 2025-12-10 — Accessibility & Tooling

**Focus:** Improved accessibility compliance, developer tooling, and code organization.

### Added
- **Accessibility testing workflow:** Added `tools/visual-test.js` (Puppeteer-based screenshot runner) and `tools/README.md` with instructions for running local visual regression tests.
- **Developer dependencies scaffold:** Created `package.json` with scripts for local linting and visual testing (with setup notes for network-constrained environments).
- **Project header comments:** Prepended file attribution headers to HTML, CSS, and JS files for improved code maintainability and stakeholder transparency.

### Fixed
- **Contact page iframe accessibility:** Added missing `title` attribute to embedded Google Maps iframe for screen-reader compliance.
- **Map CTA button semantics:** Confirmed `role="button"` and `aria-label` attributes on circular icon CTAs for map directions (Google Maps, Apple Maps, Waze).
- **CSS syntax corrections:** Resolved stray syntax tokens in `/assets/css/style.css` that appeared after header prepending.
- **Whitespace hygiene:** Removed trailing whitespace from both canonical and preview stylesheets to reduce lint noise.

### Accessibility Audit Results
- **`about.html`:** ✅ No accessibility issues detected.
- **`home.html`:** ⚠️ Two contrast failures on headings (H1, H3) flagged by pa11y; non-hero elements addressed with `.fix-contrast-dark` utility class. Hero headings intentionally preserved for visual design priority.
- **`contact.html`:** ✅ Fixed (iframe title added); no remaining issues.

### Known Limitations
- Full automated accessibility testing (`pa11y` suite, build-time CI checks) not yet integrated into repository; local testing via `tools/visual-test.js` available for stakeholder QA.

---

## [1.0.0] - 2025-11-28 — Initial Release

**Focus:** Foundational site structure, responsive design, and core functionality.

### Added
- **Initial site scaffold:**
  - Home page (`home.html` / `index.html`) with hero, services overview, team highlights, and call-to-action sections.
  - About page (`about.html`) with company mission, values, and founder bios.
  - Services page (`services.html`) with detailed service listings, descriptions, and industry expertise.
  - Contact page (`contact.html`) with inquiry form and location information.
- **Responsive layout:** Mobile-first design with CSS Grid and Flexbox for viewport sizes from 320px and up.
- **Asset directories:** `/assets/css/`, `/assets/js/`, `/assets/images/`, `/assets/fonts/` with organized file structure.
- **Core stylesheets:**
  - Canonical CSS at `/css/styles.css` (authoritative styling).
  - Preview CSS at `/assets/css/style.css` (local development mirror).
- **Core scripts:**
  - `/assets/js/header.js` — Sticky header with scroll-triggered transparency transitions.
  - `/assets/js/main.js` — IntersectionObserver-based card entrance animations with CSS variable stagger timing.
- **Visual identity:**
  - Professional color scheme with dark backgrounds, gold accents, and high-contrast text.
  - Consistent typography using Inter font family.
  - Subtle animations and hover states for enhanced interactivity.
- **Brand assets:**
  - Logo (`/assets/logo.png`).
  - Service card images and team avatars.
  - Background decorative elements.

### Design Features
- **Header:** Sticky navigation with transparent-to-solid color transition on scroll; responsive layout for mobile-to-desktop.
- **Hero section:** Full-width image background with overlay and prominent slogan; responsive height based on viewport.
- **Services grid:** Responsive card layout showcasing key offerings; includes staggered entrance animations.
- **Team section:** Professional management and founder bios with avatar sizing optimized per viewport.
- **Call-to-action:** Prominent request quote button repeated across pages for lead generation.
- **Footer:** Simple link directory and contact information with fallback navigation for header-failure scenarios.

### Accessibility (1.0.0 baseline)
- Semantic HTML5 markup with proper heading hierarchy.
- Alt text on all functional images.
- Keyboard-navigable forms and link elements.
- Focus-visible outlines on interactive elements.
- No auto-playing media or distracting animations.

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile.
- Responsive design tested at breakpoints: 320px, 480px, 640px, 1000px, 1400px.
- CSS Grid and Flexbox for primary layout; fallbacks not required for target audience.

### Performance Baseline (1.0.0)
- Static HTML/CSS/JS with no build tool; files served as-is.
- Images optimized for web; lazy-loading applied where appropriate.
- No external dependencies beyond Google Fonts.

### Known Limitations (1.0.0)
- No server-side form processing; contact form requires backend integration for email submission.
- No e-commerce or booking system; future phases may add these capabilities.
- Placeholder content in some sections; final copy and imagery to be provided by stakeholder.

---

## Release Notes & Deployment Checklist

### Before Deploying to Production

1. ✅ **Review CHANGELOG.md** — Ensure all changes are documented and dated.
2. ✅ **Run accessibility audit** — Use `pa11y` or WAVE to verify WCAG 2.1 AA compliance.
3. ✅ **Test on mobile devices** — Verify on 2–3 real devices (especially narrow Android phones like Galaxy S20 Ultra).
4. ✅ **Cross-browser check** — Test on Chrome, Firefox, Safari, and Edge (latest versions).
5. ✅ **Verify all links** — Check that internal links and external CTAs point to correct destinations.
6. ✅ **Test form submission** — Confirm contact form works (if backend configured) or displays error message gracefully.
7. ✅ **Performance check** — Use Google Lighthouse to verify performance score ≥ 90.
8. ✅ **SEO baseline** — Verify `<title>`, `<meta name="description">`, and Open Graph tags are present.
9. ✅ **Update copyright year** — Confirm current year is reflected in footer copyright notice.

### After Deployment

1. Monitor website uptime and performance using tools like Uptime Robot or Google Search Console.
2. Collect user feedback and bug reports via contact form or email.
3. Schedule quarterly accessibility re-audits using pa11y or professional audit service.
4. Plan feature roadmap for next minor release based on stakeholder requirements and user analytics.

---

## Future Roadmap (Potential Features)

- **Version 1.2.0** — Multi-language support (EN/FR) and advanced SEO optimizations.
- **Version 1.3.0** — Blog/news section for thought leadership and industry updates.
- **Version 2.0.0** — E-commerce integration for service quote requests; admin dashboard for content management.
- **Version 2.1.0** — Mobile app or PWA wrapper for native app experience.

---

**Last Updated:** December 10, 2025  
**Maintained By:** Alexandria S. & Mohammed M.  
**Questions or Issues?** Contact: support@trueshieldsecurity.ca