/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	nanstdev = require( './../lib/accessor.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'accessor standard deviation', function tests() {

	it( 'should export a function', function test() {
		expect( nanstdev ).to.be.a( 'function' );
	});

	it( 'should compute the standard deviation using an accessor', function test() {
		var data, expected;

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
			// encode missing values as 999
			{'x':999},
			{'x':999}
		];

		expected = 2.280350850198276;

		assert.strictEqual( nanstdev( data, [ 999 ], getValue ), expected );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should compute the (biased) standard deviation using an accessor', function test() {
		var data, expected;

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
			// encode missing values as 999
			{'x':999},
			{'x':999}
		];

		expected = 2.0816659994661326;

		assert.strictEqual( nanstdev( data, [ 999 ], getValue, true ), expected );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should return 0 for a single element array', function test() {
		var data, expected;

		data = [ {'x':2} ];
		expected = 0;

		assert.strictEqual( nanstdev( data, [], getValue ), expected );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should return null if provided an empty array', function test() {
		assert.isNull( nanstdev( [], [], getValue ) );

		function getValue( d ) {
			return d.x;
		}
	});

});
