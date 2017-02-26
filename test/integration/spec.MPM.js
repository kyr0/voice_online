var MPM = require('../../src/client/js/MPM.js');
var buffers = require('../fixtures/audioBuffers.js');

describe('detectPitch()', function () {

    beforeEach(function () {
        this.sample44k = 44100;   // sampleRate of 44100
    });

    it('should throw an error when called on buffer with NaN', function () {
        var mpm = new MPM(this.sample44k, buffers.oscBuffer.length);
        var buffer = createMockBufferFullOfNaN();
        expect(Math.round(mpm.detectPitch(buffer))).to.equal(-1);
    });

    it('should assign correct frequency to A2 buffer given 512 samples', function () {
        var expectedA2Freq = 110;
        var mpm = new MPM(this.sample44k, buffers.noteBuffers.A2_512.length);
        expect(Math.round(mpm.detectPitch(buffers.noteBuffers.A2_512))).to.equal(expectedA2Freq);
    });

});


function createMockBufferFullOfNaN() {
    var numFrames = buffers.oscBuffer.length;
    var mockBuffer = new Array(numFrames);
    // Fill the mock buffer with NaNs
    for (var i = 0; i < numFrames; i++) {
        mockBuffer[i] = 'Not A Number ' + i;
    }
    return mockBuffer;
}
