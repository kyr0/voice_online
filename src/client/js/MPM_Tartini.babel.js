// Going to need special case for first time through aka window filling

// Frames per chunk = step size, step size (aka num frames per step) is half the buffer size and the units are milliseconds
// a chunk is a step

// Tartini buffersize value of 48 (ms) converted to samples == (2116.8) 2048 nearest pow2, see getAnalysisBufferSize

// buffer might be synonymous with window, so buffer size could be == window size

// sampleRate: The desired sample rate (sample frames per second).

// n == window size aka buffer size
// k = (n + 1) / 2 ????
// "size" = n + k

import RFFT from '../../dependencies/rfft.js';

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI * 0.5;
const RATE = 44100;
const BUFFER_SIZE = 1024;
const STEP_SIZE = BUFFER_SIZE / 2;
const DB_FLOOR = -150;
const DO_EQL_LOUD = true;

let fft = new RFFT(BUFFER_SIZE);

let analysisData = [];
let prevAnalysisData = [];
let nsdfMaxPositions = []; // TODO set the default size
let dataTime = new Float32Array(BUFFER_SIZE);
let dataHann = new Float32Array(BUFFER_SIZE);
let dataFFT = new Float32Array(BUFFER_SIZE);
let fftData1 = new Float32Array(STEP_SIZE);
let fftData2 = new Float32Array(STEP_SIZE);
let autoCorrData = new Float32Array(BUFFER_SIZE + STEP_SIZE);
let nsdfData = [];

    let hanningCoeff = [];  // array of floats size 'n'

let hanningScalar = 0;
let maxIntensityDB = 0;


let getAbsMaxElement = function (arr) {
    let len = arr.length;
    let max = -Infinity;  // or set (just)Infinity for min
    let x;
    let i = 0;
    while (i < len) {
        x = Math.abs(arr[len]);
        if (x > max) {  // or set < for min
            max = x;
        }
        i++;
    }
    return max;
};


let bound = function (value, lowerBound, upperBound) {
    //this way will deal with NAN, setting it to lowerBound
    if (value < lowerBound) return lowerBound;
    if (value > upperBound) return upperBound;
    return value;
};


let linearToDB = function (element) {
    if (element > 0) {
        return bound((Math.log10(element) * 20), DB_FLOOR, 0);
    }
    return DB_FLOOR;
};


export default function calculateAnalysisData(inputBuffer) {
    dataTime = inputBuffer;

    // TODO equal loudness bit

    maxIntensityDB = linearToDB(getAbsMaxElement(dataTime));  // TODO this inline


    /////////////////////////////////////////
    // Apply a Hanning Window to the input //
    /////////////////////////////////////////
    hanningScalar = 0;
    for (let i = 0; i < BUFFER_SIZE; i++) {
        hanningCoeff[i] = 0.5 * (1 - Math.cos(TWO_PI * i / (BUFFER_SIZE - 1)));
        dataHann[i] = dataTime[i] * hanningCoeff[i];
        hanningScalar += hanningCoeff[i];
    }
    hanningScalar *= 0.5; // Normalise the FFT coefficients by dividing the sum of the Hanning window / 2


    /////////////////////////////
    // Do the channel data FFT //
    /////////////////////////////
    dataFFT = fft.forward(dataHann);

    let logSize = Math.log10(STEP_SIZE);

    //Adjust the coefficients, both real and imaginary parts by same amount
    let sqValue;
    const logBase = 100;

    for (let j = 1; j < STEP_SIZE; j++) {  // zero index handled after for loop individually
        sqValue = Math.pow(dataFFT[j], 2) + Math.pow(dataFFT[BUFFER_SIZE - j], 2);
        fftData2[j] =  Math.log(1 + 2 * Math.sqrt(sqValue) / STEP_SIZE * (logBase - 1)) / Math.log(logBase);
        if (sqValue > 0) {
            fftData1[j] = Math.log10(sqValue) / 2 - logSize;
            if (fftData1[j] < DB_FLOOR) fftData1[j] = DB_FLOOR;
            if (fftData1[j] > 0) fftData1[j] = 0;
        } else {
            fftData1[j] = DB_FLOOR;
        }
    }

    sqValue = Math.pow(dataFFT[0], 2) + Math.pow(dataFFT[STEP_SIZE], 2);
    fftData2[0] = Math.log(1 + 2 * Math.sqrt(sqValue) / STEP_SIZE * (logBase - 1)) / Math.log(logBase);
    if (sqValue > 0) {
        fftData1[0] = Math.log10(sqValue) / 2 - logSize;
        if (fftData1[0] < DB_FLOOR) fftData1[0] = DB_FLOOR;
        if (fftData1[0] > 0) fftData1[0] = 0;
    } else {
        fftData1[0] = DB_FLOOR;
    }

}



