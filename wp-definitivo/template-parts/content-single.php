<?php
/**
 * Single post content.
 *
 * @package WP_Definitivo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$wpdef_categories       = get_the_category();
$wpdef_primary_category = $wpdef_categories ? $wpdef_categories[0] : null;
$wpdef_has_update       = get_the_modified_time( 'U' ) > get_the_time( 'U' );
$wpdef_excerpt          = has_excerpt() ? get_the_excerpt() : '';
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'wpdef-single-article' ); ?>>
	<?php
	get_template_part(
		'template-parts/standard-hero',
		null,
		array(
			'title'       => esc_html( get_the_title() ),
			'description' => $wpdef_excerpt ? wpautop( esc_html( $wpdef_excerpt ) ) : '',
		)
	);
	?>

	<div class="wpdef-common-shell wpdef-content-shell wpdef-shell">
		<div class="wpdef-common-layout<?php echo wpdef_has_sidebar() ? ' has-sidebar' : ''; ?>">
			<div class="wpdef-common-main wpdef-content-card wpdef-single-content-card">
				<?php if ( wpdef_show_post_meta() ) : ?>
					<div class="wpdef-single-meta">
						<?php if ( $wpdef_primary_category ) : ?>
							<a class="wpdef-single-category" href="<?php echo esc_url( get_category_link( $wpdef_primary_category ) ); ?>"><?php echo esc_html( $wpdef_primary_category->name ); ?></a>
						<?php endif; ?>
						<span class="wpdef-single-date">
							<span class="screen-reader-text"><?php esc_html_e( 'Published', 'wp-definitivo' ); ?></span>
							<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
						</span>
						<?php if ( $wpdef_has_update ) : ?>
							<span class="wpdef-single-updated">
								<?php
								printf(
									/* translators: %s: post modified date. */
									esc_html__( 'Updated on %s', 'wp-definitivo' ),
									esc_html( get_the_modified_date() )
								);
								?>
							</span>
						<?php endif; ?>
					</div>
				<?php endif; ?>
				<?php wpdef_post_thumbnail(); ?>
				<div class="entry-content">
					<?php the_content(); ?>
					<?php
					wp_link_pages(
						array(
							'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'wp-definitivo' ) . '">',
							'after'  => '</nav>',
						)
					);
					?>
				</div>
				<footer class="entry-footer"><?php wpdef_entry_footer(); ?></footer>
			</div>
			<?php get_sidebar(); ?>
		</div>
	</div>
</article>
