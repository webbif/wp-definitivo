<?php
/**
 * Comments template.
 *
 * @package WP_Definitivo
 */

if ( post_password_required() ) {
	return;
}
?>
<section id="comments" class="comments-area">
	<?php if ( have_comments() ) : ?>
		<h2 class="comments-title">
			<?php
			$wpdef_comment_count = get_comments_number();
			printf(
				/* translators: 1: comment count, 2: post title. */
				esc_html( _n( '%1$s comment on “%2$s”', '%1$s comments on “%2$s”', $wpdef_comment_count, 'wp-definitivo' ) ),
				esc_html( number_format_i18n( $wpdef_comment_count ) ),
				esc_html( get_the_title() )
			);
			?>
		</h2>

		<ol class="comment-list">
			<?php
			wp_list_comments(
				array(
					'style'       => 'ol',
					'short_ping'  => true,
					'avatar_size' => 64,
				)
			);
			?>
		</ol>

		<?php
		the_comments_navigation(
			array(
				'prev_text' => esc_html__( 'Older comments', 'wp-definitivo' ),
				'next_text' => esc_html__( 'Newer comments', 'wp-definitivo' ),
			)
		);
		?>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'wp-definitivo' ); ?></p>
	<?php endif; ?>

	<?php comment_form(); ?>
</section>
