<?php
/**
 * Site footer.
 *
 * @package WP_Definitivo
 */

?>
	<?php if ( ! wpdef_elementor_do_location( 'footer' ) ) : ?>
		<footer id="colophon" class="site-footer">
			<div class="wpdef-shell footer-inner">
				<div class="site-info">
					<?php wpdef_site_copyright(); ?>
				</div>

				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Footer menu', 'wp-definitivo' ); ?>">
						<?php
						wp_nav_menu(
							array(
								'theme_location' => 'footer',
								'menu_class'     => 'footer-menu',
								'container'      => false,
								'depth'          => 1,
							)
						);
						?>
					</nav>
				<?php endif; ?>
			</div>
		</footer>
	<?php endif; ?>
</div><!-- #page -->
<?php wp_footer(); ?>
</body>
</html>
