<?php
/**
 * Customizer controls.
 *
 * @package WP_Definitivo
 */

/**
 * Sanitize checkbox values.
 *
 * @param mixed $checked Raw value.
 * @return bool
 */
function wpdef_sanitize_checkbox( $checked ) {
	return (bool) $checked;
}

/**
 * Sanitize a select against the control choices.
 *
 * @param string               $input   Raw value.
 * @param WP_Customize_Setting $setting Setting instance.
 * @return string
 */
function wpdef_sanitize_select( $input, $setting ) {
	$input   = sanitize_key( $input );
	$control = $setting->manager->get_control( $setting->id );

	return $control && array_key_exists( $input, $control->choices ) ? $input : $setting->default;
}

/**
 * Sanitize archive columns.
 *
 * @param mixed $value Raw value.
 * @return int
 */
function wpdef_sanitize_columns( $value ) {
	$value = absint( $value );

	return in_array( $value, array( 2, 3 ), true ) ? $value : 2;
}

/**
 * Sanitize WooCommerce store column counts.
 *
 * @param mixed $value Raw value.
 * @return int
 */
function wpdef_sanitize_shop_columns( $value ) {
	$value = absint( $value );

	return in_array( $value, array( 2, 3, 4 ), true ) ? $value : 3;
}

/**
 * Determine whether the archive grid layout is selected.
 *
 * @return bool
 */
function wpdef_is_archive_grid() {
	return 'grid' === get_theme_mod( 'wpdef_archive_layout', 'list' );
}

/**
 * Validate the custom accent against the selected background.
 *
 * @param WP_Error             $validity Existing validity object.
 * @param mixed                $value    Proposed value.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @return WP_Error
 */
function wpdef_validate_accent( $validity, $value, $setting ) {
	if ( '' === $value ) {
		return $validity;
	}

	$accent = sanitize_hex_color( $value );

	if ( ! $accent ) {
		$validity->add( 'invalid_color', __( 'Choose a valid hexadecimal color.', 'wp-definitivo' ) );
		return $validity;
	}

	$schemes = wpdef_get_color_schemes();
	$posted  = $setting->manager->unsanitized_post_values();
	$choice  = isset( $posted['wpdef_color_scheme'] ) ? sanitize_key( $posted['wpdef_color_scheme'] ) : get_theme_mod( 'wpdef_color_scheme', 'light-blue' );
	$scheme  = isset( $schemes[ $choice ] ) ? $schemes[ $choice ] : $schemes['light-blue'];

	if ( ! wpdef_accent_meets_scheme_contrast( $accent, $scheme, 4.5 ) ) {
		$validity->add( 'low_contrast', __( 'The accent must have a contrast ratio of at least 4.5:1 against the selected scheme surfaces and button text.', 'wp-definitivo' ) );
	}

	return $validity;
}

/**
 * Register theme options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @return void
 */
