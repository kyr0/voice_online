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


function InvalidLengthError(message) {
    this.name = 'InvalidLengthError';
    this.message = (message || '');
}
InvalidLengthError.prototype = Error.prototype;


module.exports = {
    InvalidRangeError: InvalidRangeError,
    CaptionsTooLongError: CaptionsTooLongError,
    InvalidLengthError: InvalidLengthError
};