'use strict';

var Caption = require('../../src/client/js/Caption.js');

describe('Caption object', function() {

    it('should set duration when text is empty', function () {
        this.emptyCaption = new Caption('', '1/4');
        expect(this.emptyCaption.duration).to.equal('1/4');
    });

    it('should set text field when empty string passed in to constructor', function () {
        this.emptyCaption = new Caption('', '1/4');
        expect(this.emptyCaption.text).to.equal('');
    });

    it('should set text field when non-empty string passed in to constructor', function () {
        this.emptyCaption = new Caption('Yo', '1/4');
        expect(this.emptyCaption.text).to.equal('Yo');
    });


});
