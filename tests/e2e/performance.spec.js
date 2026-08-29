import { expect, test } from '@playwright/test';

test( 'native pages load only their contextual theme assets', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'Asset composition runs once in desktop Chromium.'
	);

	await page.goto( '/' );

	const styles = await page
		.locator( 'link[rel="stylesheet"]' )
		.evaluateAll( ( links ) => links.map( ( link ) => link.href ) );
	const scripts = await page
		.locator( 'script[src]' )
		.evaluateAll( ( elements ) =>
			elements.map( ( script ) => script.src )
		);
	const unnecessaryWooScripts = [
		'jquery-blockui',
		'add-to-cart',
		'js-cookie',
		'frontend/woocommerce',
		'cart-fragments',
	];

	for ( const moduleName of [ 'base', 'header', 'footer', 'content' ] ) {
		expect(
			styles.some( ( href ) =>
				href.includes( `/assets/css/${ moduleName }.min.css` )
			)
		).toBe( true );
	}

	expect(
		styles.some( ( href ) =>
			href.includes( '/assets/css/woocommerce.min.css' )
		)
	).toBe( false );
	expect(
		styles.some( ( href ) => href.includes( '/assets/css/theme.min.css' ) )
	).toBe( false );
	expect(
		styles.some( ( href ) => href.includes( '/plugins/woocommerce/' ) )
	).toBe( false );
	expect(
		scripts.some( ( src ) =>
			unnecessaryWooScripts.some( ( fragment ) =>
				src.includes( fragment )
			)
		)
	).toBe( false );
	expect(
		styles.some( ( href ) => href.includes( '/plugins/elementor/' ) )
	).toBe( false );
	expect(
		scripts.some( ( src ) => src.includes( '/plugins/elementor/' ) )
	).toBe( false );

	await expect(
		page.locator( 'link[rel="preload"][as="font"]' )
	).toHaveAttribute( 'href', /inter-latin\.woff2/ );
	await expect( page.locator( 'a.wpdef-cart-link' ) ).toHaveClass(
		/\bno-prefetch\b/
	);
} );
