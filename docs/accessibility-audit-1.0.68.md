# WP Definitivo 1.0.68 accessibility audit

Started: 2026-09-03  
Primary test site: https://mytemplateswoo.com/  
Official report: https://docs.google.com/spreadsheets/d/1mpT8YVlZCt9sQszHxouvt5-KTd5MYENyB0Ijz-xkr5M/edit  
Audit status: In progress

This file tracks internal execution and evidence. The official Google Sheet remains the source of truth for the WordPress.org accessibility-ready review.

## 1. Test candidate and environment

- [x] The audit started from clean, synchronized release `fe3c59d` / `v1.0.61`.
- [x] Accessibility remediation is prepared as version `1.0.68` in the working tree.
- [x] Create the version 1.0.64 audit-candidate commit (`848e477`).
- [x] Create the version 1.0.68 table-remediation commit (`e3b4f4a`).
- [ ] Create the final tag after the formal audit is complete.
- [x] `style.css`, `readme.txt`, and `package.json` report version `1.0.68`.
- [x] MyTemplatesWoo runs WordPress 7.1.
- [x] Synchronize WP Definitivo 1.0.68 to MyTemplatesWoo and verify all deployed file hashes.
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
  - Evidence: 68 distributable files; screenshot 1200 x 900; contextual CSS 14,722 bytes gzip; JavaScript 1,309 bytes gzip.
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
- [x] 3. Keyboard Navigation Support
- [x] 4. Controls with Accessible Names, Roles, and States
- [x] 5. Labeled Form Fields
- [x] 6. Headings with Meaningful Structure
- [x] 7. Underlined Links in Text
- [x] 8. No Ambiguous Link Text
- [x] 9. Sufficient Color Contrast of Text and UI Controls
- [x] 10. Alternative Text on Images and Graphics
- [x] 11. Accessible Audio, Video, and Animations
- [ ] 12. Support for Reflow, Resize, and Text Spacing Changes
- [x] 13. No Unexpected Changes of Context
- [x] 14. No Links Opening New Windows or Tabs Without Warning
- [ ] 15. Content on Hover or Focus Is Accessible
- [x] 16. Accessibility Statement
- [x] 17. Must Not Recommend or Require Inaccessible Plugins
- [x] 18. Screen Reader Text Supported

## 5. Manual interaction and assistive-technology testing

