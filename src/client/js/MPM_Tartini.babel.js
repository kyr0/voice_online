// Going to need special case for first time through aka window filling

// Frames per chunk = step size, step size (aka num frames per step) is half the buffer size and the units are milliseconds
// a chunk is a step

// Tartini buffersize value of 48 (ms) converted to samples == (2116.8) 2048 nearest pow2, see getAnalysisBufferSize

// buffer might be synonymous with window, so buffer size could be == window size

// sampleRate: The desired sample rate (sample frames per second).

// n == window size aka buffer size
// k = (n + 1) / 2 ????
// "size" = n + k

import { RFFT } from 'fftw-js';

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI * 0.5;
const RATE = 44100;
const BUFFER_SIZE = 1024;
const STEP_SIZE = BUFFER_SIZE / 2;
const P_SIZE = BUFFER_SIZE + STEP_SIZE;
const DB_FLOOR = -150;
const DO_EQL_LOUD = true;

let baseFFT = new RFFT(BUFFER_SIZE);
let acFFT = new RFFT(P_SIZE);

let analysisData = [];
let prevAnalysisData = [];
let nsdfMaxPositions = []; // TODO set the default size
let dataTime = new Float32Array(BUFFER_SIZE);
let dataHann = new Float32Array(BUFFER_SIZE);
let dataFFT = new Float32Array(BUFFER_SIZE);
let fftData1 = new Float32Array(STEP_SIZE);
let fftData2 = new Float32Array(STEP_SIZE);
let autoCorrTime = new Float32Array(BUFFER_SIZE + STEP_SIZE);
let autoCorrFFT = new Float32Array(BUFFER_SIZE + STEP_SIZE);
let nsdfData = new Float32Array(STEP_SIZE);   // TODO triple check this length

let hanningCoeff = [];  // array of floats size 'n'

let sumOfSquares;
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
    // TODO buffer size assertion or param, atm it is assume to be same as BUFFER_SIZE
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

    // http://www.katjaas.nl/home/home.html  - interesting FFT walkthrough

    dataFFT = baseFFT.forward(dataHann);
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

    /////////////////
    // Do the NSDF //
    /////////////////
    autoCorrTime.set(dataHann);
    autoCorrFFT = acFFT.forward(autoCorrTime);  // TODO optimize this transfer so that autoCorrFFT is set inside the FFT

    //calculate the (real*real + ima*imag) for each coefficient
    //Note: The numbers are packed in half_complex form (refer fftw)
    //ie. R[0], R[1], R[2], ... R[size/2], I[(size+1)/2+1], ... I[3], I[2], I[1]
    for(let k = 1; k <  P_SIZE / 2; k++)
    {
        autoCorrFFT[k] = Math.pow(autoCorrFFT[k], 2) + Math.pow(autoCorrFFT[P_SIZE - k], 2);
        autoCorrFFT[P_SIZE - k] = 0;
    }
    autoCorrFFT[0] = Math.pow(autoCorrFFT[0], 2);
    autoCorrFFT[P_SIZE / 2] = Math.pow(autoCorrFFT[P_SIZE / 2], 2);

    autoCorrTime = acFFT.inverse(autoCorrFFT);  // TODO optimize this transfer so that autoCorrTime is set inside the FFT

    //extract the wanted elements out, and normalise --  see REPL https://repl.it/IWiH/19
    // for(float * p1 = output, *p2 = autocorrTime + 1; p1 < output + k;)
    // {
    // *p1++ = *p2++ / fsize;
    // }
    for (let l = 0; l < STEP_SIZE; l++) {
        nsdfData[l] = autoCorrTime[l + 1] / BUFFER_SIZE;
    }
    sumOfSquares = autoCorrTime[0] / BUFFER_SIZE;
    let totalSumOfSquares = sumOfSquares * 2;

    // This is the nsdf
    for (let m = 0; m < STEP_SIZE; m++) {
        totalSumOfSquares -= Math.pow(dataHann[BUFFER_SIZE - 1 - m], 2) + Math.pow(dataHann[m]);
        if(totalSumOfSquares > 0) {
            nsdfData[m] *= 2.0 / totalSumOfSquares;
        } else {
            nsdfData[m] = 0.0;
        }
    }
}
