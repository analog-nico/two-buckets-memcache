'use strict';

function Bucket() {
    this._cache = {};
}

Bucket.prototype.set = function (key, value) {
    this._cache['!'+key] = value;
    delete this._arr;
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
    delete this._arr;
};

Bucket.prototype.toArray = function () {
    if (!this._arr) {
        this._arr = [];
        var keys = Object.keys(this._cache);
        for ( var i = 0; i < keys.length; i+=1 ) {
            this._arr.push([keys[i].slice(1), this._cache[keys[i]]]);
        }
    }
    return this._arr;
};

module.exports = Bucket;
