/**
 * Created by jaboing on 2015-07-31.
 */
"use strict";

var assert = require("assert");
var 

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});