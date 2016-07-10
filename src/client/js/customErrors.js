'use strict';

function InvalidRangeError(message) {
    this.name = 'InvalidRangeError';
    this.message = message || '';
}
InvalidRangeError.prototype = Error.prototype;


function CaptionsTooLongError(message) {
    this.name = 'CaptionsTooLongError';
    this.message = (message || '');
}
CaptionsTooLongError.prototype = Error.prototype;


function InvalidDurationError(message) {
    this.name = 'InvalidDurationError';
    this.message = (message || '');
}
InvalidDurationError.prototype = Error.prototype;


module.exports = {
    InvalidRangeError: InvalidRangeError,
    CaptionsTooLongError: CaptionsTooLongError,
    InvalidDurationError: InvalidDurationError
};