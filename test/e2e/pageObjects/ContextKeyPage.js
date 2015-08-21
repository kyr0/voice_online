/**
 * Created by jaboing on 2015-08-03.
 */
"use strict";

// TODO: setup configs so that we don't need to hard code the base URL in page objects

require("protractor");

var ContextKeyPage = function () {
    var submitButton = element(By.id("submitButton"));
    var keyInput = element(By.id("contextKeyInput"));
    var list = element(By.id("list"));

    this.visitPage = function () {
        browser.get("http://localhost:9000/contextKey.html");
    };

    this.getTitle = function () {
        return browser.getTitle();
    }

    this.fillKeyInput = function (contextKey) {
        keyInput.sendKeys(contextKey);
    };

    ContextKeyPage.prototype.submit = function () {
        submitButton.click();
    };

    ContextKeyPage.prototype.getDivHTML = function () {
        return list.getInnerHtml();
    };

};

module.exports = ContextKeyPage;