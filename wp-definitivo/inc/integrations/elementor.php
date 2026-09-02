<?php
/**
 * Optional Elementor integration.
 *
 * @package WP_Definitivo
 */

/**
 * Register core theme locations when Elementor Pro exposes the API.
 *
 * @param object $manager Elementor theme manager.
 * @return void
 */
function wpdef_register_elementor_locations( $manager ) {
	if ( method_exists( $manager, 'register_all_core_location' ) ) {
		$manager->register_all_core_location();
	}
}
add_action( 'elementor/theme/register_locations', 'wpdef_register_elementor_locations' );

/**
 * Ask Elementor to render a theme location when available.
 *
 * @param string $location Location name.
 * @return bool
 */
function wpdef_elementor_do_location( $location ) {
	if ( function_exists( 'elementor_theme_do_location' ) ) {
		return (bool) elementor_theme_do_location( $location );
	}

	return false;
}

/**
 * Open the main landmark around Elementor content locations.
 *
 * Elementor Pro may replace the template before WordPress reaches the theme's
 * archive or singular file, notably for WooCommerce and Theme Builder archive
 * conditions. Its location hooks are therefore the only reliable point shared
 * by both the regular theme flow and those early overrides.
 *
 * @return void
 */
function wpdef_elementor_content_landmark_open() {
	global $wpdef_elementor_content_landmark_depth;

	if ( ! is_int( $wpdef_elementor_content_landmark_depth ) ) {
		$wpdef_elementor_content_landmark_depth = 0;
	}

	if ( 0 === $wpdef_elementor_content_landmark_depth ) {
		echo '<main id="primary" class="wpdef-elementor-location" tabindex="-1">';
	}

	++$wpdef_elementor_content_landmark_depth;
}

/**
 * Close the main landmark opened for an Elementor content location.
 *
 * @return void
 */
function wpdef_elementor_content_landmark_close() {
	global $wpdef_elementor_content_landmark_depth;

	if ( ! is_int( $wpdef_elementor_content_landmark_depth ) || $wpdef_elementor_content_landmark_depth < 1 ) {
		return;
	}

	--$wpdef_elementor_content_landmark_depth;

	if ( 0 === $wpdef_elementor_content_landmark_depth ) {
		echo '</main>';
	}
}

add_action( 'elementor/theme/before_do_single', 'wpdef_elementor_content_landmark_open', 0, 0 );
add_action( 'elementor/theme/after_do_single', 'wpdef_elementor_content_landmark_close', PHP_INT_MAX, 0 );
add_action( 'elementor/theme/before_do_archive', 'wpdef_elementor_content_landmark_open', 0, 0 );
add_action( 'elementor/theme/after_do_archive', 'wpdef_elementor_content_landmark_close', PHP_INT_MAX, 0 );

/**
 * Determine whether Elementor Pro has a matching document for a location.
 *
 * The second API argument checks the current display conditions without
 * printing the document, so asset decisions can be made before wp_head.
 *
 * @param string $location Location name.
 * @return bool
 */
function wpdef_elementor_location_has_template( $location ) {
	if ( ! function_exists( 'elementor_location_exits' ) ) {
		return false;
	}

	try {
		return (bool) elementor_location_exits( $location, true );
	} catch ( \Throwable $error ) {
		return false;
	}
}

/**
 * Get the Elementor Pro documents matching a Theme Builder location.
 *
 * @param string $location Location name.
 * @return array
 */
function wpdef_get_elementor_location_documents( $location ) {
	if ( ! class_exists( '\\ElementorPro\\Modules\\ThemeBuilder\\Module' ) ) {
		return array();
	}

	try {
		$module = \ElementorPro\Modules\ThemeBuilder\Module::instance();

		if ( ! $module || ! method_exists( $module, 'get_conditions_manager' ) ) {
			return array();
		}

		$manager = $module->get_conditions_manager();

		if ( ! $manager || ! method_exists( $manager, 'get_documents_for_location' ) ) {
			return array();
		}

		$documents = $manager->get_documents_for_location( $location );

		return is_array( $documents ) ? $documents : array();
	} catch ( \Throwable $error ) {
		return array();
	}
}

/**
 * Get the Elementor document for a post when the plugin is available.
 *
 * @param int $post_id Optional post ID. Defaults to the queried object.
 * @return object|null
 */
function wpdef_get_elementor_document( $post_id = 0 ) {
	if ( ! class_exists( '\\Elementor\\Plugin' ) ) {
		return null;
	}

	$post_id = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );

	if ( ! $post_id || ! isset( \Elementor\Plugin::$instance->documents ) || ! method_exists( \Elementor\Plugin::$instance->documents, 'get' ) ) {
		return null;
	}

	$document = \Elementor\Plugin::$instance->documents->get( $post_id );

	return is_object( $document ) ? $document : null;
}

/**
 * Get the selected page template slug without requiring Elementor.
 *
 * @param int $post_id Optional post ID. Defaults to the queried object.
 * @return string
 */
