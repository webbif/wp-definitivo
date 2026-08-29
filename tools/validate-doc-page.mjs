import { readFile } from 'node:fs/promises';

const html = await readFile( 'docs/theme-uri-page.html', 'utf8' );
const ids = [ ...html.matchAll( /\bid="([^"]+)"/g ) ].map( ( match ) => match[ 1 ] );
const references = [ ...html.matchAll( /href="#([^"]+)"/g ) ].map( ( match ) => match[ 1 ] );
const duplicateIds = ids.filter( ( id, index ) => ids.indexOf( id ) !== index );
const missingReferences = references.filter( ( reference ) => ! ids.includes( reference ) );
const h1Count = ( html.match( /<h1\b/g ) ?? [] ).length;
const sectionOpenCount = ( html.match( /<section\b/g ) ?? [] ).length;
const sectionCloseCount = ( html.match( /<\/section>/g ) ?? [] ).length;

if (
	duplicateIds.length ||
	missingReferences.length ||
	1 !== h1Count ||
	sectionOpenCount !== sectionCloseCount ||
	/<script\b|target="_blank"/i.test( html )
) {
	throw new Error(
		JSON.stringify(
			{
				duplicateIds,
				missingReferences,
				h1Count,
				sectionOpenCount,
				sectionCloseCount,
			},
			null,
			2
		)
	);
}

console.log(
	JSON.stringify(
		{
			characters: html.length,
			sections: sectionOpenCount,
			navigationLinks: references.length,
			uniqueIds: ids.length,
			h1Count,
		},
		null,
		2
	)
);
