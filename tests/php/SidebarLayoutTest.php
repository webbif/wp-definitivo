<?php
/**
 * Sidebar layout setting tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

final class SidebarLayoutTest extends TestCase {
	/**
	 * Reset test theme mods.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_theme_mods'] = array();
	}

	/**
	 * Confirm invalid layouts use their context default.
	 *
	 * @return void
	 */
	public function test_invalid_layout_uses_default() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_page_sidebar_layout'] = 'center';

		$this->assertSame( 'none', wpdef_get_sidebar_layout_setting( 'wpdef_page_sidebar_layout', 'none', false ) );
	}

	/**
	 * Confirm existing users inherit the former global position where appropriate.
	 *
	 * @return void
	 */
	public function test_legacy_position_is_inherited() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_sidebar_position'] = 'left';

		$this->assertSame( 'left', wpdef_get_sidebar_layout_setting( 'wpdef_blog_sidebar_layout', 'right' ) );
		$this->assertSame( 'none', wpdef_get_sidebar_layout_setting( 'wpdef_page_sidebar_layout', 'none', false ) );
	}

	/**
	 * Confirm the product layout is independent from the former global position.
	 *
	 * @return void
	 */
	public function test_product_layout_is_independent() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_sidebar_position']       = 'left';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_product_sidebar_layout'] = 'right';

		$this->assertSame( 'right', wpdef_get_sidebar_layout_setting( 'wpdef_product_sidebar_layout', 'none', false ) );
	}

	/**
	 * Confirm transactional WooCommerce pages use independent layouts.
	 *
	 * @return void
	 */
	public function test_woocommerce_page_layouts_are_independent() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_cart_sidebar_layout']     = 'left';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_checkout_sidebar_layout'] = 'none';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_account_sidebar_layout']  = 'right';

		$this->assertSame( 'left', wpdef_get_sidebar_layout_setting( 'wpdef_cart_sidebar_layout', 'none', false ) );
		$this->assertSame( 'none', wpdef_get_sidebar_layout_setting( 'wpdef_checkout_sidebar_layout', 'none', false ) );
		$this->assertSame( 'right', wpdef_get_sidebar_layout_setting( 'wpdef_account_sidebar_layout', 'none', false ) );
	}
}
