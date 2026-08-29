import { defineConfig, devices } from '@playwright/test';

export default defineConfig( {
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean( process.env.CI ),
	retries: process.env.CI ? 2 : 0,
	reporter: [ [ 'list' ], [ 'html', { open: 'never' } ] ],
	use: {
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices[ 'Desktop Chrome' ],
				channel: process.env.CI ? undefined : 'chrome',
			},
		},
		{ name: 'firefox', use: { ...devices[ 'Desktop Firefox' ] } },
		{ name: 'webkit', use: { ...devices[ 'Desktop Safari' ] } },
		{
			name: 'mobile-chrome',
			use: {
				...devices[ 'Pixel 7' ],
				channel: process.env.CI ? undefined : 'chrome',
			},
		},
		{ name: 'mobile-safari', use: { ...devices[ 'iPhone 14' ] } },
	],
} );
