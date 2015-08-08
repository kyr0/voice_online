/*
 * "Implementation of MPM adapted from the Tarsos DSP project."
 *
 * Based on this article:
 * http://miracle.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf
 *
 * Converted from java->to->javascript from this project:
 * https://github.com/sevagh/Pitcha/blob/master/app/src/main/java/com/sevag/pitcha/dsp/MPM.java
 */

module.exports = MPM;

function MPM (audioSampleRate, audioBufferSize, cutoffMPM) {

	var DEFAULT_BUFFER_SIZE = 1024; // public int
	var DEFAULT_CUTOFF = 0.97; // private double
	var SMALL_CUTOFF = 0.5;
	var LOWER_PITCH_CUTOFF = 80.0; // Hz
	var cutoff;
	var sampleRate;
	var nsdf = [];
	var bufferSize;
	var turningPointX;
	var turningPointY;
	var maxPositions = [];
	var periodEstimates = [];
	var ampEstimates = [];

	sampleRate = audioSampleRate;
	bufferSize = audioBufferSize !== 'undefined' ? audioBufferSize : DEFAULT_BUFFER_SIZE;
	cutoff = cutoffMPM !== 'undefined' ? cutoffMPM : DEFAULT_CUTOFF;

}

/*
	private void normalizedSquareDifference(final double[] audioBuffer) {
		for (int tau = 0; tau < audioBuffer.length; tau++) {
			double acf = 0;
			double divisorM = 0;
			for (int i = 0; i < audioBuffer.length - tau; i++) {
				acf += audioBuffer[i] * audioBuffer[i + tau];
				divisorM += audioBuffer[i] * audioBuffer[i] + audioBuffer[i + tau] * audioBuffer[i + tau];
			}
			nsdf[tau] = 2 * acf / divisorM;
		}
	}

	public double getPitchFromShort(final short[] data) {
		double[] doubleData = new double[data.length];

		short maxshort = 0;
		for (int i = 0; i < data.length; i++) {
			if (data[i] > maxshort) {
				maxshort = data[i];
			}
		}

		for (int i = 0; i < data.length; i++) {
			doubleData[i] = (double) ((double) data[i] * (double) Integer.MAX_VALUE / (double) maxshort);
		}
		return getPitch(doubleData);
	}

	public double getPitch(final double[] audioBuffer) {
		final double pitch;

		// 0. Clear previous results (Is this faster than initializing a list
		// again and again?)
		maxPositions.clear();
		periodEstimates.clear();
		ampEstimates.clear();

		// 1. Calculate the normalized square difference for each Tau value.
		normalizedSquareDifference(audioBuffer);
		// 2. Peak picking time: time to pick some peaks.
		peakPicking();

		double highestAmplitude = Double.NEGATIVE_INFINITY;

		for (final Integer tau : maxPositions) {
			// make sure every annotation has a probability attached
			highestAmplitude = Math.max(highestAmplitude, nsdf[tau]);

			if (nsdf[tau] > SMALL_CUTOFF) {
				// calculates turningPointX and Y
				prabolicInterpolation(tau);
				// store the turning points
				ampEstimates.add(turningPointY);
				periodEstimates.add(turningPointX);
				// remember the highest amplitude
				highestAmplitude = Math.max(highestAmplitude, turningPointY);
			}
		}

		if (periodEstimates.isEmpty()) {
			pitch = -1;
		} else {
			// use the overall maximum to calculate a cutoff.
			// The cutoff value is based on the highest value and a relative
			// threshold.
			final double actualCutoff = cutoff * highestAmplitude;

			// find first period above or equal to cutoff
			int periodIndex = 0;
			for (int i = 0; i < ampEstimates.size(); i++) {
				if (ampEstimates.get(i) >= actualCutoff) {
					periodIndex = i;
					break;
				}
			}

			final double period = periodEstimates.get(periodIndex);
			final double pitchEstimate = (double) (sampleRate / period);
			if (pitchEstimate > LOWER_PITCH_CUTOFF) {
				pitch = pitchEstimate;
			} else {
				pitch = -1;
			}

		}
		return pitch;
	}

	private void prabolicInterpolation(final int tau) {
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