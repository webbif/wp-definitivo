<?php
/**
 * Template Name: Page with sidebar
 * Template Post Type: page
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) {
	get_template_part( 'template-parts/page-layout' );
}

get_footer();
