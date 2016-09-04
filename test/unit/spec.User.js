"use strict";

var User = require("../../src/client/js/User.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('User Object', function() {

    it("should set top note properly", function () {
        var theUser = new User("A2", "F3");
        expect(theUser.topNote).to.equal("F3");
    });

    it("should set bottom note properly", function () {
        var theUser = new User("A2", "F3");
        expect(theUser.bottomNote).to.equal("A2");
    });

    it("should throw an error if range < 6", function () {
        var fn = function() {new User("A2", "B2")};
        expect(fn).to.throw(Error, /must be at least 6 semitones/);
    });

});
