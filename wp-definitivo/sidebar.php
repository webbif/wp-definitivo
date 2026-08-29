<?php
/**
 * Contextual sidebar.
 *
 * @package WP_Definitivo
 */

if ( ! wpdef_has_sidebar() ) {
	return;
}
?>
<aside id="secondary" class="widget-area" aria-label="<?php esc_attr_e( 'Sidebar', 'wp-definitivo' ); ?>">
	<?php wpdef_display_sidebar(); ?>
</aside>
