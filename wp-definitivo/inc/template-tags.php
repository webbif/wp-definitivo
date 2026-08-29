<?php
/**
 * Template tags.
 *
 * @package WP_Definitivo
 */

/**
 * Print post metadata.
 *
 * @return void
 */
function wpdef_posted_on() {
	if ( ! wpdef_show_post_meta() ) {
		return;
	}

	printf(
		'<span class="posted-on">%1$s <a href="%2$s" rel="bookmark"><time class="entry-date published%3$s" datetime="%4$s">%5$s</time></a></span>',
		esc_html__( 'Published', 'wp-definitivo' ),
		esc_url( get_permalink() ),
		get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ? ' has-update' : '',
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() )
	);

	printf(
		/* translators: %s: author name. */
		'<span class="byline">' . esc_html__( ' by %s', 'wp-definitivo' ) . '</span>',
		'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
	);
}

/**
 * Print categories, tags, and comment link.
 *
 * @return void
 */
function wpdef_entry_footer() {
	if ( 'post' === get_post_type() ) {
		$categories = get_the_category_list( esc_html_x( ', ', 'list item separator', 'wp-definitivo' ) );
		$tags       = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'wp-definitivo' ) );

		if ( $categories ) {
			printf(
				/* translators: %s: categories. */
				'<span class="cat-links">' . esc_html__( 'Filed under %s', 'wp-definitivo' ) . '</span>',
				wp_kses_post( $categories )
			);
		}

		if ( $tags ) {
			printf(
				/* translators: %s: tags. */
				'<span class="tags-links">' . esc_html__( 'Tagged %s', 'wp-definitivo' ) . '</span>',
				wp_kses_post( $tags )
			);
		}
	}

	if ( ! is_singular() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		comments_popup_link(
			esc_html__( 'Leave a comment', 'wp-definitivo' ),
			esc_html__( '1 comment', 'wp-definitivo' ),
			esc_html__( '% comments', 'wp-definitivo' )
		);
		echo '</span>';
	}

	edit_post_link(
		esc_html__( 'Edit', 'wp-definitivo' ),
		'<span class="edit-link">',
		'</span>'
	);
}

/**
 * Print a linked post thumbnail when enabled.
 *
 * @return void
 */
function wpdef_post_thumbnail() {
	if ( post_password_required() || is_attachment() || ! has_post_thumbnail() || ! wpdef_show_featured_images() ) {
		return;
	}

	if ( is_singular() ) {
		printf(
			'<figure class="post-thumbnail">%s</figure>',
			get_the_post_thumbnail( null, 'large', array( 'loading' => 'eager' ) ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
		return;
	}

	printf(
		'<a class="post-thumbnail" href="%1$s" aria-hidden="true" tabindex="-1">%2$s</a>',
		esc_url( get_permalink() ),
		get_the_post_thumbnail( null, 'large' ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}
