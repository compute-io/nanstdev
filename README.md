nanstdev
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the sample standard deviation ignoring any values which are not numeric or encoded as missing values.

The biased [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) is defined as

<div class="equation" align="center" data-raw-text="s = \sqrt{\frac{1}{N} \sum_{i=0}^{N-1} \left(x_i - \overline{x} \right)^2}" data-equation="eq:biased_stdev">
	<img src="" alt="Equation for the biased sample standard deviation.">
	<br>
</div>

and the unbiased [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) is defined as

<div class="equation" align="center" data-raw-text="s =\sqrt{\frac{1}{N-1} \sum_{i=0}^{N-1} \left(x_i - \overline{x} \right)^2}" data-equation="eq:stdev">
	<img src="" alt="Equation for the sample standard deviation.">
	<br>
</div>

where `x_0, x_1,...,x_{N-1}` are individual data values and `N` is the total number of values in the data set. It is the square root of the [sample variance](http://en.wikipedia.org/wiki/Variance).



## Installation

``` bash
$ npm install compute-nanstdev
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage


``` javascript
var nanstdev = require( 'compute-nanstdev' );
```

#### nanstdev( x[, opts] )

Computes the sample standard deviation ignoring non-numeric values and values encoded as missing. `x` may be either an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or [`matrix`](https://github.com/dstructs/matrix).

For numeric `arrays`,

``` javascript
var data = [ 1, 4, NaN, 7, NaN ];

var s = nanstdev( data );
// returns 3

data = new Float64Array( data );
s = nanstdev( data );
// returns 3
```

If the array or matrix contains missing values encoded by numbers, use the `encoding` option to ensure they do not affect the calculation:

* __encoding__: `array` holding all values which will be regarded as missing values. Default: `[]`.

``` javascript
var data, mu;

data = [ 1, 981, 4, 999, 7 ];
s = nanstdev( data, {
	'encoding': [ 981, 999 ]
});
// returns 3

data = new Int32Array( data );
s = nanstdev( data, {
	'encoding': [ 981, 999 ]
});
// returns 3
```

For object `arrays`, provide an accessor `function` for accessing numeric `array` values

``` javascript
var data = [
    {'x':1},
    {'x':4},
    {'x':NaN},
    {'x':7},
    {'x':NaN}
];

function getValue( d ) {
    return d.x;
}

var s = nanstdev( data, {
	'accessor': getValue
});
// returns 2
```

By default, the function calculates the *unbiased* sample [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation). To calculate the population standard deviation (or a *biased* sample standard deviation), set the `bias` option to `true`.

``` javascript
var data = [ 1, 4, NaN, 7, NaN ];

var value = nanstdev( data, {
	'bias': true
});
// returns 1.3333
```

If provided a [`matrix`](https://github.com/dstructs/matrix), the function accepts the following two additional `options`:

*	__dim__: dimension along which to compute the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation). Default: `2` (along the columns).
*	__dtype__: output [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.

By default, the function computes the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) along the columns (`dim=2`).

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	s,
	i;

data = new Int8Array( 25 );
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = i;
}
mat = matrix( data, [5,5], 'int8' );
/*
	[  0  1  2  3  4
	   5  6  7  8  9
	  10 11 12 13 14
	  15 16 17 18 19
	  20 21 22 23 24 ]
*/

s = nanstdev( mat );
/*
	[  1.581139
	   1.581139
	   1.581139
	   1.581139
	   1.581139 ]
*/
```

To compute the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) along the rows, set the `dim` option to `1`.

``` javascript
s = nanstdev( mat, {
	'dim': 1
});
/*
	[ 7.905694, 7.905694, 7.905694, 7.905694, 7.905694 ]
*/
```

By default, the output [`matrix`](https://github.com/dstructs/matrix) data type is `float64`. To specify a different output data type, set the `dtype` option.

``` javascript
s = nanstdev( mat, {
	'dim': 1,
	'dtype': 'uint8'
});
/*
	[ 7, 7, 7, 7, 7 ]
*/

var dtype = s.dtype;
// returns 'uint8'
```

If provided a [`matrix`](https://github.com/dstructs/matrix) having either dimension equal to `1`, the function treats the [`matrix`](https://github.com/dstructs/matrix) as a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) and returns a `numeric` value.

``` javascript
data = [ 1, 4, 7 ];

// Row vector:
mat = matrix( new Int8Array( data ), [1,3], 'int8' );
s = nanstdev( mat );
// returns 2

// Column vector:
mat = matrix( new Int8Array( data ), [3,1], 'int8' );
s = nanstdev( mat );
// returns 2
```

If provided an empty [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or [`matrix`](https://github.com/dstructs/matrix), the function returns `null`.

``` javascript
s = nanstdev( [] );
// returns null

s = nanstdev( new Int8Array( [] ) );
// returns null

s = nanstdev( matrix( [0,0] ) );
// returns null

s = nanstdev( matrix( [0,10] ) );
// returns null

s = nanstdev( matrix( [10,0] ) );
// returns null
```



## Examples

``` javascript
var nanstdev = require( 'compute-nanstdev' );

var data = new Array( 1000 );

for ( var i = 0; i < data.length; i++ ) {
	if ( i%5 === 0 ) {
		data[ i ] = NaN;
	} else {
		data[ i ] = Math.random() * 100;
	}
}

console.log( nanstdev( data ) );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

The sample standard deviation of an array containing non-numeric values is equal to the sample standard deviation of an equivalent array which contains only the numeric values. Hence,

``` javascript
var d1 = [ 1, NaN, 2, 3, NaN ],
    d2 = [ 1, 2, 3 ];

console.log( nanstdev( d1 ) === nanstdev( d2 ) );
// returns true
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2014-2015. The [Compute.io](https://github.com/compute-io) Authors.

[npm-image]: http://img.shields.io/npm/v/compute-nanstdev.svg
[npm-url]: https://npmjs.org/package/compute-nanstdev

[travis-image]: http://img.shields.io/travis/compute-io/nanstdev/master.svg
[travis-url]: https://travis-ci.org/compute-io/nanstdev

[coveralls-image]: https://img.shields.io/coveralls/compute-io/nanstdev/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/nanstdev?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/nanstdev.svg
[dependencies-url]: https://david-dm.org/compute-io/nanstdev

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/nanstdev.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/nanstdev

[github-issues-image]: http://img.shields.io/github/issues/compute-io/nanstdev.svg
[github-issues-url]: https://github.com/compute-io/nanstdev/issues
