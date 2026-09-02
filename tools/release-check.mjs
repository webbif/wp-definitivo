import { access, readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import gettextParser from 'gettext-parser';

const themeRoot = 'wp-definitivo';
const requiredFiles = [
	'style.css',
	'index.php',
	'comments.php',
	'screenshot.png',
	'theme.json',
	'readme.txt',
	'accessibility.txt',
	'LICENSE',
	'languages/wp-definitivo.pot',
	'languages/pt_BR.po',
	'languages/pt_BR.mo',
	'assets/css/base.min.css',
	'assets/css/header.min.css',
	'assets/css/footer.min.css',
	'assets/css/content.min.css',
	'assets/css/elementor.min.css',
	'assets/css/woocommerce.min.css',
];

for ( const file of requiredFiles ) {
	await access( `${ themeRoot }/${ file }` );
}

const style = await readFile( `${ themeRoot }/style.css`, 'utf8' );
const themeCss = await readFile( `${ themeRoot }/assets/css/theme.css`, 'utf8' );
for ( const header of [ 'Theme Name: WP Definitivo', 'Text Domain: wp-definitivo', 'Domain Path: /languages', 'Requires PHP: 7.4' ] ) {
	if ( ! style.includes( header ) ) {
		throw new Error( `Missing style.css header: ${ header }` );
	}
}

function relativeLuminance( hex ) {
	const normalized = 4 === hex.length
		? `#${ [ ...hex.slice( 1 ) ].map( ( value ) => value.repeat( 2 ) ).join( '' ) }`
		: hex;
	const channels = normalized
		.slice( 1 )
		.match( /.{2}/g )
		.map( ( value ) => Number.parseInt( value, 16 ) / 255 )
		.map( ( value ) =>
			value <= 0.04045
				? value / 12.92
				: ( ( value + 0.055 ) / 1.055 ) ** 2.4
		);

	return 0.2126 * channels[ 0 ] + 0.7152 * channels[ 1 ] + 0.0722 * channels[ 2 ];
}

function contrastRatio( foreground, background ) {
	const values = [ relativeLuminance( foreground ), relativeLuminance( background ) ].sort( ( a, b ) => b - a );
	return ( values[ 0 ] + 0.05 ) / ( values[ 1 ] + 0.05 );
}

for ( const selector of [ ':root', '.wpdef-scheme-ivory-wine', '.wpdef-scheme-sand-green', '.wpdef-scheme-night-wine' ] ) {
	const escapedSelector = selector.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
	const block = themeCss.match( new RegExp( `${ escapedSelector }\\s*\\{([^}]*)\\}` ) )?.[ 1 ];
	const surface = block?.match( /--wpdef-surface:\s*(#[0-9a-f]{3}(?:[0-9a-f]{3})?)/i )?.[ 1 ];
	const controlBorder = block?.match( /--wpdef-control-border:\s*(#[0-9a-f]{3}(?:[0-9a-f]{3})?)/i )?.[ 1 ];
	if ( ! surface || ! controlBorder || contrastRatio( controlBorder, surface ) < 3 ) {
		throw new Error( `${ selector } form-control border must have at least 3:1 contrast against its surface.` );
	}
}

for ( const requiredFocusRule of [
	'outline: 3px solid var(--wpdef-accent);',
	'outline: 3px solid var(--wpdef-accent) !important;',
] ) {
	if ( ! themeCss.includes( requiredFocusRule ) ) {
		throw new Error( `Missing accessible focus rule: ${ requiredFocusRule }` );
	}
}

if ( style.includes( 'accessibility-ready' ) ) {
	const accessibility = await readFile( `${ themeRoot }/accessibility.txt`, 'utf8' );
	for ( const section of [
		'=== Accessibility Statement ===',
		'== Testing Tools and Methodology ==',
		'== Screen Reader Text Class ==',
		'== Accessibility Help Contact ==',
		'== Where to Report Issues ==',
	] ) {
		if ( ! accessibility.includes( section ) ) {
			throw new Error( `accessibility.txt is missing the required section: ${ section }` );
		}
	}
}

async function walk( directory ) {
	const entries = await readdir( directory );
	const files = [];
	for ( const entry of entries ) {
		const path = `${ directory }/${ entry }`;
		if ( ( await stat( path ) ).isDirectory() ) {
			files.push( ...( await walk( path ) ) );
		} else {
			files.push( path );
		}
	}
	return files;
}

const files = await walk( themeRoot );
const forbidden = files.filter( ( file ) => /(?:node_modules|\.git|\.map$|\.log$|\.zip$|\.psd$)/.test( file ) );
if ( forbidden.length ) {
	throw new Error( `Forbidden release files:\n${ forbidden.join( '\n' ) }` );
}

for ( const obsoleteAsset of [ `${ themeRoot }/assets/css/fonts.css`, `${ themeRoot }/assets/css/theme.min.css` ] ) {
	if ( files.includes( obsoleteAsset ) ) {
		throw new Error( `Obsolete front-end asset must not be shipped: ${ obsoleteAsset }` );
	}
}

const assetSource = await readFile( `${ themeRoot }/inc/assets.php`, 'utf8' );
if ( ! assetSource.includes( '/assets/css/{$module}.min.css' ) ) {
	throw new Error( 'The contextual stylesheet loader is missing.' );
}

const accessibilitySources = await Promise.all(
	files
		.filter( ( file ) => /\.(?:css|php)$/.test( file ) && ! file.endsWith( '.min.css' ) )
		.map( ( file ) => readFile( file, 'utf8' ) )
);
const accessibilitySource = accessibilitySources.join( '\n' );
for ( const forbiddenAccessibilityOverride of [
	'wpdef_underline_content_links',
	'wpdef-content-links-no-underline',
] ) {
	if ( accessibilitySource.includes( forbiddenAccessibilityOverride ) ) {
		throw new Error( `Accessibility override must not be shipped: ${ forbiddenAccessibilityOverride }` );
	}
}
if ( ! accessibilitySource.includes( 'text-decoration-line: underline' ) ) {
	throw new Error( 'Readable theme CSS must keep a non-color indicator on links in body text.' );
}

const potCatalog = gettextParser.po.parse( await readFile( `${ themeRoot }/languages/wp-definitivo.pot` ) );
const ptBrCatalog = gettextParser.po.parse( await readFile( `${ themeRoot }/languages/pt_BR.po` ) );
const compiledCatalog = gettextParser.mo.parse( await readFile( `${ themeRoot }/languages/pt_BR.mo` ) );
const emptyTranslations = [];
const missingCatalogEntries = [];
const staleCompiledEntries = [];
const potMessageIds = new Set();
for ( const context of Object.values( ptBrCatalog.translations ) ) {
	for ( const [ msgid, entry ] of Object.entries( context ) ) {
		if ( msgid && ( ! entry.msgstr || entry.msgstr.some( ( translation ) => ! translation ) ) ) {
			emptyTranslations.push( msgid );
		}
	}
}
if ( emptyTranslations.length ) {
	throw new Error( `Incomplete pt_BR translations:\n${ emptyTranslations.join( '\n' ) }` );
}

for ( const [ contextName, context ] of Object.entries( potCatalog.translations ) ) {
	for ( const [ msgid, potEntry ] of Object.entries( context ) ) {
		if ( ! msgid ) {
			continue;
		}

		potMessageIds.add( msgid );
		if ( potEntry.msgid_plural ) {
			potMessageIds.add( potEntry.msgid_plural );
		}

		const poEntry = ptBrCatalog.translations?.[ contextName ]?.[ msgid ];
		const moEntry = compiledCatalog.translations?.[ contextName ]?.[ msgid ];
		if ( ! poEntry ) {
			missingCatalogEntries.push( msgid );
			continue;
		}
		if ( ! moEntry || JSON.stringify( moEntry.msgstr ) !== JSON.stringify( poEntry.msgstr ) ) {
			staleCompiledEntries.push( msgid );
		}
	}
}
if ( missingCatalogEntries.length ) {
	throw new Error( `pt_BR.po is missing POT entries:\n${ missingCatalogEntries.join( '\n' ) }` );
}
if ( staleCompiledEntries.length ) {
	throw new Error( `pt_BR.mo is missing or stale for:\n${ staleCompiledEntries.join( '\n' ) }` );
}

const sourceMessageIds = new Set();
const literalPattern = String.raw`(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")`;
const singularPattern = new RegExp( String.raw`\b(?:__|_e|_x|esc_html__|esc_html_e|esc_html_x|esc_attr__|esc_attr_e|esc_attr_x)\(\s*${ literalPattern }`, 'g' );
const pluralPattern = new RegExp( String.raw`\b(?:_n|_nx|_n_noop|_nx_noop)\(\s*${ literalPattern }\s*,\s*${ literalPattern }`, 'g' );
const decodePhpLiteral = ( value ) => value.replace( /\\(['"\\])/g, '$1' );

for ( const file of files.filter( ( candidate ) => candidate.endsWith( '.php' ) ) ) {
	const source = await readFile( file, 'utf8' );
	for ( const match of source.matchAll( singularPattern ) ) {
		sourceMessageIds.add( decodePhpLiteral( match[ 1 ] ?? match[ 2 ] ) );
	}
	for ( const match of source.matchAll( pluralPattern ) ) {
		sourceMessageIds.add( decodePhpLiteral( match[ 1 ] ?? match[ 2 ] ) );
		sourceMessageIds.add( decodePhpLiteral( match[ 3 ] ?? match[ 4 ] ) );
	}
	for ( const match of source.matchAll( /Template Name:\s*([^\r\n*]+)/g ) ) {
		sourceMessageIds.add( match[ 1 ].trim() );
	}
}

const themeJson = JSON.parse( await readFile( `${ themeRoot }/theme.json`, 'utf8' ) );
for ( const collection of [
	themeJson.settings?.color?.palette,
	themeJson.settings?.spacing?.spacingSizes,
	themeJson.settings?.typography?.fontFamilies,
	themeJson.settings?.typography?.fontSizes,
] ) {
	for ( const item of collection ?? [] ) {
		if ( item.name ) {
			sourceMessageIds.add( item.name );
		}
	}
}

for ( const headerName of [ 'Theme Name', 'Theme URI', 'Description', 'Author', 'Author URI' ] ) {
	const match = style.match( new RegExp( `^${ headerName }:\\s*(.+)$`, 'm' ) );
	if ( match ) {
		sourceMessageIds.add( match[ 1 ].trim() );
	}
}

const sourceStringsMissingFromPot = [ ...sourceMessageIds ].filter( ( msgid ) => ! potMessageIds.has( msgid ) );
if ( sourceStringsMissingFromPot.length ) {
	throw new Error( `Translatable source strings are missing from the POT file:\n${ sourceStringsMissingFromPot.join( '\n' ) }` );
}

const screenshot = await readFile( `${ themeRoot }/screenshot.png` );
if ( 1200 !== screenshot.readUInt32BE( 16 ) || 900 !== screenshot.readUInt32BE( 20 ) ) {
	throw new Error( 'screenshot.png must be exactly 1200 by 900 pixels.' );
}

const textExtensions = /\.(?:css|js|json|md|php|po|pot|txt)$/;
for ( const file of files.filter( ( candidate ) => textExtensions.test( candidate ) || candidate.endsWith( '/LICENSE' ) ) ) {
	const contents = await readFile( file, 'utf8' );
	if ( /\r\n/.test( contents ) && /(^|[^\r])\n/.test( contents ) ) {
		throw new Error( `${ file } mixes CRLF and LF line endings.` );
	}
}

const cssModules = [ 'base', 'header', 'footer', 'content', 'elementor', 'woocommerce' ];
const cssContents = Object.fromEntries(
	await Promise.all(
		cssModules.map( async ( moduleName ) => [
			moduleName,
			await readFile( `${ themeRoot }/assets/css/${ moduleName }.min.css`, 'utf8' ),
		] )
	)
);

for ( const [ moduleName, requiredSelector ] of Object.entries( {
	base: ':root',
	header: '.site-header',
	footer: '.site-footer',
	content: '.entry-content',
	elementor: '.wpdef-elementor',
	woocommerce: '.woocommerce',
} ) ) {
	if ( ! cssContents[ moduleName ].includes( requiredSelector ) ) {
		throw new Error( `${ moduleName }.min.css is missing ${ requiredSelector }.` );
	}
}

for ( const moduleName of [ 'base', 'header', 'footer', 'content', 'elementor' ] ) {
	if ( cssContents[ moduleName ].includes( '.woocommerce' ) ) {
		throw new Error( `WooCommerce selectors leaked into ${ moduleName }.min.css.` );
	}
}

if ( cssContents.content.includes( '.site-header' ) || cssContents.content.includes( '.site-footer' ) ) {
	throw new Error( 'Native frame selectors leaked into content.min.css.' );
}

const cssSizes = Object.fromEntries(
	await Promise.all(
		cssModules.map( async ( moduleName ) => [
			moduleName,
			gzipSync( cssContents[ moduleName ] ).byteLength,
		] )
	)
);
const cssBytes = Object.values( cssSizes ).reduce( ( total, bytes ) => total + bytes, 0 );
const jsBytes = gzipSync( await readFile( `${ themeRoot }/assets/js/navigation.min.js` ) ).byteLength;
if ( cssBytes > 24 * 1024 ) {
	throw new Error( `Contextual theme CSS totals ${ cssBytes } bytes gzip; the limit is 24576.` );
}
if ( cssSizes.base + cssSizes.header + cssSizes.footer + cssSizes.content > 12 * 1024 ) {
	throw new Error( 'A native non-commerce page exceeds the 12 KiB contextual CSS budget.' );
}
if ( jsBytes > 15 * 1024 ) {
	throw new Error( `Theme JavaScript is ${ jsBytes } bytes gzip; the limit is 15360.` );
}

console.log( `Release checks passed: ${ files.length } files; screenshot 1200x900; contextual CSS ${ cssBytes } B gzip; JS ${ jsBytes } B gzip.` );
