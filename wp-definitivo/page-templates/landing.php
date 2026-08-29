<?php
/**
 * Template Name: Landing page
 * Template Post Type: page
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) {
	?>
	<main id="primary" class="site-main wpdef-landing" tabindex="-1">
		<?php
		while ( have_posts() ) {
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'landing-content' ); ?>>
				<div class="entry-content">
					<?php the_content(); ?>
					<?php wp_link_pages(); ?>
				</div>
			</article>
			<?php
		}
		?>
	</main>
	<?php
}

get_footer();
