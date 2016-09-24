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

    it('should assign correct frequency to A2 buffer given 512 samples', function () {
        var expectedA2Freq = 110;
        expect(Math.round(this.mpm.detectPitch(buffers.noteBuffers.A2_512))).to.equal(expectedA2Freq);
    });

});


function createMockBufferFullOfNaN() {
    var numFrames = 10;
    var mockBuffer = new Array(numFrames);
    // Fill the mock buffer with NaNs
    for (var i = 0; i < numFrames; i++) {
        mockBuffer[i] = 'Not A Number ' + i;
    }
    return mockBuffer;
}
