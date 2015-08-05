// spec.js
"use strict";

beforeEach(function() {
    isAngularSite(false);
});

describe('Context Key Page', function() {
    it('should have a title', function() {
        browser.get('http://localhost:9000/index.html');
        expect(browser.getTitle()).toEqual('Context Key');
    });
    //done();
});