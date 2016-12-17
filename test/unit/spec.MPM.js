'use strict';
var MPM = require('../../src/client/js/MPM.js');

describe('MPM Object', function() {
    var sample48k = 48000;   // a sampleRate of 48000
    var sample44k = 44100;   // sampleRate of 44100
    var buffer2kb = 2048;  // a non-default buffersize of 2kb
    var customCutoff = 0.93; // a non-default cutoff threshold


    describe('created with single parameter. Initial value of', function() {
        beforeEach(function () {
            this.mpm = new MPM(sample48k);
        });

        it('sampleRate should equal the passed in parameter' + sample48k, function () {
            expect(this.mpm.__testonly__.sampleRate).to.equal(sample48k);
        });
        it('bufferSize should equal DEFAULT_BUFFER_SIZE', function () {
            expect(this.mpm.__testonly__.bufferSize).to.equal(this.mpm.__testonly__.DEFAULT_BUFFER_SIZE);
        });
        it('cutoff should equal DEFAULT_CUTOFF', function () {
            expect(this.mpm.__testonly__.cutoff).to.equal(this.mpm.__testonly__.DEFAULT_CUTOFF);
        });
    });

    describe('created with all parameters. Initial value of', function() {
        beforeEach(function () {
            this.mpm = new MPM(sample48k, buffer2kb, customCutoff);
        });

        it('bufferSize should be same as the passed in parameter', function () {
            expect(this.mpm.__testonly__.bufferSize).to.equal(buffer2kb);
        });

        it('bufferSize should be same as the passed in parameter', function () {
            expect(this.mpm.__testonly__.cutoff).to.equal(customCutoff);
        });

        it('nsdf.length should be same as bufferSize', function () {
            expect(this.mpm.__testonly__.nsdfLength).to.equal(this.mpm.__testonly__.bufferSize);
        });
    });


    describe('private array nsdf[]', function() {

        beforeEach(function () {
            this.bufferLength = 50;
            this.mpm = new MPM(sample44k, this.bufferLength);
        });

        it('should be undefined before detectPitch() is called', function () {
            expect(allNSDFValuesAreUndefined(this.mpm)).to.equal(true);
        });

        it('should be less than Abs value of +/- 1 when called with valid buffer', function () {
            var buffer = createMockBufferOfSize(50);
            this.mpm.__testonly__.normalizedSquareDifference(buffer);
            expect(allNSDFValuesAreLessThanAbsolute1(this.mpm)).to.equal(true);
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


