'use strict';

function InvalidRangeError(message) {
    this.name = 'InvalidRangeError';
    this.message = message || '';
}
InvalidRangeError.prototype = Error.prototype;


function SilentIntervalError(message) {
    this.name = 'SilentIntervalError';
    this.message = (message || '');
}
SilentIntervalError.prototype = Error.prototype;


module.exports = {
    InvalidRangeError: InvalidRangeError,
    SilentIntervalError: SilentIntervalError
};