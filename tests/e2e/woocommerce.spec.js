import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function addResponsiveTestProductToCart( page ) {
	const response = await page.request.get(
		'/?rest_route=/wc/store/v1/products&slug=wp-definitivo-responsive-test-product'
	);
	expect( response.ok() ).toBe( true );

	const products = await response.json();
	expect( products ).toHaveLength( 1 );

	await page.goto( `/?add-to-cart=${ products[ 0 ].id }` );
}

test( 'WooCommerce shop uses the theme shell without WCAG errors', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'The integration route runs once in desktop Chromium.'
	);

	const response = await page.goto( '/shop/' );
	expect( response?.status() ).toBe( 200 );
	await expect( page.locator( 'main#primary' ) ).toBeVisible();
	await expect( page.locator( 'body' ) ).not.toContainText( 'Fatal error' );

	const results = await new AxeBuilder( { page } )
		.withTags( [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa' ] )
		.analyze();
	expect( results.violations ).toEqual( [] );
} );

test( 'WooCommerce mobile cart keeps totals clear of product details', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'mobile-chrome' !== testInfo.project.name,
		'The responsive cart integration runs once in mobile Chrome.'
	);

	await page.setViewportSize( { width: 390, height: 844 } );
	await addResponsiveTestProductToCart( page );
	await page.goto( '/cart/' );

	const row = page
		.locator( '.wc-block-cart-items__row' )
		.filter( { hasText: 'Produto com um título muito longo' } );
	await expect( row ).toBeVisible();
	const mobilePanelPadding = await page.evaluate( () => ( {
		main: Number.parseFloat(
			window.getComputedStyle(
				document.querySelector( '.wc-block-cart__main' )
			).paddingLeft
		),
		sidebar: Number.parseFloat(
			window.getComputedStyle(
				document.querySelector( '.wc-block-cart__sidebar' )
			).paddingLeft
		),
	} ) );
	expect( mobilePanelPadding.main ).toBeGreaterThanOrEqual( 12 );
	expect( mobilePanelPadding.sidebar ).toBeGreaterThanOrEqual( 12 );

	await page
		.getByRole( 'button', { name: /^(Add coupons|Adicionar cupons)$/ } )
		.click();
	const couponInput = page.getByRole( 'textbox', {
		name: /^(Enter code|Digite o código)$/,
	} );
	await couponInput.click();
	const couponLayout = await page.evaluate( () => {
		const input = document.querySelector(
			'.wc-block-components-totals-coupon__input input'
		);
		const label = document.querySelector(
			'.wc-block-components-totals-coupon__input label'
		);
		const form = document.querySelector(
			'.wc-block-components-totals-coupon__form'
		);
		const button = form.querySelector( 'button' );
		const inputRect = input.getBoundingClientRect();
		const labelRect = label.getBoundingClientRect();
		const formRect = form.getBoundingClientRect();
		const buttonRect = button.getBoundingClientRect();
		const inputStyle = window.getComputedStyle( input );

		return {
			buttonWidth: buttonRect.width,
			formWidth: formRect.width,
			inputPaddingTop: Number.parseFloat( inputStyle.paddingTop ),
			inputWidth: inputRect.width,
			labelBottom: labelRect.bottom,
			textStart:
				inputRect.top + Number.parseFloat( inputStyle.paddingTop ),
		};
	} );
	expect( couponLayout.inputPaddingTop ).toBeGreaterThanOrEqual( 20 );
	expect( couponLayout.labelBottom ).toBeLessThanOrEqual(
		couponLayout.textStart
	);
	expect( couponLayout.inputWidth ).toBeGreaterThanOrEqual(
		couponLayout.formWidth - 1
	);
	expect( couponLayout.buttonWidth ).toBeGreaterThanOrEqual(
		couponLayout.formWidth - 1
	);

	const product = await row
		.locator( '.wc-block-cart-item__product' )
		.boundingBox();
	const total = await row
		.locator( '.wc-block-cart-item__total' )
		.boundingBox();
	expect( product ).not.toBeNull();
	expect( total ).not.toBeNull();
	expect( product.y + product.height ).toBeLessThanOrEqual( total.y );
	expect(
		await page.evaluate(
			() =>
				document.documentElement.scrollWidth <=
				document.documentElement.clientWidth + 2
		)
	).toBe( true );
} );

test( 'WooCommerce tablet cart keeps padding in both stacked panels', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'The tablet cart integration runs once in desktop Chromium.'
	);

	await page.setViewportSize( { width: 768, height: 1024 } );
	await addResponsiveTestProductToCart( page );
	await page.goto( '/cart/' );

	const panelPadding = await page.evaluate( () => ( {
		main: Number.parseFloat(
			window.getComputedStyle(
				document.querySelector( '.wc-block-cart__main' )
			).paddingLeft
		),
		sidebar: Number.parseFloat(
			window.getComputedStyle(
				document.querySelector( '.wc-block-cart__sidebar' )
			).paddingLeft
		),
	} ) );

	expect( panelPadding.main ).toBeGreaterThanOrEqual( 16 );
	expect( panelPadding.sidebar ).toBeGreaterThanOrEqual( 16 );
} );

test( 'WooCommerce tablet checkout hides the compact duplicate summary', async ( {
	page,
}, testInfo ) => {
	test.skip(
		'chromium' !== testInfo.project.name,
		'The tablet checkout integration runs once in desktop Chromium.'
	);

	await page.setViewportSize( { width: 768, height: 1024 } );
	await addResponsiveTestProductToCart( page );
	await page.goto( '/checkout/' );

	const checkout = page.locator(
		'.wc-block-components-sidebar-layout.wc-block-checkout.is-medium'
	);
	await expect( checkout ).toBeVisible();
	await expect(
		checkout.locator( '.wc-block-checkout__sidebar' )
	).toBeHidden();
	await expect(
		page.locator( '.wc-block-components-order-summary-item' ).first()
	).toBeVisible();
} );
