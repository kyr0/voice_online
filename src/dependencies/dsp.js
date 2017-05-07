/* 
 *  DSP.js - a comprehensive digital signal processing  library for javascript
 * 
 *  Created by Corban Brook <corbanbrook@gmail.com> on 2010-01-01.
 *  Copyright 2010 Corban Brook. All rights reserved.
 *
 */

/**
 * RFFT is a class for calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 *
 * This method currently only contains a forward transform but is highly optimized.
 *
 * @param {Number} bufferSize The size of the sample buffer to be computed. Must be power of 2
 *
 * @constructor
 */

// lookup tables don't really gain us any speed, but they do increase
// cache footprint, so don't use them in here

// also we don't use separate arrays for real/imaginary parts

// this one a little more than twice as fast as the one in FFT
// however I only did the forward transform

// the rest of this was translated from C, see http://www.jjj.de/fxt/
// this is the real split radix FFT

function RFFT(bufferSize) {
  this.bufferSize = bufferSize;
  this.spectrum   = new Float32Array(bufferSize/2);
  this.trans = new Float32Array(bufferSize);
  this.reverseTable = new Uint32Array(bufferSize);

  // don't use a lookup table to do the permute, use this instead
  this.reverseBinPermute = function (dest, source) {
    var bufferSize  = this.bufferSize, 
        halfSize    = bufferSize >>> 1, 
        nm1         = bufferSize - 1, 
        i = 1, r = 0, h;

    dest[0] = source[0];

    do {
      r += halfSize;
      dest[i] = source[r];
      dest[r] = source[i];
      
      i++;

      h = halfSize << 1;
      while (h = h >> 1, !((r ^= h) & h));

      if (r >= i) { 
        dest[i]     = source[r]; 
        dest[r]     = source[i];

        dest[nm1-i] = source[nm1-r]; 
        dest[nm1-r] = source[nm1-i];
      }
      i++;
    } while (i < halfSize);
    dest[nm1] = source[nm1];
  };

  this.generateReverseTable = function () {
    var bufferSize  = this.bufferSize, 
        halfSize    = bufferSize >>> 1, 
        nm1         = bufferSize - 1, 
        i = 1, r = 0, h;

    this.reverseTable[0] = 0;

    do {
      r += halfSize;
      
      this.reverseTable[i] = r;
      this.reverseTable[r] = i;

      i++;

      h = halfSize << 1;
      while (h = h >> 1, !((r ^= h) & h));

      if (r >= i) { 
        this.reverseTable[i] = r;
        this.reverseTable[r] = i;

        this.reverseTable[nm1-i] = nm1-r;
        this.reverseTable[nm1-r] = nm1-i;
      }
      i++;
    } while (i < halfSize);

    this.reverseTable[nm1] = nm1;
  };

  this.generateReverseTable();
}


// Ordering of output:
//
// trans[0]     = re[0] (==zero frequency, purely real)
// trans[1]     = re[1]
//             ...
// trans[n/2-1] = re[n/2-1]
// trans[n/2]   = re[n/2]    (==nyquist frequency, purely real)
//
// trans[n/2+1] = im[n/2-1]
// trans[n/2+2] = im[n/2-2]
//             ...
// trans[n-1]   = im[1] 

