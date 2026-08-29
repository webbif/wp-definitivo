# WP Definitivo 1.0.6 test matrix

## Automated baseline

| Layer | Checks |
| --- | --- |
| PHP | Syntax, WordPress Coding Standards, PHPCompatibility 7.4+, PHPUnit contrast checks |
| Front end | WordPress ESLint, WordPress Stylelint, `theme.json` structural validation, production build |
| WordPress | Theme Check in `wp-env`, `WP_DEBUG`, activation without plugins |
| Browser | Playwright keyboard interactions and axe scans in Chromium, Firefox, WebKit, Android Chrome, and iOS Safari profiles |
| Release | Required files, forbidden files, CSS/JS gzip budgets |

## Manual release-candidate matrix

- WordPress 6.6 on PHP 7.4 with no plugins.
- WordPress 7.0 and 7.1 on PHP 8.3.
- WooCommerce 10.9 and 11.0 on compatible WordPress versions.
- Current and previous Elementor releases on WordPress 6.8 or later.
- Gutenberg alone, Elementor alone, and each editor with WooCommerce.
- Theme Unit Test data and WooCommerce sample products.
- Chrome, Edge, Firefox, and Safari current and previous major releases.
- Android Chrome and iOS Safari at widths from 320px through 1440px.
- Browser zoom at 200% and 400%, text-only enlargement, reduced motion, and RTL.

## Accessibility-ready manual audit

- Keyboard-only traversal, skip link, visible focus, and no keyboard trap.
- Correct landmarks and heading order in every template.
- Underlined links in body content and controls with accessible names and states.
- Form labels, errors, required fields, comment cookie consent, and WooCommerce notices.
- AA color contrast in every scheme and hover/focus state.
- Reflow at 320 CSS pixels and 400% zoom.
- NVDA with Firefox and VoiceOver with Safari.

## Performance gates

- Lighthouse Performance at least 95 on the clean theme fixture.
- Lighthouse Accessibility 100 on the clean theme fixture.
- Cumulative Layout Shift below 0.1.
- Theme-owned CSS no more than 80 KB gzip.
- Theme-owned JavaScript no more than 15 KB gzip.

Record the date, exact versions, pass/fail result, tester, and issue link for every manual run before approval.
