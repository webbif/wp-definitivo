# WP Definitivo

WP Definitivo is a free, GPL-licensed classic WordPress theme for creators and small businesses. It combines PHP templates with `theme.json`, local variable fonts, accessible navigation, Gutenberg block styles, and optional WooCommerce and Elementor integrations.

The source repository includes the distributable theme in `wp-definitivo/`, quality tooling, end-to-end tests, and release documentation. No plugin is required for the theme to work. The readable `theme.css` source is compiled into contextual modules so native pages, WooCommerce, and Elementor load only the theme layers they need.

## Requirements

- WordPress 6.6 or later
- PHP 7.4 or later
- Node.js 20+ and npm for front-end tooling
- Composer 2 for PHP quality checks
- Docker for the optional `wp-env` integration test environment

## Development

```sh
composer install
npm install
npm run build
composer lint
npm run lint
```

Use `npm run wp-env:start` to launch the integration environment and `npm run test:e2e` to run Playwright and axe checks.

## Release

Run `npm run release:check` before packaging. The distributable ZIP must contain a single top-level `wp-definitivo` folder and must not include repository metadata, dependency directories, test files, or build caches.

## License

WP Definitivo is licensed under the GNU General Public License v2 or later. Inter and JetBrains Mono are distributed under the SIL Open Font License 1.1; their license files are included beside the font files.
