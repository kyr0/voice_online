// Going to need special case for first time through aka window filling

// Frames per chunk = step size, step size (aka num frames per step) is half the buffer size and the units are milliseconds
// a chunk is a step

// Tartini buffersize value of 48 (ms) converted to samples == (2116.8) 2048 nearest pow2, see getAnalysisBufferSize

// buffer might be synonymous with window, so buffer size could be == window size

// sampleRate: The desired sample rate (sample frames per second).

// n == window size aka buffer size
// k = (n + 1) / 2 ????
// "size" = n + k

const PI = 3.1415926535897932384;
const TWO_PI = 3.1415926535897932384 * 2.0;
const HALF_PI = 3.1415926535897932384 * 0.5;
const RATE = 44100;
const BUFFER_SIZE = 1024;
const STEP_SIZE = BUFFER_SIZE / 2;
const DB_FLOOR = -150;
const doEqualLoudness = true;

let analysisData = [];
let prevAnalysisData = [];
let nsdfMaxPositions = []; // TODO set the default size
let dataTime = [];  // array of floats size 'n'
let dataFFT = [];  // array of floats size 'n'
let hanningCoeff = [];  // array of floats size 'n'

let hanningScalar = 0;
let maxIntensityDB = 0;
let isFirstTimeThrough = true;


let init = function (curBuf, timeData, fftData) {
    //Initialize the hanningCoeff aka Hanning windowing function
    dataTime = timeData;
    dataFFT = fftData;
    hanningScalar = 0;
    for (let j = 0; j < BUFFER_SIZE; j++) {
        hanningCoeff[j] = (1.0 - Math.cos(j + 1) / (BUFFER_SIZE + 1) * TWO_PI) / 2.0;
        hanningScalar += hanningCoeff[j];
    }
    // Normalise the FFT coefficients by dividing the sum of the Hanning window / 2
    hanningScalar /= 2;
};


let applyHanningWindow = function (dataArr) {
    for (let j = 0; j < BUFFER_SIZE; j++) {
        dataArr[j] *= hanningCoeff[j];
    }
};


let getAbsMaxElement = function (arr) {
    let len = arr.length;
    let max = -Infinity;  // or set (just)Infinity for min
    let x;
    while (len--) {
        x = Math.abs(arr[len]);
        if (x > max) {  // or set < for min
            max = x;
        }
    }
    return max;
};


let bound = function (value, lowerBound, upperBound) {
    //this way will deal with NAN, setting it to lowerBound
    if(value < lowerBound) return lowerBound;
    if(value > upperBound) return upperBound;
    return value;
};


let linearToDB = function (value) {
    if (value > 0) {
        return bound((Math.log10(value) * 20), DB_FLOOR, 0);
    }
    return DB_FLOOR;
};


let doChannelDataFFT = function () {
    applyHanningWindow(dataTime);

};


export function calculateAnalysisData(input) {
    maxIntensityDB = linearToDB(getAbsMaxElement(input));
}
