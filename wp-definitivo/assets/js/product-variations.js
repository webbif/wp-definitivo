/**
 * Progressive, accessible visual controls for WooCommerce product variations.
 *
 * Native selects remain in the markup and keep WooCommerce's variation logic
 * intact. This script only supplies button controls when JavaScript is present.
 */
( function () {
	'use strict';

	const colorValues = {
		areia: '#cbb99b',
		amarelo: '#eab308',
		azul: '#2563eb',
		'azul-marinho': '#173f74',
		bege: '#d6c2a2',
		branco: '#ffffff',
		cinza: '#64748b',
		laranja: '#f97316',
		preto: '#111827',
		rosa: '#db2777',
		roxo: '#7c3aed',
		verde: '#15803d',
		vermelho: '#dc2626',
	};

	function normalize( value ) {
		return value
			.toLocaleLowerCase()
			.normalize( 'NFD' )
			.replace( /[\u0300-\u036f]/g, '' )
			.trim();
	}

	function isColorAttribute( label, select ) {
		const value =
			`${ label.textContent } ${ select.name }`.toLocaleLowerCase();

		return value.includes( 'cor' ) || value.includes( 'color' );
	}

	function getColor( option ) {
		return colorValues[ normalize( option.textContent ) ] || '#94a3b8';
	}

	function synchronizeButtons( select, controls ) {
		controls.querySelectorAll( 'button' ).forEach( function ( button ) {
			const option = Array.from( select.options ).find(
				function ( item ) {
					return item.value === button.dataset.value;
				}
			);
			const selected = button.dataset.value === select.value;

			button.classList.toggle( 'is-selected', selected );
			button.setAttribute( 'aria-pressed', selected ? 'true' : 'false' );
			button.disabled = ! option || option.disabled;
		} );
	}

	function enhanceSelect( select ) {
		const cell = select.closest( 'td' );
		const row = select.closest( 'tr' );
		const label = row ? row.querySelector( 'th label' ) : null;

		if ( ! cell || ! row || ! label || select.dataset.wpdefEnhanced ) {
			return;
		}

		select.dataset.wpdefEnhanced = 'true';
		const controls = document.createElement( 'div' );
		const colorAttribute = isColorAttribute( label, select );
		const labelId = `${ select.id || select.name }-label`;

		label.id = labelId;
		controls.className = `wpdef-variation-options${
			colorAttribute ? ' wpdef-variation-options--colors' : ''
		}`;
		controls.setAttribute( 'role', 'group' );
		controls.setAttribute( 'aria-labelledby', labelId );

		Array.from( select.options ).forEach( function ( option ) {
			if ( ! option.value ) {
				return;
			}

			const button = document.createElement( 'button' );
			button.type = 'button';
			button.dataset.value = option.value;
			button.setAttribute( 'aria-pressed', 'false' );

			if ( colorAttribute ) {
				button.className =
					'wpdef-variation-option wpdef-variation-option--color';
				button.style.setProperty(
					'--wpdef-variation-color',
					getColor( option )
				);
				button.setAttribute( 'aria-label', option.textContent.trim() );
				button.title = option.textContent.trim();
			} else {
				button.className = 'wpdef-variation-option';
				button.textContent = option.textContent.trim();
			}

			button.addEventListener( 'click', function () {
				if ( button.disabled ) {
					return;
				}

				select.value = option.value;
				select.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
				synchronizeButtons( select, controls );
			} );

			controls.appendChild( button );
		} );

		cell.appendChild( controls );
		const resetButton = cell.querySelector( '.reset_variations' );

		if ( resetButton ) {
			controls.insertAdjacentElement( 'afterend', resetButton );
		}

		row.classList.add( 'wpdef-variation-row-enhanced' );
		select.addEventListener( 'change', function () {
			synchronizeButtons( select, controls );
			window.setTimeout( function () {
				synchronizeButtons( select, controls );
			}, 0 );
		} );
		synchronizeButtons( select, controls );
	}

	function initializeVariationControls() {
		document
			.querySelectorAll( '.variations_form .variations select' )
			.forEach( enhanceSelect );
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener(
			'DOMContentLoaded',
			initializeVariationControls
		);
	} else {
		initializeVariationControls();
	}
} )();
