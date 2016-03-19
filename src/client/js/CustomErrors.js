'use strict';

function InvalidRangeError(message) {
    this.name = 'InvalidRangeError';
    this.message = message || '';
}
InvalidRangeError.prototype = Error.prototype;


function InvalidIntervalError(message) {
    this.name = 'InvalidIntervalError';
    this.message = (message || '');
}
InvalidIntervalError.prototype = Error.prototype;


module.exports = {
    InvalidRangeError: InvalidRangeError,
    InvalidIntervalError: InvalidIntervalError
};