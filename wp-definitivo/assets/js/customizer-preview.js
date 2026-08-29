/**
 * Live preview for the typography controls.
 *
 * @param {Object} api WordPress Customizer API.
 */
( function ( api ) {
	'use strict';

	const fontFamilies = {
		inter: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		arial: 'Arial, Helvetica, sans-serif',
		trebuchet: '"Trebuchet MS", Arial, Helvetica, sans-serif',
	};
	const bodySizes = {
		compact: '0.9375rem',
		standard: 'clamp(1rem, 0.96rem + 0.2vw, 1.125rem)',
		large: 'clamp(1.1875rem, 1.1rem + 0.3vw, 1.3125rem)',
	};
	const scales = {
		compact: '0.85',
		standard: '1',
		large: '1.2',
	};

	function bindVariable( settingId, variable, values, fallback ) {
		api( settingId, function ( setting ) {
			function updateVariable( value ) {
				document.body.style.setProperty(
					variable,
					values[ value ] || values[ fallback ]
				);
			}

			updateVariable( setting.get() );
			setting.bind( updateVariable );
		} );
	}

	bindVariable(
		'wpdef_theme_body_font',
		'--wpdef-font-body',
		fontFamilies,
		'inter'
	);
	bindVariable(
		'wpdef_theme_heading_font',
		'--wpdef-font-heading',
		fontFamilies,
		'inter'
	);
	bindVariable(
		'wpdef_theme_body_size',
		'--wpdef-theme-body-size',
		bodySizes,
		'standard'
	);
	bindVariable(
		'wpdef_theme_heading_scale',
		'--wpdef-theme-heading-scale',
		scales,
		'standard'
	);
	bindVariable(
		'wpdef_woocommerce_text_scale',
		'--wpdef-woocommerce-text-scale',
		scales,
		'standard'
	);
	bindVariable(
		'wpdef_woocommerce_heading_scale',
		'--wpdef-woocommerce-heading-scale',
		scales,
		'standard'
	);
} )( wp.customize );
