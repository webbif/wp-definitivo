<?php
/**
 * Shared page layout controlled by the Customizer.
 *
 * @package WP_Definitivo
 *
 * @var array<string, bool> $args Template arguments.
 */

$wpdef_has_sidebar         = wpdef_has_sidebar();
$wpdef_show_comments       = ! isset( $args['show_comments'] ) || $args['show_comments'];
$wpdef_is_transaction_page =
	( function_exists( 'is_cart' ) && is_cart() ) ||
	( function_exists( 'is_checkout' ) && is_checkout() ) ||
	( function_exists( 'is_account_page' ) && is_account_page() );
?>

<?php
while ( have_posts() ) :
	the_post();
	$wpdef_page_description = wpdef_get_visible_explicit_excerpt( get_the_ID() );

	if ( ! $wpdef_is_transaction_page ) {
		get_template_part(
			'template-parts/standard-hero',
			null,
			array(
				'title'       => esc_html( get_the_title() ),
				'description' => $wpdef_page_description ? wpautop( esc_html( $wpdef_page_description ) ) : '',
			)
		);
	}
	?>
	<div class="wpdef-common-shell wpdef-content-shell wpdef-shell<?php echo $wpdef_is_transaction_page ? ' wpdef-transaction-shell' : ''; ?>">
		<div class="wpdef-common-layout<?php echo $wpdef_has_sidebar ? ' has-sidebar' : ''; ?>">
			<main id="primary" class="site-main wpdef-common-main wpdef-content-card wpdef-page-main" tabindex="-1">
				<?php if ( $wpdef_is_transaction_page ) : ?>
					<header class="wpdef-transaction-header" aria-labelledby="wpdef-transaction-title">
						<h1 id="wpdef-transaction-title" class="wpdef-transaction-header__title"><?php echo esc_html( get_the_title() ); ?></h1>
					</header>
				<?php endif; ?>
				<?php
				get_template_part(
					'template-parts/content',
					'page',
					array(
						'show_title' => false,
					)
				);

				if ( $wpdef_show_comments && ( comments_open() || get_comments_number() ) ) {
					comments_template();
				}
				?>
			</main>
			<?php get_sidebar(); ?>
		</div>
	</div>
<?php endwhile; ?>
