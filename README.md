# Two Buckets Memcache

Memcache that trades a simplified expiry strategy for a super low resource consumption

[![Build Status](https://travis-ci.org/analog-nico/two-buckets-memcache.svg?branch=master)](https://travis-ci.org/analog-nico/two-buckets-memcache) [![Coverage Status](https://coveralls.io/repos/request/two-buckets-memcache/badge.svg?branch=master&service=github)](https://coveralls.io/github/request/two-buckets-memcache?branch=master) [![Dependency Status](https://david-dm.org/analog-nico/two-buckets-memcache.svg)](https://david-dm.org/analog-nico/two-buckets-memcache)

## Installation

[![NPM Stats](https://nodei.co/npm/two-buckets-memcache.png?downloads=true)](https://npmjs.org/package/two-buckets-memcache)

This is a module for node.js and is installed via npm:

``` bash
npm install two-buckets-memcache --save
```

## What is special about this memory cache?

Description forthcoming.

This design allows a super low resource consumption:

- Just a single timer is used and not a timer for each cache entry like many other memcaches do.
- The asymptotic runtime for `.get(...)` and `.set(...)` are still O(1) like you would expect.

## Contributing

To set up your development environment for Quota:

1. Clone this repo to your desktop,
2. in the shell `cd` to the main folder,
3. hit `npm install`,
4. hit `npm install gulp -g` if you haven't installed gulp globally yet, and
5. run `gulp dev`. (Or run `node ./node_modules/.bin/gulp dev` if you don't want to install gulp globally.)

`gulp dev` watches all source files and if you save some changes it will lint the code and execute all tests. The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

If you want to debug a test you should use `gulp test-without-coverage` to run all tests without obscuring the code by the test coverage instrumentation.

## Change History

- v0.1.0 (upcoming)
    - Initial version

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.
