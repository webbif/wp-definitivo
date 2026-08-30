<?php
/**
 * WooCommerce integration using hooks only.
 *
 * @package WP_Definitivo
 */

/**
 * Declare WooCommerce features.
 *
 * @return void
 */
function wpdef_woocommerce_setup() {
	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 480,
			'single_image_width'    => 720,
			'product_grid'          => array(
				'default_rows'    => 4,
				'min_rows'        => 1,
				'default_columns' => 3,
				'min_columns'     => 2,
				'max_columns'     => 4,
			),
		)
	);
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'wpdef_woocommerce_setup' );

/**
 * Replace WooCommerce wrappers without overriding plugin templates.
 *
 * @return void
 */
function wpdef_woocommerce_hooks() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
	remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
	remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
	remove_action( 'woocommerce_archive_description', 'woocommerce_product_archive_description', 10 );
	remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
	remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
	if ( ! is_product() ) {
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
	}
	add_filter( 'woocommerce_show_page_title', '__return_false' );

	add_action( 'woocommerce_before_main_content', 'wpdef_woocommerce_wrapper_start', 10 );
	add_action( 'woocommerce_after_main_content', 'wpdef_woocommerce_wrapper_end', 10 );
	add_action( 'woocommerce_sidebar', 'wpdef_woocommerce_sidebar', 10 );
}
add_action( 'wp', 'wpdef_woocommerce_hooks' );

/**
 * Use the Store Page setting for WooCommerce archive columns.
 *
 * @return int
 */
function wpdef_woocommerce_loop_columns() {
	$columns = absint( get_theme_mod( 'wpdef_shop_columns', 3 ) );

	return in_array( $columns, array( 2, 3, 4 ), true ) ? $columns : 3;
}
add_filter( 'loop_shop_columns', 'wpdef_woocommerce_loop_columns' );

/**
 * Print the optional short description in store catalog cards.
 *
 * @return void
 */
function wpdef_woocommerce_loop_description() {
	if ( ! wpdef_is_shop_archive() || ! get_theme_mod( 'wpdef_shop_show_description', false ) ) {
		return;
	}

	$description = trim( wp_strip_all_tags( get_the_excerpt() ) );

	if ( '' === $description ) {
		return;
	}

	printf(
		'<p class="wpdef-product-card__description">%s</p>',
		esc_html( wp_trim_words( $description, 20 ) )
	);
}
add_action( 'woocommerce_after_shop_loop_item_title', 'wpdef_woocommerce_loop_description', 9 );

/**
 * Give products without a price an intentional label in store cards.
 *
 * WooCommerce omits the price markup for these products. Adding a compact
 * consultation label keeps the card balanced and matches the single-product
 * consultation state without changing any purchase behaviour.
 *
 * @return void
 */
function wpdef_woocommerce_loop_unpriced_label() {
	global $product;

	if ( ! wpdef_is_shop_archive() || ! $product instanceof WC_Product || '' !== (string) $product->get_price() || $product->is_purchasable() ) {
		return;
	}

	printf(
		'<span class="price wpdef-product-card__inquiry">%s</span>',
		esc_html__( 'Price on request', 'wp-definitivo' )
	);
}
add_action( 'woocommerce_after_shop_loop_item_title', 'wpdef_woocommerce_loop_unpriced_label', 11 );

/**
 * Return the description for the current store archive.
 *
 * The main shop uses its explicit page excerpt. Product taxonomies retain
 * their native term descriptions.
 *
 * @return string
 */
function wpdef_get_shop_description() {
	if ( function_exists( 'is_shop' ) && is_shop() ) {
		$shop_page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : 0;

		return $shop_page_id > 0 ? trim( (string) get_post_field( 'post_excerpt', $shop_page_id ) ) : '';
	}

	return function_exists( 'term_description' ) ? term_description() : '';
}

/**
 * Return the title and description for the current WooCommerce view.
 *
 * @return array<string, string>
 */