- [x] Keyboard-only traversal on all required routes.
- [x] Visible focus for every interactive element and no keyboard traps.
- [x] Desktop nested submenus open inward, remain inside the viewport, close with Escape, and return focus correctly.
- [x] Mobile menu and nested submenu states are correctly announced.
- [x] Header search opens, receives focus, closes with Escape, and remains usable without JavaScript.
- [ ] Forms expose labels, required state, instructions, errors, and status messages.
- [x] Reflow passes at 320 CSS pixels without two-dimensional scrolling except allowed content.
- [ ] Browser zoom passes at 200% and 400%.
- [ ] WCAG text-spacing overrides do not hide or overlap content.
- [x] Default color schemes and the applicable normal, hover, and focus states pass measured contrast; disabled controls are exempt and the theme does not generate a standalone validation-error presentation.
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
- [x] Build and validate the current 1.0.68 local candidate after the compact-table correction.
- [ ] Record the final 1.0.68 ZIP contents and hashes.

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
| 2026-09-03 | Automated browser matrix | Pass | The earlier 155/155 matrix passed across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari profiles; all eight required routes passed Axe, skip-link, landmark, reflow, text-spacing, link-identification, link-name, menu, submenu, no-JS search, reduced-motion, focus-transfer, visible-label, and required-field checks. |
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
| 2026-09-03 | Repository state | Controlled | Commit `848e477` records the 1.0.64 remediation and expanded tests. The earlier local commit `24949e0` is preserved. Both commits remain ahead of `origin/main`; no push or final tag has been made. |
| 2026-09-03 | Superseded 1.0.64 package | Historical | `wp-definitivo-1.0.64.zip` contained exactly one `wp-definitivo/` root and 68 files. It was superseded when the manual keyboard audit found an off-screen nested submenu. SHA-256: `2087CF1029B6160ECDBA70A33C3494CCE84CD5A8844A058619DC4DBFD634C0B7`. |
| 2026-09-03 | Manual keyboard audit: front page | Failed, remediation required | Skip link, visible focus, focus transfer to `#primary`, top-level dropdowns, nested keyboard focus, Escape restoration, header search, body link, and footer link work. The third-level desktop submenu is positioned from x=1350.6 to x=1574.6 in a 1329px viewport, leaving its focused links fully off-screen. Full Review row 32 is marked Fail on all routes because the shared header is affected. |
| 2026-09-03 | Submenu cache invalidation | In progress | The viewport regression correctly rejected the first deployment because browsers still received versioned 1.0.64 CSS from cache. The candidate advanced to 1.0.65 so corrected assets receive a new public URL. |
| 2026-09-03 | Desktop submenu remediation | Pass | Version 1.0.65 aligns desktop dropdowns inward with logical inset properties. At a 1329px viewport, the first submenu occupies x=984.75–1208.75 and the nested submenu x=770.75–994.75; both remain fully visible. Keyboard focus and nested Escape restoration pass. |
| 2026-09-03 | Post-submenu browser matrix | Pass | 155/155 tests passed with two workers across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. A prior high-concurrency run exposed transient production database/load delays rather than theme failures; the navigation helper now waits for DOM readiness instead of unrelated resource completion. |
| 2026-09-03 | Version 1.0.65 deployed integrity | Pass | The canonical source and active MyTemplatesWoo theme each contain 68 files, with zero missing, extra, or SHA-256-mismatched files. Release checks pass with the synchronized candidate. |
| 2026-09-04 | Heading structure | Failed, remediated | The theme contributes one nonempty page-title H1 on every required route. A focused regression exposed the WordPress default H3 reply heading after H1 on pages with no existing comments; the theme now requests H2 from `comment_form()`. Theme-owned headings have no skipped levels in all five browser profiles. The additional `Header one` H1 on two routes is literal content from the official accessibility test XML, not theme output. |
| 2026-09-04 | Images and graphics | Pass | Every visible image on all eight routes has an explicit `alt` attribute; meaningful fixture images have descriptive text, redundant comment avatars use `alt=""`, image-only links receive their name from image alternative text, and the theme's decorative search SVGs use `aria-hidden="true"`. The focused regression passed in Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. |
| 2026-09-04 | Expanded browser matrix | Pass | 165/165 tests passed in Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari after adding heading and graphic regressions and correcting the comment reply heading level. |
| 2026-09-04 | Keyboard traversal | Pass | A complete forward and reverse Tab traversal reached every exposed focus target on all eight routes in desktop Chromium. Every target retained a visible focus indicator and no keyboard trap occurred. Dedicated menu, nested submenu, search, Escape, mobile-navigation, and viewport checks continue to pass across all five browser profiles. |
| 2026-09-04 | Control semantics and names | Failed, remediated | The compact navigation button showed “Menu” but exposed “Open menu” as its accessible name. The visible Menu label is now the accessible name and `aria-expanded` communicates state. All eight routes then passed native-role, nonempty-name, label-in-name, `aria-controls`, and disabled-state checks in all five browser profiles; focused control and mobile-menu tests passed 10/10. |
| 2026-09-04 | Official report update | Pass | Headings and alternative-text sections were already saved. Keyboard rows 24–29, controls rows 38–46, and the required-field marker row 59 were recorded in the official Google Sheet, read back successfully, and visually verified; dropdown validation remains intact. |
| 2026-09-04 | Final automated browser matrix | Pass | 171 tests passed and 4 intentionally desktop-only traversal cases were skipped across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. The deployed site passed the complete eight-route accessibility suite after the final menu-label remediation. |
| 2026-09-04 | Post-report deployed integrity | Pass | The canonical theme and the active MyTemplatesWoo copy each contain 68 files, with zero missing, extra, or SHA-256-mismatched files after the final validation run. |
| 2026-09-04 | Unexpected context changes | Pass | All visible controls on all eight required routes were focused without navigation, submission, popup, or other context changes. The sole applicable choice control—the comment-cookie checkbox—was changed from the keyboard without changing context. The focused regression passed 10/10 across all five browser profiles; Full Review rows 135–137 were completed page by page. |
| 2026-09-04 | Hover and focus interaction | Partial pass | Desktop nested submenus were exercised with a real pointer, remained visible while the pointer crossed each submenu level, and closed with Escape. Existing keyboard and focus checks also passed. The focused regression passed 10/10 across all five browser profiles; Full Review rows 146–148 and 150 were marked Pass. Screen-reader announcement and real 200%/400% browser zoom remain manual, so requirement 15 stays open. |
| 2026-09-04 | Interactive-state contrast | Pass | A focused Chromium regression measured a content link, the icon-only search control, the comment field, and the comment submit button in every built-in palette. Hover and focus text, icon, boundary, and 3px focus-outline ratios met 4.5:1 or 3:1 as applicable. Together with the five-browser Axe matrix and release-checker palette assertions, this closes requirement 9 and Full Review rows 96–99. |
| 2026-09-04 | Post-context/contrast browser matrix | Pass | 176 tests passed and 8 intentional project-specific cases were skipped across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. One Firefox image test exceeded 30 seconds while loading the remote category route; the same focused test passed on immediate isolated retry in 2.8 seconds, confirming transient remote latency rather than a theme defect. |
| 2026-09-04 | Manual zoom: front page at 200% | Pass | In Chrome at real 200% browser zoom with an approximately 1180px restored window, the front page stacked and wrapped correctly, required no horizontal scrolling, showed no clipped or overlapping text, and kept links and controls usable. The compact menu and nested Level 1, Level 2, and Level 3 content remained visible and operable. Full Review front-page cells B119:B122 and B151 were marked Pass. |
| 2026-09-04 | Manual zoom: front page at 400% | Pass after remediation | Content stacked and wrapped correctly, required no horizontal scrolling, showed no clipped or overlapping text, and kept links and controls usable. Opening Accessibility-Ready Test Pages, Other Pages, and Level 1 in sequence kept all three groups expanded and caused no layout jump after the deployed 1.0.66 remediation. Full Review front-page cells B123:B126 and B152 were marked Pass, and the evidence notes in B132 and B153 were updated. |
| 2026-09-04 | Manual zoom: Blog Page at 200% and 400% | Pass | In Chrome with an approximately 1180px restored window, the Blog Page stacked and wrapped correctly, required no horizontal scrolling, showed no clipped or overlapping titles, metadata, excerpts, or controls, and kept links, pagination, menu, and submenus usable. Full Review cells C119:C126 and C151:C152 were marked Pass; C132 and C153 contain the evidence. |
| 2026-09-04 | Version 1.0.66 deployment and integrity | Pass | MyTemplatesWoo was upgraded from 1.0.65 to active version 1.0.66 after creating `/home/u976587618/backups/wp-definitivo-1.0.65-before-1.0.66-20260904.tar.gz`. The local and deployed themes each contain 68 files, with zero missing, extra, or SHA-256-mismatched files. |
| 2026-09-04 | Compact-menu layout-jump regression | Pass | The two focused submenu scenarios passed across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. Two initial remote page-load timeouts passed immediately on isolated retry, confirming transient network latency rather than a functional failure. |
| 2026-09-04 | Desktop submenu indicators | Deployed; automated pass | Version 1.0.67 adds a downward indicator to top-level menu items with children and a direction-aware lateral indicator to nested parents such as Level 2. RTL nested indicators are mirrored. The integrated desktop submenu regression verifies both indicator levels while visible and passed across all five browser profiles. |
| 2026-09-04 | Version 1.0.67 release checks and deployment integrity | Pass | Build, generated translations, JavaScript/CSS/JSON lint, PHPCS 38/38, PHPUnit 36 tests with 80 assertions, package validation, 68-file inventory, 1200 x 900 screenshot, and asset budgets passed. MyTemplatesWoo runs 1.0.67; its 68 theme files exactly match the canonical source with zero missing, extra, or SHA-256-mismatched files. |
| 2026-09-04 | Manual zoom: Post with Comments at 200% | Pass | In Chrome, the Post with Comments route reflowed correctly at real 200% browser zoom with no reported clipping, overlap, horizontal scrolling, or unusable controls. |
| 2026-09-04 | Manual zoom: Post with Comments at 400% | Remediated and deployed; manual retest pending | The page content reflowed, but the opened header search kept its field, submit button, and close control in one horizontal row, clipping the controls beyond the compact viewport. Version 1.0.67 stacks the form controls and places the close button on its own line at widths up to 700 CSS pixels. The focused 320px regression passed across all five browser profiles. |
| 2026-09-04 | Manual zoom: comment table at 400% | Remediated and deployed; manual retest pending | Version 1.0.67 kept the table inside the page but fixed equal-width columns and arbitrary character wrapping made its content unreadable at 400% zoom. Version 1.0.68 restores automatic column sizing and whole-word wrapping, contains horizontal scrolling within the table, and makes the table keyboard focusable without replacing its native semantics. The focused regression passed in all five browser profiles; real 400% browser-zoom review remains pending. |
| 2026-09-04 | Manual zoom: nested comment metadata at 400% | Remediated and deployed; manual retest pending | Comment author rows did not wrap and cumulative nesting indents left deep comments too narrow, causing “disse:” and long author names to touch or cross the card boundary. Version 1.0.67 arranges avatar, author, and “disse:” in a compact grid, safely wraps names, and removes cumulative nested-list indentation at widths up to 700 CSS pixels. The focused regression covers the content labelled Comment Depth 10 and passed across all five browser profiles. |
| 2026-09-04 | Version 1.0.67 focused post-deployment matrix | Pass | Compact accordion stability, desktop nested submenu position/Escape/indicator behavior, opened header-search reflow, classic comment-table reflow, and deeply nested comment headers passed 25/25 across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. Test selectors were corrected to inspect hidden submenu markup only after display and to identify the deepest fixture by its content because WordPress caps the structural depth class at five. |
| 2026-09-04 | Version 1.0.67 complete post-deployment browser matrix | Pass | The public accessibility suite completed with 196 passes and 8 intentional project-specific skips across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. One Chromium control-semantics run timed out while loading `/blog/`; the same isolated test passed immediately in 1.9 seconds, confirming transient remote latency rather than a theme defect. |
| 2026-09-04 | Version 1.0.68 table-scroller regression | Pass | At 320 CSS pixels, the classic comment table remains inside its content column while exposing a local horizontal scroll range, retains automatic column sizing and whole-word wrapping, receives keyboard focus, and scrolls with ArrowRight. The focused test passed 5/5 across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. |
| 2026-09-04 | Version 1.0.68 deployment and integrity | Pass | Build, lint, release packaging, PHPCS 38/38, and PHPUnit 36 tests with 80 assertions passed. MyTemplatesWoo runs active version 1.0.68, and its 68 theme files exactly match the canonical source with zero missing, extra, or SHA-256-mismatched files. The previous version is preserved in both archive and tree backups under `/home/u976587618/backups/`. |
| 2026-09-04 | Version 1.0.68 complete post-deployment browser matrix | Pass after isolated retry | The public accessibility suite completed with 196 passes and 8 intentional project-specific skips. One Firefox unexpected-context test exceeded 30 seconds while traversing the 404 page; the same isolated test passed in 15.6 seconds, confirming a suite-timeout condition rather than a functional defect. |
