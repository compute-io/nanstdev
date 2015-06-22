'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' );

// FUNCTIONS //

var contains = require( './contains.js' );

// NANSTDEV //

/**
* FUNCTION: nanstdev( arr, encoding, clbk[, bias] )
*	Computes the standard deviation of an array using an accessor ignoring non-numeric / missing values..
*
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} arr - input array
* @param {Array} encoding - array whose elements encode missing values
* @param {Function} accessor - accessor function for accessing array values
* @param {Boolean} [bias=false] - boolean indicating whether to calculate a biased or unbiased estimate of the standard deviation
* @returns {Number|Null} standard deviation or null
*/
function nanstdev( arr, encoding, clbk, bias ) {
	var len = arr.length,
		N = 0,
		delta = 0,
		mean = 0,
		M2 = 0,
		x, i;

	if ( !len ) {
		return null;
	}
	for ( i = 0; i < len; i++ ) {
		x = clbk( arr[ i ], i );
		if ( !isNumber( x ) || contains( encoding, x ) ) {
			continue;
		}
		N += 1;
		delta = x - mean;
		mean += delta / N;
		M2 += delta * ( x - mean );
	}
	if ( N < 2 ) {
		return 0;
	}
	if ( bias ) {
		return Math.sqrt( M2 / N );
	}
	return Math.sqrt( M2 / ( N - 1 ) );
} // end FUNCTION nanstdev()


// EXPORTS //

module.exports = nanstdev;
