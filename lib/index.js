'use strict';

var Bucket = require('./bucket.js');

function TwoBucketsMemcache(expireAfter) {
    this._expireAfter = expireAfter;
    this._activeBucket = new Bucket();
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

TwoBucketsMemcache.prototype._moveToNewBucket = function () {
    this._retiredBucket = this._activeBucket;
    this._activeBucket = new Bucket();
    setTimeout(this._moveToNewBucket, this._expireAfter);
};

module.exports = TwoBucketsMemcache;
