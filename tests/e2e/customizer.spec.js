import { expect, test } from '@playwright/test';

test( 'Customizer preview loads from the canonical site origin', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'The Customizer integration runs once in desktop Chromium.'
	);

	await page.goto( '/wp-login.php' );
	await page.locator( '#user_login' ).fill( 'admin' );
	await page.locator( '#user_pass' ).fill( 'password' );
	await page.locator( '#wp-submit' ).click();

	const response = await page.goto( '/wp-admin/customize.php' );
	expect( response?.status() ).toBe( 200 );

	const preview = page.locator( '#customize-preview iframe' );
	await expect( preview ).toBeVisible();
	const previewUrl = new URL( await preview.getAttribute( 'src' ) );
	const expectedOrigin = new URL( testInfo.project.use.baseURL ).origin;
	expect( previewUrl.origin ).toBe( expectedOrigin );
	await expect(
		page.frameLocator( '#customize-preview iframe' ).locator( 'body' )
	).toBeVisible();
} );
