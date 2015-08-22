///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var MPM = require("../../spikes/pitch/js/MPM.js");
var buffers = require("../resources/audioBuffers.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('MPM Object', function() {
    var sample48k = 48000;   // a sampleRate of 48000
    var sample44k = 44100;   // sampleRate of 44100
    var buffer2kb = 2048;  // a non-default buffersize of 2kb
    var customCutoff = 0.93; // a non-default cutoff threshold


    describe('created with single parameter. Initial value of', function() {
        beforeEach(function () {
            this.mpm = new MPM(sample48k);
        });

        it("sampleRate should equal the passed in parameter" + sample48k, function () {
            expect(this.mpm.__testonly__.sampleRate).toEqual(sample48k);
        });
        it("bufferSize should equal DEFAULT_BUFFER_SIZE", function () {
            expect(this.mpm.__testonly__.bufferSize).toEqual(this.mpm.__testonly__.DEFAULT_BUFFER_SIZE);
        });
        it("cutoff should equal DEFAULT_CUTOFF", function () {
            expect(this.mpm.__testonly__.cutoff).toEqual(this.mpm.__testonly__.DEFAULT_CUTOFF);
        });
    });

    describe('created with all parameters. Initial value of', function() {
        beforeEach(function () {
            this.mpm = new MPM(sample48k, buffer2kb, customCutoff);
        });

        it("bufferSize should be same as the passed in parameter", function () {
            expect(this.mpm.__testonly__.bufferSize).toEqual(buffer2kb);
        });

        it("bufferSize should be same as the passed in parameter", function () {
            expect(this.mpm.__testonly__.cutoff).toEqual(customCutoff);
        });

        it("nsdf.length should be same as bufferSize", function () {
            expect(this.mpm.__testonly__.nsdfLength).toEqual(this.mpm.__testonly__.bufferSize);
        });
    });


    describe('private array nsdf[]', function() {

        beforeEach(function () {
            this.bufferLength = 50;
            this.mpm = new MPM(sample44k, this.bufferLength);
        });

        it("should be undefined before detectPitch() is called", function () {
            expect(allNSDFValuesAreUndefined(this.mpm)).toEqual(true);
        });

        it("should be less than Abs value of +/- 1 when called with valid buffer", function () {
            var buffer = createMockBufferOfSize(50);
            this.mpm.__testonly__.normalizedSquareDifference(buffer);
            expect(allNSDFValuesAreLessThanAbsolute1(this.mpm)).toEqual(true);
        });

    });


    describe('detectPitch()', function() {

        beforeEach(function () {
            this.mpm = new MPM(sample44k, buffers.oscBuffer.length);
        });

        it("should throw an error when called on buffer with NaN", function () {
            var buffer = createMockBufferFullOfNaN();
            //this.mpm.detectPitch(buffer);
            var errMsg = catchError("detectPitch", buffer, this.mpm);
            var expectedMsg = "peakPicking(): NSDF value at index 1 should be >= 0, was: NaN";
            expect(errMsg).toContain(expectedMsg);
        });


        describe('should put expected values in ', function() {
            beforeEach(function () {
                this.mpm.detectPitch(buffers.oscBuffer);
            });

            it("maxPositions[] given known input", function() {
                var maxValue1 = 0.9998912511141909;
                var maxValue2 = 0.9995046600818478;
                var maxIndex1 = 100;
                var maxIndex2 = 200;
                expect(this.mpm.__testonly__.nsdf[maxIndex1]).toEqual(maxValue1);
                expect(this.mpm.__testonly__.nsdf[maxIndex2]).toEqual(maxValue2);
                expect(MPM.__testonly__.maxPositions.toString()).toEqual(maxIndex1 + "," + maxIndex2);
            });

            it("turningPointX/Y given known input", function() {
                expect(MPM.__testonly__.turningPointX).toEqual(200.46002039225493);
                expect(MPM.__testonly__.turningPointY).toEqual(1.0000240543039114);
            });

            it("turningPointX/Y if private function prabolicInterpolation() finds 1 in 3 consecutive index", function() {
                var tauIndex = 34;
                this.mpm.__testonly__.nsdf[tauIndex - 1] = 1;   // a
                this.mpm.__testonly__.nsdf[tauIndex] = 1;       // b, tau index
                this.mpm.__testonly__.nsdf[tauIndex + 1] = 1;   // c
                this.mpm.__testonly__.prabolicInterpolation(tauIndex);
                expect(MPM.__testonly__.turningPointX).toEqual(tauIndex);
                expect(MPM.__testonly__.turningPointY).toEqual(1);
            });
        });

    });

    // this could also be used to add noise to a signal for clarity testing in future
    function createMockBufferOfSize(numFrames){
        var mockBuffer = new Array(numFrames);
        // Fill the mock buffer with white noise which is just random values between -1.0 and 1.0
        // This gives us the actual ArrayBuffer that contains the data
        for (var i = 0; i < numFrames; i++) {
            // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
            mockBuffer[i] = Math.random() * 2 - 1;
        }
        return mockBuffer;
    }

    function createMockBufferFullOfNaN(){
        var numFrames = 10;
        var mockBuffer = new Array(numFrames);
        // Fill the mock buffer with NaNs
        for (var i = 0; i < numFrames; i++) {
            mockBuffer[i] = 'Not A Number ' + i;
        }
        return mockBuffer;
    }

    function allNSDFValuesAreUndefined(mpmObj){
        for (var i = 0; i < mpmObj.__testonly__.nsdfLength; i++) {
            if (typeof mpmObj.__testonly__.nsdf[i] !== 'undefined') {
                return 'false';
            }
        }
        return true;
    }

    function allNSDFValuesAreLessThanAbsolute1(mpmObj){
        for (var i = 0; i < mpmObj.__testonly__.nsdfLength; i++) {
            if (Math.abs(mpmObj.__testonly__.nsdf[i]) > 1) {
                return false;
            }
        }
        return true;
    }
});


