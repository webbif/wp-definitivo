# WP Definitivo 1.0.65 release checklist

- Canonical source: `C:\Users\leand\Documents\Codex\2026-08-25\e\work\wp-definitivo-project`.
- `C:\Users\leand\Documents\WP Definitivo\theme-source` is only a directory junction to this same repository, not a second copy.
- Primary accessibility validation environment: `https://mytemplateswoo.com/`.

## Code and package

- [ ] All automated checks pass from a clean checkout.
- [x] Theme Check reports no required errors.
- [x] No PHP notices, warnings, deprecated messages, or JavaScript errors with `WP_DEBUG` enabled.
- [x] The ZIP contains exactly one `wp-definitivo/` top-level directory.
- [x] The ZIP excludes `.git`, `.github`, dependencies, caches, logs, IDE files, tests, and build configuration.
- [x] Readable sources for minified CSS and JavaScript are present in the theme.
- [x] Font files and both OFL license files are present and credited.
- [x] `readme.txt`, POT, screenshot, GPL license, and changelog match version 1.0.65.

## Functional and visual QA

- [ ] Every PHP template in the hierarchy has been inspected with Theme Unit Test content.
- [ ] Both menu locations, all three sidebars, threaded comments, pagination, attachments, search, and 404 work.
- [ ] Static front page, posts front page, page with sidebar, and landing page work in Gutenberg and Elementor.
- [ ] WooCommerce shop, product, reviews, cart, checkout, account, notices, forms, tables, and blocks work without template overrides.
- [ ] The theme activates and works when WooCommerce and Elementor are absent.
- [ ] RTL, 320px reflow, 200%/400% zoom, current/previous browsers, Android, and iOS pass.

## Accessibility-ready audit

- [ ] Keyboard and visible-focus audit passes.
- [ ] Skip link reaches `#primary` in every native and replaced template.
- [ ] Landmarks, headings, form labels, link distinction, names, states, and errors pass.
- [ ] Every default color scheme and interaction state has verified contrast.
- [ ] NVDA and VoiceOver smoke tests pass.

## Owner approval and WordPress.org

- [ ] Leandro Biffi completes final RC acceptance and explicitly approves the 1.0.65 ZIP.
- [ ] `leandrobiffi` login is confirmed.
- [ ] No other theme is awaiting review on the account.
- [ ] `wp-definitivo` slug is accepted by the uploader; otherwise rename slug, text domain, and code prefixes before resubmission.
- [ ] Theme page, documentation, support, GPL/independence statement, and updated terms are published on wpdefinitivo.com.
- [ ] Submit with `accessibility-ready` and reply to review feedback within seven days.

The RC is not authorized for submission until the owner-approval checkbox is complete.
