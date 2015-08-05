"use strict";

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    //specs: ['../../test/e2e/spec.js'],
    onPrepare: function(){
        global.isAngularSite = function(flag){
            /* jshint ignore:start */
            browser.ignoreSynchronization = !flag;
            /* jshint ignore:end */
        };
    },
    capabilities: {
        'browserName': 'chrome'
    },
    //multiCapabilities: [{
    //    browserName: 'firefox'
    //}, {
    //    browserName: 'chrome'
    //}]
};