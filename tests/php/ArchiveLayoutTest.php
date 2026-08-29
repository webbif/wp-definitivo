<?php
/**
 * Archive layout Customizer condition tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

require_once dirname( __DIR__, 2 ) . '/wp-definitivo/inc/customizer.php';

/**
 * Tests archive Customizer visibility and effective column rules.
 */
final class ArchiveLayoutTest extends TestCase {
	/**
	 * Reset test theme mods.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_theme_mods'] = array();
	}

	/**
	 * The columns control remains hidden for the default list layout.
	 *
	 * @return void
	 */
	public function test_columns_control_is_hidden_for_list_layout() {
		$this->assertFalse( wpdef_is_archive_grid() );
	}

	/**
	 * The columns control becomes available for the grid layout.
	 *
	 * @return void
	 */
	public function test_columns_control_is_visible_for_grid_layout() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_archive_layout'] = 'grid';

		$this->assertTrue( wpdef_is_archive_grid() );
	}

	/**
	 * Three columns remain available when the Blog has no sidebar.
	 *
	 * @return void
	 */
	public function test_three_columns_are_available_without_sidebar() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_archive_columns']     = 3;
		$GLOBALS['wpdef_test_theme_mods']['wpdef_blog_sidebar_layout'] = 'none';

		$this->assertSame( 3, wpdef_get_archive_columns() );
	}

	/**
	 * A configured Blog sidebar limits the grid to two columns.
	 *
	 * @return void
	 */
	public function test_sidebar_limits_grid_to_two_columns() {
		$GLOBALS['wpdef_test_theme_mods']['wpdef_archive_columns']     = 3;
		$GLOBALS['wpdef_test_theme_mods']['wpdef_blog_sidebar_layout'] = 'right';

		$this->assertSame( 2, wpdef_get_archive_columns() );
	}
}
