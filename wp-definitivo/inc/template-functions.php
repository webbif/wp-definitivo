<?php
/**
 * General template helpers.
 *
 * @package WP_Definitivo
 */

/**
 * Return the built-in color schemes.
 *
 * @return array<string, array<string, string>>
 */
function wpdef_get_color_schemes() {
	return array(
		'light-blue' => array(
			'label'       => __( 'White and navy', 'wp-definitivo' ),
			'background'  => '#F6F8FC',
			'surface'     => '#FFFFFF',
			'foreground'  => '#0F172A',
			'accent'      => '#0F3D73',
			'secondary'   => '#14599F',
			'button_text' => '#F6F8FC',
		),
		'ivory-wine' => array(
			'label'       => __( 'Ivory and wine', 'wp-definitivo' ),
			'background'  => '#FAF8F5',
			'surface'     => '#FFFFFF',
			'foreground'  => '#2B2527',
			'accent'      => '#7A263A',
			'secondary'   => '#B76A78',
			'button_text' => '#FAF8F5',
		),
		'sand-green' => array(
			'label'       => __( 'Sand and green', 'wp-definitivo' ),
			'background'  => '#F4F0E6',
			'surface'     => '#FFFDF7',
			'foreground'  => '#253027',
			'accent'      => '#28533F',
			'secondary'   => '#8A7653',
			'button_text' => '#F4F0E6',
		),
		'night-wine' => array(
			'label'       => __( 'Night and wine', 'wp-definitivo' ),
			'background'  => '#1F191B',
			'surface'     => '#2A2225',
			'foreground'  => '#FAF7F4',
			'accent'      => '#E7A7B5',
			'secondary'   => '#B76A78',
			'button_text' => '#1F191B',
		),
	);
}

/**
 * Return the active color scheme values.
 *
 * @return array<string, string>
 */
function wpdef_get_active_color_scheme() {
	$schemes = wpdef_get_color_schemes();
	$choice  = get_theme_mod( 'wpdef_color_scheme', 'light-blue' );

	if ( ! isset( $schemes[ $choice ] ) ) {
		$choice = 'light-blue';
	}

	return $schemes[ $choice ];
}

/**
 * Return a validated content container width setting.
 *
 * @param string $setting Theme mod name.
 * @return string One of compact, medium, or wide.
 */
function wpdef_get_container_width_setting( $setting ) {
	$width = get_theme_mod( $setting, 'wide' );

	return in_array( $width, array( 'compact', 'medium', 'wide' ), true ) ? $width : 'wide';
}

/**
 * Return the content container width for the current front-end context.
 *
 * @return string One of compact, medium, or wide.
 */
function wpdef_get_container_width() {
	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() ) ) {
		return wpdef_get_container_width_setting( 'wpdef_shop_container_width' );
	}

	if ( function_exists( 'is_product' ) && is_product() ) {
		return wpdef_get_container_width_setting( 'wpdef_product_container_width' );
	}

	if ( function_exists( 'is_cart' ) && is_cart() ) {
		return wpdef_get_container_width_setting( 'wpdef_cart_container_width' );
	}

	if ( function_exists( 'is_checkout' ) && is_checkout() ) {
		return wpdef_get_container_width_setting( 'wpdef_checkout_container_width' );
	}

	if ( function_exists( 'is_account_page' ) && is_account_page() ) {
		return wpdef_get_container_width_setting( 'wpdef_account_container_width' );
	}

	if ( is_page() ) {
		return wpdef_get_container_width_setting( 'wpdef_page_container_width' );
	}

	if ( is_singular( 'post' ) ) {
		return wpdef_get_container_width_setting( 'wpdef_single_container_width' );
	}

	if ( is_home() || is_archive() || is_search() ) {
		return wpdef_get_container_width_setting( 'wpdef_blog_container_width' );
	}

	return 'wide';
}

