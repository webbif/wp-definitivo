# Changelog

## 1.0.64 — 2026-09-03

- Kept text links in sidebar widgets permanently underlined with a non-color hover change.
- Made archive date and comment-link accessible names unique by including the post title.

## 1.0.63 — 2026-09-03

- Added visible, persistent labels to the theme search form while preserving its programmatic label association.

## 1.0.62 — 2026-09-03

- Improved text-link identification in post metadata.
- Made preformatted content reflow without creating inaccessible horizontal scrolling regions.
- Prevented the standard page hero from creating a duplicate banner landmark.

## 1.0.61 — 2026-09-02

- Made desktop dropdown submenus dismissible with Escape, including nested levels.
- Kept the no-JavaScript header search fallback visible to assistive technologies.

## 1.0.60 — 2026-09-02

- Increased form-control contrast and restored strong keyboard focus indicators in header search, cart, and checkout fields.

## 1.0.59 — 2026-09-02

- Updated the public theme descriptions to reflect the current feature set and positioning.

## 1.0.58 — 2026-09-02

- Added third-level page hierarchy support to the native fallback menu used by the Theme Unit Test.
- Aligned desktop dropdowns with their parent items and refined panel width and padding.

## 1.0.57 — 2026-09-02

- Made the native page-list fallback menu use the same accessible desktop dropdown and responsive submenu controls as assigned custom menus.

## 1.0.56 — 2026-09-02

- Prevented explicit page excerpts from appearing before WordPress password verification, including native pages, Elementor fallbacks, the posts page, and the WooCommerce shop page.

## 1.0.55 — 2026-09-02

- Preserved the main content landmark and skip-link target when Elementor Pro replaces singular, archive, blog, and WooCommerce templates through Theme Builder.

## 1.0.54 — 2026-09-02

- Added an optional back-to-top control with resilient fixed positioning and a release-versioned asset URL for reliable cache invalidation.
- Improved responsive navigation submenus and refined global component radius, account, comment, footer, and WooCommerce layouts.
- Refined WooCommerce product galleries, variation controls, offer labels, and no-price presentation.

## 1.0.53 — 2026-08-29

- Split the theme stylesheet into contextual base, header, footer, content, Elementor, and WooCommerce modules.
- Prevented WooCommerce presentation styles and interface scripts from loading on unrelated pages while preserving order-attribution tracking.
- Added asset-aware support for Elementor Canvas, Full Width, and matched Theme Builder locations.
- Reused the bundled local fonts in Elementor, preloaded Inter when selected, and removed duplicate font declarations.

## 1.0.52 — 2026-08-29

- Allowed long site titles to wrap completely above the header actions on mobile screens instead of being truncated.

## 1.0.51 — 2026-08-29

- Fixed the WooCommerce coupon field's floating label and improved its mobile layout with full-width stacked controls.

## 1.0.50 — 2026-08-29

- Restored responsive padding around WooCommerce cart items and totals when container queries switch to the stacked layout.

## 1.0.49 — 2026-08-28

- Replaced the heavy sticky-post outline with a subtle logical-side accent border.

## 1.0.48 — 2026-08-28

- Added consistent vertical breathing room around multi-line site branding in wide desktop headers.

## 1.0.47 — 2026-08-28

- Prevented desktop navigation labels from wrapping and enabled the compact menu before header content becomes crowded.

## 1.0.46 — 2026-08-28

- Prevented WooCommerce 11 mobile cart totals from overlapping long product names.

## 1.0.45 — 2026-08-28

- Constrained very long site titles to the mobile header width with an ellipsis instead of clipping beyond the viewport.

## 1.0.44 — 2026-08-28

- Increased muted-text contrast on soft theme surfaces to satisfy WCAG AA for normal text.

## 1.0.43 — 2026-08-28

- Removed persistent underlines from WooCommerce sidebar category navigation while preserving visible keyboard focus.

## 1.0.42 — 2026-08-28

- Standardized theme-owned translation calls on the `wp-definitivo` text domain for WordPress.org language-pack compatibility.

## 1.0.41 — 2026-08-28

- Removed persistent underlines from recent-post widget navigation while preserving visible keyboard focus.

## 1.0.40 — 2026-08-28

- Added the standardized `accessibility.txt` statement required for accessibility-ready themes.
- Kept links permanently underlined in body text, excerpts, comments, text widgets, and editable footer text while preserving underline-free navigation lists.
- Removed the Customizer option that could disable an accessibility requirement.
- Expanded custom accent validation across backgrounds, surfaces, and button text.

## 1.0.39 — 2026-08-28

- Completed Elementor Theme Builder routing for header, footer, singular, archive, attachment, landing, fallback, and 404 templates.
- Added an unconstrained fallback for Elementor-built pages while honoring Elementor's Hide Title setting.
- Isolated Theme Builder output from native content-card and WooCommerce layout selectors.

## 1.0.38 — 2026-08-28

