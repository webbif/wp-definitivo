/* global jQuery */

( function ( api, $ ) {
	'use strict';

	const childSections = {
		wpdef_store: [
			'wpdef_store_page',
			'wpdef_product',
			'wpdef_cart',
			'wpdef_checkout',
			'wpdef_account',
		],
		wpdef_typography: [
			'wpdef_theme_typography',
			'wpdef_woocommerce_typography',
		],
	};
	let activeChild = '';
	let initialized = false;
	let blogColumnsInitialized = false;

	function getParentSectionId( childSectionId ) {
		return Object.keys( childSections ).find( function ( parentSectionId ) {
			return childSections[ parentSectionId ].includes( childSectionId );
		} );
	}

	function setChildVisibility( section, visible ) {
		section.container.toggleClass(
			'wpdef-customizer-child-section--active',
			visible
		);

		if ( visible ) {
			section.container.show();
			return;
		}

		section.container.hide();
	}

	function initializeChildSections() {
		if ( initialized ) {
			return;
		}

		const childSectionIds = Object.values( childSections ).flat();
		const sections = childSectionIds.map( function ( sectionId ) {
			return api.section( sectionId );
		} );

		if (
			sections.some( function ( section ) {
				return ! section;
			} )
		) {
			window.setTimeout( initializeChildSections, 50 );
			return;
		}

		initialized = true;

		childSectionIds.forEach( function ( sectionId, index ) {
			const section = sections[ index ];

			section.container.addClass( 'wpdef-customizer-child-section' );

			if ( section.expanded() ) {
				activeChild = sectionId;
				setChildVisibility( section, true );
			} else {
				setChildVisibility( section, false );
			}

			section.expanded.bind( function ( expanded ) {
				if ( expanded ) {
					activeChild = sectionId;
					setChildVisibility( section, true );
					return;
				}

				setChildVisibility( section, false );

				if ( activeChild === sectionId ) {
					activeChild = '';
					window.setTimeout( function () {
						const parentSection = api.section(
							getParentSectionId( sectionId )
						);

						if ( parentSection ) {
							parentSection.focus();
						}
					}, 0 );
				}
			} );
		} );

		$( document ).on(
			'click',
			'.wpdef-customizer-section-link',
			function () {
				const sectionId = $( this ).data( 'section' );
				const section = api.section( sectionId );

				if ( ! section ) {
					return;
				}

				activeChild = sectionId;
				setChildVisibility( section, true );
				section.focus();
			}
		);
	}

	function initializeBlogGridColumnsRule() {
		if ( blogColumnsInitialized ) {
			return;
		}

		const columnsControl = api.control( 'wpdef_archive_columns' );
		const columnsSetting = api( 'wpdef_archive_columns' );
		const sidebarSetting = api( 'wpdef_blog_sidebar_layout' );

		if ( ! columnsControl || ! columnsSetting || ! sidebarSetting ) {
			window.setTimeout( initializeBlogGridColumnsRule, 50 );
			return;
		}

		blogColumnsInitialized = true;

		function syncColumnsWithSidebar( sidebarLayout ) {
			const hasSidebar = 'none' !== sidebarLayout;
			const threeColumnsOption = columnsControl.container.find(
				'select option[value="3"]'
			);

			threeColumnsOption.prop( 'disabled', hasSidebar );

			if ( hasSidebar && '3' === String( columnsSetting.get() ) ) {
				columnsSetting.set( 2 );
			}
		}

		sidebarSetting.bind( syncColumnsWithSidebar );
		syncColumnsWithSidebar( sidebarSetting.get() );
	}

	function initializeControls() {
		initializeChildSections();
		initializeBlogGridColumnsRule();
	}

	api.bind( 'ready', initializeControls );
	$( initializeControls );
} )( wp.customize, jQuery );
