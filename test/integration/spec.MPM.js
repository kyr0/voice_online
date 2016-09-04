var MPM = require('../../src/client/js/MPM.js');
var buffers = require('../fixtures/audioBuffers.js');
var helpers = require('../utils/testHelpers.js');
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('detectPitch()', function () {

    beforeEach(function () {
        var sample44k = 44100;   // sampleRate of 44100
        this.mpm = new MPM(sample44k, buffers.oscBuffer.length);
    });

    it('should throw an error when called on buffer with NaN', function () {
        var buffer = createMockBufferFullOfNaN();
        var errMsg = catchError('detectPitch', buffer, this.mpm);
        var expectedMsg = 'peakPicking(): NSDF value at index';
        expect(errMsg).to.have.string(expectedMsg);
    });

    it('should assign correct frequency to A2 buffer given 512 samples', function() {
        var expectedA2Freq = 110;
        expect(Math.round(this.mpm.detectPitch(buffers.noteBuffers.A2_512))).to.equal(expectedA2Freq);
    });

    describe('should put expected values in ', function() {
        beforeEach(function () {
            this.mpm.detectPitch(buffers.oscBuffer);
        });

        it('maxPositions[] given known input', function() {
            var maxValue1 = 0.9998912511141909;
            var maxValue2 = 0.9995046600818478;
            var maxIndex1 = 100;
            var maxIndex2 = 200;
            expect(this.mpm.__testonly__.nsdf[maxIndex1]).to.equal(maxValue1);
            expect(this.mpm.__testonly__.nsdf[maxIndex2]).to.equal(maxValue2);
            expect(MPM.__testonly__.maxPositions.toString()).to.equal(maxIndex1 + ',' + maxIndex2);
        });

        it('turningPointX/Y given known input', function() {
            expect(MPM.__testonly__.turningPointX).to.equal(200.46002039225493);
            expect(MPM.__testonly__.turningPointY).to.equal(1.0000240543039114);
        });

        it('turningPointX/Y if private function prabolicInterpolation() finds 1 in 3 consecutive index', function() {
            var tauIndex = 34;
            this.mpm.__testonly__.nsdf[tauIndex - 1] = 1;   // a
            this.mpm.__testonly__.nsdf[tauIndex] = 1;       // b, tau index
            this.mpm.__testonly__.nsdf[tauIndex + 1] = 1;   // c
            this.mpm.__testonly__.prabolicInterpolation(tauIndex);
            expect(MPM.__testonly__.turningPointX).to.equal(tauIndex);
            expect(MPM.__testonly__.turningPointY).to.equal(1);
        });
    });

});


function createMockBufferFullOfNaN(){
    var numFrames = 10;
    var mockBuffer = new Array(numFrames);
    // Fill the mock buffer with NaNs
    for (var i = 0; i < numFrames; i++) {
        mockBuffer[i] = 'Not A Number ' + i;
    }
    return mockBuffer;
}
