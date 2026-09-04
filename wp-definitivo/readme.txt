=== WP Definitivo ===
Contributors: leandrobiffi
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.69
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A lightweight WordPress theme for blogs, business sites and WooCommerce stores, with block editor and Elementor integration.

== Description ==

WP Definitivo is a lightweight, content-focused WordPress theme for blogs, business websites and WooCommerce stores. It provides polished layouts out of the box, flexible controls for blogs and shops, locally hosted fonts, responsive design and optional integrations with the block editor, Elementor, Elementor Pro Theme Builder and WooCommerce. Context-specific assets are loaded only when needed, helping keep configuration simple and the front end lean. The theme works without required plugins and avoids proprietary content features, remote assets and tracking.

== Installation ==

1. In the WordPress dashboard, open Appearance > Themes > Add New.
2. Upload the WP Definitivo ZIP, install it, and activate it.
3. Assign the Primary and Footer menus under Appearance > Menus.
4. Configure colors and layout under Appearance > Customize.
5. Add widgets only to the sidebars you want to display. Empty sidebars remain hidden.
6. For the store hero, edit the shop page title and excerpt, then configure its label under Appearance > Customize > Theme options > Store.

== Frequently Asked Questions ==

= Does WP Definitivo require a plugin? =

No. WooCommerce and Elementor support is optional and loaded only when the relevant plugin is active.

= How do I create a landing page? =

Create or edit a page and choose the Landing page template. It keeps the site header and footer but removes the page title and sidebar.

= Can I remove the author credit? =

Yes. Edit or remove it directly in Appearance > Customize > Theme options > Footer.

= Does the theme send data or load remote files? =

No. The bundled fonts, CSS, and JavaScript are served from your own WordPress installation. The theme does not collect or transmit personal data.

== Accessibility ==

WP Definitivo is designed to meet the WordPress accessibility-ready requirements. It includes a visible-on-focus skip link, semantic landmarks, keyboard-operable navigation and search, visible focus indicators, labelled forms, permanently underlined links in body text, reduced-motion support, reflow support, and color schemes designed for WCAG AA contrast.

The accessibility-ready tag indicates that the theme itself meets the WordPress review requirements; it does not guarantee that user-created content or third-party plugins are accessible. Site owners should preserve meaningful headings, alternative text, link wording, captions, and form labels.

The required theme accessibility statement, testing methodology, screen-reader text class, help contact, and issue-reporting details are documented in accessibility.txt.

== Privacy ==

WP Definitivo does not track visitors or administrators. It does not make remote requests, load CDN resources, or send theme settings outside the WordPress installation.

When comments or WooCommerce are enabled, WordPress and those plugins may process information independently of the theme. Refer to their documentation and configure the site privacy policy accordingly.

== Limitations ==

WP Definitivo does not include forms, SEO tools, analytics, custom post types, shortcodes, custom blocks, social sharing, favicons, or demo content. These features belong in plugins or WordPress core.

== Changelog ==

= 1.0.69 - 2026-09-04 =

* Added clear spacing between the 404 search form and return action, and stacked the search controls at narrow reflow widths.

= 1.0.68 - 2026-09-04 =

* Replaced compressed fixed-layout content tables with readable, keyboard-focusable local horizontal scrolling at compact widths.

= 1.0.67 - 2026-09-04 =

* Added directional indicators to desktop menu items that contain submenus, including mirrored nested indicators in RTL layouts.
* Stacked header-search controls at compact widths so the opened panel reflows without horizontal clipping at 400% zoom.
* Kept classic content tables within compact viewports by using fixed columns and safe cell wrapping.
* Reflowed comment author details and removed cumulative nesting indents at compact widths so deeply nested comments remain readable.

= 1.0.66 - 2026-09-04 =

* Kept compact-menu groups independently expanded so opening a later submenu does not cause a disorienting layout jump at high zoom.

= 1.0.65 - 2026-09-03 =

