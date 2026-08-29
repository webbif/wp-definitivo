<?php
/**
 * Customizer section navigation control.
 *
 * @package WP_Definitivo
 */

/**
 * Navigation control used to open a nested Customizer section.
 */
class WPDEF_Customize_Section_Link_Control extends WP_Customize_Control {
	/**
	 * Control type.
	 *
	 * @var string
	 */
	public $type = 'wpdef-section-link';

	/**
	 * Target section ID.
	 *
	 * @var string
	 */
	public $target_section = '';

	/**
	 * Render the section navigation button.
	 *
	 * @return void
	 */
	public function render_content() {
		?>
		<button type="button" class="wpdef-customizer-section-link" data-section="<?php echo esc_attr( $this->target_section ); ?>">
			<span><?php echo esc_html( $this->label ); ?></span>
			<span class="dashicons dashicons-arrow-right-alt2" aria-hidden="true"></span>
		</button>
		<?php
	}
}
