import RFFT from '../../src/dependencies/dsp.js';
import buffers from '../fixtures/audioBuffers.js';


describe('DSP.js', () => {

    it('should return the original signal after inverse', function () {
        this.timeout(0);  // this is a 3 second long test on avg
        const myMap = new Map(Object.entries(buffers.noteBuffers));

        myMap.forEach( (buff, key) => {
            let fft = new RFFT(buff.length, 44100);
            fft.forward(buff);
            fft.scale_trans();
            let inv = fft.inverse(fft.trans);
            for (let i = 0; i < buff.length; i++) {
                expect(buff[i]).to.be.closeTo(inv[i], 0.0000005);
            }
        });
    });

});
