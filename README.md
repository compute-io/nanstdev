nanstdev
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the sample standard deviation over an array of values ignoring any values which are not numeric.


## Installation

``` bash
$ npm install compute-nanstdev
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var nanstdev = require( 'compute-nanstdev' );
```

#### nanstdev( arr )

Computes the sample standard deviation ignoring non-numeric values.

``` javascript
var data = [ 10, 2, 100, NaN, 34, NaN, 0 ];

var sigma = nanstdev( data );
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

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


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