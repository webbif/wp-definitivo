<?php
/**
 * Context-aware front-end assets and performance integrations.
 *
 * @package WP_Definitivo
 */

/**
 * Safely call a conditional query function.
 *
 * @param string $function_name Conditional function name.
 * @param mixed  ...$arguments Optional arguments.
 * @return bool
 */
function wpdef_query_condition( $function_name, ...$arguments ) {
	return is_callable( $function_name ) && (bool) call_user_func_array( $function_name, $arguments );
}

/**
 * Return the Theme Builder content location for the current request.
 *
 * @return string
 */
function wpdef_get_elementor_content_location() {
	if (
		wpdef_query_condition( 'is_home' ) ||
		wpdef_query_condition( 'is_archive' ) ||
		wpdef_query_condition( 'is_search' ) ||
		( wpdef_query_condition( 'is_front_page' ) && wpdef_query_condition( 'is_home' ) )
	) {
		return 'archive';
	}

	return 'single';
}

/**
 * Determine whether Elementor is rendering an editor or preview request.
 *
 * @return bool
 */
function wpdef_is_elementor_edit_context() {
	if ( wpdef_query_condition( 'is_customize_preview' ) ) {
		return true;
	}

	if ( ! class_exists( '\\Elementor\\Plugin' ) ) {
		return false;
	}

	try {
		$plugin = \Elementor\Plugin::$instance;

		if ( isset( $plugin->editor ) && method_exists( $plugin->editor, 'is_edit_mode' ) && $plugin->editor->is_edit_mode() ) {
			return true;
		}

		return isset( $plugin->preview ) && method_exists( $plugin->preview, 'is_preview_mode' ) && $plugin->preview->is_preview_mode();
	} catch ( \Throwable $error ) {
		return false;
	}
}

/**
 * Recursively determine whether parsed blocks contain WooCommerce content.
 *
 * @param array $blocks Parsed blocks.
 * @return bool
 */