function wpdef_get_woocommerce_hero() {
	if ( function_exists( 'is_product' ) && is_product() ) {
		$description = trim( (string) get_post_field( 'post_excerpt', get_the_ID() ) );

		return array(
			'title'       => esc_html( get_the_title() ),
			'description' => $description ? wpautop( esc_html( wp_strip_all_tags( $description ) ) ) : '',
		);
	}

	$description = wpdef_get_shop_description();

	return array(
		'title'       => esc_html( woocommerce_page_title( false ) ),
		'description' => $description ? wpautop( esc_html( wp_strip_all_tags( $description ) ) ) : '',
	);
}

/**
 * Determine whether the current WooCommerce view is a transactional page.
 *
 * Cart, checkout, and account pages benefit from a compact, task-focused
 * heading placed beside their content instead of the editorial store hero.
 *
 * @return bool
 */
function wpdef_is_woocommerce_transaction_page() {
	return ( function_exists( 'is_cart' ) && is_cart() ) ||
		( function_exists( 'is_checkout' ) && is_checkout() ) ||
		( function_exists( 'is_account_page' ) && is_account_page() );
}

/**
 * Render the result count and ordering controls inside the store container.
 *
 * @return void
 */
function wpdef_woocommerce_archive_toolbar() {
	if ( ! wpdef_is_shop_archive() ) {
		return;
	}
	?>
	<div class="wpdef-shop-toolbar">
		<div class="wpdef-shop-toolbar__count"><?php woocommerce_result_count(); ?></div>
		<?php if ( function_exists( 'woocommerce_product_loop' ) && woocommerce_product_loop() ) : ?>
			<div class="wpdef-shop-toolbar__ordering"><?php woocommerce_catalog_ordering(); ?></div>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Determine whether the WooCommerce shell has an enabled sidebar.
 *
 * Unlike the generic theme templates, the store supplies a useful native
 * fallback when its widget area is empty. This makes the Store layout control
 * effective immediately while still allowing widgets to replace the fallback.
 *
 * @return bool
 */
function wpdef_woocommerce_has_sidebar() {
	return 'none' !== wpdef_get_sidebar_layout() && 'sidebar-shop' === wpdef_get_sidebar_id();
}

/**
 * Display the native fallback for an empty WooCommerce sidebar.
 *
 * @return void
 */
function wpdef_woocommerce_sidebar_fallback() {
	$categories = wp_list_categories(
		array(
			'echo'       => false,
			'hide_empty' => true,
			'taxonomy'   => 'product_cat',
			'title_li'   => '',
		)
	);
	?>
	<section class="widget widget_product_search">
		<h2 class="widget-title"><?php esc_html_e( 'Search products', 'wp-definitivo' ); ?></h2>
		<?php get_product_search_form(); ?>
	</section>
	<?php if ( $categories ) : ?>
		<section class="widget widget_product_categories">
			<h2 class="widget-title"><?php esc_html_e( 'Product categories', 'wp-definitivo' ); ?></h2>
			<ul class="product-categories"><?php echo wp_kses_post( $categories ); ?></ul>
		</section>
	<?php endif; ?>
	<?php
}

/**
 * Open the WooCommerce shell.
 *
 * @return void
 */
function wpdef_woocommerce_wrapper_start() {
	$has_sidebar      = wpdef_woocommerce_has_sidebar();
	$hero             = wpdef_get_woocommerce_hero();
	$is_transactional = wpdef_is_woocommerce_transaction_page();

	if ( ! $is_transactional && ! is_product() ) {
		get_template_part( 'template-parts/standard-hero', null, $hero );
	}
	?>
	<div class="wpdef-common-shell wpdef-content-shell wpdef-shell<?php echo $is_transactional ? ' wpdef-transaction-shell' : ''; ?>">
		<div class="wpdef-common-layout<?php echo $has_sidebar ? ' has-sidebar' : ''; ?>">
			<main id="primary" class="site-main wpdef-common-main wpdef-content-card woocommerce-main" tabindex="-1">
				<?php if ( $is_transactional ) : ?>
					<header class="wpdef-transaction-header" aria-labelledby="wpdef-transaction-title">
						<h1 id="wpdef-transaction-title" class="wpdef-transaction-header__title entry-title"><?php echo wp_kses_post( $hero['title'] ); ?></h1>
					</header>
				<?php endif; ?>
				<?php wpdef_woocommerce_archive_toolbar(); ?>
	<?php
}

/**
 * Close the WooCommerce main element.
 *
 * @return void
 */
function wpdef_woocommerce_wrapper_end() {
	?>
		</main><!-- #primary -->
	<?php
}

/**
 * Print the shop archive sidebar and close the shell.
 *
 * @return void
 */
function wpdef_woocommerce_sidebar() {
	if ( wpdef_woocommerce_has_sidebar() ) {
		$sidebar_id    = wpdef_get_sidebar_id();
		$sidebar_label = function_exists( 'is_product' ) && is_product() ? __( 'Product sidebar', 'wp-definitivo' ) : __( 'Shop sidebar', 'wp-definitivo' );
		?>
		<aside id="secondary" class="widget-area" aria-label="<?php echo esc_attr( $sidebar_label ); ?>">
			<?php
			if ( ! dynamic_sidebar( $sidebar_id ) ) {
				wpdef_woocommerce_sidebar_fallback();
			}
			?>
		</aside>
		<?php
	}
	?>
		</div><!-- .wpdef-common-layout -->
	</div><!-- .wpdef-content-shell -->
	<?php
}

/**
 * Determine whether the current WooCommerce view is a product archive.
 *
 * @return bool
 */
function wpdef_is_shop_archive() {
	return function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() );
}

