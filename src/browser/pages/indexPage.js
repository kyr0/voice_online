/**
 * Created by jaboing on 2015-08-03.
 */
"use strict";

require("../../../node_modules/protractor/node_modules/jasminewd");

var IndexPage = (function () {
    function IndexPage() {
        this.submitButton = element(By.id("submitButton"));
        this.keyInput = element(By.id("contextKeyInput"));
        this.list = element(By.id("list"));
    }

    IndexPage.prototype.visitPage = function () {
        browser.get("/");
    };

    IndexPage.prototype.fillKeyInput = function (contextKey) {
        this.keyInput.sendKeys(contextKey);
    };

    IndexPage.prototype.submit = function () {
        this.submitButton.click();
    };

    IndexPage.prototype.getDivHTML = function () {
        return this.list.getText();
    };

    return IndexPage;

})();

module.exports = IndexPage;