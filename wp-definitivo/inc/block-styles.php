<?php
/**
 * Block style registrations.
 *
 * @package WP_Definitivo
 */

/**
 * Register bundled block style variations.
 *
 * @return void
 */
function wpdef_register_block_styles() {
	register_block_style(
		'core/button',
		array(
			'name'  => 'wpdef-outline',
			'label' => __( 'Definitivo outline', 'wp-definitivo' ),
		)
	);

	register_block_style(
		'core/quote',
		array(
			'name'  => 'wpdef-organic-quote',
			'label' => __( 'Organic quote', 'wp-definitivo' ),
		)
	);

	register_block_style(
		'core/image',
		array(
			'name'  => 'wpdef-framed',
			'label' => __( 'Framed', 'wp-definitivo' ),
		)
	);

	register_block_style(
		'core/group',
		array(
			'name'  => 'wpdef-soft-panel',
			'label' => __( 'Soft panel', 'wp-definitivo' ),
		)
	);
}
add_action( 'init', 'wpdef_register_block_styles' );
