<?php
/**
 * Prepare the local staging-2 installation for theme runtime tests.
 */

update_option( 'blogname', 'WP Definitivo — Um título de site deliberadamente longo para testes de responsividade' );
update_option( 'blogdescription', 'Uma descrição extensa para verificar cabeçalhos, quebras de linha e navegação em diferentes larguras de tela.' );
update_option( 'WPLANG', 'pt_BR' );
update_option( 'posts_per_page', 5 );
update_option( 'permalink_structure', '/%postname%/' );
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', 701 );
update_option( 'page_for_posts', 703 );

set_theme_mod( 'wpdef_blog_sidebar_layout', 'right' );
set_theme_mod( 'wpdef_single_sidebar_layout', 'left' );
set_theme_mod( 'wpdef_page_sidebar_layout', 'right' );
set_theme_mod( 'wpdef_shop_sidebar_layout', 'right' );
set_theme_mod( 'wpdef_product_sidebar_layout', 'left' );
set_theme_mod( 'wpdef_cart_sidebar_layout', 'none' );
set_theme_mod( 'wpdef_checkout_sidebar_layout', 'none' );
set_theme_mod( 'wpdef_account_sidebar_layout', 'none' );

$menus = wp_get_nav_menus();
if ( $menus ) {
	set_theme_mod(
		'nav_menu_locations',
		array(
			'primary' => (int) $menus[0]->term_id,
			'footer'  => (int) $menus[0]->term_id,
		)
	);
}

$widget_blocks = get_option( 'widget_block', array() );
$widget_blocks[50] = array(
	'content' => '<!-- wp:search {"label":"Pesquisar","showLabel":true,"buttonText":"Pesquisar"} /-->',
);
$widget_blocks[51] = array(
	'content' => '<!-- wp:latest-posts {"postsToShow":5,"displayPostDate":true} /-->',
);
$widget_blocks['_multiwidget'] = 1;
update_option( 'widget_block', $widget_blocks );

$sidebars_widgets = get_option( 'sidebars_widgets', array() );
$sidebars_widgets['sidebar-blog'] = array( 'block-50', 'block-51' );
$sidebars_widgets['sidebar-page'] = array( 'block-50', 'block-51' );
$sidebars_widgets['sidebar-shop'] = array();
update_option( 'sidebars_widgets', $sidebars_widgets );

if ( class_exists( 'WC_Install' ) ) {
	WC_Install::create_pages();

	$woocommerce_page_titles = array(
		'woocommerce_shop_page_id'      => 'Loja',
		'woocommerce_cart_page_id'      => 'Carrinho',
		'woocommerce_checkout_page_id'  => 'Finalizar compra',
		'woocommerce_myaccount_page_id' => 'Minha conta',
	);

	foreach ( $woocommerce_page_titles as $option_name => $page_title ) {
		$page_id = (int) get_option( $option_name );

		if ( $page_id ) {
			wp_update_post(
				array(
					'ID'         => $page_id,
					'post_title' => $page_title,
				)
			);
		}
	}

	$cart_page_id = (int) get_option( 'woocommerce_cart_page_id' );

	if ( $cart_page_id ) {
		$cart_content = (string) get_post_field( 'post_content', $cart_page_id );
		$cart_content = str_replace(
			array(
				'You may be interested in&hellip;',
				'Your cart is currently empty!',
				'New in store',
			),
			array(
				'Você pode se interessar por&hellip;',
				'Seu carrinho está vazio no momento!',
				'Novidade na loja',
			),
			$cart_content
		);

		wp_update_post(
			array(
				'ID'           => $cart_page_id,
				'post_content' => $cart_content,
			)
		);
	}
}

if ( class_exists( 'WC_Product_Simple' ) && 0 === (int) wp_count_posts( 'product' )->publish ) {
	$category = wp_insert_term( 'Produtos de teste', 'product_cat' );
	$category_id = is_wp_error( $category ) ? 0 : (int) $category['term_id'];

	foreach ( array( 'Produto com título curto', 'Produto com um título muito longo para testar quebras responsivas', 'Produto acessível de demonstração' ) as $index => $title ) {
		$product = new WC_Product_Simple();
		$product->set_name( $title );
		$product->set_status( 'publish' );
		$product->set_catalog_visibility( 'visible' );
		$product->set_description( '<p>Descrição completa com <a href="#detalhes">um link contextual</a>, uma lista e conteúdo para validação do layout.</p><ul><li>Primeiro detalhe</li><li>Segundo detalhe</li></ul>' );
		$product->set_short_description( 'Descrição curta criada para validar cartões, tipografia e responsividade.' );
		$product->set_regular_price( (string) ( 49.9 + ( $index * 25 ) ) );
		$product->set_sku( 'WPDEF-TEST-' . ( $index + 1 ) );
		if ( $category_id ) {
			$product->set_category_ids( array( $category_id ) );
		}
		$product->save();
	}
}

$elementor_page = get_page_by_path( 'elementor-compatibility-test' );
if ( ! $elementor_page ) {
	$elementor_page_id = wp_insert_post(
		array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => 'Elementor Compatibility Test',
			'post_name'    => 'elementor-compatibility-test',
			'post_content' => '',
		)
	);
	if ( ! is_wp_error( $elementor_page_id ) ) {
		update_post_meta( $elementor_page_id, '_elementor_edit_mode', 'builder' );
		update_post_meta( $elementor_page_id, '_elementor_template_type', 'wp-page' );
		update_post_meta( $elementor_page_id, '_elementor_data', '[]' );
	}
}

flush_rewrite_rules();

echo "staging-2 preparado\n";