* Kept desktop dropdowns and nested submenus inside the viewport, including in RTL layouts.
* Kept the comment form heading at the correct level when no earlier comments heading is present.
* Matched the compact navigation button's accessible name to its visible "Menu" label while preserving the expanded state.

= 1.0.64 - 2026-09-03 =

* Kept text links in sidebar widgets permanently underlined with a non-color hover change.
* Made archive date and comment-link accessible names unique by including the post title.

= 1.0.63 - 2026-09-03 =

* Added visible, persistent labels to the theme search form while preserving its programmatic label association.

= 1.0.62 - 2026-09-03 =

* Improved text-link identification in post metadata.
* Made preformatted content reflow without creating inaccessible horizontal scrolling regions.
* Prevented the standard page hero from creating a duplicate banner landmark.

= 1.0.61 - 2026-09-02 =

* Made desktop dropdown submenus dismissible with Escape, including nested levels.
* Kept the no-JavaScript header search fallback visible to assistive technologies.

= 1.0.60 - 2026-09-02 =

* Increased form-control contrast and restored strong keyboard focus indicators in header search, cart, and checkout fields.

= 1.0.59 - 2026-09-02 =

* Updated the public theme descriptions to reflect the current feature set and positioning.

= 1.0.58 - 2026-09-02 =

* Added third-level page hierarchy support to the native fallback menu used by the Theme Unit Test.
* Aligned desktop dropdowns with their parent items and refined panel width and padding.

= 1.0.57 - 2026-09-02 =

* Made the native page-list fallback menu use the same accessible desktop dropdown and responsive submenu controls as assigned custom menus.

= 1.0.56 - 2026-09-02 =

* Prevented explicit page excerpts from appearing before WordPress password verification, including native pages, Elementor fallbacks, the posts page, and the WooCommerce shop page.

= 1.0.55 - 2026-09-02 =

* Preserved the main content landmark and skip-link target when Elementor Pro replaces singular, archive, blog, and WooCommerce templates through Theme Builder.

= 1.0.54 - 2026-09-02 =

* Added an optional back-to-top control and ensured its styles are cache-busted with the release version.
* Improved responsive navigation submenus and refined global component radius, account, comment, footer, and WooCommerce layouts.
* Refined WooCommerce product galleries, variation controls, offer labels, and no-price presentation.

= 1.0.53 - 2026-08-29 =

* Split the theme stylesheet into contextual base, header, footer, content, Elementor, and WooCommerce modules.
* Prevented WooCommerce presentation styles and interface scripts from loading on unrelated pages while preserving order-attribution tracking.
* Added asset-aware support for Elementor Canvas, Full Width, and matched Theme Builder locations.
* Reused the bundled local fonts in Elementor, preloaded Inter when selected, and removed duplicate font declarations.

= 1.0.52 - 2026-08-29 =

* Allowed long site titles to wrap completely above the header actions on mobile screens instead of being truncated.

= 1.0.51 - 2026-08-29 =

* Fixed the WooCommerce coupon field's floating label and improved its mobile layout with full-width stacked controls.

= 1.0.50 - 2026-08-29 =

* Restored responsive padding around WooCommerce cart items and totals when container queries switch to the stacked layout.

= 1.0.49 - 2026-08-28 =

* Replaced the heavy sticky-post outline with a subtle logical-side accent border.

= 1.0.48 - 2026-08-28 =

* Added consistent vertical breathing room around multi-line site branding in wide desktop headers.

= 1.0.47 - 2026-08-28 =

* Prevented desktop navigation labels from wrapping and enabled the compact menu before header content becomes crowded.

= 1.0.46 - 2026-08-28 =

* Prevented WooCommerce 11 mobile cart totals from overlapping long product names.

= 1.0.45 - 2026-08-28 =

* Constrained very long site titles to the mobile header width with an ellipsis instead of clipping beyond the viewport.

