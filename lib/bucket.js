'use strict';

function Bucket() {
    this._cache = {};
}

Bucket.prototype.set = function (key, value) {
    this._cache['!'+key] = value;
};

Bucket.prototype.has = function (key) {
    return Object.prototype.hasOwnProperty.call(this._cache, '!'+key);
};

Bucket.prototype.get = function (key) {
    key = '!' + key;
    if (!Object.prototype.hasOwnProperty.call(this._cache, key)) {
        throw new Error('Cache contains no entry for this key');
    }
    return this._cache[key];
};

Bucket.prototype.remove = function (key) {
    delete this._cache['!'+key];
};

module.exports = Bucket;