/**
 * Add contextual classes to the body.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function wpdef_body_classes( $classes ) {
	$schemes   = wpdef_get_color_schemes();
	$scheme    = get_theme_mod( 'wpdef_color_scheme', 'light-blue' );
	$position  = wpdef_get_sidebar_layout();
	$layout    = get_theme_mod( 'wpdef_archive_layout', 'list' );
	$scheme    = isset( $schemes[ $scheme ] ) ? $scheme : 'light-blue';
	$classes[] = 'wpdef-scheme-' . sanitize_html_class( $scheme );
	$classes[] = 'wpdef-sidebar-' . sanitize_html_class( $position );
	$classes[] = 'wpdef-archive-' . sanitize_html_class( $layout );
	$classes[] = 'wpdef-container-width-' . sanitize_html_class( wpdef_get_container_width() );

	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() ) ) {
		$shop_columns = absint( get_theme_mod( 'wpdef_shop_columns', 3 ) );
		$shop_ratio   = get_theme_mod( 'wpdef_shop_thumbnail_ratio', 'square' );

		$shop_columns = in_array( $shop_columns, array( 2, 3, 4 ), true ) ? $shop_columns : 3;
		$shop_ratio   = in_array( $shop_ratio, array( 'square', 'vertical' ), true ) ? $shop_ratio : 'square';
		$classes[]    = 'wpdef-shop-columns-' . $shop_columns;
		$classes[]    = 'wpdef-shop-thumbnail-' . $shop_ratio;
	}

	if ( function_exists( 'is_product' ) && is_product() ) {
		$product_image_ratio = get_theme_mod( 'wpdef_product_image_ratio', 'original' );

		$product_image_ratio = in_array( $product_image_ratio, array( 'original', 'square', 'vertical' ), true ) ? $product_image_ratio : 'original';
		$classes[]           = 'wpdef-product-image-' . $product_image_ratio;
	}

	if ( get_theme_mod( 'wpdef_sticky_header', false ) ) {
		$classes[] = 'wpdef-sticky-header';
	}

	if ( wpdef_has_sidebar() ) {
		$classes[] = 'wpdef-has-sidebar';
	} else {
		$classes[] = 'wpdef-no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'wpdef_body_classes' );

/**
 * Return a validated sidebar layout theme mod.
 *
 * The legacy global position is inherited by contexts that previously used it.
 * Pages keep their former no-sidebar default.
 *
 * @param string $setting        Theme mod name.
 * @param string $default_layout Default layout.
 * @param bool   $inherit_legacy Whether to inherit the old global position.
 * @return string
 */
function wpdef_get_sidebar_layout_setting( $setting, $default_layout, $inherit_legacy = true ) {
	$layout = get_theme_mod( $setting, null );

	if ( null === $layout && $inherit_legacy ) {
		$layout = get_theme_mod( 'wpdef_sidebar_position', null );
	}

	if ( ! in_array( $layout, array( 'none', 'left', 'right' ), true ) ) {
		$layout = $default_layout;
	}

	return $layout;
}

/**
 * Return the sidebar layout for the current front-end context.
 *
 * @return string One of none, left, or right.
 */
function wpdef_get_sidebar_layout() {
	if ( is_page_template( 'page-templates/landing.php' ) ) {
		return 'none';
	}

	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() ) ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_shop_sidebar_layout', 'right' );
	}

	if ( function_exists( 'is_product' ) && is_product() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_product_sidebar_layout', 'none', false );
	}

	if ( function_exists( 'is_cart' ) && is_cart() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_cart_sidebar_layout', 'none', false );
	}

	if ( function_exists( 'is_checkout' ) && is_checkout() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_checkout_sidebar_layout', 'none', false );
	}

	if ( function_exists( 'is_account_page' ) && is_account_page() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_account_sidebar_layout', 'none', false );
	}

	if ( is_page() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_page_sidebar_layout', 'none', false );
	}

	if ( is_singular( 'post' ) ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_single_sidebar_layout', 'right' );
	}

	if ( is_home() || is_archive() || is_search() ) {
		return wpdef_get_sidebar_layout_setting( 'wpdef_blog_sidebar_layout', 'right' );
	}

	return 'none';
}

/**
 * Print user-selected color and typography variables.
 *
 * @return void
 */
