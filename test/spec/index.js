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

    it('should cache an entry that has never been set before', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            // In the retired bucket by now...
            expect(cache.get('test')).to.eql(1);
            done();
        }, 15);

    });

    it('should cache an entry that has been set right before', function () {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        cache.set('test', 2);
        expect(cache.get('test')).to.eql(2);

    });

    it('should cache an entry that has been set in expired bucket', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            cache.set('test', 2);
            expect(cache.get('test')).to.eql(2);
            done();
        }, 15);

    });

    it('should cache an entry that has been set before and already expired', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            cache.set('test', 2);
            expect(cache.get('test')).to.eql(2);
            done();
        }, 25);

    });

    it('should throw an error if trying to get an entry for a key that is not set', function () {

        expect(function () {
            cache.get('not set');
        }).to.throw();

    });

    it('should remove an expired entry', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            expect(function () {
                cache.get('test');
            }).to.throw();
            done();
        }, 25);

    });

    it('should allow removing an entry that has never been set before', function () {

        cache.remove('test');
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set right before', function () {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        cache.remove('test');
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set in expired bucket', function (done) {

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

    it('should allow removing an entry that has been set before and already expired', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            cache.remove('test');
            expect(function () {
                cache.get('test');
            }).to.throw();
            done();
        }, 25);

    });

    it('should allow removing an entry even if it was removed before', function () {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        cache.remove('test');
        expect(function () {
            cache.get('test');
        }).to.throw();

        cache.remove('test');

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

    it('should allow .remove(...) after being destroyed', function () {

        cache.destroy();

        cache.remove('test');

    });

    it('should be robust against multiple destroy calls', function (done) {

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);

        setTimeout(function () {
            // In the retired bucket by now...
            expect(cache.get('test')).to.eql(1);

            cache.set('test2', 2);
            expect(cache.get('test2')).to.eql(2);

            cache.destroy();
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
