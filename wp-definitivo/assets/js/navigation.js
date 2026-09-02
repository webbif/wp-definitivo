/**
 * Accessible mobile navigation and expandable header search.
 */
( function () {
	'use strict';

	document.documentElement.classList.add( 'wpdef-js' );

	function setExpanded( button, target, expanded ) {
		const label = button.querySelector( '.screen-reader-text' );

		button.setAttribute( 'aria-expanded', expanded ? 'true' : 'false' );
		target.classList.toggle( 'is-open', expanded );

		if ( label ) {
			label.textContent = expanded
				? label.dataset.closeLabel
				: label.dataset.openLabel;
		}
	}

	function initializeNavigation() {
		const button = document.querySelector( '.menu-toggle' );
		const navigation = document.querySelector( '.primary-navigation' );

		if ( ! button || ! navigation ) {
			return;
		}

		button.addEventListener( 'click', function () {
			setExpanded(
				button,
				navigation,
				button.getAttribute( 'aria-expanded' ) !== 'true'
			);
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if (
				'Escape' === event.key &&
				'true' === button.getAttribute( 'aria-expanded' )
			) {
				setExpanded( button, navigation, false );
				button.focus();
			}
		} );
	}

	function initializeSubmenus() {
		const navigation = document.querySelector( '.primary-navigation' );

		if ( ! navigation ) {
			return;
		}

		const compactNavigation = window.matchMedia( '(max-width: 1280px)' );

		function setSubmenuState( item, toggle, expanded ) {
			item.classList.toggle( 'is-submenu-open', expanded );
			toggle.setAttribute( 'aria-expanded', expanded ? 'true' : 'false' );
		}

		function closeSiblingSubmenus( item ) {
			Array.from( item.parentElement.children ).forEach(
				function ( sibling ) {
					if ( sibling === item ) {
						return;
					}

					const toggle = sibling.querySelector(
						':scope > .wpdef-submenu-toggle'
					);

					if ( toggle ) {
						setSubmenuState( sibling, toggle, false );
					}
				}
			);
		}

		function closeAllSubmenus() {
			navigation
				.querySelectorAll( '.wpdef-submenu-toggle' )
				.forEach( function ( toggle ) {
					setSubmenuState( toggle.parentElement, toggle, false );
				} );
		}

		navigation.querySelectorAll( 'li' ).forEach( function ( item, index ) {
			const submenu = item.querySelector( ':scope > .sub-menu' );
			const link = item.querySelector( ':scope > a' );

			if ( ! submenu || ! link ) {
				return;
			}

			item.classList.add( 'wpdef-has-submenu' );

			if ( ! submenu.id ) {
				submenu.id = `wpdef-submenu-${ index + 1 }`;
			}

			const toggle = document.createElement( 'button' );
			toggle.className = 'wpdef-submenu-toggle';
			toggle.type = 'button';
			toggle.setAttribute( 'aria-controls', submenu.id );
			toggle.setAttribute( 'aria-expanded', 'false' );
			toggle.setAttribute( 'aria-label', link.textContent.trim() );
			link.insertAdjacentElement( 'afterend', toggle );

			toggle.addEventListener( 'click', function () {
				if ( ! compactNavigation.matches ) {
					return;
				}

				const expanded =
					'true' !== toggle.getAttribute( 'aria-expanded' );

				if ( expanded ) {
					closeSiblingSubmenus( item );
				}

				setSubmenuState( item, toggle, expanded );
			} );
		} );

		compactNavigation.addEventListener( 'change', closeAllSubmenus );
	}

	function initializeSearch() {
		const openButton = document.querySelector( '.search-toggle' );
		const panel = document.querySelector( '.header-search' );
		const closeButton = document.querySelector( '.search-close' );

		if ( ! openButton || ! panel || ! closeButton ) {
			return;
		}

		function closeSearch() {
			openButton.setAttribute( 'aria-expanded', 'false' );
			panel.setAttribute( 'aria-hidden', 'true' );
			panel.classList.remove( 'is-open' );
		}

		function openSearch() {
			const field = panel.querySelector( 'input[type="search"]' );
			openButton.setAttribute( 'aria-expanded', 'true' );
			panel.setAttribute( 'aria-hidden', 'false' );
			panel.classList.add( 'is-open' );
			if ( field ) {
				field.focus();
			}
		}

		openButton.addEventListener( 'click', function () {
			if ( 'true' === openButton.getAttribute( 'aria-expanded' ) ) {
				closeSearch();
			} else {
				openSearch();
			}
		} );

		closeButton.addEventListener( 'click', function () {
			closeSearch();
			openButton.focus();
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if (
				'Escape' === event.key &&
				'true' === openButton.getAttribute( 'aria-expanded' )
			) {
				closeSearch();
				openButton.focus();
			}
		} );
	}

	function initializeBackToTop() {
		const button = document.querySelector( '.wpdef-back-to-top' );

		if ( ! button ) {
			return;
		}

		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);

		function updateVisibility() {
			button.classList.toggle( 'is-visible', window.scrollY > 480 );
		}

		button.addEventListener( 'click', function () {
			window.scrollTo( {
				top: 0,
				behavior: reduceMotion.matches ? 'auto' : 'smooth',
			} );
		} );

		window.addEventListener( 'scroll', updateVisibility, {
			passive: true,
		} );
		updateVisibility();
	}

	initializeNavigation();
	initializeSubmenus();
	initializeSearch();
	initializeBackToTop();
} )();
