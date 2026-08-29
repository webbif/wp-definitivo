<?php
/**
 * Attachment template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) {
	while ( have_posts() ) {
		the_post();
		$wpdef_attachment_description = trim( (string) get_post_field( 'post_excerpt', get_the_ID() ) );
		get_template_part(
			'template-parts/standard-hero',
			null,
			array(
				'title'       => esc_html( get_the_title() ),
				'description' => $wpdef_attachment_description ? wpautop( esc_html( $wpdef_attachment_description ) ) : '',
			)
		);
		?>
		<div class="wpdef-common-shell wpdef-content-shell wpdef-shell">
			<div class="wpdef-common-layout">
				<main id="primary" class="site-main wpdef-common-main wpdef-content-card" tabindex="-1">
					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
						<div class="entry-content">
							<?php if ( wp_attachment_is_image() ) : ?>
								<figure class="attachment-media">
									<?php echo wp_get_attachment_image( get_the_ID(), 'full' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php if ( wp_get_attachment_caption() ) : ?>
										<figcaption><?php echo esc_html( wp_get_attachment_caption() ); ?></figcaption>
									<?php endif; ?>
								</figure>
							<?php else : ?>
								<p><a href="<?php echo esc_url( wp_get_attachment_url() ); ?>"><?php esc_html_e( 'Download attachment', 'wp-definitivo' ); ?></a></p>
							<?php endif; ?>
							<?php the_content(); ?>
							<?php wp_link_pages(); ?>
						</div>
					</article>
					<?php

					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
					?>
				</main>
			</div>
		</div>
		<?php
	}
}

get_footer();
