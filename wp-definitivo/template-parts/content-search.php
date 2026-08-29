<?php
/**
 * Search result item.
 *
 * @package WP_Definitivo
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card search-result' ); ?>>
	<?php wpdef_post_thumbnail(); ?>
	<div class="post-card__body">
		<header class="entry-header">
			<p class="eyebrow"><?php echo esc_html( get_post_type_object( get_post_type() )->labels->singular_name ); ?></p>
			<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
			<?php if ( 'post' === get_post_type() ) : ?>
				<div class="entry-meta"><?php wpdef_posted_on(); ?></div>
			<?php endif; ?>
		</header>
		<div class="entry-summary"><?php the_excerpt(); ?></div>
	</div>
</article>
