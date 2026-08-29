<?php
/**
 * Fallback template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( is_singular() ) {
	$wpdef_elementor_location = 'single';
} elseif ( is_archive() || is_home() || is_search() ) {
	$wpdef_elementor_location = 'archive';
} else {
	$wpdef_elementor_location = 'single';
}

if ( ! wpdef_elementor_do_content_location( $wpdef_elementor_location ) ) {
	if ( is_singular() ) {
		?>
		<main id="primary" class="site-main wpdef-single-post" tabindex="-1">
			<?php
			while ( have_posts() ) {
				the_post();
				get_template_part( 'template-parts/content', 'single' );
			}
			?>
		</main>
		<?php
	} else {
		get_template_part(
			'template-parts/archive-loop',
			null,
			array(
				'title' => __( 'Latest posts', 'wp-definitivo' ),
			)
		);
	}
}

get_footer();
