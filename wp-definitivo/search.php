<?php
/**
 * Search results template.
 *
 * @package WP_Definitivo
 */

get_header();
if ( ! wpdef_elementor_do_content_location( 'archive' ) ) {
	get_template_part(
		'template-parts/archive-loop',
		null,
		array(
			/* translators: %s: search query. */
			'title'        => sprintf( __( 'Search results for: %s', 'wp-definitivo' ), get_search_query() ),
			'content_slug' => 'search',
		)
	);
}
get_footer();
