import calculateAnalysisData from '../../src/client/js/MPM_Tartini.babel.js';
import MPM from '../../src/client/js/MPM.js';
import buffers from '../fixtures/audioBuffers.js';
// import fft from 'kissfft';


const REPS = 10000;

describe('Benchmark Tartini', function () {

    it('', function () {
        this.timeout(0);
        let startTime = Date.now();
        for (let rep = 0; rep < REPS; rep++) {
            calculateAnalysisData(buffers.noteBuffers.A4_1024);
        }
        console.log("New Algo avg time in ms: " + (Date.now() - startTime) / REPS);
    });

});

describe('Benchmark original MPM', function () {

    let mpm;

    beforeEach(function () {
        mpm = new MPM(44100, buffers.noteBuffers.A2_1024.length);
    });

    it('', function() {
        this.timeout(0);
        let startTime = Date.now();
        for (let rep = 0; rep < REPS; rep++) {
            mpm.detectPitch(buffers.noteBuffers.A2_1024)
        }
        console.log("Old Algo avg time in ms: " + (Date.now() - startTime) / REPS);
    });

});
