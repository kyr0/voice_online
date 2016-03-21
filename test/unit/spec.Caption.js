'use strict';

var Caption = require('../../src/client/js/Caption.js');

describe('Caption object', function() {

    it('should set length when text is empty', function () {
        this.emptyCaption = new Caption('', '1/4');
        expect(this.emptyCaption.length).to.equal('1/4');
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
