'use strict';

/**
 * Implementation of The McLeod Pitch Method (MPM). It is described in the
 * article A Smarter Way to Find Pitch. According to the article:
 *
 * "A fast, accurate and robust method for finding the continuous pitch in
 * monophonic musical sounds. [It uses] a special normalized version of the
 * Squared Difference Function (SDF) coupled with a peak picking algorithm.
 *
 * MPM runs in real time with a standard 44.1 kHz sampling rate. It operates
 * without using low-pass filtering so it can work on sound with high harmonic
 * frequencies such as a violin and it can display pitch changes of one cent
 * reliably. MPM works well without any post processing to correct the pitch.

 * For the moment this implementation uses the inefficient way of calculating
 * the pitch. It uses O(Ww) with W the window size in samples and w
 * the desired number of ACF coefficients. The implementation can be optimized
 * to O((W+w)log(W+w)) by using an FFT to calculate the Auto-Correlation Function
 * But I am still afraid of the dark magic of the FFT and clinging to the familiar,
 * friendly, laggard time domain."
 */

var PitchDetectionResult = require('./PitchDetectionResult.js');


function MPM(audioSampleRate, audioBufferSize, cutoffMPM) {

    this.DEFAULT_BUFFER_SIZE = 1024; // The expected size of an audio buffer (in samples).
    // note that this can be optimized if we know in advance the range of input freq that will
    // be found in the buffer, for instance A1 needs a buffer of 1024 to be successful, but A4
    // only needs 128 (smallest in Javascript Web Audio API is 256)

    // Overlap defines how much two audio buffers following each other should
    // overlap (in samples). 75% overlap is advised in the MPM article.
    this.DEFAULT_OVERLAP = 768;

    // Defines the relative size the chosen peak (pitch) has. 0.93 means: choose
    // the first peak that is higher than 93% of the highest peak detected. 93%
    // is the default value used in the Tartini user interface.
    var _DEFAULT_CUTOFF = 0.97;

    // For performance reasons, peaks below small cutoff are not even considered.
    var _SMALL_CUTOFF = 0.5;

    //Pitch annotations below this threshold are considered invalid and ignored.
    var _LOWER_PITCH_CUTOFF = 53.435; // Hz == 50 cents below A1
    var _HIGHER_PITCH_CUTOFF = 3229.2; // Hz == 50 cents above G7
    // TODO implement high cutoff and test,
    // TODO return freq guess even if out of range

    // Defines the relative size that the chosen peak (pitch) has
    var _cutoff;

    // The audio sample rate. Most audio has a sample rate of 44.1kHz.
    var _sampleRate;

    //Contains a normalized square difference (NSDF) function value for each delay (tau)
    var _nsdf;

    // The x and y coordinate of the top of the curve (nsdf)
    var _turningPointX;
    var _turningPointY;

    // A list with minimum and maximum values of the nsdf curve.
    var _maxPositions = [];

    // A list of estimates of the period of the signal (in samples).
    var _periodEstimates = [];

    //A list of estimates of the amplitudes corresponding with the period estimates.
    var _ampEstimates = [];

    // returned by getPitch()
    var _result = new PitchDetectionResult();


    _sampleRate = audioSampleRate;
    var bufferSize = typeof audioBufferSize !== 'undefined' ? audioBufferSize : this.DEFAULT_BUFFER_SIZE;
    _cutoff = typeof cutoffMPM !== 'undefined' ? cutoffMPM : _DEFAULT_CUTOFF;
    _nsdf = new Array(bufferSize);

    /* start-test-code */
    this.__testonly__ = {
        sampleRate : _sampleRate,
        bufferSize : bufferSize,
        cutoff : _cutoff,
        DEFAULT_CUTOFF : _DEFAULT_CUTOFF,
        DEFAULT_BUFFER_SIZE : this.DEFAULT_BUFFER_SIZE,
        nsdfLength : _nsdf.length,
    };
    /* end-test-code */

    // void xcorr_timedomain(void *signala, void *signalb, void *result, int N)
    // {
    //     for (int tau = 0; tau < 2*N-1; ++tau) {
    //     complex acf = 0 + 0*I;
    //     for (int i = 0; i < N; ++i) {
    //         const int signala_idx = (i+tau)%(2*N-1);
    //         const complex conjb = conj(((complex*)signalb)[i]);
    //         const double factor = (signala_idx >= N) ?
    //             ((complex*)signala)[signala_idx-N] : 1.0;
    //         acf += factor * conjb;
    //     }
    //     ((complex*)result)[tau] = acf;
    // }
    //     return;
    // }

    /*
     * Implements the normalized square difference function. See section 4 (and
     * the explanation before) in the MPM article. This calculation can be
     * optimized by using an FFT. The results should remain the same.
     */
    function normalizedSquareDifference(audioBuffer) {
        for (var tau = 0; tau < bufferSize; tau++) {
            var acf = 0;
            var divisorM = 0;
            for (var i = 0; i < bufferSize - tau; i++) {
                acf += audioBuffer[i] * audioBuffer[i + tau];
                divisorM += audioBuffer[i] * audioBuffer[i] + audioBuffer[i + tau] * audioBuffer[i + tau];
            }
            _nsdf[tau] = 2 * acf / divisorM;
        }
    }

    /* start-test-code */
    this.__testonly__.nsdf = _nsdf;
    this.__testonly__.normalizedSquareDifference = normalizedSquareDifference;
    /* end-test-code */

    this.detectPitch = function (audioBuffer) {
        var pitch;

        // Clear previous results without creating new arrays for Garbage Collection
        _maxPositions.length = 0;
        _periodEstimates.length = 0;
        _ampEstimates.length = 0;

        // 1. Calculate the normalized square difference for each Tau value.
        normalizedSquareDifference(audioBuffer);
        // 2. Peak picking time: time to pick some peaks.
        peakPicking(audioBuffer);

        var highestAmplitude = Number.NEGATIVE_INFINITY;

        var tau;
        for (var i = 0; i < _maxPositions.length; i++) {
            tau = _maxPositions[i];
            // make sure every annotation has a probability attached
            highestAmplitude = Math.max(highestAmplitude, _nsdf[tau]);

            if (_nsdf[tau] > _SMALL_CUTOFF) {
                // calculates turningPointX and Y
                parabolicInterpolation(tau);
                // store the turning points
                _ampEstimates.push(_turningPointY);
                _periodEstimates.push(_turningPointX);
                // remember the highest amplitude
                highestAmplitude = Math.max(highestAmplitude, _turningPointY);
            }
        }

        if (_periodEstimates.length === 0) {
            pitch = -1;
        } else {
            // use the overall maximum to calculate a cutoff.
            // The cutoff value is based on the highest value and a relative
            // threshold.
            var actualCutoff = _cutoff * highestAmplitude;

            // find first period above or equal to cutoff
            var periodIndex = 0;
            for (var j = 0; j < _ampEstimates.length; j++) {
                if (_ampEstimates[j] >= actualCutoff) {
                    periodIndex = j;
                    break;
                }
            }

            var period = _periodEstimates[periodIndex];
            var pitchEstimate = _sampleRate / period;
            if (pitchEstimate > _LOWER_PITCH_CUTOFF && pitchEstimate < _HIGHER_PITCH_CUTOFF) {
                pitch = pitchEstimate;
            } else {
                pitch = -1;
            }

        }

        /**
         *  A probability (noisiness, (a)periodicity, salience, voicedness or
         *         clarity measure) for the detected pitch. This is somewhat similar
         *         to the term voiced which is used in speech recognition. This
         *         probability is calculated together with the pitch.
         */
        _result.setProbability(highestAmplitude);

        _result.setPitch(pitch);
        return _result;

    };



    /**
     * Finds the x value corresponding with the peak of a parabola.
     *
     * a,b,c are three samples that follow each other. E.g. a is at 511, b at
     * 512 and c at 513; f(a), f(b) and f(c) are the normalized square
     * difference values for those samples; x is the peak of the parabola and is
     * what we are looking for. Because the samples follow each other
     * (b - a = 1) the formula for parabolic interpolation can be simplified a lot.
     *
     * http://fizyka.umk.pl/nrbook/c10-2.pdf
     *
     * The following ASCII ART shows it a bit more clear, imagine this to be a
     * bit more curvaceous.
     *
     *     nsdf(x)
     *       ^
     *       |
     * f(x)  |------ ^
     * f(b)  |     / |\
     * f(a)  |    /  | \
     *       |   /   |  \
     *       |  /    |   \
     * f(c)  | /     |    \
     *       |_____________________> x
     *            a  x b  c
     *
     * @param tau
     *            The delay tau, b value in the drawing is the tau value.
     */
    function parabolicInterpolation(tau) {
        var nsdfa = _nsdf[tau - 1];
        var nsdfb = _nsdf[tau];
        var nsdfc = _nsdf[tau + 1];
        var bValue = tau;
        var bottom = nsdfc + nsdfa - 2 * nsdfb;
        if (bottom === 0) {
            _turningPointX = bValue;
            _turningPointY = nsdfb;
        } else {
            var delta = nsdfa - nsdfc;
            _turningPointX = bValue + delta / (2 * bottom);
            _turningPointY = nsdfb - delta * delta / (8 * bottom);
        }
    }

    /* start-test-code */
    this.__testonly__.parabolicInterpolation = parabolicInterpolation;
    /* end-test-code */


    /**
     * PEAK PICKING TIME:
     *
     * Implementation based on the GPL'ED code of Tartini
     * This code can be found in the file, 'general/mytransforms.cpp'.
     *
     * Finds the highest value between each pair of positive zero crossings.
     * Including the highest value between the last positive zero crossing and
     * the end (if any). Ignoring the first maximum (which is at zero). In this
     * diagram the desired values are marked with a +
     *
     *  f(x)
     *   ^
     *   |
     *  1|               +
     *   | \      +     /\      +     /\
     *  0| _\____/\____/__\/\__/\____/_______> x
     *   |   \  /  \  /      \/  \  /
     * -1|    \/    \/            \/
     *   |
     *
     * @param audioBuffer - The array to look for maximum values in. It should contain
     *   values between -1 and 1
     * @author Phillip McLeod
     */
    function peakPicking(audioBuffer) {

        var pos = 0;
        var curMaxPos = 0;

        // find the first negative zero crossing
        while (pos < (bufferSize - 1) / 3 && _nsdf[pos] > 0) {
            pos++;
        }

        // loop over all the values below zero
        while (pos < bufferSize - 1 && _nsdf[pos] <= 0) {
            pos++;
        }

        // can happen if output[0] is NAN
        if (pos === 0) {
            pos = 1;
        }

        while (pos < bufferSize - 1) {
            if ((_nsdf[pos] > _nsdf[pos - 1]) && (_nsdf[pos] >= _nsdf[pos + 1])) {
                if (curMaxPos === 0) {
                    // the first max (between zero crossings)
                    curMaxPos = pos;
                } else if (_nsdf[pos] > _nsdf[curMaxPos]) {
                    // a higher max (between the zero crossings)
                    curMaxPos = pos;
                }
            }
            pos++;
            // a negative zero crossing
            if ((pos < bufferSize - 1) && (_nsdf[pos] <= 0)) {
                // if there was a maximum add it to the list of maxima
                if (curMaxPos > 0) {
                    _maxPositions.push(curMaxPos);
                    curMaxPos = 0; // clear the maximum position, so we start looking for new ones
                }
                while ((pos < bufferSize - 1) && (_nsdf[pos] <= 0)) {
                    pos++; // loop over all the values below zero
                }
            }
        }
        if (curMaxPos > 0) { // if there was a maximum in the last part
            _maxPositions.push(curMaxPos); // add it to the vector of maxima
        }
    }

    /* start-test-code */
    this.__testonly__.peakPicking = peakPicking;
    /* end-test-code */

}

module.exports = MPM;