= 1.0.44 - 2026-08-28 =

* Increased muted-text contrast on soft theme surfaces to satisfy WCAG AA for normal text.

= 1.0.43 - 2026-08-28 =

* Removed persistent underlines from WooCommerce sidebar category navigation while preserving visible keyboard focus.

= 1.0.42 - 2026-08-28 =

* Standardized theme-owned translation calls on the wp-definitivo text domain for WordPress.org language-pack compatibility.

= 1.0.41 - 2026-08-28 =

* Removed persistent underlines from recent-post widget navigation while preserving visible keyboard focus.

= 1.0.40 - 2026-08-28 =

* Added the standardized accessibility.txt statement required for accessibility-ready themes.
* Kept links permanently underlined in body text, excerpts, comments, text widgets, and editable footer text while preserving underline-free navigation lists.
* Expanded custom accent validation across theme surfaces and button text.

= 1.0.39 - 2026-08-28 =

* Completed Elementor Theme Builder routing across the classic template hierarchy.
* Added unconstrained Elementor page output with support for Elementor's Hide Title setting.
* Kept native theme layouts as fallbacks when Elementor or a matching Theme Builder condition is unavailable.

= 1.0.38 - 2026-08-28 =

* Declared the /languages domain path explicitly for WordPress.org translation discovery.

= 1.0.37 - 2026-08-28 =

* Completed the bundled Brazilian Portuguese translation and added its compiled runtime catalog.
* Added release checks that reject missing or incomplete pt_BR translation files.

= 1.0.36 - 2026-08-28 =

* Kept left-positioned sidebars below the main content on tablet and mobile layouts.

= 1.0.35 - 2026-08-28 =

* Added a Customizer notice explaining that the three-column Blog grid is unavailable while a sidebar is selected.

= 1.0.34 - 2026-08-28 =

* Removed underlines from sidebar widget links while preserving their color, weight, and keyboard focus indicator.

= 1.0.33 - 2026-08-28 =

* Limited the Blog grid to two columns whenever a sidebar is selected and disabled the three-column option in the Customizer for that layout.

= 1.0.32 - 2026-08-28 =

* Reflowed mobile cart items within the available width and centered the two mobile header rows with increased spacing.

= 1.0.31 - 2026-08-28 =

* Reduced compact page and Checkout step title sizes on mobile screens.

= 1.0.30 - 2026-08-28 =

* Hid the compact Checkout order-summary bar on tablets while retaining the complete final order review.

= 1.0.29 - 2026-08-28 =

* Reflowed mobile Checkout order-summary items to prevent product names and totals from overlapping.

= 1.0.28 - 2026-08-28 =

* Replaced the full hero on Cart, Checkout, and My Account with a compact accessible page title.

= 1.0.27 - 2026-08-28 =

* Removed underlines from My Account navigation links and added clear active, hover, and keyboard-focus states.

= 1.0.26 - 2026-08-28 =

* Matched the current WooCommerce Blocks country and state fields to the checkout input border while preserving a keyboard focus indicator.

= 1.0.25 - 2026-08-27 =

* Reduced mobile content gutters and card padding.

= 1.0.24 - 2026-08-27 =

* Reduced the mobile page-hero title scale to improve wrapping and readability.

= 1.0.23 - 2026-08-27 =

* Placed the site identity on its own mobile header row and the search, cart, and Menu controls on the row below.

= 1.0.22 - 2026-08-27 =

* Replaced the mobile hamburger drawing with a clear text menu button.

= 1.0.21 - 2026-08-27 =

* Fixed the automatic typography preview in the Customizer.

= 1.0.20 - 2026-08-27 =

* Fixed the Typography child sections so they load only inside their parent item in the Customizer.
* Updated the theme asset version to prevent stale Customizer CSS and JavaScript from being cached.

= 1.0.19 - 2026-08-27 =

