import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.WP_BASE_URL || 'http://staging-2.local';
const evidenceDir = path.resolve('evidencias/theme-builder-compatibility');

const viewports = [
	{ name: 'desktop-1440', width: 1440, height: 1000 },
	{ name: 'tablet-1024', width: 1024, height: 900 },
	{ name: 'tablet-768', width: 768, height: 1024 },
	{ name: 'mobile-390', width: 390, height: 844 },
];

const cases = [
	{
		key: 'page-header-footer',
		path: '/elementor-compatibility-test/',
		markers: [ 'TESTE HEADER ELEMENTOR PRO', 'TESTE FOOTER ELEMENTOR PRO' ],
		h1: 'Elementor Compatibility Test',
		selectors: {
			'.elementor-location-header': 1,
			'.elementor-location-footer': 1,
			'.site-header, #masthead, .wp-definitivo-header': 0,
			'.site-footer, #colophon, .wp-definitivo-footer': 0,
		},
	},
	{
		key: 'single-post',
		path: '/hello-world/',
		markers: [ 'TESTE SINGLE POST ELEMENTOR PRO' ],
		h1: 'Hello world!',
		selectors: {
			'.elementor-location-single': 1,
			'.elementor-widget-theme-post-content': 1,
		},
	},
	{
		key: 'post-archive',
		path: '/category/edge-case-2/',
		markers: [ 'TESTE ARCHIVE ELEMENTOR PRO' ],
		h1: 'Category: Edge Case',
		selectors: {
			'.elementor-location-archive': 1,
			'.elementor-widget-posts': 1,
		},
	},
	{
		key: 'single-product',
		path: '/product/produto-acessivel-de-demonstracao/',
		markers: [ 'TESTE SINGLE PRODUCT ELEMENTOR PRO' ],
		h1: 'Produto acessível de demonstração',
		selectors: {
			'.elementor-location-single': 1,
			'.woocommerce-product-gallery': 1,
			'form.cart': 1,
		},
	},
	{
		key: 'product-archive',
		path: '/product-category/produtos-de-teste/',
		markers: [ 'TESTE PRODUCT ARCHIVE ELEMENTOR PRO' ],
		h1: 'Categoria: Produtos de teste',
		selectors: {
			'.elementor-location-archive': 1,
			'.elementor-widget-wc-archive-products': 1,
			'ul.products li.product': 3,
		},
	},
];

await fs.mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

try {
	for ( const viewport of viewports ) {
		const context = await browser.newContext({ viewport });

		for ( const testCase of cases ) {
			const page = await context.newPage();
			const consoleErrors = [];
			const pageErrors = [];
			const failedRequests = [];

			page.on('console', (message) => {
				if (message.type() === 'error') consoleErrors.push(message.text());
			});
			page.on('pageerror', (error) => pageErrors.push(error.message));
			page.on('requestfailed', (request) => {
				failedRequests.push({ url: request.url(), error: request.failure()?.errorText || '' });
			});

			const response = await page.goto(`${baseURL}${testCase.path}`, {
				waitUntil: 'networkidle',
				timeout: 30_000,
			});

			const metrics = await page.evaluate(({ markers, h1, selectors }) => {
				const visible = (element) => Boolean(
					element.offsetWidth || element.offsetHeight || element.getClientRects().length
				);
				const exactVisibleTextCount = (text) => [ ...document.querySelectorAll('*') ]
					.filter((element) => element.children.length === 0)
					.filter(visible)
					.filter((element) => element.textContent.trim() === text).length;
				const selectorCounts = Object.fromEntries(
					Object.keys(selectors).map((selector) => [ selector, document.querySelectorAll(selector).length ])
				);
				const visibleH1 = [ ...document.querySelectorAll('h1') ]
					.filter(visible)
					.map((element) => element.textContent.trim());
				const root = document.documentElement;

				return {
					innerWidth,
					clientWidth: root.clientWidth,
					scrollWidth: root.scrollWidth,
					overflowX: root.scrollWidth > root.clientWidth + 1,
					markerCounts: Object.fromEntries(markers.map((marker) => [ marker, exactVisibleTextCount(marker) ])),
					selectorCounts,
					visibleH1,
					h1Matches: visibleH1.filter((text) => text === h1).length,
				};
			}, testCase);

			const assertions = {
				http200: response?.status() === 200,
				markersUnique: Object.values(metrics.markerCounts).every((count) => count === 1),
				h1Unique: metrics.h1Matches === 1 && metrics.visibleH1.length === 1,
				selectorsMatch: Object.entries(testCase.selectors)
					.every(([ selector, expected ]) => metrics.selectorCounts[selector] === expected),
				noHorizontalOverflow: !metrics.overflowX,
				noRuntimeErrors: consoleErrors.filter((message) => !message.includes('ERR_NETWORK_ACCESS_DENIED')).length === 0 &&
					pageErrors.length === 0 &&
					failedRequests.filter((request) => request.url.startsWith(baseURL)).length === 0,
			};

			await page.screenshot({
				path: path.join(evidenceDir, `${viewport.name}--${testCase.key}.png`),
				fullPage: true,
			});

			results.push({
				viewport,
				case: testCase.key,
				url: page.url(),
				status: response?.status() || null,
				metrics,
				assertions,
				consoleErrors,
				pageErrors,
				failedRequests,
				environmentalWarnings: failedRequests.filter((request) =>
					!request.url.startsWith(baseURL) && request.error.includes('ERR_NETWORK_ACCESS_DENIED')
				),
				passed: Object.values(assertions).every(Boolean),
			});

			await page.close();
		}

		await context.close();
	}
} finally {
	await browser.close();
}

await fs.writeFile(
	path.join(evidenceDir, 'resultados-responsive.json'),
	`${JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, results }, null, 2)}\n`,
	'utf8'
);

const failed = results.filter((result) => !result.passed);
console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed }, null, 2));
process.exitCode = failed.length ? 1 : 0;
