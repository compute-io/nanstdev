/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Module to be tested:
	nanstdev = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-nanstdev', function tests() {

	it( 'should export a function', function test() {
		expect( nanstdev ).to.be.a( 'function' );
	});

	it( 'should throw an error if the first argument is neither array-like or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				nanstdev( value );
			};
		}
	});

	it( 'should throw an error if provided an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				nanstdev( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a dim option which is not a positive integer', function test() {
		var data, values;

		values = [
			'5',
			-5,
			2.2,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		data = matrix( new Int32Array([1,2,3,4]), [2,2] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				nanstdev( data, {
					'dim': value
				});
			};
		}
	});

	it( 'should throw an error if provided a dim option which exceeds the number of matrix dimensions (2)', function test() {
		var data, values;

		values = [
			3,
			4,
			5
		];

		data = matrix( new Int32Array([1,2,3,4]), [2,2] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( RangeError );
		}
		function badValue( value ) {
			return function() {
				nanstdev( data, {
					'dim': value
				});
			};
		}
	});

	it( 'should compute the sample standard deviation ignoring non-numeric values', function test() {
		var data, expected;

		data = [ 2, 4, 5, 3, 8, 2, null, {}, function(){}, true ];
		expected = Math.sqrt(5.2);

		assert.strictEqual( nanstdev( data ), expected );
	});

	it( 'should compute the sample standard deviation ignoring missing values', function test() {
		var data, expected;

		data = [ 2, 999, 4, 5, 3, 8, 2, 999, 981 ];
		expected = Math.sqrt( 5.2 );

		assert.strictEqual( nanstdev( data, {'encoding': [981, 999] } ), expected );
	});

	it( 'should compute the sample standard deviation of a typed array ignoring non-numeric / missing values', function test() {
		var data, expected;

		data = new Int32Array( [ 2, 4, 5, 3, 8, 2, 981, 999 ] );
		expected = Math.sqrt( 5.2 );

		assert.strictEqual( nanstdev( data, {'encoding': [981, 999] }  ), expected );
	});

	it( 'should compute the (biased) sample standard deviation ignoring non-numeric values', function test() {
		var data, expected, actual;

		data = [ 2, 4, 5, 3, 8, 2, null, {}, function(){}, true ];
		expected = Math.sqrt( 5.2 * (6-1) / 6 );

		actual =  nanstdev( data, {
			'bias': true
		});

		assert.strictEqual( actual, expected );
	});

	it( 'should compute the sample standard deviation using an accessor function ignoring non-numeric values', function test() {
		var data, expected, actual;

		data = [
			{'x':2},
			{'x':4},
			{'x':5},
			{'x':3},
			{'x':8},
			{'x':2},
			{'x':true},
			{'x':NaN},
			{'x':{}},
			{'x':function(){}},
			{'x':'string'}
		];
		actual = nanstdev( data, {
			'accessor': getValue
		});
		expected = Math.sqrt( 5.2 );

		assert.strictEqual( actual, expected );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should return `null` when provided an empty array', function test() {
		assert.isNull( nanstdev( [] ) );
	});

	it( 'should calculate the column standard deviations of a matrix', function test() {
		var data, expected, s;

		data = matrix( new Int32Array( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ), [3,3] );
		expected = matrix( new Float64Array( [ 1, 1, 1 ] ), [3,1] );

		s = nanstdev( data, {
			'dim': 2
		});

		assert.deepEqual( s.data, expected.data );
	});

	it( 'should calculate the row standard deviations of a matrix', function test() {
		var data, expected, s;

		data = matrix( new Int32Array( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ), [3,3] );
		expected = matrix( new Float64Array( [ 3, 3, 3 ] ), [1, 3] );

		s = nanstdev( data, {
			'dim': 1
		});

		assert.deepEqual( s.data, expected.data );
	});

	it( 'should calculate the standard deviations of a matrix and output a matrix having a specified data type', function test() {
		var data, expected, s;

		data = matrix( new Int32Array( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ), [3,3] );
		expected = matrix( new Int32Array( [ 1, 1, 1 ] ), [3,1] );

		s = nanstdev( data, {
			'dtype': 'int32'
		});

		assert.strictEqual( s.dtype, 'int32' );
		assert.deepEqual( s.data, expected.data );
	});

	it( 'should compute the standard deviation for a vector (matrix with one column or row)', function test() {
		var data, expected;

		expected = Math.sqrt( 5.2 );
		data = matrix( new Int32Array( [ 2, 4, 5, 3, 8, 2 ] ), [6,1] );

		assert.strictEqual( nanstdev( data ), expected );
	});

});
