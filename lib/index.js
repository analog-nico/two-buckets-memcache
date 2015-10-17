'use strict';

var Bucket = require('./bucket.js');

function TwoBucketsMemcache(expireAfter) {
    this._expireAfter = expireAfter;
    this._activeBucket = new Bucket();
    this._moveToNewBucket = this._moveToNewBucket.bind(this);
    this._moveToNewBucket();
}

TwoBucketsMemcache.prototype.set = function (key, value) {
    this._retiredBucket.remove(key);
    this._activeBucket.set(key, value);
};

TwoBucketsMemcache.prototype.get = function (key) {
    try {
        return this._retiredBucket.get(key);
    } catch (e) {
        return this._activeBucket.get(key);
    }
};

TwoBucketsMemcache.prototype.remove = function (key) {
    this._retiredBucket.remove(key);
    this._activeBucket.remove(key);
};

TwoBucketsMemcache.prototype.destroy = function () {
    if (this._timeout) {
        clearTimeout(this._timeout);
        delete this._timeout;
        this._retiredBucket = this._activeBucket = new Bucket();
    }
};

TwoBucketsMemcache.prototype._moveToNewBucket = function () {
    this._retiredBucket = this._activeBucket;
    this._activeBucket = new Bucket();
    this._timeout = setTimeout(this._moveToNewBucket, this._expireAfter);
    /* istanbul ignore else */
    if (this._timeout.unref) {
        this._timeout.unref(); // Unblocking the node.js process
    }
};

module.exports = TwoBucketsMemcache;
