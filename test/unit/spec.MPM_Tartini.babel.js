import calculateAnalysisData from '../../src/client/js/MPM_Tartini.babel.js';
import buffers from '../fixtures/audioBuffers.js';


describe('MPM Tartini', () => {

    beforeEach(() => {

    });

    it('should...', () => {
        calculateAnalysisData(buffers.noteBuffers.A4_1024);
    });

});
