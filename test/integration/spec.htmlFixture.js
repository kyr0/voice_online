"use strict";

describe('', function() {

    beforeEach(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        window.close();
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/integration/fixtures/dummy.html'];
        }
    });

    it("should be able to access innerHTML", function () {
        expect(document.body.innerHTML).to.exist;
    });

    it("should be able to use sinon methods", function () {
        function once(fn) {
            var returnValue, called = false;
            return function () {
                if (!called) {
                    called = true;
                    returnValue = fn.apply(this, arguments);
                }
                return returnValue;
            };
        }

        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();

        expect(callback.called).to.be.true;
    });

});
