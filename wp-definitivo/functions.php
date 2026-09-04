<?php
/**
 * WP Definitivo functions and definitions.
 *
 * @package WP_Definitivo
 */

if ( ! defined( 'WPDEF_VERSION' ) ) {
	define( 'WPDEF_VERSION', '1.0.70' );
}

require get_template_directory() . '/inc/setup.php';
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/block-styles.php';
require get_template_directory() . '/inc/integrations/woocommerce.php';
require get_template_directory() . '/inc/integrations/elementor.php';
require get_template_directory() . '/inc/assets.php';
