<?php
/**
 * Empty result content.
 *
 * @package WP_Definitivo
 */

?>
<section class="no-results not-found">
	<header class="page-header">
		<h2 class="page-title"><?php esc_html_e( 'Nothing found', 'wp-definitivo' ); ?></h2>
	</header>
	<div class="page-content">
		<?php if ( is_search() ) : ?>
			<p><?php esc_html_e( 'No results matched your search. Try different keywords.', 'wp-definitivo' ); ?></p>
			<?php get_search_form(); ?>
		<?php else : ?>
			<p><?php esc_html_e( 'There is no content here yet.', 'wp-definitivo' ); ?></p>
		<?php endif; ?>
	</div>
</section>
