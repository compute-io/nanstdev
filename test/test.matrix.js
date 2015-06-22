/* global describe, it, require, beforeEach */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Module to be tested:
	nanstdev = require( './../lib/matrix.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'matrix nanstdev', function tests() {

	var data,
		mat,
		i;

	data = new Int32Array( 30 );
	for ( i = 0; i < data.length; i++ ) {
		if ( i < 25 ) {
			data[ i ] = i + 1;
		} else {
			data[ i ] = 999;
		}
	}

	beforeEach( function before() {
		mat = matrix( data, [6,5], 'int32' );
	});

	it( 'should export a function', function test() {
		expect( nanstdev ).to.be.a( 'function' );
	});

	it( 'should compute the standard deviation along matrix columns ignoring missing values', function test() {
		var out, p, expected;

		out = matrix( [6,1], 'float64' );

		p = nanstdev( out, mat, [ 999 ] );
		expected = '1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898;0';

		assert.strictEqual( p.toString(), expected );

		p = nanstdev( out, mat, [ 999 ], false, 2 );
		expected = '1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898;0';

		assert.strictEqual( p.toString(), expected );

		// Flip matrix up-down:
		mat.strides[ 0 ] *= -1;
		mat.offset = mat.length + mat.strides[ 0 ];

		p = nanstdev( out, mat, [ 999 ] );
		expected = '0;1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898;1.5811388300841898';

		assert.strictEqual( p.toString(), expected, 'flipud' );
	});

	it( 'should compute the standard deviation along matrix rows ignoring missing values', function test() {
		var out, p, expected;

		out = matrix( [1,5], 'float64' );

		p = nanstdev( out, mat, [ 999 ], false, 1 );
		expected = '7.905694150420948,7.905694150420948,7.905694150420948,7.905694150420948,7.905694150420948';

		assert.strictEqual( p.toString(), expected );

		// Flip matrix left-right:
		mat.strides[ 1 ] *= -1;
		mat.offset = mat.strides[ 0 ] - 1;

		p = nanstdev( out, mat, [ 999 ], false, 1 );
		expected = '7.905694150420948,7.905694150420948,7.905694150420948,7.905694150420948,7.905694150420948';

		assert.strictEqual( p.toString(), expected, 'fliplr' );
	});

	it( 'should compute the population (biased sample) standard deviation ignoring missing values', function test() {
		var out, p, expected;

		out = matrix( [1,6], 'float64' );

		p = nanstdev( out, mat, [ 999 ], true, 1 );
		expected = '7.0710678118654755,7.0710678118654755,7.0710678118654755,7.0710678118654755,7.0710678118654755,0';

		assert.strictEqual( p.toString(), expected );
	});

	it( 'should return null if provided a matrix having one or more zero dimensions', function test() {
		var out, mat;

		out = matrix( [0,0] );

		mat = matrix( [0,10] );
		assert.isNull( nanstdev( out, mat, [] ) );

		mat = matrix( [10,0] );
		assert.isNull( nanstdev( out, mat, [] ) );

		mat = matrix( [0,0] );
		assert.isNull( nanstdev( out, mat, [] ) );
	});

});
