'use strict';

var sinon = require('sinon');
var chai = require("chai");
var expect = chai.expect;


var Timeout = require('../../lib/timeout.js');


describe('The Timeout', function () {

    var clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    it('should call the callback without delay', function (done) {
        /*jshint nonew:false */

        new Timeout(function () {
            done();
        });

        clock.tick(1);

    });

    it('should call the callback with delay', function (done) {
        /*jshint nonew:false */

        var startTime = (new Date()).getTime();

        new Timeout(function () {
            expect((new Date()).getTime() - startTime).to.be.above(9);
            done();
        }, 10);

        clock.tick(10);

    });

    it('should return the elapsed time', function (done) {

        var timeout = new Timeout(function () {}, 10);

        setTimeout(function () {
            expect(timeout.getTimeElapsed()).to.be.above(4);
            done();
        }, 5);

        clock.tick(5);

    });

    it('should return the elapsed time even after the timeout fired', function (done) {

        var timeout = new Timeout(function () {});

        setTimeout(function () {
            expect(timeout.getTimeElapsed()).to.be.above(9);
            done();
        }, 10);

        clock.tick(10);

    });

    it('should allow to be cleared', function (done) {

        var timeoutsFired = 0;

        var timeout1 = new Timeout(function () {
            timeoutsFired += 1;
        }, 10);
        var timeout2 = new Timeout(function () {
            timeoutsFired += 1;
        }, 10);

        timeout1.clear();
        setTimeout(function () {
            timeout2.clear();
        });

        setTimeout(function () {
            expect(timeoutsFired).to.eql(0);
            done();
        }, 15);

        clock.tick(1);
        clock.tick(14);

    });

    it('should ignore repeated clear calls', function () {

        var timeout = new Timeout(function () {}, 10);

        timeout.clear();
        timeout.clear();

    });

});
