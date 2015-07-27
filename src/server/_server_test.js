/**
 * Created by jaboing on 2015-07-26.
 */
"use strict";

var server = require("./server.js");
var http = require("http");

exports.tearDown = function(done) {
    server.stop(function(){
        done();
    });
}

exports.testServerRespondsToGetRequests = function(test) {
    server.start();
    http.get("http://localhost:8080", function(response) {
        response.on("data", function(){});
        test.done();
    });
};

