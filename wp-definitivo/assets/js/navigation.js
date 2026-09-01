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
	initializeSearch();
	initializeBackToTop();
} )();
