'use strict';

var Interval = require('../../src/client/js/Interval.js');

describe('Interval Object', function() {

    beforeEach(function() {
        this.dummy = "A4";
        this.note1 = 'A1';
        this.note2 = 'B2';
        this.silentNote = '-';
        this.itvl = new Interval(this.note1, this.note2);
        this.itvl2 = new Interval(this.note2, this.note1);
        this.itvl3 = new Interval(this.note2, this.note2);
    });

    it('should have the right name', function () {
        expect(this.itvl.name).to.equal('A1:B2');
        expect(this.itvl2.name).to.equal('B2:A1');
        expect(this.itvl3.name).to.equal('B2:B2');
    });

    it('should have the right name (silent notes', function () {
        var silentItvl = new Interval(this.silentNote, this.silentNote);
        expect(silentItvl.name).to.equal('-:-');
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

    it('should create an Interval with null distance (starting silentNote)', function () {
        var silentStart = new Interval(this.silentNote, this.dummy);
        expect(silentStart.halfsteps).to.equal(null);
    });

    it('should create an Interval with null distance (ending silentNote)', function () {
        var silentEnd = new Interval(this.dummy, this.silentNote);
        expect(silentEnd.halfsteps).to.equal(null);
    });

});
