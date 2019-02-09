'use strict';

function Timeout(callback, delay) {
    this._startTime = (new Date()).getTime();
    this._timeout = setTimeout(callback, delay);
    /* istanbul ignore else */
    if (this._timeout.unref) {
        this._timeout.unref(); // Unblocking the node.js process
    }
}

Timeout.prototype.getTimeElapsed = function () {
    return (new Date()).getTime() - this._startTime;
};

Timeout.prototype.clear = function () {
    if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
    }
};

module.exports = Timeout;