RFFT.prototype.forward = function(buffer) {
  var n         = this.bufferSize,
      spectrum  = this.spectrum,
      x         = this.trans,
      TWO_PI    = 2*Math.PI,
      sqrt      = Math.sqrt,
      i         = n >>> 1,
      bSi       = 2 / n,
      n2, n4, n8, nn,
      t1, t2, t3, t4,
      i1, i2, i3, i4, i5, i6, i7, i8,
      st1, cc1, ss1, cc3, ss3,
      e,
      a,
      rval, ival, mag;

  this.reverseBinPermute(x, buffer);

  /*
  var reverseTable = this.reverseTable;

  for (var k = 0, len = reverseTable.length; k < len; k++) {
    x[k] = buffer[reverseTable[k]];
  }
  */

  for (var ix = 0, id = 4; ix < n; id *= 4) {
    for (var i0 = ix; i0 < n; i0 += id) {
      //sumdiff(x[i0], x[i0+1]); // {a, b}  <--| {a+b, a-b}
      st1 = x[i0] - x[i0+1];
      x[i0] += x[i0+1];
      x[i0+1] = st1;
    } 
    ix = 2*(id-1);
  }

  n2 = 2;
  nn = n >>> 1;

  while((nn = nn >>> 1)) {
    ix = 0;
    n2 = n2 << 1;
    id = n2 << 1;
    n4 = n2 >>> 2;
    n8 = n2 >>> 3;
    do {
      if(n4 !== 1) {
        for(i0 = ix; i0 < n; i0 += id) {
          i1 = i0;
          i2 = i1 + n4;
          i3 = i2 + n4;
          i4 = i3 + n4;
     
          //diffsum3_r(x[i3], x[i4], t1); // {a, b, s} <--| {a, b-a, a+b}
          t1 = x[i3] + x[i4];
          x[i4] -= x[i3];
          //sumdiff3(x[i1], t1, x[i3]);   // {a, b, d} <--| {a+b, b, a-b}
          x[i3] = x[i1] - t1; 
          x[i1] += t1;
     
          i1 += n8;
          i2 += n8;
          i3 += n8;
          i4 += n8;
         
          //sumdiff(x[i3], x[i4], t1, t2); // {s, d}  <--| {a+b, a-b}
          t1 = x[i3] + x[i4];
          t2 = x[i3] - x[i4];
         
          t1 = -t1 * Math.SQRT1_2;
          t2 *= Math.SQRT1_2;
     
          // sumdiff(t1, x[i2], x[i4], x[i3]); // {s, d}  <--| {a+b, a-b}
          st1 = x[i2];
          x[i4] = t1 + st1; 
          x[i3] = t1 - st1;
          
          //sumdiff3(x[i1], t2, x[i2]); // {a, b, d} <--| {a+b, b, a-b}
          x[i2] = x[i1] - t2;
          x[i1] += t2;
        }
      } else {
        for(i0 = ix; i0 < n; i0 += id) {
          i1 = i0;
          i2 = i1 + n4;
          i3 = i2 + n4;
          i4 = i3 + n4;
     
          //diffsum3_r(x[i3], x[i4], t1); // {a, b, s} <--| {a, b-a, a+b}
          t1 = x[i3] + x[i4]; 
          x[i4] -= x[i3];
          
          //sumdiff3(x[i1], t1, x[i3]);   // {a, b, d} <--| {a+b, b, a-b}
          x[i3] = x[i1] - t1; 
          x[i1] += t1;
        }
      }
   
      ix = (id << 1) - n2;
      id = id << 2;
    } while (ix < n);
 
    e = TWO_PI / n2;

    for (var j = 1; j < n8; j++) {
      a = j * e;
      ss1 = Math.sin(a);
      cc1 = Math.cos(a);

      //ss3 = sin(3*a); cc3 = cos(3*a);
      cc3 = 4*cc1*(cc1*cc1-0.75);
      ss3 = 4*ss1*(0.75-ss1*ss1);
   
      ix = 0; id = n2 << 1;
      do {
        for (i0 = ix; i0 < n; i0 += id) {
          i1 = i0 + j;
          i2 = i1 + n4;
          i3 = i2 + n4;
          i4 = i3 + n4;
       
          i5 = i0 + n4 - j;
          i6 = i5 + n4;
          i7 = i6 + n4;
          i8 = i7 + n4;
       
          //cmult(c, s, x, y, &u, &v)
          //cmult(cc1, ss1, x[i7], x[i3], t2, t1); // {u,v} <--| {x*c-y*s, x*s+y*c}
          t2 = x[i7]*cc1 - x[i3]*ss1; 
          t1 = x[i7]*ss1 + x[i3]*cc1;
          
          //cmult(cc3, ss3, x[i8], x[i4], t4, t3);
          t4 = x[i8]*cc3 - x[i4]*ss3; 
          t3 = x[i8]*ss3 + x[i4]*cc3;
       
          //sumdiff(t2, t4);   // {a, b} <--| {a+b, a-b}
          st1 = t2 - t4;
          t2 += t4;
          t4 = st1;
          
          //sumdiff(t2, x[i6], x[i8], x[i3]); // {s, d}  <--| {a+b, a-b}
          //st1 = x[i6]; x[i8] = t2 + st1; x[i3] = t2 - st1;
          x[i8] = t2 + x[i6]; 
          x[i3] = t2 - x[i6];
         
          //sumdiff_r(t1, t3); // {a, b} <--| {a+b, b-a}
          st1 = t3 - t1;
          t1 += t3;
          t3 = st1;
          
          //sumdiff(t3, x[i2], x[i4], x[i7]); // {s, d}  <--| {a+b, a-b}
          //st1 = x[i2]; x[i4] = t3 + st1; x[i7] = t3 - st1;
          x[i4] = t3 + x[i2]; 
          x[i7] = t3 - x[i2];
         
          //sumdiff3(x[i1], t1, x[i6]);   // {a, b, d} <--| {a+b, b, a-b}
          x[i6] = x[i1] - t1; 
          x[i1] += t1;
          
          //diffsum3_r(t4, x[i5], x[i2]); // {a, b, s} <--| {a, b-a, a+b}
          x[i2] = t4 + x[i5]; 
          x[i5] -= t4;
        }
     
        ix = (id << 1) - n2;
        id = id << 2;
   
      } while (ix < n);
    }
  }

  while (--i) {
    rval = x[i];
    ival = x[n-i-1];
    mag = bSi * sqrt(rval * rval + ival * ival);
    spectrum[i] = mag;
  }

  spectrum[0] = bSi * x[0];

  return spectrum;
};


