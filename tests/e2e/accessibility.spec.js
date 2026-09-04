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

const navigate = ( page, path ) =>
	page.goto( path, { waitUntil: 'domcontentloaded' } );

test.describe( 'public theme', () => {
	for ( const route of accessibilityRoutes ) {
		test( `${ route.name } has no automatically detectable accessibility violations`, async ( {
			page,
		} ) => {
			const response = await navigate( page, route.path );
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
			await navigate( page, route.path );
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
					await navigate( page, route.path );
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

			await navigate( page, '/' );
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
				await navigate( page, route.path );
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
				await navigate( page, route.path );
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

	test( 'theme headings keep one page-title H1 and a logical hierarchy', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await navigate( page, route.path );
				const headingAudit = await page
					.locator( 'h1, h2, h3, h4, h5, h6' )
					.evaluateAll( ( headings ) => {
						const visibleHeadings = headings.filter(
							( heading ) => heading.getClientRects().length
						);
						const themeHeadings = visibleHeadings.filter(
							( heading ) =>
								! heading.closest(
									'.entry-content, .comment-content'
								)
						);
						const levels = themeHeadings.map( ( heading ) =>
							Number.parseInt( heading.tagName.slice( 1 ), 10 )
						);

						return {
							empty: visibleHeadings
								.filter(
									( heading ) => ! heading.textContent.trim()
								)
								.map( ( heading ) => heading.outerHTML ),
							h1: themeHeadings
								.filter(
									( heading ) => 'H1' === heading.tagName
								)
								.map( ( heading ) =>
									heading.textContent.trim()
								),
							skips: levels
								.slice( 1 )
								.map( ( level, index ) => ( {
									from: levels[ index ],
									to: level,
								} ) )
								.filter( ( step ) => step.to > step.from + 1 ),
						};
					} );

				expect( headingAudit.empty ).toEqual( [] );
				expect( headingAudit.h1 ).toHaveLength( 1 );
				expect( headingAudit.h1[ 0 ] ).not.toBe( '' );
				expect( headingAudit.skips ).toEqual( [] );
			} );
		}
	} );

	test( 'images and theme graphics expose appropriate accessibility primitives', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await navigate( page, route.path );
				const graphicAudit = await page.evaluate( () => {
					const visible = ( element ) =>
						element.getClientRects().length > 0 &&
						'hidden' !==
							window.getComputedStyle( element ).visibility;
					const imagesMissingAlt = Array.from(
						document.querySelectorAll( 'img' )
					)
						.filter( visible )
						.filter( ( image ) => ! image.hasAttribute( 'alt' ) )
						.map( ( image ) => image.outerHTML );
					const unnamedImageControls = Array.from(
						document.querySelectorAll(
							'a:has(img), button:has(img), [role="link"]:has(img), [role="button"]:has(img)'
						)
					)
						.filter( visible )
						.filter( ( control ) => {
							const imageNames = Array.from(
								control.querySelectorAll( 'img[alt]' )
							)
								.map( ( image ) => image.alt.trim() )
								.filter( Boolean );
							return ! (
								control.getAttribute( 'aria-label' ) ||
								control.textContent.trim() ||
								imageNames.length
							);
						} )
						.map( ( control ) => control.outerHTML );
					const exposedDecorativeSvg = Array.from(
						document.querySelectorAll(
							'svg.wpdef-header-icon, svg.search-form__icon'
						)
					)
						.filter( visible )
						.filter(
							( svg ) =>
								'true' !== svg.getAttribute( 'aria-hidden' )
						)
						.map( ( svg ) => svg.outerHTML );

					return {
						imagesMissingAlt,
						unnamedImageControls,
						exposedDecorativeSvg,
					};
				} );

				expect( graphicAudit.imagesMissingAlt ).toEqual( [] );
				expect( graphicAudit.unnamedImageControls ).toEqual( [] );
				expect( graphicAudit.exposedDecorativeSvg ).toEqual( [] );
			} );
		}
	} );

	test( 'controls use native semantics, clear names, and valid states', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await navigate( page, route.path );
				const issues = await page.evaluate( () => {
					const visible = ( element ) => {
						const styles = window.getComputedStyle( element );

						return (
							0 < element.getClientRects().length &&
							'hidden' !== styles.visibility &&
							'none' !== styles.display
						);
					};
					const nameFor = ( element ) => {
						const labelledBy =
							element.getAttribute( 'aria-labelledby' );
						const referencedText = labelledBy
							? labelledBy
									.split( /\s+/ )
									.map(
										( id ) =>
											document
												.getElementById( id )
												?.textContent.trim() || ''
									)
									.filter( Boolean )
									.join( ' ' )
							: '';
						const labelText = element.labels
							? Array.from( element.labels )
									.map( ( label ) =>
										label.textContent.trim()
									)
									.filter( Boolean )
									.join( ' ' )
							: '';
						const imageText = Array.from(
							element.querySelectorAll( 'img[alt]' )
						)
							.map( ( image ) => image.alt.trim() )
							.filter( Boolean )
							.join( ' ' );

						return (
							referencedText ||
							element.getAttribute( 'aria-label' ) ||
							labelText ||
							element.textContent.trim() ||
							element.getAttribute( 'value' ) ||
							imageText ||
							element.getAttribute( 'title' ) ||
							''
						).trim();
					};
					const visibleTextFor = ( element ) => {
						const clone = element.cloneNode( true );

						clone
							.querySelectorAll(
								'.screen-reader-text, [aria-hidden="true"]'
							)
							.forEach( ( hidden ) => hidden.remove() );

						return clone.textContent.trim();
					};
					const controls = Array.from(
						document.querySelectorAll(
							'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="tab"]'
						)
					).filter( visible );
					const summaries = controls.map( ( element ) => ( {
						element,
						name: nameFor( element ),
						visibleText: visibleTextFor( element ),
					} ) );
					const describe = ( item ) => ( {
						html: item.element.outerHTML.slice( 0, 500 ),
						name: item.name,
						visibleText: item.visibleText,
					} );

					return {
						unnamed: summaries
							.filter( ( item ) => ! item.name )
							.map( describe ),
						labelMismatch: summaries
							.filter(
								( item ) =>
									item.visibleText &&
									! item.name
										.toLocaleLowerCase()
										.startsWith(
											item.visibleText.toLocaleLowerCase()
										)
							)
							.map( describe ),
						simulatedButtons: summaries
							.filter(
								( item ) =>
									'button' ===
										item.element.getAttribute( 'role' ) &&
									! item.element.matches(
										'button, input[type="button"], input[type="submit"], input[type="reset"]'
									)
							)
							.map( describe ),
						simulatedLinks: summaries
							.filter(
								( item ) =>
									'link' ===
										item.element.getAttribute( 'role' ) &&
									'A' !== item.element.tagName
							)
							.map( describe ),
						invalidExpanded: summaries
							.filter( ( item ) => {
								const expanded =
									item.element.getAttribute(
										'aria-expanded'
									);
								const target =
									item.element.getAttribute(
										'aria-controls'
									);

								return (
									null !== expanded &&
									( ! [ 'true', 'false' ].includes(
										expanded
									) ||
										! target ||
										! document.getElementById( target ) )
								);
							} )
							.map( describe ),
						ariaDisabledOnly: summaries
							.filter(
								( item ) =>
									'true' ===
										item.element.getAttribute(
											'aria-disabled'
										) &&
									! item.element.hasAttribute( 'disabled' )
							)
							.map( describe ),
						nonInteractiveClickHandlers: Array.from(
							document.querySelectorAll( '[onclick]' )
						)
							.filter( visible )
							.filter(
								( element ) =>
									! element.matches(
										'a[href], button, input, select, textarea, [role="button"], [role="link"]'
									)
							)
							.map( ( element ) =>
								element.outerHTML.slice( 0, 500 )
							),
					};
				} );

				for ( const result of Object.values( issues ) ) {
					expect( result ).toEqual( [] );
				}
			} );
		}
	} );

	test( 'focus and input changes do not trigger unexpected context changes', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await navigate( page, route.path );
				await page.evaluate( () => {
					window.wpdefAuditSubmitCount = 0;
					document.addEventListener(
						'submit',
						() => {
							window.wpdefAuditSubmitCount++;
						},
						true
					);
				} );

				const initialUrl = page.url();
				const controls = page.locator(
					'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
				const controlCount = await controls.count();

				for ( let index = 0; index < controlCount; index++ ) {
					const control = controls.nth( index );

					if ( ! ( await control.isVisible() ) ) {
						continue;
					}

					await control.focus();
					expect( page.url() ).toBe( initialUrl );
					expect(
						await page.evaluate(
							() => window.wpdefAuditSubmitCount
						)
					).toBe( 0 );
				}

				const choiceControls = page.locator(
					'input[type="radio"], input[type="checkbox"], select'
				);
				const choiceCount = await choiceControls.count();

				for ( let index = 0; index < choiceCount; index++ ) {
					const control = choiceControls.nth( index );

					if (
						! ( await control.isVisible() ) ||
						! ( await control.isEnabled() )
					) {
						continue;
					}

					await control.focus();
					await control.press( 'ArrowDown' );
					expect( page.url() ).toBe( initialUrl );
					expect(
						await page.evaluate(
							() => window.wpdefAuditSubmitCount
						)
					).toBe( 0 );
					await control.press(
						'SELECT' ===
							( await control.evaluate(
								( element ) => element.tagName
							) )
							? 'Enter'
							: 'Space'
					);
					expect( page.url() ).toBe( initialUrl );
					expect(
						await page.evaluate(
							() => window.wpdefAuditSubmitCount
						)
					).toBe( 0 );
				}
			} );
		}
	} );

	test( 'desktop keyboard traversal reaches every focus target forward and backward', async ( {
		browserName,
		page,
	}, testInfo ) => {
		test.skip(
			'chromium' !== browserName || 'chromium' !== testInfo.project.name,
			'The exhaustive traversal runs once in desktop Chromium; component interactions run in every profile.'
		);
		await page.setViewportSize( { width: 1280, height: 900 } );

		for ( const route of accessibilityRoutes ) {
			await test.step( route.name, async () => {
				await navigate( page, route.path );
				const targetRecords = await page.evaluate( () => {
					const targets = Array.from(
						document.querySelectorAll(
							'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]'
						)
					).filter( ( element ) => {
						const styles = window.getComputedStyle( element );

						return (
							element.tabIndex >= 0 &&
							! element.disabled &&
							! element.closest(
								'[hidden], [inert], [aria-hidden="true"]'
							) &&
							0 < element.getClientRects().length &&
							'hidden' !== styles.visibility &&
							'none' !== styles.display
						);
					} );

					targets.forEach( ( element, index ) => {
						element.dataset.wpdefAuditTabId = String( index );
					} );
					window.wpdefAuditTabTargets = targets;

					return targets.map( ( element ) => ( {
						id: element.dataset.wpdefAuditTabId,
						name:
							element.getAttribute( 'aria-label' ) ||
							element.textContent.trim() ||
							element.getAttribute( 'value' ) ||
							element.tagName,
						tag: element.tagName,
					} ) );
				} );
				const targetIds = targetRecords.map( ( target ) => target.id );

				const traverse = async ( key ) => {
					await page.evaluate( ( reverse ) => {
						window.scrollTo( 0, 0 );
						if ( reverse ) {
							const sentinel = document.createElement( 'button' );
							sentinel.id = 'wpdef-audit-tab-sentinel';
							sentinel.type = 'button';
							document.body.append( sentinel );
							sentinel.focus();
							return;
						}
						document.body.setAttribute( 'tabindex', '-1' );
						document.body.focus();
						document.body.removeAttribute( 'tabindex' );
					}, 'Shift+Tab' === key );
					const visited = [];

					for ( let index = 0; index < targetIds.length; index++ ) {
						await page.keyboard.press( key );
						const focus = await page.evaluate( () => {
							const element =
								document.body.ownerDocument.activeElement;
							const styles = window.getComputedStyle( element );
							const rect = element.getBoundingClientRect();
							const pointX = Math.min(
								window.innerWidth - 1,
								Math.max( 0, rect.left + rect.width / 2 )
							);
							const pointY = Math.min(
								window.innerHeight - 1,
								Math.max( 0, rect.top + rect.height / 2 )
							);
							const hit = document.elementFromPoint(
								pointX,
								pointY
							);

							return {
								id: element.dataset.wpdefAuditTabId,
								tag: element.tagName,
								name:
									element.getAttribute( 'aria-label' ) ||
									element.textContent.trim(),
								rect: {
									left: rect.left,
									top: rect.top,
									right: rect.right,
									bottom: rect.bottom,
								},
								visible:
									0 < rect.width &&
									0 < rect.height &&
									'hidden' !== styles.visibility &&
									'none' !== styles.display,
								inViewport:
									rect.right > 0 &&
									rect.bottom > 0 &&
									rect.left < window.innerWidth &&
									rect.top < window.innerHeight,
								notObscured:
									Boolean( hit ) &&
									( element === hit ||
										element.contains( hit ) ||
										hit.contains( element ) ),
								hasFocusIndicator:
									( 'none' !== styles.outlineStyle &&
										2 <=
											Number.parseFloat(
												styles.outlineWidth
											) ) ||
									'none' !== styles.boxShadow,
							};
						} );

						const diagnostic = JSON.stringify( focus );
						if ( ! focus.id ) {
							break;
						}
						expect( focus.visible, diagnostic ).toBe( true );
						expect( focus.hasFocusIndicator, diagnostic ).toBe(
							true
						);
						visited.push( focus.id );
					}

					await page.evaluate( () =>
						document
							.getElementById( 'wpdef-audit-tab-sentinel' )
							?.remove()
					);

					return visited;
				};

				const forward = await traverse( 'Tab' );
				const forwardMissing = targetRecords.filter(
					( target ) => ! forward.includes( target.id )
				);
				expect(
					forward,
					JSON.stringify( { missing: forwardMissing } )
				).toEqual( targetIds );

				const backward = await traverse( 'Shift+Tab' );
				const backwardMissing = targetRecords.filter(
					( target ) => ! backward.includes( target.id )
				);
				expect(
					backward,
					JSON.stringify( { missing: backwardMissing } )
				).toEqual( [ ...targetIds ].reverse() );
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
				await navigate( page, route.path );
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
			await navigate( page, sample.path );
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

	test( 'built-in palettes preserve contrast in hover and focus states', async ( {
		browserName,
		page,
	}, testInfo ) => {
		test.skip(
			'chromium' !== browserName || 'chromium' !== testInfo.project.name,
			'Computed color-state contrast is browser-independent and runs once in Chromium.'
		);

		const schemes = [
			'',
			'wpdef-scheme-ivory-wine',
			'wpdef-scheme-sand-green',
			'wpdef-scheme-night-wine',
		];
		const samples = [
			{
				kind: 'text',
				path: '/accessibility-ready-test-pages/page-markup-and-formatting/',
				selector: '.entry-content p a',
			},
			{ kind: 'icon', path: '/', selector: '.search-toggle' },
			{
				kind: 'control',
				path: '/template-comments/',
				selector: '#comment',
			},
			{
				kind: 'control',
				path: '/template-comments/',
				selector: '#submit',
			},
		];
		const measureContrast = ( control ) =>
			control.evaluate( ( element ) => {
				const parseColor = ( value ) => {
					const channels = value.match( /[\d.]+/g )?.map( Number );

					if ( ! channels || 3 > channels.length ) {
						return null;
					}

					return {
						a: channels[ 3 ] ?? 1,
						b: channels[ 2 ],
						g: channels[ 1 ],
						r: channels[ 0 ],
					};
				};
				const luminance = ( color ) => {
					const channels = [ color.r, color.g, color.b ].map(
						( channel ) => {
							const value = channel / 255;

							return 0.04045 >= value
								? value / 12.92
								: ( ( value + 0.055 ) / 1.055 ) ** 2.4;
						}
					);

					return (
						0.2126 * channels[ 0 ] +
						0.7152 * channels[ 1 ] +
						0.0722 * channels[ 2 ]
					);
				};
				const ratio = ( first, second ) => {
					if ( ! first || ! second ) {
						return 1;
					}

					const values = [
						luminance( first ),
						luminance( second ),
					].sort( ( a, b ) => b - a );

					return ( values[ 0 ] + 0.05 ) / ( values[ 1 ] + 0.05 );
				};
				const backgroundFor = ( start ) => {
					let current = start;

					while ( current ) {
						const color = parseColor(
							window.getComputedStyle( current ).backgroundColor
						);

						if ( color && 0.99 <= color.a ) {
							return color;
						}

						current = current.parentElement;
					}

					return { a: 1, b: 255, g: 255, r: 255 };
				};
				const styles = window.getComputedStyle( element );
				const parentBackground = backgroundFor( element.parentElement );
				const effectiveBackground = backgroundFor( element );
				const elementBackground = parseColor( styles.backgroundColor );
				const borderContrasts = [
					[ styles.borderTopColor, styles.borderTopWidth ],
					[ styles.borderRightColor, styles.borderRightWidth ],
					[ styles.borderBottomColor, styles.borderBottomWidth ],
					[ styles.borderLeftColor, styles.borderLeftWidth ],
				]
					.filter( ( [ , width ] ) => 0 < Number.parseFloat( width ) )
					.map( ( [ color ] ) =>
						ratio( parseColor( color ), parentBackground )
					);
				const backgroundContrast =
					elementBackground && 0.99 <= elementBackground.a
						? ratio( elementBackground, parentBackground )
						: 1;

				return {
					boundaryContrast: Math.max(
						backgroundContrast,
						...borderContrasts
					),
					iconContrast: ratio(
						parseColor( styles.color ),
						effectiveBackground
					),
					outlineContrast:
						'solid' === styles.outlineStyle &&
						2 <= Number.parseFloat( styles.outlineWidth )
							? ratio(
									parseColor( styles.outlineColor ),
									parentBackground
							  )
							: 1,
					textContrast: ratio(
						parseColor( styles.color ),
						effectiveBackground
					),
				};
			} );

		for ( const scheme of schemes ) {
			for ( const sample of samples ) {
				await test.step( `${ scheme || 'default' }: ${
					sample.selector
				}`, async () => {
					await navigate( page, sample.path );
					await page.evaluate( ( activeScheme ) => {
						document.body.classList.forEach( ( className ) => {
							if ( className.startsWith( 'wpdef-scheme-' ) ) {
								document.body.classList.remove( className );
							}
						} );

						if ( activeScheme ) {
							document.body.classList.add( activeScheme );
						}
					}, scheme );

					const control = page.locator( sample.selector ).first();
					await expect( control ).toBeVisible();
					await control.hover();
					const hover = await measureContrast( control );
					let hoverMetric = hover.boundaryContrast;

					if ( 'text' === sample.kind ) {
						hoverMetric = hover.textContrast;
					} else if ( 'icon' === sample.kind ) {
						hoverMetric = hover.iconContrast;
					}
					expect( hoverMetric ).toBeGreaterThanOrEqual(
						'text' === sample.kind ? 4.5 : 3
					);

					await control.focus();
					const focus = await measureContrast( control );
					if ( 'text' === sample.kind ) {
						expect( focus.textContrast ).toBeGreaterThanOrEqual(
							4.5
						);
					} else if ( 'icon' === sample.kind ) {
						expect( focus.iconContrast ).toBeGreaterThanOrEqual(
							3
						);
					} else {
						expect( focus.boundaryContrast ).toBeGreaterThanOrEqual(
							3
						);
					}
					expect( focus.outlineContrast ).toBeGreaterThanOrEqual( 3 );
				} );
			}
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
				await navigate( page, route.path );
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
		await navigate( page, '/' );
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
		await navigate( page, '/' );
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

	test( 'compact accordion keeps the activated submenu toggle in place', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 320, height: 800 } );
		await navigate( page, '/' );
		await page.getByRole( 'button', { name: 'Menu' } ).click();

		const submenuToggleFor = ( label ) =>
			page
				.locator( '.primary-menu > li' )
				.filter( {
					has: page.getByRole( 'link', {
						exact: true,
						name: label,
					} ),
				} )
				.locator( ':scope > .wpdef-submenu-toggle' );
		const firstToggle = submenuToggleFor(
			'Accessibility-Ready Test Pages'
		);
		const secondToggle = submenuToggleFor( 'Other Pages' );
		const thirdToggle = submenuToggleFor( 'Level 1' );

		await firstToggle.click();
		await secondToggle.click();
		await expect( firstToggle ).toHaveAttribute( 'aria-expanded', 'true' );
		await expect( secondToggle ).toHaveAttribute( 'aria-expanded', 'true' );
		await thirdToggle.scrollIntoViewIfNeeded();
		const before = await thirdToggle.evaluate( ( toggle ) => ( {
			scrollY: window.scrollY,
			top: toggle.getBoundingClientRect().top,
		} ) );

		await thirdToggle.click();
		await page.evaluate(
			() => new Promise( window.requestAnimationFrame )
		);
		const after = await thirdToggle.evaluate( ( toggle ) => ( {
			scrollY: window.scrollY,
			top: toggle.getBoundingClientRect().top,
		} ) );

		expect(
			Math.abs( after.top - before.top ),
			JSON.stringify( { after, before } )
		).toBeLessThanOrEqual( 1 );
		await expect( firstToggle ).toHaveAttribute( 'aria-expanded', 'true' );
		await expect( secondToggle ).toHaveAttribute( 'aria-expanded', 'true' );
		await expect( thirdToggle ).toHaveAttribute( 'aria-expanded', 'true' );
	} );

	test( 'desktop navigation labels stay intact and compact mode starts before crowding', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 1625, height: 900 } );
		await navigate( page, '/' );
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

	test( 'desktop nested submenus stay in the viewport and can be dismissed with Escape', async ( {
		page,
	} ) => {
		const viewportWidth = 1329;
		await page.setViewportSize( { width: viewportWidth, height: 900 } );
		await navigate( page, '/' );
		const navigation = page.locator( '.primary-navigation' );
		const levelOneLink = navigation
			.getByRole( 'link', { exact: true, name: 'Level 1' } )
			.first();
		const levelOneItem = levelOneLink.locator( '..' );
		const levelTwoLink = levelOneItem
			.locator( ':scope > :is(.sub-menu, .children) > li > a' )
			.filter( { hasText: /^Level 2$/ } )
			.first();
		const levelTwoItem = levelTwoLink.locator( '..' );
		const levelOneSubmenu = levelOneItem.locator(
			':scope > :is(.sub-menu, .children)'
		);
		const levelTwoSubmenu = levelTwoItem.locator(
			':scope > :is(.sub-menu, .children)'
		);
		const levelThreeLink = levelTwoSubmenu
			.locator( ':scope > li > a' )
			.filter( { hasText: /^Level 3$/ } )
			.first();
		const indicatorStyles = async ( link ) =>
			link.evaluate( ( element ) => {
				const styles = window.getComputedStyle( element, '::after' );

				return {
					borderBottomWidth: styles.borderBottomWidth,
					borderRightWidth: styles.borderRightWidth,
					content: styles.content,
					transform: styles.transform,
				};
			} );
		const levelOneIndicator = await indicatorStyles( levelOneLink );

		expect( levelOneIndicator.content ).not.toBe( 'none' );
		expect( levelOneIndicator.borderBottomWidth ).not.toBe( '0px' );
		expect( levelOneIndicator.borderRightWidth ).not.toBe( '0px' );
		expect( levelOneIndicator.transform ).not.toBe( 'none' );

		await page.mouse.move( 0, 0 );
		await expect( levelOneSubmenu ).toBeHidden();
		await levelOneLink.hover();
		await expect( levelOneSubmenu ).toBeVisible();

		const levelTwoIndicator = await indicatorStyles( levelTwoLink );
		expect( levelTwoIndicator.content ).not.toBe( 'none' );
		expect( levelTwoIndicator.borderBottomWidth ).not.toBe( '0px' );
		expect( levelTwoIndicator.borderRightWidth ).not.toBe( '0px' );
		expect( levelTwoIndicator.transform ).not.toBe( 'none' );
		expect( levelTwoIndicator.transform ).not.toBe(
			levelOneIndicator.transform
		);

		await levelTwoLink.hover();
		await expect( levelTwoSubmenu ).toBeVisible();
		await levelThreeLink.hover();
		await expect( levelOneSubmenu ).toBeVisible();
		await expect( levelTwoSubmenu ).toBeVisible();
		await page.keyboard.press( 'Escape' );
		await expect( levelTwoSubmenu ).toBeHidden();
		await levelOneLink.hover();
		await page.keyboard.press( 'Escape' );
		await expect( levelOneSubmenu ).toBeHidden();
		await page.mouse.move( 0, 0 );
		await expect( levelOneItem ).not.toHaveClass( /is-submenu-dismissed/ );

		await levelOneLink.focus();
		await expect( levelOneSubmenu ).toBeVisible();
		const levelOneBox = await levelOneSubmenu.boundingBox();
		expect( levelOneBox ).not.toBeNull();
		expect( levelOneBox.x ).toBeGreaterThanOrEqual( 0 );
		expect( levelOneBox.x + levelOneBox.width ).toBeLessThanOrEqual(
			viewportWidth
		);
		await levelTwoLink.focus();
		await expect( levelTwoSubmenu ).toBeVisible();
		const levelTwoBox = await levelTwoSubmenu.boundingBox();
		expect( levelTwoBox ).not.toBeNull();
		expect( levelTwoBox.x ).toBeGreaterThanOrEqual( 0 );
		expect( levelTwoBox.x + levelTwoBox.width ).toBeLessThanOrEqual(
			viewportWidth
		);
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

		await navigate( page, new URL( '/', baseURL ).toString() );
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
		await navigate( page, '/' );

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
		await navigate( page, '/' );
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

	test( 'opened header search reflows at 320 CSS pixels', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 320, height: 800 } );
		await navigate( page, '/template-comments/' );
		await page
			.getByRole( 'button', {
				name: /^(Open search|Abrir pesquisa)$/,
			} )
			.click();

		const searchForm = page.locator( '#header-search .search-form' );
		const searchField = searchForm.getByRole( 'searchbox' );
		const searchSubmit = searchForm.getByRole( 'button', {
			name: /^(Search|Pesquisar)$/,
		} );
		const closeButton = page.getByRole( 'button', {
			name: /^(Close search|Fechar pesquisa)$/,
		} );

		await expect( searchForm ).toBeVisible();
		await expect( closeButton ).toBeVisible();

		const layout = await page.evaluate( () => {
			const selectors = [
				'#header-search .search-form',
				'#header-search .search-field',
				'#header-search .search-submit',
				'#header-search .search-close',
			];

			return {
				clientWidth: document.documentElement.clientWidth,
				scrollWidth: document.documentElement.scrollWidth,
				boxes: selectors.map( ( selector ) => {
					const rectangle = document
						.querySelector( selector )
						.getBoundingClientRect();
					return {
						selector,
						left: rectangle.left,
						right: rectangle.right,
						top: rectangle.top,
						bottom: rectangle.bottom,
					};
				} ),
			};
		} );

		expect( layout.scrollWidth ).toBeLessThanOrEqual( layout.clientWidth );
		for ( const box of layout.boxes ) {
			expect( box.left, box.selector ).toBeGreaterThanOrEqual( 0 );
			expect( box.right, box.selector ).toBeLessThanOrEqual(
				layout.clientWidth
			);
		}

		const fieldBox = await searchField.boundingBox();
		const submitBox = await searchSubmit.boundingBox();
		expect( fieldBox ).not.toBeNull();
		expect( submitBox ).not.toBeNull();
		expect( submitBox.y ).toBeGreaterThanOrEqual(
			fieldBox.y + fieldBox.height
		);
	} );

	test( '404 search and return actions remain separated at high zoom', async ( {
		page,
	} ) => {
		for ( const width of [ 640, 320 ] ) {
			await page.setViewportSize( { width, height: 800 } );
			await navigate( page, '/accessibility-audit-intentional-404/' );

			const searchForm = page.locator( '.error-404 .search-form' );
			const returnLink = page.locator( '.error-404 .wpdef-button' );

			await expect( searchForm ).toBeVisible();
			await expect( returnLink ).toBeVisible();

			const layout = await page.evaluate( () => {
				const form = document.querySelector(
					'.error-404 .search-form'
				);
				const field = form.querySelector( '.search-field' );
				const submit = form.querySelector( '.search-submit' );
				const link = document.querySelector(
					'.error-404 .wpdef-button'
				);
				const formBox = form.getBoundingClientRect();
				const fieldBox = field.getBoundingClientRect();
				const submitBox = submit.getBoundingClientRect();
				const linkBox = link.getBoundingClientRect();

				return {
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
					formBottom: formBox.bottom,
					fieldBottom: fieldBox.bottom,
					submitTop: submitBox.top,
					linkTop: linkBox.top,
				};
			} );

			expect( layout.scrollWidth ).toBeLessThanOrEqual(
				layout.clientWidth
			);
			expect( layout.linkTop ).toBeGreaterThanOrEqual(
				layout.formBottom + 8
			);

			if ( 320 === width ) {
				expect( layout.submitTop ).toBeGreaterThanOrEqual(
					layout.fieldBottom
				);
			}
		}
	} );

	test( 'classic content tables use a keyboard-accessible local scroller at 320 CSS pixels', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 320, height: 800 } );
		await navigate( page, '/template-comments/' );

		const table = page.locator( '.comment-content table' ).first();
		await expect( table ).toBeVisible();

		const layout = await table.evaluate( ( element ) => {
			const container = element.closest( '.comment-content' );
			const tableBox = element.getBoundingClientRect();
			const containerBox = container.getBoundingClientRect();
			const tableStyle = window.getComputedStyle( element );
			const cells = Array.from( element.querySelectorAll( 'th, td' ) );

			return {
				documentClientWidth: document.documentElement.clientWidth,
				documentScrollWidth: document.documentElement.scrollWidth,
				containerLeft: containerBox.left,
				containerRight: containerBox.right,
				tableLeft: tableBox.left,
				tableRight: tableBox.right,
				tableClientWidth: element.clientWidth,
				tableScrollWidth: element.scrollWidth,
				overflowX: tableStyle.overflowX,
				tableLayout: tableStyle.tableLayout,
				tabIndex: element.tabIndex,
				cellWrapping: cells.map( ( cell ) => {
					const style = window.getComputedStyle( cell );
					return {
						overflowWrap: style.overflowWrap,
						wordBreak: style.wordBreak,
					};
				} ),
			};
		} );

		expect( layout.documentScrollWidth ).toBeLessThanOrEqual(
			layout.documentClientWidth
		);
		expect( layout.tableLeft ).toBeGreaterThanOrEqual(
			layout.containerLeft - 1
		);
		expect( layout.tableRight ).toBeLessThanOrEqual(
			layout.containerRight + 1
		);
		expect( layout.tableScrollWidth ).toBeGreaterThan(
			layout.tableClientWidth
		);
		expect( layout.overflowX ).toBe( 'auto' );
		expect( layout.tableLayout ).toBe( 'auto' );
		expect( layout.tabIndex ).toBe( 0 );
		for ( const wrapping of layout.cellWrapping ) {
			expect( wrapping.overflowWrap ).toBe( 'normal' );
			expect( wrapping.wordBreak ).toBe( 'normal' );
		}

		await table.focus();
		await expect( table ).toBeFocused();
		const direction = await table.evaluate( ( element ) => {
			element.scrollLeft = 0;
			return window.getComputedStyle( element ).direction;
		} );
		await page.keyboard.press(
			'rtl' === direction ? 'ArrowLeft' : 'ArrowRight'
		);
		await expect
			.poll( () =>
				table.evaluate( ( element ) => Math.abs( element.scrollLeft ) )
			)
			.toBeGreaterThan( 0 );
	} );

	test( 'deeply nested comment headers reflow at 320 CSS pixels', async ( {
		page,
	} ) => {
		await page.setViewportSize( { width: 320, height: 800 } );
		await navigate( page, '/template-comments/' );

		const deepestComment = page.getByText( 'Comment Depth 10', {
			exact: true,
		} );
		await expect( deepestComment ).toBeVisible();

		const layout = await page.evaluate( () => {
			const commentBodies = Array.from(
				document.querySelectorAll( '.comment-body' )
			);
			const nestedLists = Array.from(
				document.querySelectorAll( '.comment-list .children' )
			);
			const clipped = [];

			for ( const body of commentBodies ) {
				const bodyBox = body.getBoundingClientRect();
				for ( const selector of [
					'.comment-author',
					'.comment-author .fn',
					'.comment-author .says',
				] ) {
					const element = body.querySelector( selector );
					if ( ! element ) {
						continue;
					}
					const box = element.getBoundingClientRect();
					if (
						box.left < bodyBox.left - 1 ||
						box.right > bodyBox.right + 1 ||
						element.scrollWidth > element.clientWidth + 1
					) {
						clipped.push( {
							selector,
							text: element.textContent.trim(),
						} );
					}
				}
			}

			return {
				clipped,
				maxNestedMargin: Math.max(
					0,
					...nestedLists.map( ( list ) =>
						Number.parseFloat(
							window.getComputedStyle( list ).marginInlineStart
						)
					)
				),
			};
		} );

		expect( layout.clipped ).toEqual( [] );
		expect( layout.maxNestedMargin ).toBe( 0 );
	} );

	test( 'search forms expose visible labels associated with their fields', async ( {
		page,
	} ) => {
		for ( const route of accessibilityRoutes.map(
			( item ) => item.path
		) ) {
			await test.step( route, async () => {
				await navigate( page, route );
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
				await navigate( page, route );
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
		await navigate( page, '/template-comments/' );

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