* Fixed the mobile header layout and the visible menu icon.
* Compiled the latest responsive spacing and typography changes for delivery.

= 1.0.18 - 2026-08-27 =

* Added unified theme and WooCommerce typography controls in the Customizer.
* Standardized responsive spacing, a single-column post grid on tablets, and the mobile header navigation.

= 1.0.17 - 2026-08-27 =

* Strengthened WooCommerce Blocks styling for cart product typography and checkout email and country fields.
* Reduced the catalog-card padding for a more compact store grid.

= 1.0.16 - 2026-08-27 =

* Added Store Page controls for 2, 3, or 4 product columns, square or vertical thumbnails, and optional short descriptions in catalog cards.
* Refined Blog grid spacing and title scale.
* Improved cart and checkout typography and form controls.
* Moved the footer credit into the editable footer-text field.

= 1.0.15 - 2026-08-27 =

* Made Store and Product sidebar controls effective with native product-search and category fallbacks when no shop widgets are assigned.
* Grouped WooCommerce layouts under Store in the Customizer.
* Added independent container-width and sidebar controls for the store, products, cart, checkout, and account pages.

= 1.0.14 - 2026-08-26 =

* Updated the public theme author and optional footer credit branding to WP Definitivo while retaining the individual copyright attribution and WordPress.org contributor account.
* Expanded content width choices to 1080, 1200, and 1440 pixels, with 1440 pixels as the default for content and the shared hero.
* Made the blog grid-column control visible only when the grid archive layout is selected.
* Matched WooCommerce sidebar visibility between the Customizer preview and the published site.

= 1.0.13 - 2026-08-26 =

* Moved compact, medium, and wide container controls into the Page, Blog, Post, Store, and Product sections while keeping the shared hero independent from those controls.
* Fixed the block checkout wrapper so its form and order summary use the full content area without a blank right column.
* Refined hero descriptions with a smaller indent and a subtle vertical rule.
* Made the default footer text directly editable with dynamic year and site-title tags.

= 1.0.12 - 2026-08-26 =

* Added compact, medium, and wide global container widths to the Customizer, with the widest option as the default.
* Matched post navigation and comments to the selected container width and refined standard hero description alignment.
* Centered footer content across desktop and mobile layouts.
* Rebuilt block-based cart and checkout layouts with stable responsive columns, compact typography, and clearer order summaries.

= 1.0.11 - 2026-08-26 =

* Standardized the hero, white content card, and external sidebar structure across pages, archives, posts, store archives, and products.
* Added title and explicit excerpt support to the shared hero, including product short descriptions and shop page excerpts.
* Removed the legacy store hero controls and specialized post and store header treatments.
* Prevented strong focus outlines on the expandable header search and programmatically focused WooCommerce notices.

= 1.0.10 - 2026-08-26 =

* Removed the outer framed layer from non-store page, archive, and reading shells.
* Reduced standard-page content heading sizes to a compact editorial scale.
* Kept the three-level surface treatment exclusive to WooCommerce store archives.

= 1.0.9 - 2026-08-26 =

* Realigned the WooCommerce archive toolbar so it remains fully inside the store hero on desktop and mobile.
* Fixed single-post title spacing so global heading styles no longer override its upper margin.
* Reduced editor-created heading sizes within standard page content.
* Simplified non-store surfaces to a two-color system while preserving the store's graduated background treatment.

= 1.0.8 - 2026-08-26 =

* Rebuilt standard-page headers as full-width white sections containing only the page title and explicit excerpt.
* Kept page content and optional sidebars in the responsive layout below the new header.
* Preserved landing templates and Elementor-controlled pages without the theme header treatment.

= 1.0.7 - 2026-08-26 =

* Added an optional editorial WooCommerce store hero using the shop page title and excerpt.
* Added Customizer controls for the store hero label, decoration, and visibility.
* Aligned shop sidebars with the product grid below the hero and added an informative empty-sidebar preview in the Customizer.
* Increased small single-post header text and improved title spacing.
* Added page excerpt support plus updated Portuguese and RTL presentation.

