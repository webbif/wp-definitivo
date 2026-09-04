/**
 * Accessible mobile navigation and expandable header search.
 */
( function () {
	'use strict';

	document.documentElement.classList.add( 'wpdef-js' );

	function setExpanded( button, target, expanded ) {
		button.setAttribute( 'aria-expanded', expanded ? 'true' : 'false' );
		target.classList.toggle( 'is-open', expanded );
	}

	function initializeNavigation() {
		const button = document.querySelector( '.menu-toggle' );
		const navigation = document.querySelector( '.primary-navigation' );

		if ( ! button || ! navigation ) {
			return;
		}

		function closeNavigation() {
			setExpanded( button, navigation, false );
			navigation.dispatchEvent( new Event( 'wpdef-navigation-closed' ) );
		}

		button.addEventListener( 'click', function () {
			const expanded = button.getAttribute( 'aria-expanded' ) !== 'true';

			setExpanded( button, navigation, expanded );

			if ( ! expanded ) {
				navigation.dispatchEvent(
					new Event( 'wpdef-navigation-closed' )
				);
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if (
				'Escape' === event.key &&
				! event.defaultPrevented &&
				'true' === button.getAttribute( 'aria-expanded' )
			) {
				event.preventDefault();
				closeNavigation();
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
		const submenuLabels = window.wpdefNavigationL10n || {};
		const submenuItems = [];
		const expandedSubmenuHistory = [];

		function formatSubmenuLabel( template, itemLabel ) {
			return template.replace( '%s', itemLabel );
		}

		function applySubmenuState( item, toggle, expanded ) {
			const previousHistoryIndex =
				expandedSubmenuHistory.indexOf( toggle );

			if ( -1 !== previousHistoryIndex ) {
				expandedSubmenuHistory.splice( previousHistoryIndex, 1 );
			}

			if ( expanded ) {
				expandedSubmenuHistory.push( toggle );
			}

			item.classList.toggle( 'is-submenu-open', expanded );

			if ( ! expanded ) {
				item.classList.remove( 'is-submenu-dismissed' );
			}

			toggle.setAttribute( 'aria-expanded', expanded ? 'true' : 'false' );
			toggle.setAttribute(
				'aria-label',
				expanded ? toggle.dataset.closeLabel : toggle.dataset.openLabel
			);
		}

		function setSubmenuState( item, toggle, expanded ) {
			applySubmenuState( item, toggle, expanded );

			if ( expanded ) {
				return;
			}

			item.querySelectorAll(
				':scope > :is(.sub-menu, .children) .wpdef-submenu-toggle'
			).forEach( function ( descendantToggle ) {
				applySubmenuState(
					descendantToggle.parentElement,
					descendantToggle,
					false
				);
			} );
		}

		function closeAllSubmenus() {
			navigation
				.querySelectorAll( '.wpdef-submenu-toggle' )
				.forEach( function ( toggle ) {
					const item = toggle.parentElement;
					applySubmenuState( item, toggle, false );
				} );
		}

		function restoreDismissedSubmenuWhenInactive( item ) {
			window.requestAnimationFrame( function () {
				if (
					! item.matches( ':hover' ) &&
					! item.contains( item.ownerDocument.activeElement )
				) {
					item.classList.remove( 'is-submenu-dismissed' );
				}
			} );
		}

		navigation.querySelectorAll( 'li' ).forEach( function ( item, index ) {
			const submenu = item.querySelector(
				':scope > .sub-menu, :scope > .children'
			);
			const link = item.querySelector( ':scope > a' );

			if ( ! submenu || ! link ) {
				return;
			}

			item.classList.add( 'wpdef-has-submenu' );

			if ( ! submenu.id ) {
				submenu.id = `wpdef-submenu-${ index + 1 }`;
			}

			const toggle = document.createElement( 'button' );
			const itemLabel = link.textContent.trim();
			const openLabel =
				submenuLabels.openSubmenu || 'Open submenu for %s';
			const closeLabel =
				submenuLabels.closeSubmenu || 'Close submenu for %s';

			toggle.className = 'wpdef-submenu-toggle';
			toggle.type = 'button';
			toggle.setAttribute( 'aria-controls', submenu.id );
			toggle.dataset.openLabel = formatSubmenuLabel(
				openLabel,
				itemLabel
			);
			toggle.dataset.closeLabel = formatSubmenuLabel(
				closeLabel,
				itemLabel
			);
			setSubmenuState( item, toggle, false );
			link.insertAdjacentElement( 'afterend', toggle );
			submenuItems.push( { item, link, submenu, toggle } );

			item.addEventListener( 'mouseleave', function () {
				restoreDismissedSubmenuWhenInactive( item );
			} );
			item.addEventListener( 'focusout', function () {
				restoreDismissedSubmenuWhenInactive( item );
			} );

			toggle.addEventListener( 'click', function () {
				if ( ! compactNavigation.matches ) {
					return;
				}

				const expanded =
					'true' !== toggle.getAttribute( 'aria-expanded' );

				setSubmenuState( item, toggle, expanded );
			} );
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' !== event.key ) {
				return;
			}

			const activeElement = navigation.ownerDocument.activeElement;

			if ( compactNavigation.matches ) {
				const focusedOpenSubmenu = submenuItems
					.filter( function ( entry ) {
						return (
							'true' ===
								entry.toggle.getAttribute( 'aria-expanded' ) &&
							entry.item.contains( activeElement )
						);
					} )
					.pop();
				const fallbackToggle = expandedSubmenuHistory
					.slice()
					.reverse()
					.find( function ( toggle ) {
						return (
							'true' === toggle.getAttribute( 'aria-expanded' )
						);
					} );
				const openSubmenu =
					focusedOpenSubmenu ||
					submenuItems.find( function ( entry ) {
						return entry.toggle === fallbackToggle;
					} );

				if ( ! openSubmenu ) {
					return;
				}

				event.preventDefault();
				setSubmenuState( openSubmenu.item, openSubmenu.toggle, false );
				openSubmenu.toggle.focus();
				return;
			}

			const openSubmenu = submenuItems
				.filter( function ( entry ) {
					return (
						! entry.item.classList.contains(
							'is-submenu-dismissed'
						) &&
						'none' !==
							window.getComputedStyle( entry.submenu ).display &&
						( entry.item.matches( ':hover' ) ||
							entry.item.contains( activeElement ) )
					);
				} )
				.pop();

			if ( ! openSubmenu ) {
				return;
			}

			event.preventDefault();
			openSubmenu.item.classList.add( 'is-submenu-dismissed' );

			if (
				openSubmenu.item.contains( activeElement ) &&
				activeElement !== openSubmenu.link
			) {
				openSubmenu.link.focus();
			}
		} );

		navigation.addEventListener(
			'wpdef-navigation-closed',
			closeAllSubmenus
		);
		compactNavigation.addEventListener( 'change', closeAllSubmenus );
	}

	function initializeSearch() {
		const openButton = document.querySelector( '.search-toggle' );
		const panel = document.querySelector( '.header-search' );
		const closeButton = document.querySelector( '.search-close' );

		if ( ! openButton || ! panel || ! closeButton ) {
			return;
		}

		panel.setAttribute( 'aria-hidden', 'true' );

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

	initializeSubmenus();
	initializeNavigation();
	initializeSearch();
	initializeBackToTop();
} )();
