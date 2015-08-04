// spec.js
describe('Context Key Page', function() {
    it('should have a title', function() {
        browser.get('http://localhost:3000/index.html');
        expect(browser.getTitle()).toEqual('Context Key');
    });
});