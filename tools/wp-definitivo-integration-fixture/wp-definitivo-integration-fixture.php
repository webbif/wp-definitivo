<?php
/**
 * Plugin Name: WP Definitivo Integration Fixture
 * Description: Creates deterministic content for the public integration test environment.
 * Version: 1.0.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 *
 * @package WP_Definitivo
 */

defined( 'ABSPATH' ) || exit;

/**
 * Create or update a fixture page.
 *
 * @param string $slug    Page slug.
 * @param string $title   Page title.
 * @param string $content Page content.
 * @return int Page ID.
 */
function wpdef_integration_fixture_page( $slug, $title, $content = '' ) {
	$page = get_page_by_path( $slug, OBJECT, 'page' );
	$data = array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => $title,
		'post_name'    => $slug,
		'post_content' => $content,
	);

	if ( $page instanceof WP_Post ) {
		$data['ID'] = $page->ID;
		$result     = wp_update_post( $data, true );
	} else {
		$result = wp_insert_post( $data, true );
	}

	return is_wp_error( $result ) ? 0 : (int) $result;
}

/**
 * Prepare a clean WordPress installation for browser integration tests.
 */
function wpdef_integration_fixture_activate() {
	update_option( 'blogname', 'WP Definitivo — Um título de site deliberadamente longo para testes de responsividade' );
	update_option( 'blogdescription', 'Uma descrição extensa para verificar cabeçalhos, quebras de linha e navegação em diferentes larguras de tela.' );
	update_option( 'permalink_structure', '/%postname%/' );

	$front_page_id = wpdef_integration_fixture_page(
		'front-page',
		'Front Page',
		'<!-- wp:heading {"level":1} --><h1 class="wp-block-heading">WP Definitivo</h1><!-- /wp:heading --><!-- wp:paragraph --><p>Accessible integration fixture content.</p><!-- /wp:paragraph -->'
	);
	$blog_page_id  = wpdef_integration_fixture_page( 'blog', 'Blog' );
	$menu_pages    = array(
		$front_page_id,
		$blog_page_id,
		wpdef_integration_fixture_page( 'about-the-tests', 'About The Tests' ),
		wpdef_integration_fixture_page( 'level-1', 'Level 1' ),
		wpdef_integration_fixture_page( 'lorem-ipsum', 'Lorem Ipsum' ),
		wpdef_integration_fixture_page( 'page-a', 'Page A' ),
		wpdef_integration_fixture_page( 'page-b', 'Page B' ),
	);

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $front_page_id );
	update_option( 'page_for_posts', $blog_page_id );

	$menu = wp_get_nav_menu_object( 'Integration Menu' );
	if ( ! $menu ) {
		$menu_id = wp_create_nav_menu( 'Integration Menu' );
	} else {
		$menu_id = (int) $menu->term_id;
	}

	if ( ! is_wp_error( $menu_id ) ) {
		$existing_items = wp_get_nav_menu_items( $menu_id );
		if ( ! $existing_items ) {
			foreach ( array_filter( $menu_pages ) as $page_id ) {
				wp_update_nav_menu_item(
					$menu_id,
					0,
					array(
						'menu-item-object-id' => $page_id,
						'menu-item-object'    => 'page',
						'menu-item-type'      => 'post_type',
						'menu-item-status'    => 'publish',
					)
				);
			}
		}

		set_theme_mod(
			'nav_menu_locations',
			array(
				'primary' => (int) $menu_id,
				'footer'  => (int) $menu_id,
			)
		);
	}

	if ( class_exists( 'WC_Install' ) ) {
		WC_Install::create_pages();

		$woocommerce_pages = array(
			'woocommerce_shop_page_id'      => array( 'shop', 'Shop', '' ),
			'woocommerce_cart_page_id'      => array( 'cart', 'Cart', '<!-- wp:woocommerce/cart /-->' ),
			'woocommerce_checkout_page_id'  => array( 'checkout', 'Checkout', '<!-- wp:woocommerce/checkout /-->' ),
			'woocommerce_myaccount_page_id' => array( 'my-account', 'My account', '[woocommerce_my_account]' ),
		);

		foreach ( $woocommerce_pages as $option_name => $page_data ) {
			$page_id = (int) get_option( $option_name );
			if ( $page_id ) {
				wp_update_post(
					array(
						'ID'           => $page_id,
						'post_name'    => $page_data[0],
						'post_title'   => $page_data[1],
						'post_content' => $page_data[2],
					)
				);
			}
		}
	}

	if ( class_exists( 'WC_Product_Simple' ) ) {
		$product_id = wc_get_product_id_by_sku( 'WPDEF-INTEGRATION-RESPONSIVE' );
		$product    = $product_id ? wc_get_product( $product_id ) : new WC_Product_Simple();

		if ( $product instanceof WC_Product ) {
			$product->set_name( 'Produto com um título muito longo para testar quebras responsivas' );
			$product->set_slug( 'wp-definitivo-responsive-test-product' );
			$product->set_status( 'publish' );
			$product->set_catalog_visibility( 'visible' );
			$product->set_description( 'Produto criado exclusivamente para a integração automatizada.' );
			$product->set_short_description( 'Fixture responsiva do WP Definitivo.' );
			$product->set_regular_price( '99.90' );
			$product->set_sku( 'WPDEF-INTEGRATION-RESPONSIVE' );
			$product->set_stock_status( 'instock' );
			$product->save();
		}
	}

	flush_rewrite_rules();
}

register_activation_hook( __FILE__, 'wpdef_integration_fixture_activate' );
