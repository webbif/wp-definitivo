<?php
/**
 * Shop sidebar fallback for direct calls.
 *
 * @package WP_Definitivo
 */

if ( ! is_active_sidebar( 'sidebar-shop' ) ) {
	return;
}
?>
<aside id="secondary" class="widget-area" aria-label="<?php esc_attr_e( 'Shop sidebar', 'wp-definitivo' ); ?>">
	<?php dynamic_sidebar( 'sidebar-shop' ); ?>
</aside>