function IRFFT(hcBuff) {
    let n           = hcBuff.size,
        n2          = 2 * n,
        realData    = new Float32Array(n2),
        m           = Math.log(n) / Math.log(2), // N=2^M
        e           = 6.283185307179586 / n2,
        j           = 1,  // j = 2 to start in FORTRAN, 1 here
        k,
        n4, n8,
        is, id, i1, i2,
        x1, x2, x3, x4,
        t1, t2, t3, t4, t5,
        ss1, ss3, sd1, sd3,
        cc1, cc3, cd1, cd3,
        jn;

    realData.set(hcBuff);  // copy half-complex data in then work 'in-place'

    for (k = 0; k < m; k++) {
        n2 /= 2;
        n4 = n2 / 4;
        irStage();

        function irStage() {
            x1 = 0;
            x2 = n4;
            x3 = n4 * 2;
            x4 = n4 * 3;

            n8 = n4 / 2;
            is = 0;
            id = 2 * n2;

            do {
                for (i1 = is; i1 < n; i1 += id) {
                    t1 = realData[x1 + i1] - realData[x3 + i1];
                    realData[x1 + i1] = realData[x1 + i1] + realData[x3 + i1];
                    realData[x2 + i1] = 2 * realData[x2 + i1];
                    t2 = 2 * realData[x4 + i1];
                    realData[x4 + i1] = t1 + t2;
                    realData[x3 + i1] = t1 - t2;
                }

                is = 2 * id - n2;
                id = 4 * id;

            } while (is < n);


            if (n4 - 1 <= 0) {
                return;
            }
            is = 0;
            id = 2 * n2;
            do {
                // 40  DO  50 I1 = IS+1+N8,N,ID
                for (i1 = is + n8; i1 < n; i1 += id) {
                    // T1    = (X2(I1) - X1(I1))*1.4142135623730950488
                    t1 = (realData[x2 + i1] - realData[x1 + i1]) * 1.4142135623730950488;
                    // T2    = (X4(I1) + X3(I1))*1.4142135623730950488
                    t2 = (realData[x4 + i1] + realData[x3 + i1]) * 1.4142135623730950488;
                    // X1(I1) = X1(I1) + X2(I1)
                    realData[x1 + i1] += realData[x2 + i1];
                    // X2(I1) = X4(I1) - X3(I1)
                    realData[x2 + i1] = realData[x4 + i1] - realData[x3 + i1];
                    // X3(I1) = -T2-T1
                    realData[x3 + i1] = 0 - t2 - t1;
                    // X4(I1) = -T2+T1
                    realData[x4 + i1] = 0 - t2 + t1;
                }
                // IS = 2*ID - N2
                is = 2 * id - n2;
                // ID = 4*ID
                id = 4 * id;
            } while (is < n - 1); // IF (IS .LT. N-1) GOTO 40


            if (n8 - 1 <= 0) {
                return;
            }
            ss1 = Math.sin(e);
            sd1 = ss1;
            sd3 = 3 * sd1 - 4 * Math.pow(sd1, 3);
            ss3 = sd3;
            cc1 = Math.cos(e);
            cd1 = cc1;
            cd3 = 4 * Math.pow(cd1, 3) - 3 * cd1;
            cc3 = cd3;

            do {
                is = 0;
                id = 2 * n2;
                jn = n4 - 2 * j + 2; // TODO might be some index issues in here

                do {
                    // 70  DO  80 I1=IS+J,N,ID
                    i1 = is + j;
                    do {
                        i2 = i1 + jn;
                        // T1     = X1(I1) - X2(I2)
                        t1 = realData[x1 + i1] - realData[x2 + i2];
                        // X1(I1) = X1(I1) + X2(I2)
                        realData[x1 + i1] = realData[x1 + i1] + realData[x2 + i2];
                        // T2     = X1(I2) - X2(I1)
                        t2 = realData[x1 + i2] - realData[x2 + i1];
                        // X1(I2) = X2(I1) + X1(I2)
                        realData[x1 + i2] = realData[x2 + i1] + realData[x1 + i2];
                        // T3     = X4(I2) + X3(I1)
                        t3 = realData[x4 + i2] + realData[x3 + i1];
                        // X2(I2) = X4(I2) - X3(I1)
                        realData[x2 + i2] = realData[x4 + i2] - realData[x3 + i1];
                        // T4     = X4(I1) + X3(I2)
                        t4 = realData[x4 + i1] + realData[x3 + i2];
                        // X2(I1) = X4(I1) - X3(I2)
                        realData[x2 + i1] = realData[x4 + i1] - realData[x3 + i2];
                        // T5 = T1 - T4
                        // T1 = T1 + T4
                        // T4 = T2 - T3
                        // T2 = T2 + T3
                        t5 = t1 - t4;
                        t1 = t1 + t4;
                        t4 = t2 - t3;
                        t2 = t2 + t3;
                        // X3(I1) =  T5*CC1 + T4*SS1
                        realData[x3 + i1] = t5 * cc1 + t4 * ss1;
                        // X3(I2) = -T4*CC1 + T5*SS1
                        realData[x3 + i2] = t5 * ss1 - t4 * cc1;
                        // X4(I1) =  T1*CC3 - T2*SS3
                        realData[x4 + i1] = t1 * cc3 - t2 * ss3;
                        // X4(I2) =  T2*CC3 + T1*SS3
                        realData[x4 + i2] = t2 * cc3 + t1 * ss3;

                        i1 += id;
                    } while (i1 < n);
                    // IS = 2*ID - N2
                    is = 2 * id - n2;
                    // ID = 4*ID
                    id = 4 * id;
                } while (is < n); // IF (IS .LT. N) GOTO 70

                // T1  = CC1*CD1 - SS1*SD1
                t1  = cc1 * cd1 - ss1 * sd1;
                // SS1 = CC1*SD1 + SS1*CD1
                ss1 = cc1 * sd1 + ss1 * cd1;
                // CC1 = T1
                cc1 = t1;
                // T3  = CC3*CD3 - SS3*SD3
                t3 = cc3 * cd3 - ss3 * sd3;
                // SS3 = CC3*SD3 + SS3*CD3
                ss3 = cc3 * sd3 + ss3 * cd3;
                // CC3 = T3
                cc3 = t3;
                j++;
            } while (j <= n8)
        }
    }

}

module.exports = RFFT;
