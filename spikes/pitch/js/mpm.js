/*
 * Implementation of Mcleod Pitch Method (MPM)
 *
 * Based on this article:
 * http://miracle.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf
 *
 * Converted from java->to->javascript from this project:
 * Github: https://github.com/JorenSix/TarsosDSP
 *
 * Special thanks to Sevag for pointing it out and for bits of code (freq array):
 * https://github.com/sevagh/Pitcha/blob/master/app/src/main/java/com/sevag/pitcha/dsp/MPM.java
 *
 */

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
 * friendly, laggard time domain.
 */

function MPM (audioSampleRate, audioBufferSize, cutoffMPM) {

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
    var DEFAULT_CUTOFF = 0.97;

    // For performance reasons, peaks below small cutoff are not even considered.
    var SMALL_CUTOFF = 0.5;

    //Pitch annotations below this threshold are considered invalid and ignored.
    var LOWER_PITCH_CUTOFF = 54.0; // Hz

    // Defines the relative size that the chosen peak (pitch) has
    var cutoff;

    // The audio sample rate. Most audio has a sample rate of 44.1kHz.
    var sampleRate;

    //Contains a normalized square difference (NSDF) function value for each delay (tau)
    var nsdf;

    // The x and y coordinate of the top of the curve (nsdf)
    var turningPointX;
    var turningPointY;

    // A list with minimum and maximum values of the nsdf curve.
    var maxPositions = [];

    // A list of estimates of the period of the signal (in samples).
    var periodEstimates = [];

    //A list of estimates of the amplitudes corresponding with the period estimates.
    var ampEstimates = [];

    /**
     *  A probability (noisiness, (a)periodicity, salience, voicedness or
     *         clarity measure) for the detected pitch. This is somewhat similar
     *         to the term voiced which is used in speech recognition. This
     *         probability is calculated together with the pitch.
     */
    var probability;


    sampleRate = audioSampleRate;
    var bufferSize = typeof audioBufferSize !== 'undefined' ? audioBufferSize : this.DEFAULT_BUFFER_SIZE;
    cutoff = typeof cutoffMPM !== 'undefined' ? cutoffMPM : DEFAULT_CUTOFF;
    nsdf = new Array(bufferSize);

    /* start-test-code */
    this.__testonly__ = {
        sampleRate : sampleRate,
        bufferSize : bufferSize,
        cutoff : cutoff,
        DEFAULT_CUTOFF : DEFAULT_CUTOFF,
        DEFAULT_BUFFER_SIZE : this.DEFAULT_BUFFER_SIZE,
        nsdfLength : nsdf.length
    };
    /* end-test-code */


    /*
     * Implements the normalized square difference function. See section 4 (and
     * the explanation before) in the MPM article. This calculation can be
     * optimized by using an FFT. The results should remain the same.
     */
    function normalizedSquareDifference(audioBuffer) {
        //var makeNSDFLog = "";   // used to initially inspect behaviour and performance
        //var startTime = Date.now();
        for (var tau = 0; tau < audioBuffer.length; tau++) {
            var acf = 0;
            var divisorM = 0;
            for (var i = 0; i < audioBuffer.length - tau; i++) {
                acf += audioBuffer[i] * audioBuffer[i + tau];
                divisorM += audioBuffer[i] * audioBuffer[i] + audioBuffer[i + tau] * audioBuffer[i + tau];
            }
            nsdf[tau] = 2 * acf / divisorM;
            //makeNSDFLog += (nsdf[tau] + ", ");
        }
        //var elapsedTime = ((Date.now() - startTime));
        //console.log("Finished NSDF.\n Time elapsed (ms): " + elapsedTime + "\nNSDF Array length: " +
        //	nsdf.length + "\n" + makeNSDFLog);
    }

    /* start-test-code */
    this.__testonly__.nsdf = nsdf;
    this.__testonly__.normalizedSquareDifference = normalizedSquareDifference;
    /* end-test-code */

    this.getPitch = function(audioBuffer) {
        var pitch;

        // Clear previous results (this is faster than setting length to 0)
        // http://www.2ality.com/2012/12/clear-array.html
        maxPositions = [];
        periodEstimates = [];
        ampEstimates = [];

        // 1. Calculate the normalized square difference for each Tau value.
        normalizedSquareDifference(audioBuffer);
        // 2. Peak picking time: time to pick some peaks.
        peakPicking();

        var highestAmplitude = Number.NEGATIVE_INFINITY;

        var tau;
        for (var i = 0; i < maxPositions.length; i++) {
            tau = maxPositions[i];
            // make sure every annotation has a probability attached
            highestAmplitude = Math.max(highestAmplitude, nsdf[tau]);

            if (nsdf[tau] > SMALL_CUTOFF) {
                // calculates turningPointX and Y
                prabolicInterpolation(tau);
                // store the turning points
                ampEstimates.push(turningPointY);
                periodEstimates.push(turningPointX);
                // remember the highest amplitude
                highestAmplitude = Math.max(highestAmplitude, turningPointY);
            }
        }

        if (periodEstimates.length === 0) {
            pitch = -1;
        } else {
            // use the overall maximum to calculate a cutoff.
            // The cutoff value is based on the highest value and a relative
            // threshold.
            var actualCutoff = cutoff * highestAmplitude;

            // find first period above or equal to cutoff
            var periodIndex = 0;
            for (var j = 0; j < ampEstimates.length; j++) {
                if (ampEstimates[j] >= actualCutoff) {
                    periodIndex = j;
                    break;
                }
            }

            var period = periodEstimates[periodIndex];
            var pitchEstimate = sampleRate / period;
            if (pitchEstimate > LOWER_PITCH_CUTOFF) {
                pitch = pitchEstimate;
            } else {
                pitch = -1;
            }

        }

        //result.setProbability((float) highestAmplitude);
        //result.setPitch(pitch);
        //
        return pitch;

        /* start-test-code */
        module.exports.__testonly__.pitch = pitch;
        /* end-test-code */
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
    function prabolicInterpolation(tau) {
        var nsdfa = nsdf[tau - 1];
        var nsdfb = nsdf[tau];
        var nsdfc = nsdf[tau + 1];
        var bValue = tau;
        var bottom = nsdfc + nsdfa - 2 * nsdfb;
        if (bottom == 0) {
            turningPointX = bValue;
            turningPointY = nsdfb;
        } else {
            var delta = nsdfa - nsdfc;
            turningPointX = bValue + delta / (2 * bottom);
            turningPointY = nsdfb - delta * delta / (8 * bottom);
        }
        /* start-test-code */
        module.exports.__testonly__.turningPointX = turningPointX;
        module.exports.__testonly__.turningPointY = turningPointY;
        /* end-test-code */
    }

    /* start-test-code */
    this.__testonly__.prabolicInterpolation = prabolicInterpolation;
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
     * @param nsdf - The array to look for maximum values in. It should contain
     *   values between -1 and 1
     * @author Phillip McLeod
     */
    // note that if this method is malfunctioning it may be because I removed the '=' from
    //  the float comparisons due to inexplicable javascript behaviour in the error thrown
    function peakPicking() {

        var pos = 0;
        var curMaxPos = 0;

        // find the first negative zero crossing
        while (pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0) {
            pos++;
        }

        // loop over all the values below zero
        while (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
            pos++;
        }

        // can happen if output[0] is NAN
        if (pos === 0) {
            pos = 1;
        }

        while (pos < nsdf.length - 1) {
            if (!(nsdf[pos] >= 0)) {
                throw new Error("peakPicking(): NSDF value at index " + pos + " should be >= 0, was: " + nsdf[pos]);}
            if ((nsdf[pos] > nsdf[pos - 1]) && (nsdf[pos] >= nsdf[pos + 1])) {
                if (curMaxPos === 0) {
                    // the first max (between zero crossings)
                    curMaxPos = pos;
                } else if (nsdf[pos] > nsdf[curMaxPos]) {
                    // a higher max (between the zero crossings)
                    curMaxPos = pos;
                }
            }
            pos++;
            // a negative zero crossing
            if ((pos < nsdf.length - 1) && (nsdf[pos] <= 0)) {
                // if there was a maximum add it to the list of maxima
                if (curMaxPos > 0) {
                    maxPositions.push(curMaxPos);
                    curMaxPos = 0; // clear the maximum position, so we start looking for new ones
                }
                while ((pos < nsdf.length - 1) && (nsdf[pos] <= 0)) {
                    pos++; // loop over all the values below zero
                }
            }
        }
        if (curMaxPos > 0) { // if there was a maximum in the last part
            maxPositions.push(curMaxPos); // add it to the vector of maxima
        }
        module.exports.__testonly__ = { maxPositions : maxPositions };
    }

    /* start-test-code */
    this.__testonly__.peakPicking = peakPicking;
    /* end-test-code */


}

module.exports = MPM;