function wpdef_customizer_css() {
	$schemes = wpdef_get_color_schemes();
	$choice  = get_theme_mod( 'wpdef_color_scheme', 'light-blue' );
	$choice  = isset( $schemes[ $choice ] ) ? $choice : 'light-blue';
	$scheme  = $schemes[ $choice ];
	$accent  = get_theme_mod( 'wpdef_custom_accent', '' );

	$font_families = array(
		'inter'     => '"Inter",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
		'system'    => 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
		'arial'     => 'Arial,Helvetica,sans-serif',
		'trebuchet' => '"Trebuchet MS",Arial,Helvetica,sans-serif',
	);
	$body_sizes    = array(
		'compact'  => '0.9375rem',
		'standard' => 'clamp(1rem,0.96rem + 0.2vw,1.125rem)',
		'large'    => 'clamp(1.1875rem,1.1rem + 0.3vw,1.3125rem)',
	);
	$scales        = array(
		'compact'  => '0.85',
		'standard' => '1',
		'large'    => '1.2',
	);
	$body_font     = get_theme_mod( 'wpdef_theme_body_font', 'inter' );
	$heading_font  = get_theme_mod( 'wpdef_theme_heading_font', 'inter' );
	$body_size     = get_theme_mod( 'wpdef_theme_body_size', 'standard' );
	$heading_scale = get_theme_mod( 'wpdef_theme_heading_scale', 'standard' );
	$woo_text      = get_theme_mod( 'wpdef_woocommerce_text_scale', 'standard' );
	$woo_heading   = get_theme_mod( 'wpdef_woocommerce_heading_scale', 'standard' );

	$body_font     = isset( $font_families[ $body_font ] ) ? $body_font : 'inter';
	$heading_font  = isset( $font_families[ $heading_font ] ) ? $heading_font : 'inter';
	$body_size     = isset( $body_sizes[ $body_size ] ) ? $body_size : 'standard';
	$heading_scale = isset( $scales[ $heading_scale ] ) ? $heading_scale : 'standard';
	$woo_text      = isset( $scales[ $woo_text ] ) ? $woo_text : 'standard';
	$woo_heading   = isset( $scales[ $woo_heading ] ) ? $woo_heading : 'standard';

	$css = sprintf(
		'body{--wpdef-font-body:%1$s;--wpdef-font-heading:%2$s;--wpdef-theme-body-size:%3$s;--wpdef-theme-heading-scale:%4$s;--wpdef-woocommerce-text-scale:%5$s;--wpdef-woocommerce-heading-scale:%6$s}',
		$font_families[ $body_font ],
		$font_families[ $heading_font ],
		$body_sizes[ $body_size ],
		$scales[ $heading_scale ],
		$scales[ $woo_text ],
		$scales[ $woo_heading ]
	);

	if ( $accent && wpdef_accent_meets_scheme_contrast( $accent, $scheme, 4.5 ) ) {
		$css .= sprintf(
			'body.wpdef-scheme-%1$s{--wpdef-accent:%2$s;--wpdef-button-text:%3$s}',
			sanitize_html_class( $choice ),
			esc_html( $accent ),
			esc_html( $scheme['button_text'] )
		);
	}

	wp_add_inline_style( 'wpdef-style', $css );
}
add_action( 'wp_enqueue_scripts', 'wpdef_customizer_css', 20 );

/**
 * Return a relative luminance value for a hexadecimal color.
 *
 * @param string $hex Hex color.
 * @return float
 */
function wpdef_relative_luminance( $hex ) {
	$hex = ltrim( $hex, '#' );

	if ( 3 === strlen( $hex ) ) {
		$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
	}

	$channels = array(
		hexdec( substr( $hex, 0, 2 ) ) / 255,
		hexdec( substr( $hex, 2, 2 ) ) / 255,
		hexdec( substr( $hex, 4, 2 ) ) / 255,
	);

	foreach ( $channels as $key => $channel ) {
		$channels[ $key ] = ( $channel <= 0.03928 ) ? $channel / 12.92 : pow( ( $channel + 0.055 ) / 1.055, 2.4 );
	}

	return ( 0.2126 * $channels[0] ) + ( 0.7152 * $channels[1] ) + ( 0.0722 * $channels[2] );
}

/**
 * Check WCAG contrast between two colors.
 *
 * @param string $first  First hexadecimal color.
 * @param string $second Second hexadecimal color.
 * @param float  $target Required ratio.
 * @return bool
 */
function wpdef_color_meets_contrast( $first, $second, $target = 4.5 ) {
	if ( ! sanitize_hex_color( $first ) || ! sanitize_hex_color( $second ) ) {
		return false;
	}

	$first_luminance  = wpdef_relative_luminance( $first );
	$second_luminance = wpdef_relative_luminance( $second );
	$lighter          = max( $first_luminance, $second_luminance );
	$darker           = min( $first_luminance, $second_luminance );

	return ( ( $lighter + 0.05 ) / ( $darker + 0.05 ) ) >= $target;
}

