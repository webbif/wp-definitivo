import { readFile, writeFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { minify } from 'terser';

const cssSourcePath = 'wp-definitivo/assets/css/theme.css';
const cssSource = await readFile( cssSourcePath, 'utf8' );
const sourceRoot = postcss.parse( cssSource, { from: cssSourcePath } );
const moduleNames = [ 'base', 'header', 'footer', 'content', 'elementor', 'woocommerce' ];
const moduleRoots = Object.fromEntries( moduleNames.map( ( name ) => [ name, postcss.root() ] ) );
const wooStartMarker = '/* WooCommerce classic templates and blocks. */';
const wooEndMarker = '/* End WooCommerce classic templates and blocks. */';
const wooStartLine = cssSource.slice( 0, cssSource.indexOf( wooStartMarker ) ).split( '\n' ).length;
const wooEndLine = cssSource.slice( 0, cssSource.indexOf( wooEndMarker ) ).split( '\n' ).length;

if ( ! cssSource.includes( wooStartMarker ) || ! cssSource.includes( wooEndMarker ) ) {
	throw new Error( 'The readable CSS must keep the WooCommerce section markers.' );
}

const headerPattern = /(?:site-header|header-|site-branding|custom-logo|site-title|site-description|primary-navigation|primary-menu|menu-toggle|search-toggle|search-close|wpdef-header-icon|wpdef-cart-link|wpdef-cart-count|wpdef-cart-label)/;
const footerPattern = /(?:site-footer|footer-|site-info)/;
const contentPattern = /(?:entry-content|entry-summary|widget|comment-content|comments-area|post-|wpdef-reading|wpdef-content|site-main)/;
const woocommercePattern = /(?:woocommerce|wc-block|wc-block-grid|wc-block-components|select2-|wpdef-shop|widget_product|single-product|shop-columns)/;
const basePattern = /^(?::root$|html(?:$|[:\[])|body(?:$|[:\[])|\*|::?before|::?after|button|input|select|textarea|img|video|iframe|figure|a(?::|\[|\s|$)|h[1-6](?::|\s|$)|p$|ul$|ol$|blockquote$|pre$|table$|code$|kbd$|samp$|th$|td$|hr$|:where\(a,\s*button|\.screen-reader-text|\.wpdef-shell|\.wpdef-button|\.wpdef-container-width-|\.wpdef-scheme-|\.site(?:\s|$)|\.admin-bar\s+\.site|\.search-form)/;

function classifySelector( selector, line ) {
	if ( ( line >= wooStartLine && line < wooEndLine ) || woocommercePattern.test( selector ) ) {
		return [ 'woocommerce' ];
	}

	if ( selector.includes( 'elementor' ) ) {
		return [ 'elementor' ];
	}

	const contextualModules = [];

	if ( headerPattern.test( selector ) ) {
		contextualModules.push( 'header' );
	}

	if ( footerPattern.test( selector ) ) {
		contextualModules.push( 'footer' );
	}

	if ( contentPattern.test( selector ) ) {
		contextualModules.push( 'content' );
	}

	if ( contextualModules.length ) {
		return [ ...new Set( contextualModules ) ];
	}

	if ( basePattern.test( selector.trim() ) ) {
		return [ 'base' ];
	}

	return [ 'content' ];
}

function groupSelectors( rule ) {
	const groups = new Map();
	const parsed = selectorParser().astSync( rule.selector );
	const line = rule.source?.start?.line ?? 0;

	for ( const selector of parsed.nodes ) {
		const value = selector.toString();
		for ( const moduleName of classifySelector( value, line ) ) {
			if ( ! groups.has( moduleName ) ) {
				groups.set( moduleName, [] );
			}

			groups.get( moduleName ).push( value );
		}
	}

	return groups;
}

function distributeContainer( sourceContainer, targets ) {
	for ( const node of sourceContainer.nodes ?? [] ) {
		if ( 'comment' === node.type ) {
			continue;
		}

		if ( 'rule' === node.type ) {
			for ( const [ moduleName, selectors ] of groupSelectors( node ) ) {
				const clone = node.clone( { selector: selectors.join( ',' ) } );
				targets[ moduleName ].append( clone );
			}
			continue;
		}

		if ( 'atrule' === node.type && node.nodes ) {
			for ( const moduleName of moduleNames ) {
				const wrapper = node.clone( { nodes: [] } );
				const nestedTargets = Object.fromEntries(
					moduleNames.map( ( name ) => [ name, name === moduleName ? wrapper : postcss.root() ] )
				);

				distributeContainer( node, nestedTargets );

				if ( wrapper.nodes.length ) {
					targets[ moduleName ].append( wrapper );
				}
			}
			continue;
		}

		targets.base.append( node.clone() );
	}
}

distributeContainer( sourceRoot, moduleRoots );

for ( const moduleName of moduleNames ) {
	const result = transform( {
		filename: `${ moduleName }.css`,
		code: Buffer.from( moduleRoots[ moduleName ].toString() ),
		minify: true,
		targets: {
			chrome: 109 << 16,
			firefox: 115 << 16,
			safari: 16 << 16,
		},
	} );

	await writeFile( `wp-definitivo/assets/css/${ moduleName }.min.css`, result.code );
}

const jsSource = await readFile( 'wp-definitivo/assets/js/navigation.js', 'utf8' );
const jsResult = await minify( jsSource, {
	compress: true,
	mangle: true,
	format: {
		comments: /^!/,
	},
} );
await writeFile( 'wp-definitivo/assets/js/navigation.min.js', `${ jsResult.code }\n` );
