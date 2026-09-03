<?php
/**
 * Search form.
 *
 * @package WP_Definitivo
 */

$wpdef_search_id = wp_unique_id( 'wpdef-search-field-' );
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="search-form__label" for="<?php echo esc_attr( $wpdef_search_id ); ?>">
		<span class="search-form__label-text"><?php echo esc_html_x( 'Search for:', 'label', 'wp-definitivo' ); ?></span>
		<span class="search-form__control">
			<svg class="search-form__icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
				<circle cx="10.75" cy="10.75" r="6.25"></circle>
				<path d="m15.5 15.5 4.25 4.25"></path>
			</svg>
			<input id="<?php echo esc_attr( $wpdef_search_id ); ?>" type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search…', 'placeholder', 'wp-definitivo' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
		</span>
	</label>
	<button type="submit" class="search-submit"><?php echo esc_html_x( 'Search', 'submit button', 'wp-definitivo' ); ?></button>
</form>