function wpdef_customize_register( $wp_customize ) {
	require_once get_template_directory() . '/inc/class-wpdef-customize-section-link-control.php';

	$wp_customize->add_panel(
		'wpdef_theme_options',
		array(
			'title'       => __( 'Theme options', 'wp-definitivo' ),
			'description' => __( 'Presentation controls for WP Definitivo.', 'wp-definitivo' ),
			'priority'    => 120,
		)
	);

	$wp_customize->add_section(
		'wpdef_colors',
		array(
			'title'    => __( 'Color scheme', 'wp-definitivo' ),
			'panel'    => 'wpdef_theme_options',
			'priority' => 10,
		)
	);

	$scheme_choices = array();
	foreach ( wpdef_get_color_schemes() as $slug => $scheme ) {
		$scheme_choices[ $slug ] = $scheme['label'];
	}

	$wp_customize->add_setting(
		'wpdef_color_scheme',
		array(
			'default'           => 'light-blue',
			'sanitize_callback' => 'wpdef_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'wpdef_color_scheme',
		array(
			'label'   => __( 'Color scheme', 'wp-definitivo' ),
			'section' => 'wpdef_colors',
			'type'    => 'select',
			'choices' => $scheme_choices,
		)
	);

	$wp_customize->add_setting(
		'wpdef_custom_accent',
		array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_hex_color',
			'validate_callback' => 'wpdef_validate_accent',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'wpdef_custom_accent',
			array(
				'label'       => __( 'Custom accent', 'wp-definitivo' ),
				'description' => __( 'Optional. The color is saved only when it maintains WCAG AA contrast against the selected scheme surfaces and button text.', 'wp-definitivo' ),
				'section'     => 'wpdef_colors',
			)
		)
	);

	$wp_customize->add_section(
		'wpdef_header',
		array(
			'title'    => __( 'Header', 'wp-definitivo' ),
			'panel'    => 'wpdef_theme_options',
			'priority' => 20,
		)
	);

	$wp_customize->add_setting(
		'wpdef_sticky_header',
		array(
			'default'           => false,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_sticky_header',
		array(
			'label'   => __( 'Keep the header visible while scrolling', 'wp-definitivo' ),
			'section' => 'wpdef_header',
			'type'    => 'checkbox',
		)
	);

	$wp_customize->add_setting(
		'wpdef_header_search',
		array(
			'default'           => true,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_header_search',
		array(
			'label'   => __( 'Show search in the header', 'wp-definitivo' ),
			'section' => 'wpdef_header',
			'type'    => 'checkbox',
		)
	);

	$wp_customize->add_setting(
		'wpdef_header_cart',
		array(
			'default'           => true,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_header_cart',
		array(
			'label'   => __( 'Show cart in the header', 'wp-definitivo' ),
			'section' => 'wpdef_header',
			'type'    => 'checkbox',
		)
	);

	$wp_customize->add_section(
		'wpdef_typography',
		array(
			'title'       => __( 'Typography', 'wp-definitivo' ),
			'description' => __( 'Choose which typography settings to configure.', 'wp-definitivo' ),
			'panel'       => 'wpdef_theme_options',
			'priority'    => 25,
		)
	);

	$typography_sections = array(
		'wpdef_theme_typography'       => array(
			'title'       => __( 'Theme typography', 'wp-definitivo' ),
			'description' => __( 'Typography settings for pages, posts, navigation, and widgets.', 'wp-definitivo' ),
		),
		'wpdef_woocommerce_typography' => array(
			'title'       => __( 'WooCommerce typography', 'wp-definitivo' ),
			'description' => __( 'Typography settings for the store, products, cart, checkout, and account pages.', 'wp-definitivo' ),
		),
	);

	$typography_section_priority = 26;
	foreach ( $typography_sections as $section_id => $section_args ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'       => $section_args['title'],
				'description' => $section_args['description'],
				'panel'       => 'wpdef_theme_options',
				'priority'    => $typography_section_priority,
			)
		);

		$wp_customize->add_control(
			new WPDEF_Customize_Section_Link_Control(
				$wp_customize,
				'wpdef_link_' . $section_id,
				array(
					'label'          => $section_args['title'],
					'section'        => 'wpdef_typography',
					'settings'       => array(),
					'target_section' => $section_id,
					'priority'       => $typography_section_priority,
				)
			)
		);

		++$typography_section_priority;
	}

	$font_family_choices = array(
		'inter'     => __( 'Inter', 'wp-definitivo' ),
		'system'    => __( 'System UI', 'wp-definitivo' ),
		'arial'     => __( 'Arial', 'wp-definitivo' ),
		'trebuchet' => __( 'Trebuchet MS', 'wp-definitivo' ),
	);

	$theme_typography_controls = array(
		'wpdef_theme_body_font'     => array(
			'label'    => __( 'Body font', 'wp-definitivo' ),
			'section'  => 'wpdef_theme_typography',
			'default'  => 'inter',
			'choices'  => $font_family_choices,
			'priority' => 10,
		),
		'wpdef_theme_heading_font'  => array(
			'label'    => __( 'Heading font', 'wp-definitivo' ),
			'section'  => 'wpdef_theme_typography',
			'default'  => 'inter',
			'choices'  => $font_family_choices,
			'priority' => 20,
		),
		'wpdef_theme_body_size'     => array(
			'label'       => __( 'Base text size', 'wp-definitivo' ),
			'description' => __( 'Controls paragraph and interface text across the theme.', 'wp-definitivo' ),
			'section'     => 'wpdef_theme_typography',
			'default'     => 'standard',
			'choices'     => array(
				'compact'  => __( 'Compact', 'wp-definitivo' ),
				'standard' => __( 'Standard', 'wp-definitivo' ),
				'large'    => __( 'Large', 'wp-definitivo' ),
			),
			'priority'    => 30,
		),
		'wpdef_theme_heading_scale' => array(
			'label'       => __( 'Heading scale', 'wp-definitivo' ),
			'description' => __( 'Controls the size of headings across pages, posts, and cards.', 'wp-definitivo' ),
			'section'     => 'wpdef_theme_typography',
			'default'     => 'standard',
			'choices'     => array(
				'compact'  => __( 'Compact', 'wp-definitivo' ),
				'standard' => __( 'Standard', 'wp-definitivo' ),
				'large'    => __( 'Large', 'wp-definitivo' ),
			),
			'priority'    => 40,
		),
	);

	foreach ( $theme_typography_controls as $setting_id => $control_args ) {
		$wp_customize->add_setting(
			$setting_id,
			array(
				'default'           => $control_args['default'],
				'sanitize_callback' => 'wpdef_sanitize_select',
				'transport'         => 'postMessage',
			)
		);
		$wp_customize->add_control(
			$setting_id,
			array(
				'label'       => $control_args['label'],
				'description' => isset( $control_args['description'] ) ? $control_args['description'] : '',
				'section'     => $control_args['section'],
				'type'        => 'select',
				'choices'     => $control_args['choices'],
				'priority'    => $control_args['priority'],
			)
		);
	}

	$woocommerce_typography_controls = array(
		'wpdef_woocommerce_text_scale'    => array(
			'label'       => __( 'WooCommerce text size', 'wp-definitivo' ),
			'description' => __( 'Controls descriptions, forms, cart, checkout, and account text.', 'wp-definitivo' ),
			'default'     => 'standard',
			'priority'    => 10,
		),
		'wpdef_woocommerce_heading_scale' => array(
			'label'       => __( 'WooCommerce heading scale', 'wp-definitivo' ),
			'description' => __( 'Controls product, product card, cart, checkout, and account headings.', 'wp-definitivo' ),
			'default'     => 'standard',
			'priority'    => 20,
		),
	);

	foreach ( $woocommerce_typography_controls as $setting_id => $control_args ) {
		$wp_customize->add_setting(
			$setting_id,
			array(
				'default'           => $control_args['default'],
				'sanitize_callback' => 'wpdef_sanitize_select',
				'transport'         => 'postMessage',
			)
		);
		$wp_customize->add_control(
			$setting_id,
			array(
				'label'       => $control_args['label'],
				'description' => $control_args['description'],
				'section'     => 'wpdef_woocommerce_typography',
				'type'        => 'select',
				'choices'     => array(
					'compact'  => __( 'Compact', 'wp-definitivo' ),
					'standard' => __( 'Standard', 'wp-definitivo' ),
					'large'    => __( 'Large', 'wp-definitivo' ),
				),
				'priority'    => $control_args['priority'],
			)
		);
	}

	$template_sections = array(
		'wpdef_page' => array(
			'title'       => __( 'Page', 'wp-definitivo' ),
			'description' => __( 'Layout options for standard pages.', 'wp-definitivo' ),
			'priority'    => 30,
		),
		'wpdef_blog' => array(
			'title'       => __( 'Blog', 'wp-definitivo' ),
			'description' => __( 'Layout options for the posts page, archives, and search results.', 'wp-definitivo' ),
			'priority'    => 40,
		),
		'wpdef_post' => array(
			'title'       => __( 'Post', 'wp-definitivo' ),
			'description' => __( 'Layout and content options for individual posts.', 'wp-definitivo' ),
			'priority'    => 50,
		),
	);

	foreach ( $template_sections as $section_id => $section_args ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'       => $section_args['title'],
				'description' => $section_args['description'],
				'panel'       => 'wpdef_theme_options',
				'priority'    => $section_args['priority'],
			)
		);
	}

	$wp_customize->add_section(
		'wpdef_store',
		array(
			'title'       => __( 'Store', 'wp-definitivo' ),
			'description' => __( 'Choose a WooCommerce page to configure its container and sidebar.', 'wp-definitivo' ),
			'panel'       => 'wpdef_theme_options',
			'priority'    => 60,
		)
	);

	$woocommerce_sections = array(
		'wpdef_store_page' => array(
			'title'       => __( 'Store Page', 'wp-definitivo' ),
			'description' => __( 'Layout options for the main store, product categories, product tags, and product search results.', 'wp-definitivo' ),
		),
		'wpdef_product'    => array(
			'title'       => __( 'Individual product', 'wp-definitivo' ),
			'description' => __( 'Layout options for individual WooCommerce products.', 'wp-definitivo' ),
		),
		'wpdef_cart'       => array(
			'title'       => __( 'Cart', 'wp-definitivo' ),
			'description' => __( 'Layout options for the WooCommerce cart page.', 'wp-definitivo' ),
		),
		'wpdef_checkout'   => array(
			'title'       => __( 'Checkout', 'wp-definitivo' ),
			'description' => __( 'Layout options for checkout and order confirmation.', 'wp-definitivo' ),
		),
		'wpdef_account'    => array(
			'title'       => __( 'My Account', 'wp-definitivo' ),
			'description' => __( 'Layout options for the account dashboard, orders, downloads, addresses, account details, and lost password views.', 'wp-definitivo' ),
		),
	);

	$woocommerce_section_priority = 61;
	foreach ( $woocommerce_sections as $section_id => $section_args ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'       => $section_args['title'],
				'description' => $section_args['description'],
				'panel'       => 'wpdef_theme_options',
				'priority'    => $woocommerce_section_priority,
			)
		);

		$wp_customize->add_control(
			new WPDEF_Customize_Section_Link_Control(
				$wp_customize,
				'wpdef_link_' . $section_id,
				array(
					'label'          => $section_args['title'],
					'section'        => 'wpdef_store',
					'settings'       => array(),
					'target_section' => $section_id,
					'priority'       => $woocommerce_section_priority,
				)
			)
		);

		++$woocommerce_section_priority;
	}

	$container_width_choices = array(
		'compact' => __( 'Compact (1080 px)', 'wp-definitivo' ),
		'medium'  => __( 'Medium (1200 px)', 'wp-definitivo' ),
		'wide'    => __( 'Wide (1440 px)', 'wp-definitivo' ),
	);

	$container_width_controls = array(
		'wpdef_page_container_width'     => 'wpdef_page',
		'wpdef_blog_container_width'     => 'wpdef_blog',
		'wpdef_single_container_width'   => 'wpdef_post',
		'wpdef_shop_container_width'     => 'wpdef_store_page',
		'wpdef_product_container_width'  => 'wpdef_product',
		'wpdef_cart_container_width'     => 'wpdef_cart',
		'wpdef_checkout_container_width' => 'wpdef_checkout',
		'wpdef_account_container_width'  => 'wpdef_account',
	);

	foreach ( $container_width_controls as $setting_id => $section_id ) {
		$wp_customize->add_setting(
			$setting_id,
			array(
				'default'           => 'wide',
				'sanitize_callback' => 'wpdef_sanitize_select',
			)
		);
		$wp_customize->add_control(
			$setting_id,
			array(
				'label'       => __( 'Container width', 'wp-definitivo' ),
				'description' => __( 'Sets the maximum width of the content and optional sidebar. The page hero keeps its standard width.', 'wp-definitivo' ),
				'section'     => $section_id,
				'type'        => 'radio',
				'choices'     => $container_width_choices,
				'priority'    => 10,
			)
		);
	}

	$sidebar_choices = array(
		'none'  => __( 'No sidebar', 'wp-definitivo' ),
		'left'  => __( 'Left', 'wp-definitivo' ),
		'right' => __( 'Right', 'wp-definitivo' ),
	);

	$sidebar_layout_controls = array(
		'wpdef_page_sidebar_layout'     => array(
			'section' => 'wpdef_page',
			'default' => 'none',
		),
		'wpdef_single_sidebar_layout'   => array(
			'section' => 'wpdef_post',
			'default' => 'right',
		),
		'wpdef_blog_sidebar_layout'     => array(
			'section' => 'wpdef_blog',
			'default' => 'right',
		),
		'wpdef_shop_sidebar_layout'     => array(
			'section' => 'wpdef_store_page',
			'default' => 'right',
		),
		'wpdef_product_sidebar_layout'  => array(
			'section' => 'wpdef_product',
			'default' => 'none',
		),
		'wpdef_cart_sidebar_layout'     => array(
			'section' => 'wpdef_cart',
			'default' => 'none',
		),
		'wpdef_checkout_sidebar_layout' => array(
			'section' => 'wpdef_checkout',
			'default' => 'none',
		),
		'wpdef_account_sidebar_layout'  => array(
			'section' => 'wpdef_account',
			'default' => 'none',
		),
	);

	foreach ( $sidebar_layout_controls as $setting_id => $control_args ) {
		$sidebar_description = in_array( $setting_id, array( 'wpdef_shop_sidebar_layout', 'wpdef_product_sidebar_layout', 'wpdef_cart_sidebar_layout', 'wpdef_checkout_sidebar_layout', 'wpdef_account_sidebar_layout' ), true )
			? __( 'The store sidebar displays product search and categories when its widget area is empty.', 'wp-definitivo' )
			: __( 'The sidebar is displayed only when its widget area contains widgets.', 'wp-definitivo' );

		$wp_customize->add_setting(
			$setting_id,
			array(
				'default'           => $control_args['default'],
				'sanitize_callback' => 'wpdef_sanitize_select',
			)
		);
		$wp_customize->add_control(
			$setting_id,
			array(
				'label'       => __( 'Sidebar position', 'wp-definitivo' ),
				'description' => $sidebar_description,
				'section'     => $control_args['section'],
				'type'        => 'radio',
				'choices'     => $sidebar_choices,
				'priority'    => 20,
			)
		);
	}

	$wp_customize->add_setting(
		'wpdef_shop_columns',
		array(
			'default'           => 3,
			'sanitize_callback' => 'wpdef_sanitize_shop_columns',
		)
	);
	$wp_customize->add_control(
		'wpdef_shop_columns',
		array(
			'label'       => __( 'Product grid columns', 'wp-definitivo' ),
			'description' => __( 'Choose the number of products displayed in each row of the store catalog.', 'wp-definitivo' ),
			'section'     => 'wpdef_store_page',
			'type'        => 'select',
			'priority'    => 30,
			'choices'     => array(
				2 => __( 'Two', 'wp-definitivo' ),
				3 => __( 'Three', 'wp-definitivo' ),
				4 => __( 'Four', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_product_image_ratio',
		array(
			'default'           => 'original',
			'sanitize_callback' => 'wpdef_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'wpdef_product_image_ratio',
		array(
			'label'       => __( 'Product image shape', 'wp-definitivo' ),
			'description' => __( 'Choose the proportion of the main image on individual product pages.', 'wp-definitivo' ),
			'section'     => 'wpdef_product',
			'type'        => 'radio',
			'priority'    => 30,
			'choices'     => array(
				'original' => __( 'Original', 'wp-definitivo' ),
				'square'   => __( 'Square', 'wp-definitivo' ),
				'vertical' => __( 'Vertical (4:5)', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_shop_thumbnail_ratio',
		array(
			'default'           => 'square',
			'sanitize_callback' => 'wpdef_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'wpdef_shop_thumbnail_ratio',
		array(
			'label'       => __( 'Product thumbnail shape', 'wp-definitivo' ),
			'description' => __( 'Choose the image proportion used by product cards in the store catalog.', 'wp-definitivo' ),
			'section'     => 'wpdef_store_page',
			'type'        => 'radio',
			'priority'    => 40,
			'choices'     => array(
				'square'   => __( 'Square', 'wp-definitivo' ),
				'vertical' => __( 'Vertical (4:5)', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_shop_show_description',
		array(
			'default'           => false,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_shop_show_description',
		array(
			'label'       => __( 'Show product description', 'wp-definitivo' ),
			'description' => __( 'Displays the short product description in store catalog cards.', 'wp-definitivo' ),
			'section'     => 'wpdef_store_page',
			'type'        => 'checkbox',
			'priority'    => 50,
		)
	);

	$wp_customize->add_setting(
		'wpdef_archive_layout',
		array(
			'default'           => 'list',
			'sanitize_callback' => 'wpdef_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'wpdef_archive_layout',
		array(
			'label'    => __( 'Archive layout', 'wp-definitivo' ),
			'section'  => 'wpdef_blog',
			'type'     => 'radio',
			'priority' => 30,
			'choices'  => array(
				'list' => __( 'List', 'wp-definitivo' ),
				'grid' => __( 'Grid', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_archive_columns',
		array(
			'default'           => 2,
			'sanitize_callback' => 'wpdef_sanitize_columns',
		)
	);
	$wp_customize->add_control(
		'wpdef_archive_columns',
		array(
			'label'           => __( 'Grid columns', 'wp-definitivo' ),
			'description'     => __( 'The three-column layout is not compatible with a sidebar. Select No sidebar to enable it.', 'wp-definitivo' ),
			'section'         => 'wpdef_blog',
			'type'            => 'select',
			'priority'        => 40,
			'active_callback' => 'wpdef_is_archive_grid',
			'choices'         => array(
				2 => __( 'Two', 'wp-definitivo' ),
				3 => __( 'Three', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_archive_content',
		array(
			'default'           => 'excerpt',
			'sanitize_callback' => 'wpdef_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'wpdef_archive_content',
		array(
			'label'    => __( 'Posts on archive pages', 'wp-definitivo' ),
			'section'  => 'wpdef_blog',
			'type'     => 'radio',
			'priority' => 50,
			'choices'  => array(
				'excerpt' => __( 'Excerpt', 'wp-definitivo' ),
				'full'    => __( 'Full content', 'wp-definitivo' ),
			),
		)
	);

	$wp_customize->add_setting(
		'wpdef_show_featured_images',
		array(
			'default'           => true,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_show_featured_images',
		array(
			'label'   => __( 'Show featured images', 'wp-definitivo' ),
			'section' => 'wpdef_post',
			'type'    => 'checkbox',
		)
	);

	$wp_customize->add_setting(
		'wpdef_show_post_meta',
		array(
			'default'           => true,
			'sanitize_callback' => 'wpdef_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'wpdef_show_post_meta',
		array(
			'label'   => __( 'Show post metadata', 'wp-definitivo' ),
			'section' => 'wpdef_post',
			'type'    => 'checkbox',
		)
	);

	$wp_customize->add_section(
		'wpdef_footer',
		array(
			'title'    => __( 'Footer', 'wp-definitivo' ),
			'panel'    => 'wpdef_theme_options',
			'priority' => 80,
		)
	);

	$wp_customize->add_setting(
		'wpdef_copyright',
		array(
			'default'           => __( 'Copyright © [current_year] [site_title]. <a href="https://wpdefinitivo.com/">Theme by WP Definitivo.</a>', 'wp-definitivo' ),
			'sanitize_callback' => 'wp_kses_post',
		)
	);
	$wp_customize->add_control(
		'wpdef_copyright',
		array(
			'label'       => __( 'Footer text', 'wp-definitivo' ),
			'description' => __( 'Edit the text directly. Use [current_year] and [site_title] for dynamic values. Basic links and emphasis are allowed.', 'wp-definitivo' ),
			'section'     => 'wpdef_footer',
			'type'        => 'textarea',
		)
	);
}
add_action( 'customize_register', 'wpdef_customize_register' );

/**
 * Enqueue the controls used by the nested Store layout navigation.
 *
 * @return void
 */
function wpdef_customize_controls_assets() {
	wp_enqueue_style( 'wpdef-customizer-controls', get_theme_file_uri( '/assets/css/customizer-controls.css' ), array(), WPDEF_VERSION );
	wp_enqueue_script( 'wpdef-customizer-controls', get_theme_file_uri( '/assets/js/customizer-controls.js' ), array( 'customize-controls', 'jquery' ), WPDEF_VERSION, true );
}
add_action( 'customize_controls_enqueue_scripts', 'wpdef_customize_controls_assets' );

/**
 * Enqueue live-preview behavior for typography settings.
 *
 * @return void
 */
function wpdef_customize_preview_assets() {
	wp_enqueue_script( 'wpdef-customizer-preview', get_theme_file_uri( '/assets/js/customizer-preview.js' ), array( 'customize-preview' ), WPDEF_VERSION, true );
}
add_action( 'customize_preview_init', 'wpdef_customize_preview_assets' );
