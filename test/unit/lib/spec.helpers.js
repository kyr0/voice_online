'use strict';

var helpers = require('../../../src/client/js/lib/helpers.js');

describe('helpers.js', function() {

    beforeEach(function () {
        this.passedCookies = 'tabstyle=raw-tab; csrftoken=a_cookie';
    });


    describe('getCookie', function() {

        it('should return the value of a cookie', function () {
            expect(helpers.getCookie('csrftoken', this.passedCookies)).to.equal('a_cookie');
        });


        it('should return null when cookie not found', function () {
            expect(helpers.getCookie('dummy', this.passedCookies)).to.be.null;
        });
    });


    describe('_csrfSafeMethod', function() {

        it('should return false if method not in list', function () {
            expect(helpers._csrfSafeMethod('dummy_method')).to.be.false;
        });

        it('should return true if method not in list', function () {
            expect(helpers._csrfSafeMethod('get')).to.be.true;
        });
    });


    describe('_addTokenToAxiosHeader', function() {

        it('should have headers undefined acceptable request method', function () {
            expect(helpers._addTokenToAxiosHeader(
                {method: 'get'}, this.passedCookies).headers).to.be.undefined;
        });

        it('should add token to authorization request method header', function () {
            var expectedResult = {'X-CSRFToken': 'a_cookie'};
            var config = {method: 'put'};
            expect(helpers._addTokenToAxiosHeader(config, this.passedCookies).headers).to.eql(expectedResult);
        });
    });

});
