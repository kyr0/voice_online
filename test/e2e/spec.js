/**
 * Created by jaboing on 2015-08-03.
 */

describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('./src/browser/index.html');

        expect(browser.getTitle()).toEqual('Context Key');
    });
});