<?php
/**
 * Color contrast tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

final class ColorContrastTest extends TestCase {
	/**
	 * Confirm all bundled accents meet WCAG AA in every color context.
	 *
	 * @return void
	 */
	public function test_bundled_schemes_meet_aa() {
		foreach ( wpdef_get_color_schemes() as $scheme ) {
			$this->assertTrue( wpdef_accent_meets_scheme_contrast( $scheme['accent'], $scheme, 4.5 ) );
		}
	}

	/**
	 * Confirm invalid and low-contrast values are rejected.
	 *
	 * @return void
	 */
	public function test_low_contrast_is_rejected() {
		$this->assertFalse( wpdef_color_meets_contrast( '#ffffff', '#ffffff', 4.5 ) );
		$this->assertFalse( wpdef_color_meets_contrast( 'not-a-color', '#ffffff', 4.5 ) );
		$this->assertFalse(
			wpdef_accent_meets_scheme_contrast(
				'#777777',
				array(
					'background'  => '#000000',
					'surface'     => '#FFFFFF',
					'button_text' => '#000000',
				),
				4.5
			)
		);
	}
}
