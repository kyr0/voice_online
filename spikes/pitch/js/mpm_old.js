/*
 * Implementation of Mcleod Pitch Method (MPM)
 *
 * Based on this article:
 * http://miracle.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf
 *
 * Converted from java->to->javascript from this project:
 * https://github.com/sevagh/Pitcha/blob/master/app/src/main/java/com/sevag/pitcha/dsp/MPM.java
 *
 *  Worth checking out this article if latency turns out to be an issue:
 *  https://courses.physics.illinois.edu/phys406/NSF_REU_Reports/2005_reu/Real-Time_Time-Domain_Pitch_Tracking_Using_Wavelets.pdf
 */

function MPM (audioSampleRate, audioBufferSize, cutoffMPM) {

	var DEFAULT_BUFFER_SIZE = 1024;
	var DEFAULT_CUTOFF = 0.97;
	var SMALL_CUTOFF = 0.5;
	var LOWER_PITCH_CUTOFF = 80.0; // Hz
	var cutoff;
	var sampleRate;
	var nsdf;  // normalized square difference
	var bufferSize;
	var turningPointX;
	var turningPointY;
	var maxPositions = [];
	var periodEstimates = [];
	var ampEstimates = [];

	sampleRate = audioSampleRate;
	bufferSize = typeof audioBufferSize !== 'undefined' ? audioBufferSize : DEFAULT_BUFFER_SIZE;
	cutoff = typeof cutoffMPM !== 'undefined' ? cutoffMPM : DEFAULT_CUTOFF;
	nsdf = new Array(bufferSize);

	/* start-test-code */
	this.__testonly__ = {
		sampleRate : sampleRate,
		bufferSize : bufferSize,
		cutoff : cutoff,
		DEFAULT_CUTOFF : DEFAULT_CUTOFF,
		DEFAULT_BUFFER_SIZE : DEFAULT_BUFFER_SIZE,
		nsdfLength : nsdf.length
	};
	/* end-test-code */

	var normalizedSquareDifference = function (audioBuffer) {
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
	};

	/* start-test-code */
	this.__testonly__.normalizedSquareDifference = normalizedSquareDifference;
	this.__testonly__.nsdf = nsdf;
	/* end-test-code */

}

MPM.prototype.getPitch = function(audioBuffer) {   // double array
	var pitch;

	// Clear previous results (this is faster than setting length to 0)
	// http://www.2ality.com/2012/12/clear-array.html
	maxPositions = [];
	periodEstimates = [];
	ampEstimates = [];

	//// 1. Calculate the normalized square difference for each Tau value.
	//normalizedSquareDifference(audioBuffer);
	//// 2. Peak picking time: time to pick some peaks.
	//peakPicking();
    //
	//double highestAmplitude = Double.NEGATIVE_INFINITY;
    //
	//for (final Integer tau : maxPositions) {
	//	// make sure every annotation has a probability attached
	//	highestAmplitude = Math.max(highestAmplitude, nsdf[tau]);
    //
	//	if (nsdf[tau] > SMALL_CUTOFF) {
	//		// calculates turningPointX and Y
	//		parabolicInterpolation(tau);
	//		// store the turning points
	//		ampEstimates.add(turningPointY);
	//		periodEstimates.add(turningPointX);
	//		// remember the highest amplitude
	//		highestAmplitude = Math.max(highestAmplitude, turningPointY);
	//	}
	//}
    //
	//if (periodEstimates.isEmpty()) {
	//	pitch = -1;
	//} else {
	//	// use the overall maximum to calculate a cutoff.
	//	// The cutoff value is based on the highest value and a relative
	//	// threshold.
	//	final double actualCutoff = cutoff * highestAmplitude;
    //
	//	// find first period above or equal to cutoff
	//	int periodIndex = 0;
	//	for (int i = 0; i < ampEstimates.size(); i++) {
	//		if (ampEstimates.get(i) >= actualCutoff) {
	//			periodIndex = i;
	//			break;
	//		}
	//	}
    //
	//	final double period = periodEstimates.get(periodIndex);
	//	final double pitchEstimate = (double) (sampleRate / period);
	//	if (pitchEstimate > LOWER_PITCH_CUTOFF) {
	//		pitch = pitchEstimate;
	//	} else {
	//		pitch = -1;
	//	}
    //
	//}
	//return pitch;
};

module.exports = MPM;

/*

//MPM.prototype.getPitchFromShort = function (data) { // data is an array of type short
//	var doubleData = new Array(data.length);
//	var maxshort = 0;
//	for (var i = 0; i < data.length; i++) {
//		if (data[i] > maxshort) {
//			maxshort = data[i];
//		}
//	}
//
//	for (var j = 0; j < data.length; j++) {
//		doubleData[j] = (double) ((double) data[j] * (double) Integer.MAX_VALUE / (double) maxshort);  // ?? No F'ing Idea
//	}
//	return getPitch(doubleData);
//};






	private void parabolicInterpolation(final int tau) {
		final double nsdfa = nsdf[tau - 1];
		final double nsdfb = nsdf[tau];
		final double nsdfc = nsdf[tau + 1];
		final double bValue = tau;
		final double bottom = nsdfc + nsdfa - 2 * nsdfb;
		if (bottom == 0.0) {
			turningPointX = bValue;
			turningPointY = nsdfb;
		} else {
			final double delta = nsdfa - nsdfc;
			turningPointX = bValue + delta / (2 * bottom);
			turningPointY = nsdfb - delta * delta / (8 * bottom);
		}
	}

	private void peakPicking() {

		int pos = 0;
		int curMaxPos = 0;

		// find the first negative zero crossing
		while (pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0) {
			pos++;
		}

		// loop over all the values below zero
		while (pos < nsdf.length - 1 && nsdf[pos] <= 0.0) {
			pos++;
		}

		// can happen if output[0] is NAN
		if (pos == 0) {
			pos = 1;
		}

		while (pos < nsdf.length - 1) {
			assert nsdf[pos] >= 0;
			if (nsdf[pos] > nsdf[pos - 1] && nsdf[pos] >= nsdf[pos + 1]) {
				if (curMaxPos == 0) {
					// the first max (between zero crossings)
					curMaxPos = pos;
				} else if (nsdf[pos] > nsdf[curMaxPos]) {
					// a higher max (between the zero crossings)
					curMaxPos = pos;
				}
			}
			pos++;
			// a negative zero crossing
			if (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
				// if there was a maximum add it to the list of maxima
				if (curMaxPos > 0) {
					maxPositions.add(curMaxPos);
					curMaxPos = 0; // clear the maximum position, so we start
					// looking for a new ones
				}
				while (pos < nsdf.length - 1 && nsdf[pos] <= 0.0f) {
					pos++; // loop over all the values below zero
				}
			}
		}
		if (curMaxPos > 0) { // if there was a maximum in the last part
			maxPositions.add(curMaxPos); // add it to the vector of maxima
		}
	}

}
 //*/