'use strict';

var TwoBucketsMemcache = require('../../lib/index.js');

describe('The TwoBucketsMemcache', function () {

    var cache;
    beforeEach(function () {
        cache = new TwoBucketsMemcache(10);
    });

    afterEach(function () {
        cache.destroy();
    });

    it('should cache an entry', function () {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

    });

    it('should throw an error if trying to get an entry for a key that is not set', function () {

        expect(function () {
            cache.get('not set');
        }).to.throw();

    });

    it('should remove a expired entry', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            // In the retired bucket by now...
            expect(cache.get('test')).to.eql(1);
        }, 15);

        setTimeout(function () {
            expect(function () {
                cache.get('test');
            }).to.throw();
            done();
        }, 25);

    });

    it('should allow removing an entry', function () {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        cache.remove('test');
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry in the retired bucket', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {

            cache.remove('test');
            expect(function () {
                cache.get('test');
            }).to.throw();

            done();

        }, 15);

    });

    it('should be robust against multiple destroy calls', function () {

        cache.destroy();
        cache.destroy();

    });

    it('should not return an entry after destroy anymore', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            // In the retired bucket by now...
            expect(cache.get('test')).to.eql(1);

            cache.set('test2', 2);
            expect(cache.get('test2')).to.eql(2);

            cache.destroy();

            expect(function () {
                cache.get('test');
            }).to.throw();

            expect(function () {
                cache.get('test2');
            }).to.throw();

            done();

        }, 15);

    });

});
