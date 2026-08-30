<?php
/**
 * Site header.
 *
 * @package WP_Definitivo
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'wp-definitivo' ); ?></a>
<div id="page" class="site">
	<?php if ( ! wpdef_elementor_do_location( 'header' ) ) : ?>
		<header id="masthead" class="site-header">
			<div class="wpdef-shell header-inner">
				<div class="site-branding">
					<?php if ( has_custom_logo() ) : ?>
						<?php the_custom_logo(); ?>
					<?php else : ?>
						<?php if ( is_front_page() && is_home() ) : ?>
							<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
						<?php else : ?>
							<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
						<?php endif; ?>
						<?php $wpdef_description = get_bloginfo( 'description', 'display' ); ?>
						<?php if ( $wpdef_description || is_customize_preview() ) : ?>
							<p class="site-description"><?php echo esc_html( $wpdef_description ); ?></p>
						<?php endif; ?>
					<?php endif; ?>
				</div>

				<button class="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded="false">
					<span class="screen-reader-text" data-open-label="<?php echo esc_attr__( 'Open menu', 'wp-definitivo' ); ?>" data-close-label="<?php echo esc_attr__( 'Close menu', 'wp-definitivo' ); ?>"><?php esc_html_e( 'Open menu', 'wp-definitivo' ); ?></span>
					<span class="menu-toggle__label" aria-hidden="true"><?php esc_html_e( 'Menu', 'wp-definitivo' ); ?></span>
				</button>

				<nav id="site-navigation" class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'wp-definitivo' ); ?>">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'primary',
							'menu_id'        => 'primary-menu',
							'menu_class'     => 'primary-menu',
							'container'      => false,
							'fallback_cb'    => 'wpdef_primary_menu_fallback',
						)
					);
					?>
				</nav>

				<div class="header-actions">
					<?php if ( get_theme_mod( 'wpdef_header_search', true ) ) : ?>
						<button class="search-toggle" type="button" aria-controls="header-search" aria-expanded="false">
							<span class="screen-reader-text"><?php esc_html_e( 'Open search', 'wp-definitivo' ); ?></span>
							<svg class="wpdef-header-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
								<circle cx="10.75" cy="10.75" r="6.25"></circle>
								<path d="m15.5 15.5 4.25 4.25"></path>
							</svg>
						</button>
					<?php endif; ?>
					<?php if ( class_exists( 'WooCommerce' ) && get_theme_mod( 'wpdef_header_cart', true ) ) : ?>
						<?php wpdef_cart_link(); ?>
					<?php endif; ?>
				</div>
			</div>

			<?php if ( get_theme_mod( 'wpdef_header_search', true ) ) : ?>
				<div id="header-search" class="header-search" aria-hidden="true">
					<div class="wpdef-shell header-search__inner">
						<?php get_search_form(); ?>
						<button class="search-close" type="button">
							<span class="screen-reader-text"><?php esc_html_e( 'Close search', 'wp-definitivo' ); ?></span>
							<svg class="wpdef-header-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
								<path d="M6 6l12 12M18 6 6 18"></path>
							</svg>
						</button>
					</div>
				</div>
			<?php endif; ?>
		</header>
	<?php endif; ?>
