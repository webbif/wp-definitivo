# WP Definitivo 1.0.64 accessibility audit

Started: 2026-09-03  
Primary test site: https://mytemplateswoo.com/  
Official report: https://docs.google.com/spreadsheets/d/1mpT8YVlZCt9sQszHxouvt5-KTd5MYENyB0Ijz-xkr5M/edit  
Audit status: In progress

This file tracks internal execution and evidence. The official Google Sheet remains the source of truth for the WordPress.org accessibility-ready review.

## 1. Test candidate and environment

- [x] The audit started from clean, synchronized release `fe3c59d` / `v1.0.61`.
- [x] Accessibility remediation is prepared as version `1.0.64` in the working tree.
- [ ] Create the final candidate commit and tag after the formal audit is complete.
- [x] `style.css`, `readme.txt`, and `package.json` report version `1.0.64`.
- [x] MyTemplatesWoo runs WordPress 7.1.
- [x] Synchronize WP Definitivo 1.0.64 to MyTemplatesWoo and verify the final hashes.
- [x] No regular plugins are active; only Hostinger must-use infrastructure plugins are present.
- [x] Verify the deployed theme file hashes against the current audit candidate immediately before formal testing.
- [x] Create the official Google Sheet report and add its URL above.

## 2. Accessible test content and configuration

- [x] Obtain the remediated XML from the official `wpaccessibility/a11y-theme-unit-test` repository.
- [x] Import the remediated content into MyTemplatesWoo without overwriting unrelated configuration.
- [x] Assign the `Primary` menu to the theme's primary menu location.
- [x] Assign `All Pages Flat` to the footer menu location.
- [x] Enable comments and representative theme options.
- [x] Enable the header search option.
- [x] Review the Block Patterns test page. Not applicable: WP Definitivo registers no theme block patterns.
- [x] Confirm that the following required routes are available:
  - [x] Front Page
  - [x] Blog Page: `/blog/`
  - [x] Post with Comments: `/template-comments/`
  - [x] Category Archive: `/category/block/`
  - [x] Page Markup and Formatting: `/accessibility-ready-test-pages/page-markup-and-formatting/`
  - [x] Block Patterns: `/accessibility-ready-test-pages/block-patterns/`
  - [x] Search Results: `/?s=block`
  - [x] 404 Page

## 3. Automated baseline

- [x] Production build and release package validation pass.
  - Evidence: 68 distributable files; screenshot 1200 x 900; contextual CSS 14,715 bytes gzip; JavaScript 1,309 bytes gzip.
- [x] JavaScript, CSS, and `theme.json` lint checks pass.
- [x] WordPress Coding Standards pass: 38/38 files.
- [x] PHPUnit passes: 36 tests and 80 assertions.
- [x] Theme Check passes on the exact release candidate with no REQUIRED findings.
- [x] PHPCompatibility 7.4+ passes on the exact release candidate.
- [x] `WP_DEBUG` produces no theme-owned notices, warnings, deprecations, or errors.
- [x] Axe scan passes on all eight required routes in Chromium.
- [x] Axe scan passes on all eight required routes in Firefox.
- [x] Axe scan passes on all eight required routes in WebKit.
- [x] Axe scan passes in Android Chrome and iOS Safari profiles.

## 4. WordPress accessibility-ready requirements

Record page-by-page statuses and detailed evidence in the official report.

- [x] 1. Skip to Content Link
- [x] 2. Meaningful Landmark Roles and Names
- [ ] 3. Keyboard Navigation Support
- [ ] 4. Controls with Accessible Names, Roles, and States
- [x] 5. Labeled Form Fields
- [ ] 6. Headings with Meaningful Structure
- [x] 7. Underlined Links in Text
- [x] 8. No Ambiguous Link Text
- [ ] 9. Sufficient Color Contrast of Text and UI Controls
- [ ] 10. Alternative Text on Images and Graphics
- [x] 11. Accessible Audio, Video, and Animations
- [ ] 12. Support for Reflow, Resize, and Text Spacing Changes
- [ ] 13. No Unexpected Changes of Context
- [x] 14. No Links Opening New Windows or Tabs Without Warning
- [ ] 15. Content on Hover or Focus Is Accessible
- [x] 16. Accessibility Statement
- [x] 17. Must Not Recommend or Require Inaccessible Plugins
- [x] 18. Screen Reader Text Supported

