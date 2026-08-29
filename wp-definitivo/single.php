<?php
/**
 * Single post template.
 *
 * @package WP_Definitivo
 */

get_header();

if ( ! wpdef_elementor_do_content_location( 'single' ) ) :
	?>
	<main id="primary" class="site-main wpdef-single-post" tabindex="-1">
		<?php
		while ( have_posts() ) {
			the_post();
			get_template_part( 'template-parts/content', 'single' );
			?>
			<div class="wpdef-shell wpdef-single-after">
				<div class="wpdef-single-after__content wpdef-content-card">
					<?php
					the_post_navigation(
						array(
							'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous', 'wp-definitivo' ) . '</span><span class="nav-title">%title</span>',
							'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next', 'wp-definitivo' ) . '</span><span class="nav-title">%title</span>',
						)
					);

					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
					?>
				</div>
			</div>
			<?php
		}
		?>
	</main>
	<?php
endif;

get_footer();
