/*
 *  Adapted from the TarsosDsP Java library for use in Javascript
 *
 *  Info: http://0110.be/tag/TarsosDSP
 *  Github: https://github.com/JorenSix/TarsosDSP
 *
 * A class with information about the result of a pitch detection on a block of
 * audio.
 *
 * It contains:
 *
 * - The pitch in Hertz.
 *
 * - A probability (noisiness, (a)periodicity, salience, voicedness or clarity
 * measure) for the detected pitch. This is somewhat similar to the term voiced
 * which is used in speech recognition. This probability is calculated
 * together with the pitch. The exact meaning of the value depends on MPM method used
 * and requires further research.
 *
 * - A boolean that indicates if the algorithm thinks the signal is pitched
 *
 * The separate pitched or unpitched boolean can coexist with a defined pitch.
 * E.g. if the algorithm detects 220Hz in a noisy signal it may respond with
 * 220Hz "unpitched".
 *
 * For performance reasons it's best if the object is reused. Please create a copy of the object
 * if you want to use it on an other thread.
 */

function PitchDetectionResult () {


    var _pitch = -1; // The pitch in Hertz.
    var _probability = -1;
    var _pitched = false;

    // Return the pitch in Hertz.
    this.getPitchFrequency = function () {
        return _pitch;
    };

    // Set the pitch in Hertz
    this.setPitch = function(new_pitch) {
        if ((new_pitch !== -1 && new_pitch < 0) || (typeof new_pitch !== "number")) {
            throw new Error("setPitch(): not a valid pitch setting, was: " + new_pitch);
        }
        _pitch = new_pitch;
    };

    // is calculated along with MPM,
    //   need to experiment on live sounds to understand its exact function
    this.getProbability = function() {
        return _probability;
    };

    this.setProbability = function (new_prob) {
        if (typeof new_prob !== "number") {
            throw new Error("setProbability(): not a valid setting, was: " + new_prob);
        }
        _probability = new_prob;
    };

    /**
     *  Returns whether the algorithm thinks the block of audio is pitched. Keep
     *   in mind that an algorithm can come up with a best guess for a
     *   pitch even when isPitched() is false.
     */
    this.isPitched = function() {
        return _pitched;
    };

    this.setIsPitched = function(new_IsPitched) {
        if (typeof new_IsPitched !== "boolean") {
            throw new Error("setIsPitched(): not a valid setting, was: " + new_IsPitched);
        }
        _pitched = new_IsPitched;
    };

    // if someone is evaluating carelessly should be a number
    this.valueOf = function(){
        return this.getPitchFrequency();
    };
}

module.exports = PitchDetectionResult;