- Declared the `/languages` domain path explicitly for WordPress.org translation discovery.

## 1.0.37 — 2026-08-28

- Completed the bundled Brazilian Portuguese translation and added its compiled runtime catalog.
- Added release checks that reject missing or incomplete pt_BR translation files.

## 1.0.36 — 2026-08-28

- Kept left-positioned sidebars below the main content on tablet and mobile layouts.

## 1.0.35 — 2026-08-28

- Added a Customizer notice explaining that the three-column Blog grid is unavailable while a sidebar is selected.

## 1.0.34 — 2026-08-28

- Removed underlines from sidebar widget links while preserving their color, weight, and keyboard focus indicator.

## 1.0.33 — 2026-08-28

- Limited the Blog grid to two columns whenever a sidebar is selected and disabled the three-column option in the Customizer for that layout.

## 1.0.32 — 2026-08-28

- Reflowed mobile cart items within the available width and centered the two mobile header rows with increased spacing.

## 1.0.31 — 2026-08-28

- Reduced compact page and Checkout step title sizes on mobile screens.

## 1.0.30 — 2026-08-28

- Hid the compact Checkout order-summary bar on tablets while retaining the complete final order review.

## 1.0.29 — 2026-08-28

- Reflowed mobile Checkout order-summary items to prevent product names and totals from overlapping.

## 1.0.28 — 2026-08-28

- Replaced the full hero on Cart, Checkout, and My Account with a compact accessible page title.

## 1.0.27 — 2026-08-28

- Removed underlines from My Account navigation links and added clear active, hover, and keyboard-focus states.

## 1.0.26 — 2026-08-28

- Matched the current WooCommerce Blocks country and state fields to the checkout input border while preserving a keyboard focus indicator.

## 1.0.25 — 2026-08-27

- Reduced content gutters and card padding on mobile screens.

## 1.0.24 — 2026-08-27

- Reduced the page-hero title scale on mobile screens.

## 1.0.23 — 2026-08-27

- Placed the site identity above the mobile header actions and kept a textual Menu control.

## 1.0.22 — 2026-08-27

- Replaced the mobile hamburger drawing with a text menu button.

## 1.0.21 — 2026-08-27

- Fixed automatic typography updates inside the Customizer preview.

## 1.0.20 — 2026-08-27

- Fixed stale asset versioning for the Customizer and front-end styles.
- Kept Typography and Store child sections inside their parent navigation items.
- Fixed the mobile header icon and responsive product-grid columns.
- Reduced excess spacing in single-post navigation.

## 1.0.17 — 2026-08-27

- Strengthened the WooCommerce Blocks selectors used by the cart so product names, prices, and quantity controls retain the intended readable scale.
- Rebuilt checkout email and country controls with reliable label spacing, soft borders, and a consistent focus state.
- Reduced catalog-card padding for a more compact product grid.

## 1.0.16 — 2026-08-27

- Added Store Page controls for two, three, or four product columns, square or vertical product thumbnails, and optional short descriptions in catalog cards.
- Refined the blog grid with a tighter card gap and smaller grid-card titles.
- Improved WooCommerce cart and checkout typography, including aligned product search and clearer email and country controls.
- Consolidated the footer credit into the editable footer-text field and strengthened the nested Store navigation in the Customizer.

## 1.0.15 — 2026-08-27

- Made the Store and Product sidebar layout controls effective even when the shop widget area is empty, using native product search and product categories as an accessible fallback.
- Grouped all WooCommerce layouts under Store in the Customizer and added independent container width and sidebar controls for the store, products, cart, checkout, and account pages.

## 1.0.14 — 2026-08-26

- Updated the public theme author and optional footer credit branding to WP Definitivo while retaining the individual copyright attribution and WordPress.org contributor account.
- Expanded content width choices to 1080, 1200, and 1440 pixels, with 1440 pixels as the default for content and the shared hero.
- Made the blog grid-column control visible only when the grid archive layout is selected.
- Matched WooCommerce sidebar visibility between the Customizer preview and the published site.

## 1.0.13 — 2026-08-26

- Moved compact, medium, and wide container controls into the Page, Blog, Post, Store, and Product sections while keeping the shared hero fixed at 1200 pixels.
- Fixed the block checkout wrapper so its form and order summary use the full content area without a blank right column.
- Refined hero descriptions with a smaller indent and a subtle vertical rule.
- Made the default footer text directly editable with dynamic year and site-title tags.

## 1.0.12 — 2026-08-26

- Added compact, medium, and wide global container widths to the Customizer, with the widest option as the default.
- Matched post navigation and comments to the selected container width and refined standard hero description alignment.
- Centered footer content across desktop and mobile layouts.
- Rebuilt block-based cart and checkout layouts with stable responsive columns, compact typography, and clearer order summaries.

## 1.0.11 — 2026-08-26

