'use strict';

var Bucket = require('./bucket.js');


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

TwoBucketsMemcache.prototype._setTimeoutIfNotRunning = function () {

    if (this._timeout) {
        return;
    }

    this._timeout = setTimeout(this._retireBuckets.bind(this), this._expireAfter);
    /* istanbul ignore else */
    if (this._timeout.unref) {
        this._timeout.unref(); // Unblocking the node.js process
    }

};

module.exports = TwoBucketsMemcache;
