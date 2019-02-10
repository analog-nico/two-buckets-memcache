'use strict';

var Bucket = require('./bucket.js');
var Timeout = require('./timeout.js');


function TwoBucketsMemcache(expireAfter) {

    this._expireAfter = expireAfter;

}

TwoBucketsMemcache.prototype.set = function (key, value) {

    if (this._destroyed) {
        throw new Error('Cache is destroyed');
    }

    this._createActiveBucketIfNotExisting();
    this._activeBucket.set(key, value);

};

TwoBucketsMemcache.prototype.has = function (key) {

    return this._activeBucket && this._activeBucket.has(key) || this._retiredBucket && this._retiredBucket.has(key) || false;

};

TwoBucketsMemcache.prototype.get = function (key) {

    if (this._activeBucket) {

        try {

            return this._activeBucket.get(key);

        } catch (e) {

            if (!this._retiredBucket) {
                throw new Error('Cache contains no entry for this key');
            }

            return this._retiredBucket.get(key);

        }

    } else {

        if (!this._retiredBucket) {
            throw new Error('Cache contains no entry for this key');
        }

        return this._retiredBucket.get(key);

    }

};

TwoBucketsMemcache.prototype.remove = function (key) {

    if (this._activeBucket) {
        this._activeBucket.remove(key);
    }

    if (this._retiredBucket) {
        this._retiredBucket.remove(key);
    }

};

TwoBucketsMemcache.prototype.destroy = function () {

    if (this._timeout) {
        clearTimeout(this._timeout);
        delete this._timeout;
    }

    delete this._activeBucket;
    delete this._retiredBucket;

    this._destroyed = true;

};

TwoBucketsMemcache.prototype._createActiveBucketIfNotExisting = function () {

    if (this._activeBucket) {
        return;
    }

    this._activeBucket = new Bucket();
    this._setTimeoutIfNotRunning();

};

TwoBucketsMemcache.prototype._retireBuckets = function () {

    delete this._timeout; // ...since it just got fired.

    if (this._activeBucket) {

        this._retiredBucket = this._activeBucket; // Also deletes retired bucket
        delete this._activeBucket;

        this._setTimeoutIfNotRunning();

    } else {

        delete this._retiredBucket;

    }

};

TwoBucketsMemcache.prototype._setTimeoutIfNotRunning = function (expireAfter) {

    if (this._timeout) {
        return;
    }

    if (!expireAfter && expireAfter !== 0) {
        expireAfter = this._expireAfter;
    }

    this._timeout = new Timeout(this._retireBuckets.bind(this), expireAfter);

};

TwoBucketsMemcache.prototype.changeExpireAfter = function (expireAfter) {

    if (this._destroyed) {
        throw new Error('Cache is destroyed');
    }

    var spedUp = expireAfter < this._expireAfter;

    this._expireAfter = expireAfter;

    if (!spedUp || !this._timeout) {
        return;
    }

    var timeElapsed = this._timeout.getTimeElapsed();
    var timeRemaining = expireAfter - timeElapsed;
    if (timeRemaining < 0) {
        timeRemaining = 0;
    }

    this._timeout.clear();
    delete this._timeout;

    this._setTimeoutIfNotRunning(timeRemaining);

};

module.exports = TwoBucketsMemcache;
