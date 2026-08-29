<?php
/**
 * Not found template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) {
	get_template_part(
		'template-parts/standard-hero',
		null,
		array(
			'title'       => esc_html__( 'That page could not be found.', 'wp-definitivo' ),
			'description' => wpautop( esc_html__( 'It may have moved or no longer exists. Try a search or return to the home page.', 'wp-definitivo' ) ),
		)
	);
	?>
	<div class="wpdef-common-shell wpdef-content-shell wpdef-shell">
		<div class="wpdef-common-layout">
			<main id="primary" class="site-main wpdef-common-main wpdef-content-card" tabindex="-1">
				<section class="error-404 not-found">
					<div class="page-content">
						<?php get_search_form(); ?>
						<p><a class="wpdef-button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', 'wp-definitivo' ); ?></a></p>
					</div>
				</section>
			</main>
		</div>
	</div>
	<?php
}

get_footer();
