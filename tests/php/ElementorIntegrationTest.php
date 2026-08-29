<?php
/**
 * Elementor integration tests.
 *
 * @package WP_Definitivo
 */

use PHPUnit\Framework\TestCase;

/**
 * Tests the optional Elementor and Theme Builder integration.
 */
final class ElementorIntegrationTest extends TestCase {
	/**
	 * Reset Elementor fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		$GLOBALS['wpdef_test_elementor_location_calls'] = array();
		$GLOBALS['wpdef_test_elementor_locations']      = array();
		$GLOBALS['wpdef_test_elementor_location_matches'] = array();
		$GLOBALS['wpdef_test_post_meta']                = array();
		$GLOBALS['wpdef_test_queried_object_id']        = 0;
		$GLOBALS['wpdef_test_query_conditions']         = array();
		unset( $GLOBALS['wpdef_asset_context'], $GLOBALS['wpdef_woocommerce_asset_context'] );
	}

	/**
	 * All core Theme Builder locations are registered when supported.
	 *
	 * @return void
	 */
	public function test_registers_all_core_theme_locations() {
		$manager = new class() {
			/** @var bool */
			public $registered = false;

			/** Register the locations. */
			public function register_all_core_location() {
				$this->registered = true;
			}
		};

		wpdef_register_elementor_locations( $manager );

		$this->assertTrue( $manager->registered );
	}

	/**
	 * Unassigned locations preserve the theme fallback.
	 *
	 * @return void
	 */
	public function test_unassigned_content_location_returns_false_without_markup() {
		ob_start();
		$rendered = wpdef_elementor_do_content_location( 'single' );
		$output   = ob_get_clean();

		$this->assertFalse( $rendered );
		$this->assertSame( '', $output );
	}

	/**
	 * Assigned locations receive an isolated accessible main wrapper.
	 *
	 * @return void
	 */
	public function test_assigned_content_location_is_rendered_without_theme_layout_class() {
		$GLOBALS['wpdef_test_elementor_locations']['archive'] = '<div class="elementor-location-archive">Archive</div>';

		ob_start();
		$rendered = wpdef_elementor_do_content_location( 'archive' );
		$output   = ob_get_clean();

		$this->assertTrue( $rendered );
		$this->assertStringContainsString( 'id="primary"', $output );
		$this->assertStringContainsString( 'wpdef-elementor-location--archive', $output );
		$this->assertStringContainsString( 'elementor-location-archive', $output );
		$this->assertStringNotContainsString( 'site-main', $output );
	}

	/**
	 * Elementor edit metadata activates the unconstrained page fallback.
	 *
	 * @return void
	 */
	public function test_detects_page_built_with_elementor_from_metadata() {
		$GLOBALS['wpdef_test_queried_object_id']                = 48;
		$GLOBALS['wpdef_test_post_meta'][48]['_elementor_edit_mode'] = 'builder';

		$this->assertTrue( wpdef_is_built_with_elementor() );
	}

	/**
	 * Elementor's hide-title page setting is honored without the plugin API.
	 *
	 * @return void
	 */
	public function test_detects_hidden_elementor_page_title_from_metadata() {
		$GLOBALS['wpdef_test_queried_object_id']                     = 48;
		$GLOBALS['wpdef_test_post_meta'][48]['_elementor_page_settings'] = array(
			'hide_title' => 'yes',
		);

		$this->assertTrue( wpdef_elementor_page_title_is_hidden() );
	}

	/**
	 * Elementor page templates are identified from WordPress metadata.
	 *
	 * @return void
	 */
	public function test_detects_canvas_and_full_width_templates() {
		$GLOBALS['wpdef_test_queried_object_id']                 = 48;
		$GLOBALS['wpdef_test_post_meta'][48]['_wp_page_template'] = 'elementor_canvas';

		$this->assertTrue( wpdef_is_elementor_canvas() );
		$this->assertFalse( wpdef_is_elementor_full_width() );

		$GLOBALS['wpdef_test_post_meta'][48]['_wp_page_template'] = 'elementor_header_footer';

		$this->assertFalse( wpdef_is_elementor_canvas() );
		$this->assertTrue( wpdef_is_elementor_full_width() );
	}

	/**
	 * Matching Theme Builder conditions can be checked without rendering.
	 *
	 * @return void
	 */
	public function test_detects_matching_theme_builder_location() {
		$GLOBALS['wpdef_test_elementor_location_matches']['header'] = true;

		$this->assertTrue( wpdef_elementor_location_has_template( 'header' ) );
		$this->assertFalse( wpdef_elementor_location_has_template( 'footer' ) );
	}

	/**
	 * WooCommerce widgets nested in Elementor data retain commerce assets.
	 *
	 * @return void
	 */
	public function test_detects_woocommerce_elements_recursively() {
		$elements = array(
			array(
				'elType'  => 'container',
				'elements' => array(
					array(
						'elType'     => 'widget',
						'widgetType' => 'woocommerce-menu-cart',
					),
				),
			),
		);

		$this->assertTrue( wpdef_elementor_elements_use_woocommerce( $elements ) );
		$this->assertFalse(
			wpdef_elementor_elements_use_woocommerce(
				array(
					array(
						'elType'     => 'widget',
						'widgetType' => 'heading',
					),
				)
			)
		);
	}

	/**
	 * Shortcodes embedded in Elementor settings retain commerce assets.
	 *
	 * @return void
	 */
	public function test_detects_woocommerce_shortcode_in_elementor_settings() {
		$this->assertTrue(
			wpdef_elementor_elements_use_woocommerce(
				array(
					array(
						'widgetType' => 'shortcode',
						'settings'   => array( 'shortcode' => '[products limit="4"]' ),
					),
				)
			)
		);
	}

	/**
	 * Local theme fonts are exposed to Elementor without Google Fonts.
	 *
	 * @return void
	 */
	public function test_registers_local_fonts_as_elementor_system_fonts() {
		$fonts = wpdef_register_elementor_fonts( array() );

		$this->assertSame( 'system', $fonts['Inter'] );
		$this->assertSame( 'system', $fonts['JetBrains Mono'] );
	}

	/**
	 * Singular templates expose the Theme Builder single location.
	 *
	 * @return void
	 */
	public function test_singular_templates_expose_theme_builder_location() {
		$theme_directory = dirname( __DIR__, 2 ) . '/wp-definitivo/';
		$templates       = array(
			'single.php',
			'page.php',
			'front-page.php',
			'404.php',
			'attachment.php',
			'page-templates/sidebar.php',
			'page-templates/landing.php',
		);

		foreach ( $templates as $template ) {
			$source = file_get_contents( $theme_directory . $template );

			$this->assertStringContainsString( "wpdef_elementor_do_content_location( 'single' )", $source, $template );
		}
	}

	/**
	 * Archive templates expose the Theme Builder archive location.
	 *
	 * @return void
	 */
	public function test_archive_templates_expose_theme_builder_location() {
		$theme_directory = dirname( __DIR__, 2 ) . '/wp-definitivo/';
		$templates       = array( 'archive.php', 'home.php', 'search.php', 'front-page.php' );

		foreach ( $templates as $template ) {
			$source = file_get_contents( $theme_directory . $template );

			$this->assertStringContainsString( "wpdef_elementor_do_content_location( 'archive' )", $source, $template );
		}
	}
}
