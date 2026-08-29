import { expect, test } from '@playwright/test';

test( 'official Theme Check reports no required errors', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'Theme Check runs once in the desktop Chromium project.'
	);

	await page.goto( '/wp-login.php' );
	await page.locator( '#user_login' ).fill( 'admin' );
	await page.locator( '#user_pass' ).fill( 'password' );
	await page.locator( '#wp-submit' ).click();

	await page.goto( '/wp-admin/themes.php?page=themecheck' );
	await page
		.locator( 'select[name="themename"]' )
		.selectOption( 'wp-definitivo' );
	await page.getByRole( 'button', { name: 'Check it!' } ).click();

	await expect(
		page.getByText( 'WP Definitivo passed the tests' )
	).toBeVisible();
} );
