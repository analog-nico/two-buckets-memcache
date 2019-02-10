'use strict';

var _ = require('lodash');
var sinon = require('sinon');

var TwoBucketsMemcache = require('../../lib/index.js');


describe('The TwoBucketsMemcache', function () {

    var cache, clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        cache = new TwoBucketsMemcache(10);
    });

    afterEach(function () {
        cache.destroy();
        clock.restore();
    });

    it('should cache an entry that has never been set before', function () {

        expect(cache.has('test')).to.eql(false);
        expect(cache.has('test2')).to.eql(false);

        cache.set('test', 1);
        expect(cache.get('test')).to.eql(1);
        cache.set('test2', 2);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(15);

        // In the retired bucket by now...
        expect(cache.has('test')).to.eql(true);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test')).to.eql(1);
        expect(cache.get('test2')).to.eql(2);

    });

    it('should cache an entry that has been set right before', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        cache.set('test', 2);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(2);

    });

    it('should cache an entry that has been set in expired bucket', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);
        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(15);

        cache.set('test', 3);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(3);
        cache.set('test2', 4);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(4);

    });

    it('should cache an entry that has been set before and already expired', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);
        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(25);
        expect(cache.has('test')).to.eql(false);
        expect(cache.has('test2')).to.eql(false);

        cache.set('test', 3);
        expect(cache.get('test')).to.eql(3);
        cache.set('test2', 4);
        expect(cache.get('test2')).to.eql(4);

    });

    it('should throw an error if trying to get an entry for a key that is not set', function () {

        expect(cache.has('not set')).to.eql(false);

        expect(function () {
            cache.get('not set');
        }).to.throw();

    });

    it('should get an entry from the retired bucket which is not found in the active bucket', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        // Makes sure the active bucket exists
        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        // In the retired bucket by now...
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

    });

    it('should remove an expired entry (without new active bucket)', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(1);

        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(7);

        cache.set('test3', 3);
        expect(cache.has('test3')).to.eql(true);
        expect(cache.get('test3')).to.eql(3);

        clock.tick(17);

        expect(cache.has('test')).to.eql(false);
        expect(cache.has('test2')).to.eql(false);
        expect(cache.has('test3')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();
        expect(function () {
            cache.get('test2');
        }).to.throw();
        expect(function () {
            cache.get('test3');
        }).to.throw();

    });

    it('should remove an expired entry (with new active bucket)', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(1);

        cache.set('test3', 3);
        expect(cache.has('test3')).to.eql(true);
        expect(cache.get('test3')).to.eql(3);

        clock.tick(9);

        expect(cache.has('test')).to.eql(false);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.has('test3')).to.eql(true);
        expect(function () {
            cache.get('test');
        }).to.throw();
        expect(cache.get('test2')).to.eql(2);
        expect(cache.get('test3')).to.eql(3);

    });

    it('should remove an expired entry (with new active and retired bucket)', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        clock.tick(1);

        cache.set('test3', 3);
        expect(cache.has('test3')).to.eql(true);
        expect(cache.get('test3')).to.eql(3);

        clock.tick(9);

        cache.set('test4', 4);
        expect(cache.has('test4')).to.eql(true);
        expect(cache.get('test4')).to.eql(4);

        clock.tick(1);

        cache.set('test5', 5);
        expect(cache.has('test5')).to.eql(true);
        expect(cache.get('test5')).to.eql(5);

        clock.tick(1);

        expect(cache.has('test')).to.eql(false);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.has('test3')).to.eql(true);
        expect(cache.has('test4')).to.eql(true);
        expect(cache.has('test5')).to.eql(true);
        expect(function () {
            cache.get('test');
        }).to.throw();
        expect(cache.get('test2')).to.eql(2);
        expect(cache.get('test3')).to.eql(3);
        expect(cache.get('test4')).to.eql(4);
        expect(cache.get('test5')).to.eql(5);

    });

    it('should allow removing an entry that has never been set before', function () {

        cache.remove('test');
        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set right before', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        cache.remove('test');
        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set in expired bucket', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        cache.remove('test');
        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set in expired and active bucket', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        cache.set('test', 2);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(2);

        cache.remove('test');

        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry that has been set before and already expired', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(25);

        cache.remove('test');
        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

    });

    it('should allow removing an entry even if it was removed before', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        cache.remove('test');
        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

        cache.remove('test');

    });

    it('should not return an entry after destroy anymore', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        // In the retired bucket by now...
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        cache.destroy();

        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

        expect(cache.has('test2')).to.eql(false);
        expect(function () {
            cache.get('test2');
        }).to.throw();

    });

    it('should throw an error for .set(...) after being destroyed', function () {

        cache.destroy();

        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.set('test', 1);
        }).to.throw();

    });

    it('should allow .remove(...) after being destroyed', function () {

        cache.destroy();

        cache.remove('test');

    });

    it('should be robust against multiple destroy calls', function () {

        cache.set('test', 1);
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        clock.tick(15);

        // In the retired bucket by now...
        expect(cache.has('test')).to.eql(true);
        expect(cache.get('test')).to.eql(1);

        cache.set('test2', 2);
        expect(cache.has('test2')).to.eql(true);
        expect(cache.get('test2')).to.eql(2);

        cache.destroy();
        cache.destroy();

        expect(cache.has('test')).to.eql(false);
        expect(function () {
            cache.get('test');
        }).to.throw();

        expect(cache.has('test2')).to.eql(false);
        expect(function () {
            cache.get('test2');
        }).to.throw();

    });

    it('should be able to fight the monkey', function (done) {

        this.timeout(20000);

        var spansOrig = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,25];
        var repetitions = 50;

        var pending = (spansOrig.length + 1) * repetitions;
        function finishOne() {
            pending -= 1;
            if (pending === 0) {
                done();
            }
        }

        _.times(repetitions, function () {

            var spans = _.shuffle(_.clone(spansOrig));
            spans.splice(0,0,0);
            for ( var i = 1; i < spans.length; i+=1 ) {
                spans[i] += spans[i-1];
            }

            _.forEach(spans, function (span) {
                setTimeout(function () {

                    var entryName = 'test' + span;

                    cache.set(entryName, span);

                    setTimeout(function () {
                        expect(cache.has(entryName)).to.eql(true);
                        expect(cache.get(entryName)).to.eql(span);
                    }, 9);

                    setTimeout(function () {
                        try {
                            expect(cache.has(entryName)).to.eql(false);
                            expect(function () {
                                cache.get(entryName);
                            }).to.throw();
                        } catch (e) {
                            console.dir(spans);
                            console.log('Error for span: ' + span);
                            throw e;
                        }
                        finishOne();
                    }, 21);

                }, span);
            });

        });

        while (pending > 0) {
            clock.tick(1);
        }

    });

    describe('should allow changing the expiry', function () {

        it('by speeding down', function () {

            cache.set('test', 1);

            clock.tick(19);
            expect(cache.has('test')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test')).to.eql(false);

            cache.set('test2', 2);

            clock.tick(5);

            cache.changeExpireAfter(15); // -> fires on 10 and 25

            clock.tick(19);
            expect(cache.has('test2')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test2')).to.eql(false);

        });

        it('by keeping the same speed', function () {

            cache.set('test', 1);

            clock.tick(19);
            expect(cache.has('test')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test')).to.eql(false);

            cache.set('test2', 2);

            clock.tick(5);

            cache.changeExpireAfter(10); // -> fires on 10 and 20

            clock.tick(14);
            expect(cache.has('test2')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test2')).to.eql(false);

        });

        it('by speeding up without a timer running', function () {

            cache.changeExpireAfter(7);

            cache.set('test', 1);

            clock.tick(7+6);
            expect(cache.has('test')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test')).to.eql(false);

        });

        it('by speeding up with a timer running', function () {

            cache.set('test', 1);

            clock.tick(5);

            cache.changeExpireAfter(7);

            clock.tick(2+6);
            expect(cache.has('test')).to.eql(true);
            clock.tick(1);
            expect(cache.has('test')).to.eql(false);

        });

        it('unless the cache is destroyed', function () {

            cache.destroy();

            expect(function () {
                cache.changeExpireAfter(7);
            }).to.throw();

        });

    });

    describe('should notify about purged bucket', function () {

        it('with single listener', function () {

            var countNotifications = 0;

            cache.listenPurge(function () {
                countNotifications += 1;
            });

            clock.tick(10);

            cache.set('test', 1);

            clock.tick(10);
            clock.tick(9);
            expect(countNotifications).to.eql(0);
            clock.tick(1);
            expect(countNotifications).to.eql(1);

        });

        it('with single listener registered multiple times', function () {

            var countNotifications = 0;

            var callback = function () {
                countNotifications += 1;
            };

            cache.unlistenPurge('fake id');
            var listenerId = cache.listenPurge(callback);
            cache.unlistenPurge(listenerId);
            cache.unlistenPurge(listenerId);
            cache.listenPurge(callback);
            cache.listenPurge(callback);

            clock.tick(10);

            cache.set('test', 1);

            clock.tick(10);
            clock.tick(9);
            expect(countNotifications).to.eql(0);
            clock.tick(1);
            expect(countNotifications).to.eql(2);

        });

        it('with multiple listeners', function () {

            var countNotifications = 0;

            var listenerId1 = cache.listenPurge(function () {
                countNotifications += 1;
            });
            var listenerId2 = cache.listenPurge(function () {
                countNotifications += 1;
            });
            cache.listenPurge(function () {
                countNotifications += 10;
            });
            cache.listenPurge(function () {
                countNotifications += 100;
            });
            cache.unlistenPurge(listenerId2);
            cache.unlistenPurge(listenerId1);

            clock.tick(10);

            cache.set('test', 1);

            clock.tick(10);
            clock.tick(9);
            expect(countNotifications).to.eql(0);
            clock.tick(1);
            expect(countNotifications).to.eql(110);

        });

        it('with retiring bucket as parameter', function (done) {

            var expectNotification = false;

            cache.listenPurge(function (bucket) {
                expect(expectNotification).to.eql(true);
                expect(bucket).to.eql([['test', 1]]);
                done();
            });

            cache.set('test', 1);

            clock.tick(10);

            cache.set('test2', 2);

            clock.tick(9);
            expectNotification = true;
            clock.tick(1);

        });

        it('with allowing to set cache in callback (without active bucket)', function (done) {

            var phase = 0;

            cache.listenPurge(function (bucket) {
                expect(phase).to.not.eql(0);
                switch (phase) {
                    case 1:
                        cache.set('test3', 3);
                        break;
                    case 2:
                        expect(bucket).to.eql([['test2', 2], ['test3', 3]]);
                        done();
                }
            });

            cache.set('test', 1);

            clock.tick(10);

            cache.set('test2', 2);

            clock.tick(9);
            phase = 1;
            clock.tick(1);

            clock.tick(9);
            phase = 2;
            clock.tick(1);

        });

        it('with allowing to set cache in callback (with active bucket)', function (done) {

            var phase = 0;

            cache.listenPurge(function (bucket) {
                expect(phase).to.not.eql(0);
                switch (phase) {
                    case 1:
                        cache.set('test3', 3);
                        break;
                    case 2:
                        expect(bucket).to.eql([['test2', 2], ['test3', 3]]);
                        done();
                }
            });

            cache.set('test', 1);

            clock.tick(10);

            cache.set('test2', 2);

            clock.tick(9);
            phase = 1;
            clock.tick(1);

            cache.set('test4', 4);

            clock.tick(9);
            phase = 2;
            clock.tick(1);

        });

    });

});