/**
 * Confirm an accent remains readable in every theme-controlled color context.
 *
 * @param string                $accent Accent color.
 * @param array<string, string> $scheme Active color scheme.
 * @param float                 $target Required ratio.
 * @return bool
 */
function wpdef_accent_meets_scheme_contrast( $accent, $scheme, $target = 4.5 ) {
	foreach ( array( 'background', 'surface', 'button_text' ) as $context ) {
		if ( empty( $scheme[ $context ] ) || ! wpdef_color_meets_contrast( $accent, $scheme[ $context ], $target ) ) {
			return false;
		}
	}

	return true;
}

/**
 * Determine the applicable sidebar ID.
 *
 * @return string
 */
function wpdef_get_sidebar_id() {
	if ( 'none' === wpdef_get_sidebar_layout() ) {
		return '';
	}

	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() ) ) {
		return 'sidebar-shop';
	}

	if ( function_exists( 'is_product' ) && is_product() ) {
		return 'sidebar-shop';
	}

	if (
		( function_exists( 'is_cart' ) && is_cart() ) ||
		( function_exists( 'is_checkout' ) && is_checkout() ) ||
		( function_exists( 'is_account_page' ) && is_account_page() )
	) {
		return 'sidebar-shop';
	}

	if ( is_page() ) {
		return 'sidebar-page';
	}

	if ( is_home() || is_archive() || is_search() || is_singular( 'post' ) ) {
		return 'sidebar-blog';
	}

	return '';
}

/**
 * Check whether the current view has an active sidebar.
 *
 * @return bool
 */
function wpdef_has_sidebar() {
	$sidebar_id = wpdef_get_sidebar_id();

	if ( 'sidebar-shop' === $sidebar_id && function_exists( 'wpdef_woocommerce_sidebar_fallback' ) ) {
		return true;
	}

	return $sidebar_id && is_active_sidebar( $sidebar_id );
}

/**
 * Display the relevant sidebar.
 *
 * @return void
 */
function wpdef_display_sidebar() {
	$sidebar_id = wpdef_get_sidebar_id();

	if ( $sidebar_id && is_active_sidebar( $sidebar_id ) ) {
		dynamic_sidebar( $sidebar_id );
	} elseif ( 'sidebar-shop' === $sidebar_id && function_exists( 'wpdef_woocommerce_sidebar_fallback' ) ) {
		wpdef_woocommerce_sidebar_fallback();
	}
}

/**
 * Return the configured archive column count.
 *
 * @return int
 */
function wpdef_get_archive_columns() {
	$columns = absint( get_theme_mod( 'wpdef_archive_columns', 2 ) );
	$sidebar = wpdef_get_sidebar_layout_setting( 'wpdef_blog_sidebar_layout', 'right' );

	if ( 'none' !== $sidebar ) {
		return 2;
	}

	return in_array( $columns, array( 2, 3 ), true ) ? $columns : 2;
}

/**
 * Return whether post thumbnails should be displayed.
 *
 * @return bool
 */
function wpdef_show_featured_images() {
	return (bool) get_theme_mod( 'wpdef_show_featured_images', true );
}

/**
 * Return whether post metadata should be displayed.
 *
 * @return bool
 */
function wpdef_show_post_meta() {
	return (bool) get_theme_mod( 'wpdef_show_post_meta', true );
}

/**
 * Print the optional floating back-to-top button.
 *
 * @return void
 */
function wpdef_back_to_top_button() {
	if ( ! get_theme_mod( 'wpdef_back_to_top', true ) ) {
		return;
	}
	?>
	<button type="button" class="wpdef-button wpdef-back-to-top">
		<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
			<path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
		</svg>
		<span><?php esc_html_e( 'Back to top', 'wp-definitivo' ); ?></span>
	</button>
	<?php
}
add_action( 'wp_footer', 'wpdef_back_to_top_button', 5 );

/**
 * Print the editable footer text with dynamic tag replacements.
 *
 * @return void
 */
function wpdef_site_copyright() {
	$text = (string) get_theme_mod(
		'wpdef_copyright',
		__( 'Copyright © [current_year] [site_title]. <a href="https://wpdefinitivo.com/">Theme by WP Definitivo.</a>', 'wp-definitivo' )
	);
	$text = strtr(
		$text,
		array(
			'[current_year]' => esc_html( wp_date( 'Y' ) ),
			'[site_title]'   => esc_html( get_bloginfo( 'name' ) ),
		)
	);

	echo wp_kses_post( $text );
}
