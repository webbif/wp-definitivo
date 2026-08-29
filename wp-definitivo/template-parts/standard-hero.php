<?php
/**
 * Standard title and description hero.
 *
 * @package WP_Definitivo
 *
 * @var array<string, string> $args Template arguments.
 */

$wpdef_title       = isset( $args['title'] ) ? $args['title'] : '';
$wpdef_description = isset( $args['description'] ) ? $args['description'] : '';

if ( ! $wpdef_title ) {
	return;
}
?>
<header class="wpdef-standard-hero" aria-labelledby="wpdef-standard-hero-title">
	<div class="wpdef-standard-hero__inner">
		<h1 id="wpdef-standard-hero-title" class="wpdef-standard-hero__title entry-title"><?php echo wp_kses_post( $wpdef_title ); ?></h1>
		<?php if ( $wpdef_description ) : ?>
			<div class="wpdef-standard-hero__description"><?php echo wp_kses_post( $wpdef_description ); ?></div>
		<?php endif; ?>
	</div>
</header>
