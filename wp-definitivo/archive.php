<?php
/**
 * Archive template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'archive' ) ) {
	get_template_part(
		'template-parts/archive-loop',
		null,
		array(
			'title'       => get_the_archive_title(),
			'description' => get_the_archive_description(),
		)
	);
}

get_footer();
