<?php
/**
 * Page content.
 *
 * @package WP_Definitivo
 *
 * @var array<string, bool> $args Template arguments.
 */

$wpdef_show_title = ! isset( $args['show_title'] ) || $args['show_title'];
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if ( $wpdef_show_title ) : ?>
		<header class="entry-header">
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</header>
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
	<footer class="entry-footer">
		<?php edit_post_link( esc_html__( 'Edit', 'wp-definitivo' ) ); ?>
	</footer>
</article>
