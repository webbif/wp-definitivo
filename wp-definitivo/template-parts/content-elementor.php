<?php
/**
 * Unconstrained fallback for pages built with Elementor.
 *
 * @package WP_Definitivo
 *
 * @var array<string, bool> $args Template arguments.
 */

$wpdef_show_comments = ! isset( $args['show_comments'] ) || $args['show_comments'];
?>
<main id="primary" class="wpdef-elementor-page" tabindex="-1">
	<?php
	while ( have_posts() ) :
		the_post();
		$wpdef_page_description = trim( (string) get_post_field( 'post_excerpt', get_the_ID() ) );

		if ( ! wpdef_elementor_page_title_is_hidden( get_the_ID() ) ) {
			get_template_part(
				'template-parts/standard-hero',
				null,
				array(
					'title'       => esc_html( get_the_title() ),
					'description' => $wpdef_page_description ? wpautop( esc_html( $wpdef_page_description ) ) : '',
				)
			);
		}
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'wpdef-elementor-content' ); ?>>
			<?php the_content(); ?>
			<?php wp_link_pages(); ?>
		</article>
		<?php if ( $wpdef_show_comments && ( comments_open() || get_comments_number() ) ) : ?>
			<div class="wpdef-reading wpdef-elementor-comments">
				<?php comments_template(); ?>
			</div>
		<?php endif; ?>
	<?php endwhile; ?>
</main>
