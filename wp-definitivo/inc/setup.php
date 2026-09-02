<?php
/**
 * Theme setup, assets, menus, and widget areas.
 *
 * @package WP_Definitivo
 */

if ( ! function_exists( 'wpdef_setup' ) ) {
	/**
	 * Set up theme defaults and register WordPress features.
	 *
	 * @return void
	 */
	function wpdef_setup() {
		load_theme_textdomain( 'wp-definitivo', get_template_directory() . '/languages' );

		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'align-wide' );
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'editor-styles' );
		add_editor_style( 'assets/css/editor.css' );
		add_post_type_support( 'page', 'excerpt' );

		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
				'navigation-widgets',
			)
		);

		add_theme_support(
			'custom-logo',
			array(
				'height'      => 120,
				'width'       => 360,
				'flex-height' => true,
				'flex-width'  => true,
			)
		);

		register_nav_menus(
			array(
				'primary' => esc_html__( 'Primary menu', 'wp-definitivo' ),
				'footer'  => esc_html__( 'Footer menu', 'wp-definitivo' ),
			)
		);
	}
}
add_action( 'after_setup_theme', 'wpdef_setup' );

/**
 * Set the default content width.
 *
 * @return void
 */
function wpdef_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'wpdef_content_width', 760 );
}
add_action( 'after_setup_theme', 'wpdef_content_width', 0 );

/**
 * Register widget areas.
 *
 * @return void
 */
function wpdef_widgets_init() {
	$shared = array(
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	);

	register_sidebar(
		array_merge(
			$shared,
			array(
				'name'        => esc_html__( 'Blog and archives sidebar', 'wp-definitivo' ),
				'id'          => 'sidebar-blog',
				'description' => esc_html__( 'Shown on single posts, the blog, archives, and search results when enabled in the Customizer and populated with widgets.', 'wp-definitivo' ),
			)
		)
	);

	register_sidebar(
		array_merge(
			$shared,
			array(
				'name'        => esc_html__( 'Pages sidebar', 'wp-definitivo' ),
				'id'          => 'sidebar-page',
				'description' => esc_html__( 'Shown on pages when enabled in the Customizer and populated with widgets.', 'wp-definitivo' ),
			)
		)
	);

	register_sidebar(
		array_merge(
			$shared,
			array(
				'name'        => esc_html__( 'Shop sidebar', 'wp-definitivo' ),
				'id'          => 'sidebar-shop',
				'description' => esc_html__( 'Shared by WooCommerce layouts when their sidebar is enabled. Added widgets replace the theme fallback.', 'wp-definitivo' ),
			)
		)
	);
}
add_action( 'widgets_init', 'wpdef_widgets_init' );

/**
 * Render an accessible primary menu when no menu has been assigned.
 *
 * @return void
 */
function wpdef_primary_menu_fallback() {
	?>
	<ul id="primary-menu" class="primary-menu">
		<?php
		wp_list_pages(
			array(
				'title_li' => '',
				'depth'    => 3,
			)
		);
		?>
	</ul>
	<?php
}
