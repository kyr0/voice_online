"use strict";

var NoteMaps = require("../../src/browser/js/NoteMaps.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('NoteMaps', function() {

    beforeEach(function () {
        this.nMaps = new NoteMaps();
    });

    it('should have an index of every standard note', function () {
        expect(this.nMaps.pitchMap["C0"].name).to.equal("C0");
    });

    it('should have an index of every standard note', function () {
        expect(this.nMaps.pitchMap["B8"].name).to.equal("B8");
    });

    it('pitchMap member should have frequency info on each index', function () {
        expect(this.nMaps.pitchMap["A4"].frequency).to.equal(440.00);
    });

    it('should have a reverse map of frequencies to note names', function () {
        expect(this.nMaps.reverseMap[16.352].name).to.equal("C0");
    });

    it('should have a reverse map of frequencies to note names', function () {
        expect(this.nMaps.reverseMap[7902.1].name).to.equal("B8");
    });

    it("pitchMap's lowest member C0 should have previousNote set to null", function () {
        expect(this.nMaps.pitchMap["C0"].previousNote).to.be.null;
    });

    it("pitchMap's highest member B8 should have nextNote set to null", function () {
        expect(this.nMaps.pitchMap["B8"].nextNote).to.be.null;
    });

    it("pitchArray's highest note B8 should exist", function () {
        expect(this.nMaps.pitchArray[107]).to.equal(7902.1);
    });

    it("pitchArray's lowest note C0 should exist", function () {
        expect(this.nMaps.pitchArray[0]).to.equal(16.352);
    });

    it('attempting to create a note with invalid name (string)', function () {
        var noteName = "X8";
        var errMsg = "validateNoteName(): the supplied note name is invalid - " + noteName;
        expect(catchError(this.nMaps.validateNoteName, noteName)).to.equal(errMsg);
    });


});