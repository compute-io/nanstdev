
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	nanstdev = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-nanstdev', function tests() {
	'use strict';

	it( 'should export a function', function test() {
		expect( nanstdev ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a non-array', function test() {
		var values = [
				'5',
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

	it( 'should compute the sample standard deviation', function test() {
		var data, expected;

		data = [ 2, 4, NaN, 5, 3, true, null, undefined, 8, [], {}, function(){}, 2 ];
		expected = Math.sqrt( 5.2 );

		assert.strictEqual( nanstdev( data ), expected );
	});

	it( 'should return 0 for an array containing a single numeric element', function test() {
		var data, expected;

		data = [ 2, NaN, null, false ];
		expected = 0;

		assert.strictEqual( nanstdev( data ), expected );
	});

});