function wpdef_blocks_use_woocommerce( $blocks ) {
	if ( ! is_array( $blocks ) ) {
		return false;
	}

	foreach ( $blocks as $block ) {
		if ( ! is_array( $block ) ) {
			continue;
		}

		$block_name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';

		if ( 0 === strpos( $block_name, 'woocommerce/' ) ) {
			return true;
		}

		if ( ! empty( $block['innerBlocks'] ) && wpdef_blocks_use_woocommerce( $block['innerBlocks'] ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether post content contains WooCommerce blocks or shortcodes.
 *
 * @param int $post_id Optional post ID.
 * @return bool
 */
function wpdef_post_uses_woocommerce( $post_id = 0 ) {
	$post_id = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );

	if ( ! $post_id || ! function_exists( 'get_post' ) ) {
		return false;
	}

	$post = get_post( $post_id );

	if ( ! $post || ! isset( $post->post_content ) || ! is_string( $post->post_content ) ) {
		return false;
	}

	$content = $post->post_content;

	if ( function_exists( 'parse_blocks' ) && wpdef_blocks_use_woocommerce( parse_blocks( $content ) ) ) {
		return true;
	}

	$shortcodes = array(
		'add_to_cart',
		'add_to_cart_url',
		'best_selling_products',
		'featured_products',
		'product',
		'product_attribute',
		'product_category',
		'product_page',
		'products',
		'recent_products',
		'sale_products',
		'top_rated_products',
		'woocommerce_cart',
		'woocommerce_checkout',
		'woocommerce_my_account',
		'woocommerce_order_tracking',
	);

	foreach ( $shortcodes as $shortcode ) {
		if ( function_exists( 'has_shortcode' ) && has_shortcode( $content, $shortcode ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether the current request needs WooCommerce front-end assets.
 *
 * The result is deliberately conservative: editors, WooCommerce endpoints,
 * blocks, shortcodes, Elementor widgets, and matching Theme Builder documents
 * keep the plugin assets available.
 *
 * @return bool
 */
function wpdef_page_needs_woocommerce_assets() {
	if ( isset( $GLOBALS['wpdef_woocommerce_asset_context'] ) ) {
		return (bool) $GLOBALS['wpdef_woocommerce_asset_context'];
	}

	if ( ! class_exists( 'WooCommerce' ) ) {
		return false;
	}

	$needs_assets = wpdef_is_elementor_edit_context();

	foreach ( array( 'is_woocommerce', 'is_cart', 'is_checkout', 'is_account_page', 'is_wc_endpoint_url' ) as $conditional ) {
		if ( wpdef_query_condition( $conditional ) ) {
			$needs_assets = true;
			break;
		}
	}

	if ( ! $needs_assets ) {
		$needs_assets = wpdef_post_uses_woocommerce();
	}

	if ( ! $needs_assets ) {
		$needs_assets = wpdef_elementor_document_uses_woocommerce( wpdef_get_elementor_document() );
	}

	if ( ! $needs_assets ) {
		$locations = array( 'header', 'footer', wpdef_get_elementor_content_location() );

		foreach ( array_unique( $locations ) as $location ) {
			if ( wpdef_elementor_location_has_template( $location ) && wpdef_elementor_location_uses_woocommerce( $location ) ) {
				$needs_assets = true;
				break;
			}
		}
	}

	$GLOBALS['wpdef_woocommerce_asset_context'] = (bool) apply_filters( 'wpdef_needs_woocommerce_assets', $needs_assets );

	return $GLOBALS['wpdef_woocommerce_asset_context'];
}

/**
 * Build the asset context for the current request.
 *
 * @return array
 */
function wpdef_get_asset_context() {
	if ( isset( $GLOBALS['wpdef_asset_context'] ) && is_array( $GLOBALS['wpdef_asset_context'] ) ) {
		return $GLOBALS['wpdef_asset_context'];
	}

	$canvas            = wpdef_is_elementor_canvas();
	$full_width        = wpdef_is_elementor_full_width();
	$content_location  = wpdef_get_elementor_content_location();
	$elementor_page    = wpdef_is_built_with_elementor();
	$elementor_header  = wpdef_elementor_location_has_template( 'header' );
	$elementor_footer  = wpdef_elementor_location_has_template( 'footer' );
	$elementor_content = wpdef_elementor_location_has_template( $content_location );
	$uses_elementor    = $elementor_page || $full_width || $elementor_header || $elementor_footer || $elementor_content;

	$GLOBALS['wpdef_asset_context'] = array(
		'base'        => ! $canvas,
		'header'      => ! $canvas && ! $elementor_header,
		'footer'      => ! $canvas && ! $elementor_footer,
		'content'     => ! $canvas && ! $full_width && ! $elementor_content,
		'elementor'   => ! $canvas && $uses_elementor,
		'woocommerce' => ! $canvas && ! $elementor_content && wpdef_page_needs_woocommerce_assets(),
		'navigation'  => ! $canvas && ! $elementor_header,
	);

	return $GLOBALS['wpdef_asset_context'];
}

/**
 * Prevent WordPress from printing a second, unversioned copy of the parent RTL stylesheet.
 *
 * A child theme's locale stylesheet remains untouched and may load alongside the
 * versioned parent stylesheet enqueued by this theme.
 *
 * @param string $stylesheet_uri     Localized stylesheet URI.
 * @param string $stylesheet_dir_uri Stylesheet directory URI.
 * @return string
 */
function wpdef_filter_locale_stylesheet_uri( $stylesheet_uri, $stylesheet_dir_uri ) {
	$template_dir_uri = rtrim( get_template_directory_uri(), '/' );
	$locale_dir_uri   = rtrim( (string) $stylesheet_dir_uri, '/' );

	if ( $template_dir_uri === $locale_dir_uri && $template_dir_uri . '/rtl.css' === $stylesheet_uri ) {
		return '';
	}

	return $stylesheet_uri;
}
add_filter( 'locale_stylesheet_uri', 'wpdef_filter_locale_stylesheet_uri', 10, 2 );

/**
 * Enqueue only the theme modules needed by the current request.
 *
 * @return void
 */
function wpdef_scripts() {
	$context = wpdef_get_asset_context();

	if ( $context['base'] ) {
		wp_enqueue_style( 'wpdef-style', get_theme_file_uri( '/assets/css/base.min.css' ), array(), WPDEF_VERSION );
	}

	$modules = array(
		'header'      => 'wpdef-header',
		'footer'      => 'wpdef-footer',
		'content'     => 'wpdef-content',
		'elementor'   => 'wpdef-elementor',
		'woocommerce' => 'wpdef-woocommerce',
	);

	foreach ( $modules as $module => $handle ) {
		if ( $context[ $module ] ) {
			wp_enqueue_style( $handle, get_theme_file_uri( "/assets/css/{$module}.min.css" ), array( 'wpdef-style' ), WPDEF_VERSION );
		}
	}

	if ( $context['base'] && is_rtl() ) {
		wp_enqueue_style( 'wpdef-rtl', get_template_directory_uri() . '/rtl.css', array( 'wpdef-style' ), WPDEF_VERSION );
	}

	if ( $context['navigation'] || ( $context['base'] && get_theme_mod( 'wpdef_back_to_top', true ) ) ) {
		wp_enqueue_script( 'wpdef-navigation', get_theme_file_uri( '/assets/js/navigation.min.js' ), array(), WPDEF_VERSION, true );
		wp_localize_script(
			'wpdef-navigation',
			'wpdefNavigationL10n',
			array(
				/* translators: %s: navigation item label. */
				'openSubmenu'  => __( 'Open submenu for %s', 'wp-definitivo' ),
				/* translators: %s: navigation item label. */
				'closeSubmenu' => __( 'Close submenu for %s', 'wp-definitivo' ),
			)
		);
		wp_script_add_data( 'wpdef-navigation', 'strategy', 'defer' );
	}

	if ( $context['content'] && is_page( 'tema-wp-definitivo' ) ) {
		wp_enqueue_script( 'wpdef-docs-language', get_theme_file_uri( '/assets/js/docs-language.min.js' ), array(), WPDEF_VERSION . '-language-highlight-en-3', true );
		wp_script_add_data( 'wpdef-docs-language', 'strategy', 'defer' );
	}

	if ( $context['woocommerce'] && wpdef_query_condition( 'is_product' ) ) {
		wp_enqueue_script(
			'wpdef-product-variations',
			get_theme_file_uri( '/assets/js/product-variations.min.js' ),
			array( 'wc-add-to-cart-variation' ),
			WPDEF_VERSION,
			true
		);
		wp_script_add_data( 'wpdef-product-variations', 'strategy', 'defer' );
	}

	if ( $context['content'] && is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'wpdef_scripts' );

/**
 * Prevent WooCommerce's classic styles from being enqueued off commerce views.
 *
 * @param array $styles WooCommerce style definitions.
 * @return array
 */
function wpdef_filter_woocommerce_styles( $styles ) {
	return wpdef_page_needs_woocommerce_assets() ? $styles : array();
}
add_filter( 'woocommerce_enqueue_styles', 'wpdef_filter_woocommerce_styles', 100 );

/**
 * Remove globally enqueued WooCommerce assets from pages that do not use them.
 *
 * @return void
 */
function wpdef_optimize_woocommerce_assets() {
	if ( ! class_exists( 'WooCommerce' ) || wpdef_page_needs_woocommerce_assets() ) {
		return;
	}

	foreach ( array( 'woocommerce-layout', 'woocommerce-smallscreen', 'woocommerce-general', 'woocommerce-inline', 'wc-blocks-style' ) as $handle ) {
		wp_dequeue_style( $handle );
	}

	if ( function_exists( 'wp_styles' ) ) {
		$styles = wp_styles();

		foreach ( (array) $styles->queue as $handle ) {
			if ( 0 === strpos( $handle, 'wc-blocks-style-' ) ) {
				wp_dequeue_style( $handle );
			}
		}
	}

	foreach ( array(
		'wc-add-to-cart',
		'wc-cart-fragments',
		'wc-jquery-blockui',
		'jquery-blockui',
		'wc-js-cookie',
		'js-cookie',
		'woocommerce',
	) as $handle ) {
		wp_dequeue_script( $handle );
	}
}
add_action( 'wp_enqueue_scripts', 'wpdef_optimize_woocommerce_assets', 100 );
add_action( 'wp_head', 'wpdef_optimize_woocommerce_assets', 100 );
add_action( 'wp_footer', 'wpdef_optimize_woocommerce_assets', 1 );

/**
 * Register the theme's local fonts as system fonts inside Elementor.
 *
 * This lets Elementor use the existing theme font files without requesting
 * duplicate copies from Google Fonts.
 *
 * @param array $fonts Additional Elementor fonts.
 * @return array
 */
function wpdef_register_elementor_fonts( $fonts ) {
	$fonts['Inter']          = 'system';
	$fonts['JetBrains Mono'] = 'system';

	return $fonts;
}
add_filter( 'elementor/fonts/additional_fonts', 'wpdef_register_elementor_fonts' );

/**
 * Preload the primary local font when it is selected for body or headings.
 *
 * @param array $preloads WordPress preload resource definitions.
 * @return array
 */
function wpdef_preload_resources( $preloads ) {
	$context = wpdef_get_asset_context();

	if ( ! $context['base'] ) {
		return $preloads;
	}

	$body_font    = get_theme_mod( 'wpdef_theme_body_font', 'inter' );
	$heading_font = get_theme_mod( 'wpdef_theme_heading_font', 'inter' );

	if ( 'inter' !== $body_font && 'inter' !== $heading_font ) {
		return $preloads;
	}

	$href = get_theme_file_uri( '/assets/fonts/inter-latin.woff2' );

	foreach ( $preloads as $preload ) {
		if ( isset( $preload['href'] ) && $href === $preload['href'] ) {
			return $preloads;
		}
	}

	$preloads[] = array(
		'href'        => $href,
		'as'          => 'font',
		'type'        => 'font/woff2',
		'crossorigin' => 'anonymous',
	);

	return $preloads;
}
add_filter( 'wp_preload_resources', 'wpdef_preload_resources' );
