<?php
/**
 * Front page template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( is_home() ) {
	if ( ! wpdef_elementor_do_content_location( 'archive' ) ) {
		$wpdef_description = get_bloginfo( 'description' );
		get_template_part(
			'template-parts/archive-loop',
			null,
			array(
				'title'       => __( 'Latest posts', 'wp-definitivo' ),
				'description' => $wpdef_description ? wpautop( esc_html( $wpdef_description ) ) : '',
			)
		);
	}
} elseif ( ! wpdef_elementor_do_content_location( 'single' ) ) {
	if ( wpdef_is_built_with_elementor() ) {
		get_template_part(
			'template-parts/content',
			'elementor',
			array(
				'show_comments' => false,
			)
		);
	} else {
		get_template_part(
			'template-parts/page-layout',
			null,
			array(
				'show_comments' => false,
			)
		);
	}
}

get_footer();