function wpdef_get_page_template_slug( $post_id = 0 ) {
	$post_id = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );

	if ( ! $post_id ) {
		return '';
	}

	if ( function_exists( 'get_page_template_slug' ) ) {
		$template = get_page_template_slug( $post_id );

		if ( is_string( $template ) ) {
			return $template;
		}
	}

	$template = get_post_meta( $post_id, '_wp_page_template', true );

	return is_string( $template ) ? $template : '';
}

/**
 * Determine whether the current document uses Elementor Canvas.
 *
 * @param int $post_id Optional post ID.
 * @return bool
 */
function wpdef_is_elementor_canvas( $post_id = 0 ) {
	return 'elementor_canvas' === wpdef_get_page_template_slug( $post_id );
}

/**
 * Determine whether the current document uses Elementor Full Width.
 *
 * @param int $post_id Optional post ID.
 * @return bool
 */
function wpdef_is_elementor_full_width( $post_id = 0 ) {
	return 'elementor_header_footer' === wpdef_get_page_template_slug( $post_id );
}

/**
 * Search an Elementor value recursively for WooCommerce content.
 *
 * @param mixed $value Elementor setting value.
 * @return bool
 */
function wpdef_elementor_value_uses_woocommerce( $value ) {
	if ( is_array( $value ) ) {
		foreach ( $value as $nested_value ) {
			if ( wpdef_elementor_value_uses_woocommerce( $nested_value ) ) {
				return true;
			}
		}

		return false;
	}

	if ( ! is_string( $value ) ) {
		return false;
	}

	return (bool) preg_match( '/(?:\[\s*(?:products?|product_page|product_category|product_categories|add_to_cart|woocommerce_[a-z_]+)\b|wp:woocommerce\/|wp-block-woocommerce-)/i', $value );
}

/**
 * Search Elementor element data for WooCommerce widgets or embedded content.
 *
 * @param array $elements Elementor elements data.
 * @return bool
 */
function wpdef_elementor_elements_use_woocommerce( $elements ) {
	if ( ! is_array( $elements ) ) {
		return false;
	}

	foreach ( $elements as $element ) {
		if ( ! is_array( $element ) ) {
			continue;
		}

		$widget_type = isset( $element['widgetType'] ) ? strtolower( (string) $element['widgetType'] ) : '';

		if ( $widget_type && ( 0 === strpos( $widget_type, 'woocommerce-' ) || 0 === strpos( $widget_type, 'wc-' ) || in_array( $widget_type, array( 'products', 'product', 'menu-cart' ), true ) ) ) {
			return true;
		}

		if ( isset( $element['settings'] ) && wpdef_elementor_value_uses_woocommerce( $element['settings'] ) ) {
			return true;
		}

		if ( isset( $element['elements'] ) && wpdef_elementor_elements_use_woocommerce( $element['elements'] ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether an Elementor document contains WooCommerce elements.
 *
 * @param object $document Elementor document.
 * @return bool
 */
function wpdef_elementor_document_uses_woocommerce( $document ) {
	if ( ! is_object( $document ) || ! method_exists( $document, 'get_elements_data' ) ) {
		return false;
	}

	try {
		return wpdef_elementor_elements_use_woocommerce( $document->get_elements_data() );
	} catch ( \Throwable $error ) {
		return false;
	}
}

/**
 * Determine whether a matching Theme Builder location uses WooCommerce.
 *
 * @param string $location Theme Builder location.
 * @return bool
 */
function wpdef_elementor_location_uses_woocommerce( $location ) {
	foreach ( wpdef_get_elementor_location_documents( $location ) as $document ) {
		if ( wpdef_elementor_document_uses_woocommerce( $document ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether a post was built with Elementor.
 *
 * @param int $post_id Optional post ID. Defaults to the queried object.
 * @return bool
 */
function wpdef_is_built_with_elementor( $post_id = 0 ) {
	$post_id  = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );
	$document = wpdef_get_elementor_document( $post_id );

	if ( $document && method_exists( $document, 'is_built_with_elementor' ) ) {
		return (bool) $document->is_built_with_elementor();
	}

	return $post_id && 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true );
}

/**
 * Determine whether Elementor's page settings hide the document title.
 *
 * @param int $post_id Optional post ID. Defaults to the queried object.
 * @return bool
 */
function wpdef_elementor_page_title_is_hidden( $post_id = 0 ) {
	$post_id  = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );
	$document = wpdef_get_elementor_document( $post_id );

	if ( $document && method_exists( $document, 'get_settings' ) ) {
		return 'yes' === $document->get_settings( 'hide_title' );
	}

	$page_settings = $post_id ? get_post_meta( $post_id, '_elementor_page_settings', true ) : array();

	return is_array( $page_settings ) && isset( $page_settings['hide_title'] ) && 'yes' === $page_settings['hide_title'];
}

/**
 * Render an Elementor content location.
 *
 * The location-specific before/after hooks above provide the main landmark.
 * They also cover Elementor Pro flows that replace the WordPress template
 * before this helper can run.
 *
 * @param string $location Location name.
 * @return bool
 */
function wpdef_elementor_do_content_location( $location ) {
	return wpdef_elementor_do_location( $location );
}
