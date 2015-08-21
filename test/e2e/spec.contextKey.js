// spec.js
"use strict";

var indexPage = require("./pageObjects/ContextKeyPage");

beforeEach(function() {
    isAngularSite(false);
});

describe('Context Key Page', function() {
    var contextKeyPage = new indexPage();

    it('should have a title', function() {
        contextKeyPage.visitPage();
        expect(contextKeyPage.getTitle()).toEqual('Context Key');
    });

    it('should create innerHTML with lists given a contextKey', function(){
        contextKeyPage.visitPage();
        contextKeyPage.fillKeyInput('["content.landingpages.podcasts"]');
        contextKeyPage.submit();
        var expectedHTML = "<br><br><br><br><ul><br><br><li>content" +
            "<br><br><ul><br><br><li>landingpages" +
            "<br><br><ul><br><br><li>podcasts" +
            "</li><br><br></ul><br><br></li><br><br></ul><br><br>" +
            "</li><br><br></ul><br><br><br><br>";
        expect(contextKeyPage.getDivHTML()).toEqual(expectedHTML);
    });

});