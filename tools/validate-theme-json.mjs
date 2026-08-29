import { readFile } from 'node:fs/promises';

const path = 'wp-definitivo/theme.json';
const document = JSON.parse( await readFile( path, 'utf8' ) );
const errors = [];

if ( 3 !== document.version ) {
	errors.push( 'theme.json must use version 3.' );
}
if ( ! document.settings?.layout?.contentSize || ! document.settings?.layout?.wideSize ) {
	errors.push( 'theme.json must define contentSize and wideSize.' );
}
if ( ! Array.isArray( document.settings?.typography?.fontFamilies ) || 2 > document.settings.typography.fontFamilies.length ) {
	errors.push( 'theme.json must define both local font families.' );
}
if ( ! Array.isArray( document.settings?.color?.palette ) ) {
	errors.push( 'theme.json must define its palette.' );
}

if ( errors.length ) {
	throw new Error( errors.join( '\n' ) );
}

console.log( `${ path } is valid JSON and contains the required v3 theme settings.` );
