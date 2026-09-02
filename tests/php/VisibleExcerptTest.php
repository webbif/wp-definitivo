<?php
/**
 * Explicit excerpt visibility tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

/**
 * Tests password-aware explicit excerpts.
 */
final class VisibleExcerptTest extends TestCase {
	/**
	 * Reset post fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_posts']           = array();
		$GLOBALS['wpdef_test_protected_posts'] = array();
	}

	/**
	 * Missing posts do not produce an excerpt.
	 *
	 * @return void
	 */
	public function test_missing_post_returns_empty_excerpt() {
		$this->assertSame( '', wpdef_get_visible_explicit_excerpt( 99 ) );
	}

	/**
	 * Password-protected posts do not expose explicit excerpts.
	 *
	 * @return void
	 */
	public function test_protected_post_hides_explicit_excerpt() {
		$GLOBALS['wpdef_test_posts'][7] = (object) array(
			'ID'           => 7,
			'post_excerpt' => 'Private summary',
		);
		$GLOBALS['wpdef_test_protected_posts'][7] = true;

		$this->assertSame( '', wpdef_get_visible_explicit_excerpt( 7 ) );
	}

	/**
	 * Visible author-written excerpts are trimmed and returned.
	 *
	 * @return void
	 */
	public function test_visible_explicit_excerpt_is_trimmed() {
		$GLOBALS['wpdef_test_posts'][8] = (object) array(
			'ID'           => 8,
			'post_excerpt' => '  Visible summary  ',
		);

		$this->assertSame( 'Visible summary', wpdef_get_visible_explicit_excerpt( 8 ) );
	}
}