## 5. Manual interaction and assistive-technology testing

- [ ] Keyboard-only traversal on all required routes.
- [ ] Visible focus for every interactive element and no keyboard traps.
- [x] Desktop nested submenus open, close, and return focus correctly, including Escape.
- [x] Mobile menu and nested submenu states are correctly announced.
- [x] Header search opens, receives focus, closes with Escape, and remains usable without JavaScript.
- [ ] Forms expose labels, required state, instructions, errors, and status messages.
- [x] Reflow passes at 320 CSS pixels without two-dimensional scrolling except allowed content.
- [ ] Browser zoom passes at 200% and 400%.
- [ ] WCAG text-spacing overrides do not hide or overlap content.
- [ ] Default color schemes and every hover, focus, active, disabled, and error state pass contrast.
- [x] Reduced-motion behavior is respected.
- [ ] RTL layout and interaction pass.
- [ ] NVDA with Firefox passes on Windows.
- [ ] VoiceOver with Safari passes on iOS or macOS.
- [ ] TalkBack with Chrome passes on Android, if an Android device is available.

## 6. Completion and release documentation

- [ ] Every applicable cell in the official Full Review tab is `Pass` or `Not Applicable`.
- [ ] No cell remains `Not Evaluated` or `Test Incomplete`.
- [ ] Every failure found during self-audit has an issue, fix, and focused regression test.
- [ ] All affected checks are repeated after the final fix.
- [ ] The official Summary tab accurately reflects the Full Review evidence.
- [ ] The generated Markdown for Trac is reviewed and ready to paste into the submission ticket.
- [ ] `accessibility.txt` is updated with the final, truthful audit status and methodology.
- [ ] A new release candidate is built only if source files changed during remediation.
- [ ] Final ZIP contents and hashes are recorded.

## Execution log

