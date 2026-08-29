<?php
/**
 * Contextual asset loading tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

/**
 * Tests the front-end asset decision matrix.
 */
final class AssetLoadingTest extends TestCase {
	/**
	 * Reset request fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_elementor_location_matches'] = array();
		$GLOBALS['wpdef_test_post_meta']                  = array();
		$GLOBALS['wpdef_test_query_conditions']           = array();
		$GLOBALS['wpdef_test_queried_object_id']          = 48;
		unset( $GLOBALS['wpdef_asset_context'], $GLOBALS['wpdef_woocommerce_asset_context'] );
	}

	/**
	 * Native pages load the four shared theme layers.
	 *
	 * @return void
	 */
	public function test_native_page_asset_context() {
		$this->assertSame(
			array(
				'base'        => true,
				'header'      => true,
				'footer'      => true,
				'content'     => true,
				'elementor'   => false,
				'woocommerce' => false,
				'navigation'  => true,
			),
			wpdef_get_asset_context()
		);
	}

	/**
	 * Elementor Canvas remains free of theme presentation assets.
	 *
	 * @return void
	 */
	public function test_canvas_skips_all_theme_assets() {
		$GLOBALS['wpdef_test_post_meta'][48]['_wp_page_template'] = 'elementor_canvas';

		$this->assertSame(
			array(
				'base'        => false,
				'header'      => false,
				'footer'      => false,
				'content'     => false,
				'elementor'   => false,
				'woocommerce' => false,
				'navigation'  => false,
			),
			wpdef_get_asset_context()
		);
	}

	/**
	 * Elementor Full Width keeps the native frame but skips content styling.
	 *
	 * @return void
	 */
	public function test_full_width_keeps_frame_without_content_module() {
		$GLOBALS['wpdef_test_post_meta'][48]['_wp_page_template'] = 'elementor_header_footer';
		$context = wpdef_get_asset_context();

		$this->assertTrue( $context['base'] );
		$this->assertTrue( $context['header'] );
		$this->assertTrue( $context['footer'] );
		$this->assertTrue( $context['elementor'] );
		$this->assertFalse( $context['content'] );
	}

	/**
	 * Theme Builder replacements suppress the matching native modules.
	 *
	 * @return void
	 */
	public function test_theme_builder_replacements_skip_native_modules() {
		$GLOBALS['wpdef_test_elementor_location_matches'] = array(
			'header' => true,
			'footer' => true,
			'single' => true,
		);
		$context = wpdef_get_asset_context();

		$this->assertTrue( $context['base'] );
		$this->assertTrue( $context['elementor'] );
		$this->assertFalse( $context['header'] );
		$this->assertFalse( $context['footer'] );
		$this->assertFalse( $context['content'] );
		$this->assertFalse( $context['navigation'] );
	}

	/**
	 * Archive requests query the matching archive Theme Builder location.
	 *
	 * @return void
	 */
	public function test_archive_location_is_selected_for_archive_requests() {
		$GLOBALS['wpdef_test_query_conditions']['is_archive'] = true;

		$this->assertSame( 'archive', wpdef_get_elementor_content_location() );
	}

	/**
	 * Nested WooCommerce blocks are detected before plugin assets are removed.
	 *
	 * @return void
	 */
	public function test_nested_woocommerce_blocks_are_detected() {
		$blocks = array(
			array(
				'blockName'   => 'core/group',
				'innerBlocks' => array(
					array( 'blockName' => 'woocommerce/product-collection' ),
				),
			),
		);

		$this->assertTrue( wpdef_blocks_use_woocommerce( $blocks ) );
		$this->assertFalse( wpdef_blocks_use_woocommerce( array( array( 'blockName' => 'core/paragraph' ) ) ) );
	}
}
