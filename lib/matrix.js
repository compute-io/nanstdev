'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' );

// FUNCTIONS //

var contains = require( './contains.js' );

// NANSTDEV //

/**
* FUNCTION: nanstdev( out, mat,[bias , dim] )
*	Computes the standard deviation along a matrix dimension ignoring non-numeric / missing values.
*
* @param {Matrix} out - output matrix
* @param {Matrix} mat - input matrix
* @param {Array} encoding - array whose elements encode missing values
* @param {Boolean} [bias=false] - boolean indicating whether to calculate a biased or unbiased estimate of the standard deviation
* @param {Number} [dim=2] - matrix dimension along which to compute the standard deviation. If `dim=1`, compute along matrix rows. If `dim=2`, compute along matrix columns.
* @returns {Matrix|Null} standard deviation(s) or null
*/
function nanstdev( out, mat, encoding, bias, dim ) {
	var mu, delta, x, M2,
		M, N, Nobs,
		s0, s1,
		o,
		i, j, k;

	if ( dim === 1 ) {
		// Compute along the rows...
		M = mat.shape[ 1 ];
		N = mat.shape[ 0 ];
		s0 = mat.strides[ 1 ];
		s1 = mat.strides[ 0 ];
	} else {
		// Compute along the columns...
		M = mat.shape[ 0 ];
		N = mat.shape[ 1 ];
		s0 = mat.strides[ 0 ];
		s1 = mat.strides[ 1 ];
	}
	if ( M === 0 || N === 0 ) {
		return null;
	}
	o = mat.offset;

	for ( i = 0; i < M; i++ ) {
		k = o + i * s0;
		Nobs = 0;
		mu = 0;
		delta = 0;
		M2 = 0;
		for ( j = 0; j < N; j++ ) {
			x = mat.data[ k + j*s1 ];
			if ( !isNumber( x ) || contains( encoding, x ) ) {
				continue;
			}
			Nobs += 1;
			delta = x - mu;
			mu += delta / (j+1);
			M2 += delta * ( x - mu );
		}
		if ( bias ) {
			out.data[ i ] = Math.sqrt( M2 / ( Nobs ) );
		} else {
			out.data[ i ] = Math.sqrt( M2 / ( Nobs - 1 ) );
		}
	}

	return out;
} // end FUNCTION nanstdev()


// EXPORTS //

module.exports = nanstdev;
