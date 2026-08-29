<?php
/**
 * Standard page template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) :
	if ( wpdef_is_built_with_elementor() ) {
		get_template_part( 'template-parts/content', 'elementor' );
	} else {
		get_template_part( 'template-parts/page-layout' );
	}
endif;

get_footer();
