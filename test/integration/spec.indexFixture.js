"use strict";
describe('', function() {

    beforeEach(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/integration/fixtures/index.html'];
        }
    });

    it("should be able to access innerHTML", function () {
        expect(document.body.innerHTML).to.exist;
    });

});
