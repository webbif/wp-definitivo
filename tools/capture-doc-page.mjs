import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const url = process.env.DOC_URL || 'https://wpdefinitivo.com/tema-wp-definitivo/';
const browser = await chromium.launch( { channel: 'chrome', headless: true } );

async function inspect( name, viewport ) {
	const context = await browser.newContext( { viewport } );
	const page = await context.newPage();
	const response = await page.goto( url, { waitUntil: 'networkidle' } );
	await page.locator( '.wpdef-docs' ).waitFor();
	const acceptCookies = page.getByRole( 'button', { name: 'Aceitar', exact: true } );
	if ( await acceptCookies.count() ) {
		await acceptCookies.first().click();
	}

	const layout = await page.evaluate( () => {
		const docs = document.querySelector( '.wpdef-docs' );
		const desktopToc = document.querySelector( '.wpdef-docs__toc--desktop' );
		const mobileToc = document.querySelector( '.wpdef-docs__toc--mobile' );
		const toc = window.innerWidth <= 900 ? mobileToc : desktopToc;
		const content = document.querySelector( '.wpdef-docs__content' );
		const summary = toc?.querySelector( ':scope > summary' );
		const nav = toc?.querySelector( ':scope > nav' );
		const rect = ( element ) => element?.getBoundingClientRect();

		return {
			viewportWidth: window.innerWidth,
			bodyScrollWidth: document.documentElement.scrollWidth,
			docs: rect( docs ),
			toc: rect( toc ),
			content: rect( content ),
			summary: rect( summary ),
			tocDisplay: toc ? getComputedStyle( toc ).display : null,
			summaryDisplay: summary ? getComputedStyle( summary ).display : null,
			navDisplay: nav ? getComputedStyle( nav ).display : null,
			tocOpen: toc?.open ?? null,
			h1Count: docs?.querySelectorAll( 'h1' ).length ?? 0,
		};
	} );

	const accessibility = await new AxeBuilder( { page } )
		.include( '.wpdef-docs' )
		.analyze();

	await page.screenshot( {
		path: `docs/theme-uri-${ name }.png`,
		fullPage: true,
	} );
	await page.screenshot( { path: `docs/theme-uri-${ name }-top.png` } );

	await context.close();

	return {
		name,
		status: response?.status(),
		layout,
		accessibilityViolations: accessibility.violations.map( ( violation ) => ( {
			id: violation.id,
			impact: violation.impact,
			nodes: violation.nodes.length,
		} ) ),
	};
}

const results = [];
results.push( await inspect( 'desktop', { width: 1440, height: 1000 } ) );
results.push( await inspect( 'mobile', { width: 390, height: 844 } ) );

await browser.close();

console.log( JSON.stringify( results, null, 2 ) );
