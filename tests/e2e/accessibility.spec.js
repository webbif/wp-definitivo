import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe( 'public theme', () => {
	test( 'home page has no automatically detectable accessibility violations', async ( {
		page,
	} ) => {
		await page.goto( '/' );
		const results = await new AxeBuilder( { page } )
			.withTags( [
				'wcag2a',
				'wcag2aa',
				'wcag21a',
				'wcag21aa',
				'wcag22aa',
			] )
			.analyze();
		expect( results.violations ).toEqual( [] );
	} );

	test( 'skip link reaches the main landmark', async ( {
		browserName,
		page,
	} ) => {
		await page.goto( '/' );
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
		await skipLink.press( 'Enter' );
		expect( await page.evaluate( () => window.location.hash ) ).toBe(
			'#primary'
		);
		await expect( page.locator( '#primary' ) ).toBeFocused();
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
		).toBeGreaterThan( 1 );
		expect( titleBox.y + titleBox.height ).toBeLessThanOrEqual(
			actionsBox.y
		);
		const menu = page.getByRole( 'button', { name: 'Menu' } );
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
			'Open submenu for Level 1'
		);
		await levelOneToggle.click();
		await expect( levelOneToggle ).toHaveAttribute(
			'aria-expanded',
			'true'
		);
		await expect( levelOneToggle ).toHaveAttribute(
			'aria-label',
			'Close submenu for Level 1'
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
} );