/**
 * Return the live cart item count.
 *
 * @return int
 */
function wpdef_cart_count() {
	return function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
}

/**
 * Update the header cart count after Ajax changes.
 *
 * @param array<string, string> $fragments Existing fragments.
 * @return array<string, string>
 */
function wpdef_cart_link_fragment( $fragments ) {
	ob_start();
	wpdef_cart_link();
	$fragments['a.wpdef-cart-link'] = ob_get_clean();

	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'wpdef_cart_link_fragment' );

/**
 * Display a clear consultation state for products without a defined price.
 *
 * Products with an empty price are not purchasable in WooCommerce, which
 * otherwise leaves the product summary with only its metadata. The message
 * keeps that state intentional without inventing a purchase flow or contact
 * destination for the site owner.
 *
 * @return void
 */
function wpdef_woocommerce_unpriced_product_notice() {
	global $product;

	if ( ! $product instanceof WC_Product || '' !== (string) $product->get_price() || $product->is_purchasable() ) {
		return;
	}
	?>
	<section class="wpdef-product-inquiry" aria-labelledby="wpdef-product-inquiry-title">
		<p class="wpdef-product-inquiry__eyebrow"><?php esc_html_e( 'Availability', 'wp-definitivo' ); ?></p>
		<h2 id="wpdef-product-inquiry-title" class="wpdef-product-inquiry__title"><?php esc_html_e( 'Price on request', 'wp-definitivo' ); ?></h2>
		<p class="wpdef-product-inquiry__description"><?php esc_html_e( 'Contact us to receive availability and a personalized proposal for this product.', 'wp-definitivo' ); ?></p>
	</section>
	<?php
}
add_action( 'woocommerce_single_product_summary', 'wpdef_woocommerce_unpriced_product_notice', 20 );

/**
 * Print the header cart link.
 *
 * @return void
 */
function wpdef_cart_link() {
	$count      = wpdef_cart_count();
	$cart_label = sprintf(
		/* translators: %s: number of products in the cart. */
		_n( '%s item in cart', '%s items in cart', $count, 'wp-definitivo' ),
		number_format_i18n( $count )
	);
	?>
	<a class="wpdef-cart-link no-prefetch" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="<?php echo esc_attr( $cart_label ); ?>">
		<svg class="wpdef-header-icon wpdef-shop-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
			<path d="M5.75 8.5h12.5l1 11H4.75l1-11Z"></path>
			<path d="M8.75 8.5V6.75a3.25 3.25 0 0 1 6.5 0V8.5"></path>
		</svg>
		<span class="wpdef-cart-count" aria-hidden="true"><?php echo esc_html( number_format_i18n( $count ) ); ?></span>
	</a>
	<?php
}
