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
        expect(this.nMaps.pitchMap["C0"].name).toEqual("C0");
    });

    it('should have an index of every standard note', function () {
        expect(this.nMaps.pitchMap["B8"].name).toEqual("B8");
    });

    it('pitchMap member should have frequency info on each index', function () {
        expect(this.nMaps.pitchMap["A4"].frequency).toEqual(440.00);
    });

    it('should have a reverse map of frequencies to note names', function () {
        expect(this.nMaps.reverseMap[16.352].name).toEqual("C0");
    });

    it('should have a reverse map of frequencies to note names', function () {
        expect(this.nMaps.reverseMap[7902.1].name).toEqual("B8");
    });

    it("pitchMap's lowest member C0 should have previousNote set to null", function () {
        expect(this.nMaps.pitchMap["C0"].previousNote).toBeNull();
    });

    it("pitchMap's highest member B8 should have nextNote set to null", function () {
        expect(this.nMaps.pitchMap["B8"].nextNote).toBeNull();
    });

    it("pitchArray's highest note B8 should exist", function () {
        expect(this.nMaps.pitchArray[107]).toBe(7902.1);
    });

    it("pitchArray's lowest note C0 should exist", function () {
        expect(this.nMaps.pitchArray[0]).toBe(16.352);
    });


});