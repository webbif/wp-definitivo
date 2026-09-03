import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const accessibilityRoutes = [
	{ name: 'front page', path: '/' },
	{ name: 'blog page', path: '/blog/' },
	{ name: 'post with comments', path: '/template-comments/' },
	{ name: 'category archive', path: '/category/block/' },
	{
		name: 'markup and formatting page',
		path: '/accessibility-ready-test-pages/page-markup-and-formatting/',
	},
	{
		name: 'block patterns page',
		path: '/accessibility-ready-test-pages/block-patterns/',
	},
	{ name: 'search results page', path: '/?s=block' },
	{
		name: '404 page',
		path: '/accessibility-audit-intentional-404/',
	},
];

const summarizeViolations = ( violations ) =>
	violations.map( ( violation ) => ( {
		id: violation.id,
		impact: violation.impact,
		nodes: violation.nodes.map( ( node ) => ( {
			target: node.target,
			html: node.html,
		} ) ),
	} ) );

test.describe( 'public theme', () => {
	for ( const route of accessibilityRoutes ) {
		test( `${ route.name } has no automatically detectable accessibility violations`, async ( {
			page,
		} ) => {
			const response = await page.goto( route.path );
			expect( response ).not.toBeNull();
			expect( response.status() ).toBe(
				'404 page' === route.name ? 404 : 200
			);
			const results = await new AxeBuilder( { page } )
				.withTags( [
					'wcag2a',
					'wcag2aa',
					'wcag21a',
					'wcag21aa',
					'wcag22aa',
				] )
				.analyze();
			expect( summarizeViolations( results.violations ) ).toEqual( [] );
		} );

		test( `${ route.name } skip link is first, visible, and reaches the main landmark`, async ( {
			browserName,
			page,
		} ) => {
			await page.goto( route.path );
			const skipLink = page.getByRole( 'link', {
				name: /^(Skip to content|Pular para o conteúdo)$/,
			} );

			if ( 'webkit' === browserName ) {
				// Safari's default keyboard preference excludes links from Tab order.
				// Explicit focus still validates the visible control and its target.
				await skipLink.focus();
			} else {
				await page.keyboard.press( 'Tab' );
			}

			await expect( skipLink ).toBeFocused();
			await expect( skipLink ).toBeVisible();
			await skipLink.press( 'Enter' );
			expect( await page.evaluate( () => window.location.hash ) ).toBe(
				'#primary'
			);
			await expect( page.locator( '#primary' ) ).toBeFocused();
		} );
	}

	test( 'required routes reflow at 200 and 400 percent equivalents', async ( {
		page,
	} ) => {
		for ( const width of [ 640, 320 ] ) {
			await page.setViewportSize( { width, height: 800 } );

			for ( const route of accessibilityRoutes ) {
				await test.step( `${ width }px: ${ route.name }`, async () => {
					await page.goto( route.path );
					const dimensions = await page.evaluate( () => ( {
						clientWidth: document.documentElement.clientWidth,
						scrollWidth: document.documentElement.scrollWidth,
					} ) );

					expect(
						dimensions.scrollWidth,
						`${ route.name } overflows the ${ width } CSS pixel viewport`
					).toBeLessThanOrEqual( dimensions.clientWidth + 1 );
				} );
			}

			await page.goto( '/' );
			const menu = page.locator( '.menu-toggle' );
			await menu.click();
			await expect( menu ).toHaveAttribute( 'aria-expanded', 'true' );
			await page.keyboard.press( 'Escape' );
			await expect( menu ).toBeFocused();
			const searchButton = page.getByRole( 'button', {
				name: /^(Open search|Abrir pesquisa)$/,
			} );
			await searchButton.click();
			await expect(
				page.getByRole( 'searchbox', {
					name: /^(Search for:|Pesquisar por:)$/,
				} )
			).toBeFocused();
		}
	} );

	test( 'required routes tolerate WCAG text spacing overrides', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 1280, height: 900 } );

		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await page.goto( route.path );
				await page.addStyleTag( {
					content: `
						*:not(svg):not(path) {
							line-height: 1.5 !important;
							letter-spacing: 0.12em !important;
							word-spacing: 0.16em !important;
						}
						p {
							margin-bottom: 2em !important;
						}
					`,
				} );
				const dimensions = await page.evaluate( () => ( {
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				} ) );
				expect( dimensions.scrollWidth ).toBeLessThanOrEqual(
					dimensions.clientWidth + 1
				);
			} );
		}
	} );

	test( 'required routes expose one banner, main, and contentinfo landmark with distinct navigation names', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await page.goto( route.path );
				await expect( page.getByRole( 'banner' ) ).toHaveCount( 1 );
				await expect( page.getByRole( 'main' ) ).toHaveCount( 1 );
				await expect( page.getByRole( 'contentinfo' ) ).toHaveCount(
					1
				);

				const navigationNames = await page
					.getByRole( 'navigation' )
					.evaluateAll( ( landmarks ) =>
						landmarks.map( ( landmark ) =>
							landmark.getAttribute( 'aria-label' )
						)
					);
				expect( navigationNames.every( Boolean ) ).toBe( true );
				expect( new Set( navigationNames ).size ).toBe(
					navigationNames.length
				);
				expect(
					navigationNames.some( ( name ) =>
						/\b(navigation|navega(?:ç|c)[aã]o)\b/i.test( name )
					)
				).toBe( false );
			} );
		}
	} );

	test( 'text links remain underlined and gain a non-color hover change', async ( {
		page,
	} ) => {
		const textLinkSelector = [
			'.entry-content p a',
			'.entry-summary p a',
			'.comment-content a',
			'.widget a:not(.wp-block-button__link)',
			'.site-info a',
			'.entry-footer a',
		].join( ', ' );

		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await page.goto( route.path );
				const violations = await page
					.locator( textLinkSelector )
					.evaluateAll( ( links ) =>
						links
							.filter(
								( link ) =>
									link.textContent.trim() &&
									link.getClientRects().length
							)
							.filter(
								( link ) =>
									! window
										.getComputedStyle( link )
										.textDecorationLine.includes(
											'underline'
										)
							)
							.map( ( link ) => ( {
								text: link.textContent.trim(),
								href: link.href,
							} ) )
					);
				expect( violations ).toEqual( [] );
			} );
		}

		for ( const sample of [
			{ path: '/', selector: '.entry-content p a' },
			{ path: '/template-comments/', selector: '.comment-content a' },
			{ path: '/?s=block', selector: '.widget a' },
			{ path: '/', selector: '.site-info a' },
		] ) {
			await page.goto( sample.path );
			const link = page.locator( sample.selector ).first();
			await expect( link ).toBeVisible();
			const normalThickness = await link.evaluate( ( element ) => {
				const styles = window.getComputedStyle( element );
				return Number.parseFloat( styles.textDecorationThickness );
			} );
			await link.hover();
			const hoverThickness = await link.evaluate( ( element ) => {
				const styles = window.getComputedStyle( element );
				return Number.parseFloat( styles.textDecorationThickness );
			} );
			expect( hoverThickness ).toBeGreaterThan( normalThickness );
		}
	} );

	test( 'links avoid ambiguous names and conflicting destinations', async ( {
		page,
	} ) => {
		const themeLinkSelector = [
			'.site-header a[href]',
			'.post-card .entry-title a[href]',
			'.post-card .entry-meta a[href]',
			'.post-card .entry-footer a[href]',
			'.navigation a[href]',
			'.site-footer a[href]',
		].join( ', ' );

		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await page.goto( route.path );
				const links = await page
					.locator( themeLinkSelector )
					.evaluateAll( ( elements ) =>
						elements
							.filter(
								( element ) => element.getClientRects().length
							)
							.map( ( element ) => {
								const visibleText = element.innerText.trim();
								const imageText = Array.from(
									element.querySelectorAll( 'img[alt]' )
								)
									.map( ( image ) => image.alt.trim() )
									.filter( Boolean )
									.join( ' ' );
								return {
									name: (
										element.getAttribute( 'aria-label' ) ||
										visibleText ||
										imageText
									).trim(),
									href: element.href,
								};
							} )
					);
				const ambiguous = links.filter( ( link ) =>
					/^(?:click here|here|more|read more|link|clique aqui|aqui|mais|leia mais)$/i.test(
						link.name
					)
				);
				const destinations = new Map();

				for ( const link of links ) {
					const name = link.name.toLocaleLowerCase();
					if ( ! destinations.has( name ) ) {
						destinations.set( name, new Set() );
					}
					destinations.get( name ).add( link.href );
				}

				const conflicting = Array.from( destinations.entries() )
					.filter( ( [ name, urls ] ) => name && urls.size > 1 )
					.map( ( [ name, urls ] ) => ( {
						name,
						urls: Array.from( urls ),
					} ) );

				expect( ambiguous ).toEqual( [] );
				expect( conflicting ).toEqual( [] );
			} );
		}
	} );

	test( 'mobile menu reports and changes its state', async ( { page } ) => {
		await page.setViewportSize( { width: 390, height: 844 } );
		await page.goto( '/' );
		const header = await page.locator( '.header-inner' ).boundingBox();
		const branding = await page.locator( '.site-branding' ).boundingBox();
		const title = page.locator( '.site-title a' );
		const titleBox = await title.boundingBox();
		const actionsBox = await page
			.locator( '.header-actions' )
			.boundingBox();
		expect( header ).not.toBeNull();
		expect( branding ).not.toBeNull();
		expect( titleBox ).not.toBeNull();
		expect( actionsBox ).not.toBeNull();
		expect( branding.x ).toBeGreaterThanOrEqual( header.x );
		expect( branding.x + branding.width ).toBeLessThanOrEqual(
			header.x + header.width
		);
		expect(
			await title.evaluate( ( link ) => {
				const range = document.createRange();
				range.selectNodeContents( link );
				return range.getClientRects().length;
			} )
		).toBeGreaterThanOrEqual( 1 );
		expect( titleBox.y + titleBox.height ).toBeLessThanOrEqual(
			actionsBox.y
		);
		const menu = page.locator( '.menu-toggle' );
		await expect( menu ).toHaveAttribute( 'aria-expanded', 'false' );
		await menu.click();
		await expect( menu ).toHaveAttribute( 'aria-expanded', 'true' );
		await page.keyboard.press( 'Escape' );
		await expect( menu ).toHaveAttribute( 'aria-expanded', 'false' );
		await expect( menu ).toBeFocused();
	} );

	test( 'mobile submenus expand independently with accessible controls', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 390, height: 844 } );
		await page.goto( '/' );
		await page.getByRole( 'button', { name: 'Menu' } ).click();

		const levelOneItem = page
			.locator( '.primary-navigation li' )
			.filter( {
				has: page.getByRole( 'link', {
					exact: true,
					name: 'Level 1',
				} ),
			} )
			.first();
		const levelOneToggle = levelOneItem.locator(
			':scope > .wpdef-submenu-toggle'
		);

		await expect( levelOneToggle ).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		await expect( levelOneToggle ).toHaveAttribute(
			'aria-label',
			/^(Open submenu for Level 1|Abrir submenu de Level 1)$/
		);
		await levelOneToggle.click();
		await expect( levelOneToggle ).toHaveAttribute(
			'aria-expanded',
			'true'
		);
		await expect( levelOneToggle ).toHaveAttribute(
			'aria-label',
			/^(Close submenu for Level 1|Fechar submenu de Level 1)$/
		);
		await expect(
			levelOneItem.locator( ':scope > .sub-menu' )
		).toBeVisible();
	} );

	test( 'desktop navigation labels stay intact and compact mode starts before crowding', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 1625, height: 900 } );
		await page.goto( '/' );
		await expect( page.locator( '.primary-navigation' ) ).toBeVisible();
		await expect(
			page.getByRole( 'button', { name: 'Menu' } )
		).toBeHidden();
		expect(
			await page
				.locator( '.primary-menu > li > a' )
				.evaluateAll( ( links ) =>
					links.every( ( link ) => {
						const range = document.createRange();
						range.selectNodeContents( link );
						return 1 === range.getClientRects().length;
					} )
				)
		).toBe( true );

		await page.setViewportSize( { width: 1200, height: 900 } );
		await expect(
			page.getByRole( 'button', { name: 'Menu' } )
		).toBeVisible();
		await expect( page.locator( '.primary-navigation' ) ).toBeHidden();
	} );

	test( 'desktop nested submenus can be dismissed with Escape', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 1625, height: 900 } );
		await page.goto( '/' );
		const navigation = page.locator( '.primary-navigation' );
		const levelOneLink = navigation
			.getByRole( 'link', { exact: true, name: 'Level 1' } )
			.first();
		const levelOneItem = levelOneLink.locator( '..' );
		const levelTwoLink = levelOneItem
			.getByRole( 'link', { exact: true, name: 'Level 2' } )
			.first();
		const levelTwoItem = levelTwoLink.locator( '..' );
		const levelOneSubmenu = levelOneItem.locator( ':scope > .sub-menu' );
		const levelTwoSubmenu = levelTwoItem.locator( ':scope > .sub-menu' );

		await levelOneLink.focus();
		await expect( levelOneSubmenu ).toBeVisible();
		await levelTwoLink.focus();
		await expect( levelTwoSubmenu ).toBeVisible();
		await page.keyboard.press( 'Escape' );
		await expect( levelTwoSubmenu ).toBeHidden();
		await expect( levelOneSubmenu ).toBeVisible();
		await expect( levelTwoLink ).toBeFocused();
		await page.keyboard.press( 'Escape' );
		await expect( levelOneSubmenu ).toBeHidden();
		await expect( levelOneLink ).toBeFocused();
	} );

	test( 'header search remains accessible without JavaScript', async ( {
		browser,
	}, testInfo ) => {
		const context = await browser.newContext( {
			javaScriptEnabled: false,
		} );
		const page = await context.newPage();
		const baseURL = testInfo.project.use.baseURL;

		await page.goto( new URL( '/', baseURL ).toString() );
		const searchPanel = page.locator( '#header-search' );
		await expect( searchPanel ).toBeVisible();
		await expect( searchPanel ).not.toHaveAttribute(
			'aria-hidden',
			'true'
		);
		await expect( searchPanel.getByRole( 'searchbox' ) ).toBeVisible();
		await context.close();
	} );

	test( 'reduced motion disables smooth scrolling and minimizes transitions', async ( {
		page,
	} ) => {
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		await page.goto( '/' );

		const motionStyles = await page.evaluate( () => {
			const button = document.querySelector( '.wpdef-back-to-top' );
			const buttonStyles = button
				? window.getComputedStyle( button )
				: null;

			return {
				scrollBehavior: window.getComputedStyle(
					document.documentElement
				).scrollBehavior,
				transitionDuration: buttonStyles?.transitionDuration || '',
				animationDuration: buttonStyles?.animationDuration || '',
			};
		} );

		expect( motionStyles.scrollBehavior ).toBe( 'auto' );
		for ( const duration of [
			motionStyles.transitionDuration,
			motionStyles.animationDuration,
		] ) {
			expect(
				duration
					.split( ',' )
					.every( ( value ) => Number.parseFloat( value ) <= 0.001 )
			).toBe( true );
		}
	} );

	test( 'header search moves focus and closes with Escape', async ( {
		page,
	} ) => {
		await page.goto( '/' );
		const searchButton = page.getByRole( 'button', {
			name: /^(Open search|Abrir pesquisa)$/,
		} );
		await searchButton.click();
		await expect( searchButton ).toHaveAttribute( 'aria-expanded', 'true' );
		const searchField = page.getByRole( 'searchbox', {
			name: /^(Search for:|Pesquisar por:)$/,
		} );
		await expect( searchField ).toBeFocused();
		const focusIndicator = await searchField.evaluate( ( field ) => {
			const styles = window.getComputedStyle( field );
			return {
				style: styles.outlineStyle,
				width: Number.parseFloat( styles.outlineWidth ),
			};
		} );
		expect( focusIndicator.style ).toBe( 'solid' );
		expect( focusIndicator.width ).toBeGreaterThanOrEqual( 2 );
		await page.keyboard.press( 'Escape' );
		await expect( searchButton ).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		await expect( searchButton ).toBeFocused();
	} );

	test( 'search forms expose visible labels associated with their fields', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes.map(
			( item ) => item.path
		) ) {
			await test.step( route, async () => {
				await page.goto( route );
				await page
					.getByRole( 'button', {
						name: /^(Open search|Abrir pesquisa)$/,
					} )
					.click();

				const searchForms = page.locator( '.search-form' );
				const formCount = await searchForms.count();
				expect( formCount ).toBeGreaterThan( 0 );

				for ( let index = 0; index < formCount; index++ ) {
					const form = searchForms.nth( index );
					const field = form.getByRole( 'searchbox' );
					const fieldId = await field.getAttribute( 'id' );
					expect( fieldId ).toBeTruthy();
					await expect(
						form.locator(
							`label[for="${ fieldId }"] .search-form__label-text`
						)
					).toBeVisible();
				}
			} );
		}
	} );

	test( 'block search form keeps its visible associated label', async ( {
		page,
	} ) => {
		for ( const route of [
			'/blog/',
			'/template-comments/',
			'/category/block/',
			'/?s=block',
		] ) {
			await test.step( route, async () => {
				await page.goto( route );
				const field = page.locator( '.wp-block-search__input' );
				const fieldId = await field.getAttribute( 'id' );

				expect( fieldId ).toBeTruthy();
				await expect(
					page.locator(
						`.wp-block-search__label[for="${ fieldId }"]`
					)
				).toBeVisible();
			} );
		}
	} );

	test( 'comment form labels and required fields are explicit', async ( {
		page,
	} ) => {
		await page.goto( '/template-comments/' );

		for ( const fieldId of [ 'comment', 'author', 'email' ] ) {
			const field = page.locator( `#${ fieldId }` );

			if ( 0 === ( await field.count() ) ) {
				continue;
			}

			await expect( field ).toBeVisible();
			await expect(
				page.locator( `label[for="${ fieldId }"]` )
			).toBeVisible();
			await expect( field ).toHaveAttribute( 'required', '' );
		}
	} );
} );