= 1.0.6 - 2026-08-26 =

* Added a shared hero for standard pages, blog archives, and search, with top-aligned content and sidebars.
* Reorganized Customizer layouts into Page, Blog, Post, Store, and Product sections with independent sidebar positions.
* Added optional sidebars to individual products and refined product-card and review typography.
* Improved single-post breadcrumbs, category badges, title sizing, and spacing.
* Expanded standard pages to 1200 pixels, reduced upper spacing, and fixed narrow list cards without featured images.
* Removed link underlines across the front end and editor while retaining visible keyboard focus and stronger inline-link weight.

= 1.0.5 - 2026-08-26 =

* Added independent left, right, and no-sidebar Customizer layouts for pages, single posts, blog archives, search, and WooCommerce store archives.
* Kept landing pages, products, cart, checkout, and account screens at full width.
* Refined product cards with consistent image spacing, aligned content, larger accent-colored prices, and no loop add-to-cart button.
* Added a shared page layout template and sidebar-layout unit tests.

= 1.0.4 - 2026-08-26 =

* Redesigned the single-product gallery, summary, description tabs, and related-product sections.
* Redesigned classic and block-based WooCommerce cart layouts with clearer cards and totals.
* Introduced a three-level surface system with a #f6f8fc canvas, #f8fbff containers, and white cards.
* Refined header and footer typography for improved readability.
* Rebuilt the expandable header search as a compact, accessible control with integrated icons.
* Synchronized the updated palette with theme.json, editor styles, translations, and compiled assets.

= 1.0.3 - 2026-08-26 =

* Reduced header height and navigation typography to match the reference design.
* Replaced the text search glyph with an accessible SVG icon.
* Replaced the visible cart label with a shopping-bag icon and item counter.
* Fixed WooCommerce product cards that inherited conflicting percentage widths.
* Added a compact sticky-footer layout for pages with little content.
* Updated the asset version to invalidate caches from 1.0.2.

= 1.0.2 - 2026-08-25 =

* Replaced the blue page background with the reference site's white and neutral-gray canvas.
* Updated navy text, link, border, card, and button colors to match the reference palette.
* Limited level-one headings inside post content cards to preserve the single-post hierarchy.
* Updated the asset version to invalidate caches from 1.0.1.

= 1.0.1 - 2026-08-25 =

* Made the accessible light-blue palette the default color scheme.
* Replaced Source typography with local Inter and JetBrains Mono fonts.
* Removed custom header and background image controls.
* Refined header controls, sidebar widgets, and the single-post layout.
* Updated the asset version to invalidate caches from 1.0.0.

= 1.0.0 - 2026-08-25 =

* Initial release candidate.
* Added classic template hierarchy, three page layouts, theme.json v3, and four block styles.
* Added accessible mobile navigation, expandable search, comments, and responsive/RTL styles.
* Added Customizer presentation controls and four validated color schemes.
* Added optional hook-based WooCommerce and Elementor integrations.

== Resources ==

WP Definitivo theme code and design, Copyright 2026 Leandro Biffi.
License: GNU General Public License v2 or later.

Inter, Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter).
License: SIL Open Font License 1.1.
Source: https://github.com/google/fonts/tree/main/ofl/inter
License file: assets/fonts/OFL-Inter.txt

JetBrains Mono, Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono).
License: SIL Open Font License 1.1.
Source: https://github.com/google/fonts/tree/main/ofl/jetbrainsmono
License file: assets/fonts/OFL-JetBrains-Mono.txt

screenshot.png was created by Leandro Biffi from the original WP Definitivo design and contains no third-party images.
License: GNU General Public License v2 or later.

WP Definitivo is an independent project and is not affiliated with, endorsed by, or sponsored by the WordPress Foundation, Automattic, WooCommerce, or Elementor.
