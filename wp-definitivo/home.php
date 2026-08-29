<?php
/**
 * Posts index template.
 *
 * @package WP_Definitivo
 */

get_header();

$wpdef_title = single_post_title( '', false );
if ( ! $wpdef_title ) {
	$wpdef_title = __( 'Latest posts', 'wp-definitivo' );
}

$wpdef_posts_page_id          = absint( get_option( 'page_for_posts' ) );
$wpdef_posts_page_description = $wpdef_posts_page_id ? trim( (string) get_post_field( 'post_excerpt', $wpdef_posts_page_id ) ) : '';

if ( ! wpdef_elementor_do_content_location( 'archive' ) ) {
	get_template_part(
		'template-parts/archive-loop',
		null,
		array(
			'title'       => $wpdef_title,
			'description' => $wpdef_posts_page_description ? wpautop( esc_html( $wpdef_posts_page_description ) ) : '',
		)
	);
}
get_footer();