- Standardized the hero, white content card, and external sidebar structure across pages, archives, posts, store archives, and products.
- Added title and explicit excerpt support to the shared hero, including product short descriptions and shop page excerpts.
- Removed the legacy store hero controls and specialized post and store header treatments.
- Prevented strong focus outlines on the expandable header search and programmatically focused WooCommerce notices.

## 1.0.10 — 2026-08-26

- Removed the outer framed layer from non-store page, archive, and reading shells.
- Reduced standard-page content heading sizes to a compact editorial scale.
- Kept the three-level surface treatment exclusive to WooCommerce store archives.

## 1.0.9 — 2026-08-26

- Realigned the WooCommerce archive toolbar so it remains fully inside the store hero on desktop and mobile.
- Fixed single-post title spacing so global heading styles no longer override its upper margin.
- Reduced editor-created heading sizes within standard page content.
- Simplified non-store surfaces to a two-color system while preserving the store's graduated background treatment.

## 1.0.8 — 2026-08-26

- Rebuilt standard-page headers as full-width white sections containing only the page title and explicit excerpt.
- Kept page content and optional sidebars in the responsive layout below the new header.
- Preserved landing templates and Elementor-controlled pages without the theme header treatment.

## 1.0.7 — 2026-08-26

- Added an optional editorial WooCommerce store hero using the shop page title and excerpt.
- Added Customizer controls for the store hero label, decoration, and visibility.
- Aligned shop sidebars with the product grid below the hero and added an informative empty-sidebar preview in the Customizer.
- Increased small single-post header text and improved title spacing.
- Added page excerpt support plus updated Portuguese and RTL presentation.

## 1.0.6 — 2026-08-26

- Added a shared hero for standard pages, blog archives, and search, with top-aligned content and sidebars.
- Reorganized Customizer layouts into Page, Blog, Post, Store, and Product sections with independent sidebar positions.
- Added optional sidebars to individual products and refined product-card and review typography.
- Improved single-post breadcrumbs, category badges, title sizing, and spacing.
- Expanded standard pages to 1200 pixels, reduced upper spacing, and fixed narrow list cards without featured images.
- Removed link underlines across the front end and editor while retaining visible keyboard focus and stronger inline-link weight.

## 1.0.5 — 2026-08-26

- Organized the Customizer into Page, Blog, Post, Store, and Product sections, each with an independent left, right, or no-sidebar layout.
- Kept landing pages, cart, checkout, and account screens at full width.
- Added a common-page hero so page and archive titles sit above the content grid while content and sidebars remain top-aligned.
- Refined product cards with consistent image spacing, aligned content, larger accent-colored prices, and no loop add-to-cart button.
- Added a shared page layout template and sidebar-layout unit tests.

## 1.0.4 — 2026-08-26

- Redesigned the single-product gallery, summary, description tabs, and related-product sections.
- Redesigned classic and block-based WooCommerce cart layouts with clearer cards and totals.
- Introduced a three-level surface system with a `#f6f8fc` canvas, `#f8fbff` containers, and white cards.
- Refined header and footer typography for improved readability.
- Rebuilt the expandable header search as a compact, accessible control with integrated icons.
- Synchronized the updated palette with `theme.json`, editor styles, translations, and compiled assets.

## 1.0.3 — 2026-08-26

- Reduced header height and navigation typography to match the reference design.
- Replaced the text search glyph with an accessible SVG icon.
- Replaced the visible cart label with a shopping-bag icon and item counter.
- Fixed WooCommerce product cards that inherited conflicting percentage widths.
- Added a compact sticky-footer layout for pages with little content.
- Updated the public asset version to invalidate caches created by 1.0.2.

## 1.0.2 — 2026-08-25

- Replaced the blue page background with the reference site's white and neutral-gray canvas.
- Updated navy text, link, border, card, and button colors to match the reference palette.
- Limited level-one headings inside post content cards to preserve the single-post hierarchy.
- Updated the public asset version to invalidate caches created by 1.0.1.

## 1.0.1 — 2026-08-25

- Added the accessible light-blue palette and made it the default color scheme.
- Removed the custom header image and custom background image controls.
- Replaced all serif typography with Inter and added JetBrains Mono for labels, metadata, and code.
- Removed the decorative borders from the header search and cart controls.
- Refined sidebar widgets with compact typography, subtle cards, and quieter list styling.
- Redesigned single posts with an editorial hero, breadcrumbs, content card, and optional blog sidebar.
- Updated the public asset version to invalidate caches created by 1.0.0.

## 1.0.0 — 2026-08-25

- Initial private release candidate.
- Added the complete classic PHP template hierarchy.
- Added three page layouts and content-driven front-page behavior.
- Added `theme.json` v3, local fonts, three color schemes, and four block styles.
- Added accessible navigation, expandable search, comments, responsive layouts, and RTL support.
- Added Customizer controls for presentation-only options.
- Added optional hook-based WooCommerce and Elementor integrations.
- Added English source strings, a POT catalog, and a pt-BR translation catalog.
