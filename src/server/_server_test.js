/**
 * Created by jaboing on 2015-07-26.
 */
"use strict";

var server = require("./server.js");

exports.testNothing = function(test) {
    test.equals(3, server.number(),"Test the number on server.js is = 3");
    test.done();
}