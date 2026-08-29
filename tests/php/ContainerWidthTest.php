<?php
/**
 * Container width setting tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

final class ContainerWidthTest extends TestCase {
	/**
	 * Reset test theme mods.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_theme_mods'] = array();
	}

	/**
	 * Confirm the widest container is the default.
	 *
	 * @return void
	 */
	public function test_wide_is_default() {
		$this->assertSame( 'wide', wpdef_get_container_width_setting( 'wpdef_page_container_width' ) );
	}

	/**
	 * Confirm all three supported choices are accepted.
	 *
	 * @return void
	 */
	public function test_supported_widths_are_accepted() {
		foreach ( array( 'compact', 'medium', 'wide' ) as $width ) {
			$GLOBALS['wpdef_test_theme_mods']['wpdef_blog_container_width'] = $width;
			$this->assertSame( $width, wpdef_get_container_width_setting( 'wpdef_blog_container_width' ) );
		}
	}

	/**
	 * Confirm each content type reads its own independent setting.
	 *
	 * @return void
	 */
	public function test_content_types_use_independent_settings() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_page_container_width']     = 'compact';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_blog_container_width']     = 'medium';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_product_container_width']  = 'wide';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_cart_container_width']     = 'compact';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_checkout_container_width'] = 'medium';
		$GLOBALS['wpdef_test_theme_mods']['wpdef_account_container_width']  = 'wide';

		$this->assertSame( 'compact', wpdef_get_container_width_setting( 'wpdef_page_container_width' ) );
		$this->assertSame( 'medium', wpdef_get_container_width_setting( 'wpdef_blog_container_width' ) );
		$this->assertSame( 'wide', wpdef_get_container_width_setting( 'wpdef_product_container_width' ) );
		$this->assertSame( 'compact', wpdef_get_container_width_setting( 'wpdef_cart_container_width' ) );
		$this->assertSame( 'medium', wpdef_get_container_width_setting( 'wpdef_checkout_container_width' ) );
		$this->assertSame( 'wide', wpdef_get_container_width_setting( 'wpdef_account_container_width' ) );
	}

	/**
	 * Confirm an invalid value falls back to the widest container.
	 *
	 * @return void
	 */
	public function test_invalid_width_uses_wide() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_single_container_width'] = 'full';

		$this->assertSame( 'wide', wpdef_get_container_width_setting( 'wpdef_single_container_width' ) );
	}
}
