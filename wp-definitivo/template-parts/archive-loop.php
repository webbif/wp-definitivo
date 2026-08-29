<?php
/**
 * Shared archive loop.
 *
 * @package WP_Definitivo
 *
 * @var array<string, string> $args Template arguments.
 */

$wpdef_title        = isset( $args['title'] ) ? $args['title'] : '';
$wpdef_description  = isset( $args['description'] ) ? $args['description'] : '';
$wpdef_content_slug = isset( $args['content_slug'] ) ? $args['content_slug'] : get_post_type();
$wpdef_grid_class   = 'grid' === get_theme_mod( 'wpdef_archive_layout', 'list' ) ? ' posts-grid wpdef-cols-' . wpdef_get_archive_columns() : ' posts-list';
?>
<?php
get_template_part(
	'template-parts/standard-hero',
	null,
	array(
		'title'       => $wpdef_title,
		'description' => $wpdef_description,
	)
);
?>
<div class="wpdef-common-shell wpdef-content-shell wpdef-shell">

	<div class="wpdef-common-layout<?php echo wpdef_has_sidebar() ? ' has-sidebar' : ''; ?>">
		<main id="primary" class="site-main wpdef-common-main wpdef-content-card wpdef-archive-main" tabindex="-1">
			<?php if ( have_posts() ) : ?>
				<div class="posts-container<?php echo esc_attr( $wpdef_grid_class ); ?>">
					<?php
					while ( have_posts() ) {
						the_post();
						get_template_part( 'template-parts/content', $wpdef_content_slug );
					}
					?>
				</div>
				<?php
				the_posts_pagination(
					array(
						'mid_size'  => 2,
						'prev_text' => esc_html__( 'Previous', 'wp-definitivo' ),
						'next_text' => esc_html__( 'Next', 'wp-definitivo' ),
					)
				);
				?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content', 'none' ); ?>
			<?php endif; ?>
		</main>
		<?php get_sidebar(); ?>
	</div>
</div>
