<?php
/**
 * Minimal WordPress function stubs for pure helper tests.
 *
 * @package WP_Definitivo
 */

if ( ! function_exists( '__' ) ) {
	function __( $text ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		return $text;
	}
}

if ( ! function_exists( 'add_filter' ) ) {
	function add_filter() {}
}

if ( ! function_exists( 'apply_filters' ) ) {
	function apply_filters( $hook_name, $value ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		return $value;
	}
}

if ( ! function_exists( 'add_action' ) ) {
	function add_action() {}
}

if ( ! function_exists( 'get_queried_object_id' ) ) {
	function get_queried_object_id() {
		return isset( $GLOBALS['wpdef_test_queried_object_id'] ) ? (int) $GLOBALS['wpdef_test_queried_object_id'] : 0;
	}
}

if ( ! function_exists( 'get_post_meta' ) ) {
	function get_post_meta( $post_id, $key, $single = false ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		if ( ! isset( $GLOBALS['wpdef_test_post_meta'][ $post_id ] ) || ! array_key_exists( $key, $GLOBALS['wpdef_test_post_meta'][ $post_id ] ) ) {
			return $single ? '' : array();
		}

		$value = $GLOBALS['wpdef_test_post_meta'][ $post_id ][ $key ];

		return $single ? $value : array( $value );
	}
}

if ( ! function_exists( 'get_post' ) ) {
	function get_post( $post = null ) {
		$post_id = is_object( $post ) && isset( $post->ID ) ? (int) $post->ID : (int) $post;

		return isset( $GLOBALS['wpdef_test_posts'][ $post_id ] ) ? $GLOBALS['wpdef_test_posts'][ $post_id ] : null;
	}
}

if ( ! function_exists( 'post_password_required' ) ) {
	function post_password_required( $post = null ) {
		return is_object( $post ) && ! empty( $GLOBALS['wpdef_test_protected_posts'][ $post->ID ] );
	}
}

if ( ! function_exists( 'get_post_field' ) ) {
	function get_post_field( $field, $post = null, $context = 'display' ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		$post = get_post( $post );

		return $post && isset( $post->{$field} ) ? $post->{$field} : '';
	}
}

if ( ! function_exists( 'sanitize_html_class' ) ) {
	function sanitize_html_class( $class ) {
		return preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $class );
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $text ) {
		return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'elementor_theme_do_location' ) ) {
	function elementor_theme_do_location( $location ) {
		$GLOBALS['wpdef_test_elementor_location_calls'][] = $location;

		if ( empty( $GLOBALS['wpdef_test_elementor_locations'][ $location ] ) ) {
			return false;
		}

		echo $GLOBALS['wpdef_test_elementor_locations'][ $location ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Controlled test fixture.

		return true;
	}
}

if ( ! function_exists( 'elementor_location_exits' ) ) {
	function elementor_location_exits( $location, $check_match = false ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		return ! empty( $GLOBALS['wpdef_test_elementor_location_matches'][ $location ] );
	}
}

foreach ( array( 'is_home', 'is_archive', 'is_search', 'is_front_page', 'is_customize_preview' ) as $wpdef_test_conditional ) {
	if ( ! function_exists( $wpdef_test_conditional ) ) {
		eval( 'function ' . $wpdef_test_conditional . '() { return ! empty( $GLOBALS["wpdef_test_query_conditions"]["' . $wpdef_test_conditional . '"] ); }' ); // phpcs:ignore Squiz.PHP.Eval.Discouraged -- Test bootstrap generates simple WordPress conditional stubs.
	}
}

if ( ! function_exists( 'sanitize_hex_color' ) ) {
	function sanitize_hex_color( $color ) {
		if ( '' === $color ) {
			return '';
		}

		return preg_match( '/\A#([a-f0-9]{3}){1,2}\z/i', $color ) ? $color : null;
	}
}

if ( ! function_exists( 'absint' ) ) {
	/**
	 * Return a non-negative integer for helper tests.
	 *
	 * @param mixed $maybeint Value to convert.
	 * @return int
	 */
	function absint( $maybeint ) {
		return abs( (int) $maybeint );
	}
}

if ( ! function_exists( 'get_theme_mod' ) ) {
	function get_theme_mod( $name, $default = false ) {
		return array_key_exists( $name, $GLOBALS['wpdef_test_theme_mods'] ) ? $GLOBALS['wpdef_test_theme_mods'][ $name ] : $default;
	}
}

if ( ! function_exists( 'get_template_directory_uri' ) ) {
	function get_template_directory_uri() {
		return isset( $GLOBALS['wpdef_test_template_directory_uri'] ) ? $GLOBALS['wpdef_test_template_directory_uri'] : 'https://example.test/wp-content/themes/wp-definitivo';
	}
}

require dirname( __DIR__, 2 ) . '/wp-definitivo/inc/template-functions.php';
require dirname( __DIR__, 2 ) . '/wp-definitivo/inc/integrations/elementor.php';
require dirname( __DIR__, 2 ) . '/wp-definitivo/inc/assets.php';