| Date | Area | Result | Evidence or follow-up |
| --- | --- | --- | --- |
| 2026-09-03 | Candidate identity | Pass | `fe3c59d`, `v1.0.61`, clean `main` synchronized with `origin/main`. |
| 2026-09-03 | MyTemplatesWoo baseline | Pass | WordPress 7.1; WP Definitivo 1.0.61 active; only Hostinger must-use plugins; default post and page only. |
| 2026-09-03 | Deployed theme integrity | Pass | All 68 files match the local release candidate byte-for-byte by SHA-256; no missing or extra files. |
| 2026-09-03 | Release checks | Pass | Build, i18n, JS/CSS/JSON lint, package rules, screenshot, and asset budgets passed. |
| 2026-09-03 | PHP code standards | Pass | 38/38 files. |
| 2026-09-03 | PHPUnit | Pass | 36 tests, 80 assertions. |
| 2026-09-03 | Official report | Started | Copied the official Google Sheet and populated theme name, version, developer, tester, and date. Theme URL and Trac ticket remain blank until submission. |
| 2026-09-03 | Accessible test content | Pass | Imported the official remediated XML (SHA-256 `2a77b4e54d92c6c2a971951f7174c7ffc3134da09d2b10210cee606bd3450706`); the temporary importer was removed. |
| 2026-09-03 | Required routes | Pass | Seven required routes return HTTP 200 and the intentional 404 route returns HTTP 404. |
| 2026-09-03 | Initial Axe baseline | Failed, remediated | Found text links in post metadata without non-color identification and horizontally scrollable `pre` content without keyboard focus. |
| 2026-09-03 | Accessibility remediation | Pass | Metadata links are permanently underlined; preformatted content wraps and reflows instead of creating an inaccessible horizontal scroll region. Added focused coverage for all eight required routes and corrected locale-independent menu assertions. |
| 2026-09-03 | Landmark remediation | Pass | Removed the duplicate banner landmark produced by the standard hero and added a regression check for exactly one banner, main, and contentinfo landmark plus unique navigation names on all required routes. |
| 2026-09-03 | Form-label remediation | Pass | Theme search forms now expose visible, persistent labels associated with their inputs. Header search, 404 search, sidebar block search, and comment form labels passed in all five browser profiles. Required comment fields expose the `required` attribute. |
| 2026-09-03 | Audit candidate | Pass | Version advanced to 1.0.63 so browsers receive the remediated versioned assets. MyTemplatesWoo and the local theme contain the same 68 files with zero SHA-256 differences. |
| 2026-09-03 | Deployment permissions | Remediated | Recursive SCP created theme directories with mode 700, causing public asset URLs to return 404. Directories were normalized to 755 and files to 644; CSS and JavaScript then loaded normally. This was a deployment-permission issue, not a theme-code defect. |
| 2026-09-03 | Automated browser matrix | Pass | 155/155 across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari profiles; all eight required routes passed Axe, skip-link, landmark, reflow, text-spacing, link-identification, link-name, menu, submenu, no-JS search, reduced-motion, focus-transfer, visible-label, and required-field checks. |
| 2026-09-03 | Official report: labeled forms | Pass | Full Review rows 50–58 now record header search, sidebar block search, search-results/404 search, comment labels, explicit associations, and required attributes page by page. Nonexistent controls are marked Not Applicable. |
| 2026-09-03 | Static accessibility requirements | Pass | No theme-generated `_blank` links, `window.open()`, or simulated `role="button"` controls were found. Reduced-motion rules, the documented `.screen-reader-text` class, the complete `accessibility.txt` statement, and optional-only plugin integrations were confirmed. Full Review rows 156, 160, and 161 were marked Pass. |
| 2026-09-03 | Reduced motion | Pass | Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari apply automatic scrolling and reduce theme transition/animation durations to at most 1 ms when `prefers-reduced-motion: reduce` is active. The theme supplies no autoplaying media, sliders, parallax, or flashing animation. Full Review rows 111–115 were completed. |
| 2026-09-03 | Text-link remediation | Pass | Removed sidebar-widget exceptions that suppressed permanent underlines. Content, comment, widget, entry-footer, and footer-text links retain underlines and gain a thicker underline on hover in all five browser profiles. Full Review rows 74–81 were completed page by page. |
| 2026-09-03 | Link-name remediation | Pass | Archive date and comment links now append the post title to their accessible name while retaining visible-text-first naming. Theme-generated links have no ambiguous names or identical names pointing to different destinations. Full Review rows 85–89 were completed. |
| 2026-09-03 | New-window behavior | Pass | The theme contains no `_blank` targets or `window.open()` calls, so Full Review rows 141–142 are Not Applicable on every required route. |
| 2026-09-03 | Theme Check | Pass | Exact 1.0.64 candidate returned exit code 0 and no REQUIRED findings. Only advisory INFO/RECOMMENDED items and the known screenshot-size warning were reported. The temporary plugin was removed after the run. |
| 2026-09-03 | `WP_DEBUG` | Pass | All required routes were requested with debug logging enabled and display disabled. Expected HTTP statuses were returned and no debug log was created. Original constants were restored. |
| 2026-09-03 | Post-remediation validation | Pass | Release check and JS/CSS/JSON lint pass; PHPCS/PHPCompatibility 38/38; PHPUnit 36 tests and 80 assertions. |
| 2026-09-03 | Reflow and text spacing automation | Pass | All eight required routes passed at 640 and 320 CSS pixels and with WCAG text-spacing overrides in all five browser profiles. Browser zoom, visual overlap/cropping judgment, and Firefox Text Only remain manual before requirement 12 is closed. |
| 2026-09-03 | Final deployed integrity | Pass | After the final 1.0.64 build, the local and MyTemplatesWoo copies each contain 68 files with zero missing, extra, or SHA-256-mismatched files. MyTemplatesWoo has no regular active plugins, no residual Theme Check directory, the default color scheme is restored, and `WP_DEBUG` is false. |
| 2026-09-03 | Normal-state contrast | Pass | Axe passed all eight routes in every browser profile and in all four built-in color schemes. The release checker independently verifies text/accent contrast at 4.5:1 and control-boundary contrast at 3:1. Full Review rows 94–95 were marked Pass; hover and focus states remain pending manual review. |
| 2026-09-03 | Repository state | In progress | Local commit `24949e0` appeared from concurrent work during the audit and remains ahead of `origin/main`; the 1.0.64 remediation and expanded tests remain uncommitted pending completion of the formal review. |
