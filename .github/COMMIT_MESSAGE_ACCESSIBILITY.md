Accessibility: Add main landmarks, improve hidden button accessibility, and contrast utilities

Changes:
- Wrapped primary page content with <main> landmarks on core pages to satisfy 'landmark-one-main' and 'region' a11y checks.
- Added aria-label and visually-hidden text to the hidden admin activation button to resolve 'button-name' violations.
- Introduced CSS utility classes `.fix-contrast-dark` and `.fix-contrast-dark-strong` to provide safe, high-contrast fallback styling for elements flagged by axe-core.

Rationale: Low-risk, non-visual semantic and accessible-label changes that increase screen reader discoverability and address multiple critical axe violations across devices.
