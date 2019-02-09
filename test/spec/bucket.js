'use strict';

var Bucket = require('../../lib/bucket.js');

describe('The Bucket', function () {

    var bucket;
    beforeEach(function () {
        bucket = new Bucket();
    });

    it('should cache a value', function () {

        bucket.set('test', 1);
        expect(bucket.has('test')).to.eql(true);
        expect(bucket.get('test')).to.eql(1);

    });

    it('should throw an error if trying to get value for a key that is not set', function () {

        expect(bucket.has('not set')).to.eql(false);

        expect(function () {
            bucket.get('not set');
        }).to.throw();

    });

    it('should allow removing an entry', function () {

        bucket.set('test', 1);
        expect(bucket.has('test')).to.eql(true);
        expect(bucket.get('test')).to.eql(1);
        bucket.remove('test');
        expect(function () {
            bucket.get('not set');
        }).to.throw();

    });

    it('should allow reserved object properties as keys', function () {

        bucket.set('__proto__', 1);
        expect(bucket.has('__proto__')).to.eql(true);
        expect(bucket.get('__proto__')).to.eql(1);

    });

    describe('should handle all key types converted to a string', function () {

        it('undefined', function () {

            bucket.set(undefined, 1);
            expect(bucket.has(undefined)).to.eql(true);
            expect(bucket.has(String(undefined))).to.eql(true);
            bucket.set(String(undefined), 2);
            expect(bucket.get(undefined)).to.eql(2);
            expect(bucket.get(String(undefined))).to.eql(2);

        });

        it('null', function () {

            bucket.set(null, 1);
            expect(bucket.has(null)).to.eql(true);
            expect(bucket.has(String(null))).to.eql(true);
            bucket.set(String(null), 2);
            expect(bucket.get(null)).to.eql(2);
            expect(bucket.get(String(null))).to.eql(2);

        });

        it('false', function () {

            bucket.set(false, 1);
            expect(bucket.has(false)).to.eql(true);
            expect(bucket.has(String(false))).to.eql(true);
            bucket.set(String(false), 2);
            expect(bucket.get(false)).to.eql(2);
            expect(bucket.get(String(false))).to.eql(2);

        });

        it('zero', function () {

            bucket.set(0, 1);
            expect(bucket.has(0)).to.eql(true);
            expect(bucket.has(String(0))).to.eql(true);
            bucket.set(String(0), 2);
            expect(bucket.get(0)).to.eql(2);
            expect(bucket.get(String(0))).to.eql(2);

        });

        it('0.5', function () {

            bucket.set(0.5, 1);
            expect(bucket.has(0.5)).to.eql(true);
            expect(bucket.has(String(0.5))).to.eql(true);
            bucket.set(String(0.5), 2);
            expect(bucket.get(0.5)).to.eql(2);
            expect(bucket.get(String(0.5))).to.eql(2);

        });

        it('123e-5', function () {

            bucket.set(123e-5, 1);
            expect(bucket.has(123e-5)).to.eql(true);
            expect(bucket.has(String(123e-5))).to.eql(true);
            bucket.set(String(123e-5), 2);
            expect(bucket.get(123e-5)).to.eql(2);
            expect(bucket.get(String(123e-5))).to.eql(2);

        });

        it('NaN', function () {

            bucket.set(NaN, 1);
            expect(bucket.has(NaN)).to.eql(true);
            expect(bucket.has(String(NaN))).to.eql(true);
            bucket.set(String(NaN), 2);
            expect(bucket.get(NaN)).to.eql(2);
            expect(bucket.get(String(NaN))).to.eql(2);

        });

        it('Infinity', function () {

            bucket.set(Infinity, 1);
            expect(bucket.has(Infinity)).to.eql(true);
            expect(bucket.has(String(Infinity))).to.eql(true);
            bucket.set(String(Infinity), 2);
            expect(bucket.get(Infinity)).to.eql(2);
            expect(bucket.get(String(Infinity))).to.eql(2);

        });

        it('date', function () {

            var date = new Date();

            bucket.set(date, 1);
            expect(bucket.has(date)).to.eql(true);
            expect(bucket.has(String(date))).to.eql(true);
            bucket.set(String(date), 2);
            expect(bucket.get(date)).to.eql(2);
            expect(bucket.get(String(date))).to.eql(2);

        });

        it('array', function () {

            var array = [1,2,3];

            bucket.set(array, 1);
            expect(bucket.has(array)).to.eql(true);
            expect(bucket.has(String(array))).to.eql(true);
            bucket.set(String(array), 2);
            expect(bucket.get(array)).to.eql(2);
            expect(bucket.get(String(array))).to.eql(2);

        });

        it('object', function () {

            var object = { id: 1, name: 'test' };

            bucket.set(object, 1);
            expect(bucket.has(object)).to.eql(true);
            expect(bucket.has(String(object))).to.eql(true);
            bucket.set(String(object), 2);
            expect(bucket.get(object)).to.eql(2);
            expect(bucket.get(String(object))).to.eql(2);

        });

        it('string', function () {

            bucket.set('test', 1);
            expect(bucket.has('test')).to.eql(true);
            expect(bucket.has(String('test'))).to.eql(true);
            bucket.set(String('test'), 2);
            expect(bucket.get('test')).to.eql(2);
            expect(bucket.get(String('test'))).to.eql(2);

        });

    });

    describe('should handle all value types', function () {

        it('undefined', function () {

            bucket.set('test', undefined);
            expect(bucket.get('test')).to.eql(undefined);

        });

        it('null', function () {

            bucket.set('test', null);
            expect(bucket.get('test')).to.eql(null);

        });

        it('false', function () {

            bucket.set('test', false);
            expect(bucket.get('test')).to.eql(false);

        });

        it('zero', function () {

            bucket.set('test', 0);
            expect(bucket.get('test')).to.eql(0);

        });

        it('0.5', function () {

            bucket.set('test', 0.5);
            expect(bucket.get('test')).to.eql(0.5);

        });

        it('123e-5', function () {

            bucket.set('test', 123e-5);
            expect(bucket.get('test')).to.eql(123e-5);

        });

        it('NaN', function () {

            bucket.set('test', NaN);
            expect(bucket.get('test')).to.eql(NaN);

        });

        it('Infinity', function () {

            bucket.set('test', Infinity);
            expect(bucket.get('test')).to.eql(Infinity);

        });

        it('date', function () {

            var date = new Date();

            bucket.set('test', date);
            expect(bucket.get('test')).to.eql(date);

        });

        it('array', function () {

            var array = [1,2,3];

            bucket.set('test', array);
            expect(bucket.get('test')).to.eql(array);

        });

        it('object', function () {

            var object = { id: 1, name: 'test' };

            bucket.set('test', object);
            expect(bucket.get('test')).to.eql(object);

        });

        it('string', function () {

            bucket.set('test', 'test');
            expect(bucket.get('test')).to.eql('test');

        });

    });

    describe('should handle all key types when removing an entry', function () {

        it('undefined', function () {

            bucket.set(undefined, 1);
            expect(bucket.get(undefined)).to.eql(1);
            bucket.remove(undefined);
            expect(function () {
                bucket.get(undefined);
            }).to.throw();

        });

        it('null', function () {

            bucket.set(null, 1);
            expect(bucket.get(null)).to.eql(1);
            bucket.remove(null);
            expect(function () {
                bucket.get(null);
            }).to.throw();

        });

        it('false', function () {

            bucket.set(false, 1);
            expect(bucket.get(false)).to.eql(1);
            bucket.remove(false);
            expect(function () {
                bucket.get(false);
            }).to.throw();

        });

        it('zero', function () {

            bucket.set(0, 1);
            expect(bucket.get(0)).to.eql(1);
            bucket.remove(0);
            expect(function () {
                bucket.get(0);
            }).to.throw();

        });

        it('0.5', function () {

            bucket.set(0.5, 1);
            expect(bucket.get(0.5)).to.eql(1);
            bucket.remove(0.5);
            expect(function () {
                bucket.get(0.5);
            }).to.throw();

        });

        it('123e-5', function () {

            bucket.set(123e-5, 1);
            expect(bucket.get(123e-5)).to.eql(1);
            bucket.remove(123e-5);
            expect(function () {
                bucket.get(123e-5);
            }).to.throw();

        });

        it('NaN', function () {

            bucket.set(NaN, 1);
            expect(bucket.get(NaN)).to.eql(1);
            bucket.remove(NaN);
            expect(function () {
                bucket.get(NaN);
            }).to.throw();

        });

        it('Infinity', function () {

            bucket.set(Infinity, 1);
            expect(bucket.get(Infinity)).to.eql(1);
            bucket.remove(Infinity);
            expect(function () {
                bucket.get(Infinity);
            }).to.throw();

        });

        it('date', function () {

            var date = new Date();

            bucket.set(date, 1);
            expect(bucket.get(date)).to.eql(1);
            bucket.remove(date);
            expect(function () {
                bucket.get(date);
            }).to.throw();

        });

        it('array', function () {

            var array = [1,2,3];

            bucket.set(array, 1);
            expect(bucket.get(array)).to.eql(1);
            bucket.remove(array);
            expect(function () {
                bucket.get(array);
            }).to.throw();

        });

        it('object', function () {

            var object = { id: 1, name: 'test' };

            bucket.set(object, 1);
            expect(bucket.get(object)).to.eql(1);
            bucket.remove(object);
            expect(function () {
                bucket.get(object);
            }).to.throw();

        });

        it('string', function () {

            bucket.set('test', 1);
            expect(bucket.get('test')).to.eql(1);
            bucket.remove('test');
            expect(function () {
                bucket.get('test');
            }).to.throw();

        });

    });

    describe('should convert to array', function () {

        it('when empty', function () {

            expect(bucket.toArray()).to.eql([]);

            bucket.set('x', 'y');
            bucket.remove('x');

            expect(bucket.toArray()).to.eql([]);

        });

        it('when filled', function () {

            bucket.set('a', 'b');
            bucket.set('c', 'd');
            bucket.set('e', 'f');
            bucket.remove('c');

            expect(bucket.toArray()).to.eql([
                ['a', 'b'],
                ['e', 'f']
            ]);

        });

        it('with caching', function () {

            bucket.set('a', 'b');
            bucket.set('c', 'd');
            bucket.set('e', 'f');

            var arr1 = bucket.toArray();
            var arr2 = bucket.toArray();

            expect(arr1).to.eql(arr2);

            bucket.set('a', 'b');
            bucket.set('g', 'h');

            var arr3 = bucket.toArray();

            expect(arr3).to.not.eql(arr2);

            bucket.has('a');
            bucket.has('z');

            var arr4 = bucket.toArray();

            expect(arr4).to.eql(arr3);

            bucket.get('a');
            expect(function () {
                bucket.get('z');
            }).to.throw();

            var arr5 = bucket.toArray();

            expect(arr5).to.eql(arr4);

            bucket.remove('c');
            bucket.remove('z');

            var arr6 = bucket.toArray();

            expect(arr6).to.not.eql(arr5);

        });

    });

});
