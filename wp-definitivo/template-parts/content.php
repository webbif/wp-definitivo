<?php
/**
 * Archive post card.
 *
 * @package WP_Definitivo
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>
	<?php wpdef_post_thumbnail(); ?>
	<div class="post-card__body">
		<header class="entry-header">
			<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
			<div class="entry-meta"><?php wpdef_posted_on(); ?></div>
		</header>
		<div class="entry-summary">
			<?php
			if ( 'full' === get_theme_mod( 'wpdef_archive_content', 'excerpt' ) ) {
				the_content();
			} else {
				the_excerpt();
			}
			?>
		</div>
		<footer class="entry-footer"><?php wpdef_entry_footer(); ?></footer>
	</div>
</article>
