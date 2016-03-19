///**
// * Created by jaboing on 2015-07-31.
// */
'use strict';

var Interval = require('../../src/client/js/Interval.js');
var SilentIntervalError = require('../../src/client/js/customErrors.js').SilentIntervalError;
var helpers = require('../resources/testHelpers.js');
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Interval Object', function() {

    beforeEach(function() {
        this.dummy = "A4";
        this.note1 = 'A1';
        this.note2 = 'B2';
        this.itvl = new Interval(this.note1, this.note2);
        this.itvl2 = new Interval(this.note2, this.note1);
        this.itvl3 = new Interval(this.note2, this.note2);
    });

    it('should have the right name', function () {
        expect(this.itvl.name).to.equal('A1:B2');
        expect(this.itvl2.name).to.equal('B2:A1');
        expect(this.itvl3.name).to.equal('B2:B2');
    });

    it('should create an Interval with correct distance (up)', function () {
        expect(this.itvl.halfsteps).to.equal(14);
    });

    it('should create an Interval with correct distance (down)', function () {
        expect(this.itvl2.halfsteps).to.equal(-14);
    });

    it('should create an Interval with correct distance (unison)', function () {
        expect(this.itvl3.halfsteps).to.equal(0);
    });

    it('should throw Error when startNote is a silentNote', function () {
        var fn = function(){
            var dum = new Interval('-', this.dummy);
        };
        expect(fn).to.throw(SilentIntervalError);
    });

    it('should throw Error when endNote is a silentNote', function () {
        var fn = function(){
            var dum = new Interval(this.dummy, '-');
        };
        expect(fn).to.throw(SilentIntervalError);
    });

});
