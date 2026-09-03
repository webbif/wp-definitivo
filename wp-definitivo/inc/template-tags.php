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

	$date       = get_the_date();
	$post_title = get_the_title();
	$date_label = $post_title
		? sprintf(
			/* translators: 1: publication date, 2: post title. */
			esc_html__( '%1$s for %2$s', 'wp-definitivo' ),
			$date,
			$post_title
		)
		: $date;

	printf(
		'<span class="posted-on">%1$s <a href="%2$s" rel="bookmark" aria-label="%6$s"><time class="entry-date published%3$s" datetime="%4$s">%5$s</time></a></span>',
		esc_html__( 'Published', 'wp-definitivo' ),
		esc_url( get_permalink() ),
		get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ? ' has-update' : '',
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( $date ),
		esc_attr( $date_label )
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
		$comments_number = (int) get_comments_number();
		$comments_text   = esc_html__( 'Leave a comment', 'wp-definitivo' );

		if ( 1 === $comments_number ) {
			$comments_text = esc_html__( '1 comment', 'wp-definitivo' );
		} elseif ( $comments_number > 1 ) {
			$comments_text = sprintf(
				/* translators: %s: number of comments. */
				esc_html__( '%s comments', 'wp-definitivo' ),
				number_format_i18n( $comments_number )
			);
		}

		$comments_label = $comments_text;
		$post_title     = get_the_title();

		if ( $post_title ) {
			$comments_label = sprintf(
				/* translators: 1: visible comment-link text, 2: post title. */
				esc_html__( '%1$s on %2$s', 'wp-definitivo' ),
				$comments_text,
				$post_title
			);
		}

		printf(
			'<span class="comments-link"><a href="%1$s" aria-label="%2$s">%3$s</a></span>',
			esc_url( get_comments_link() ),
			esc_attr( $comments_label ),
			esc_html( $comments_text )
		);
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
