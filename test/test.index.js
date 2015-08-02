///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var contentKeyPage = require("../src/browser/js/contentKey.js");

suite('ContentObject', function() {
    setup(function() {
        // ...
    });

    suite('test_contentKey', function() {
        test("should be an Object type", function() {
            assert.equal(typeof contentKeyPage.content, 'object');
        });
        test("should stringify to 'content'", function() {
            assert.equal("content", contentKeyPage.content.toString());
        });
        test('landingpages should be an Object type', function() {
            assert.equal(typeof contentKeyPage.landingpages, 'object');
        });
        test('landingpages should stringify to "content.landingpages"', function() {
            assert.equal("content.landingpages", contentKeyPage.landingpages.toString());
        });
        test('podcast should be an Object type', function() {
            assert.equal(typeof contentKeyPage.podcast, 'object');
        });
        test('podcast should stringify to "content.landingpages.podcast"', function() {
            assert.equal("content.landingpages.podcast", contentKeyPage.podcast.toString());
        });
        test('podcast type should have 4 enumerable members', function() {
            assert.equal(4, contentKeyPage.podcast.getEnumerableCount());
        });
        test('podcast should have a code member', function() {
            assert.equal("code", contentKeyPage.podcast.code);
        });
        test('podcast should have an offer member', function() {
            assert.equal("offer", contentKeyPage.podcast.offer);
        });
        test('podcast should have a partner member', function() {
            assert.equal("partner", contentKeyPage.podcast.partner);
        });
        test('podcast should have a products member', function() {
            assert.equal("products", contentKeyPage.podcast.products);
        });
        test('podcast.repertoire array should have same .length as podcastTitles', function() {
            assert.equal(contentKeyPage.podcastTitles.length, contentKeyPage.podcast.repertoire.length);
        });
        test('getKeyList should return an array', function() {
            assert.equal(true, Array.isArray(contentKeyPage.podcast.getKeyList()));
        });
        var baseNum = 31; // The number of elements we expect getKeyListCount to return
        test('getKeyListCount() should return an value of (1 + (repertoireLength * (members+1))', function() {
            assert.equal(baseNum, contentKeyPage.podcast.getKeyListCount());
        });
        test('getKeyList()[0] should be the podcast container, function()', function() {
            assert.equal("content.landingpages.podcast", contentKeyPage.podcast.getKeyList()[0]);
        });
        test('.createPodcast should add an array of strings to repertoire.titles with a length of getEnumerableCount()' +
            ' + 1', function() {
            contentKeyPage.podcast.createPodcast("test");
            assert.equal(contentKeyPage.podcast.getEnumerableCount() + 1,
                contentKeyPage.podcast.repertoire[contentKeyPage.podcast.repertoire.length - 1].titles.length);
        });
        test('Titles should have their container element contained in the first index' +
            ' + 1', function() {
            assert.equal("content.landingpages.podcast.test",
                contentKeyPage.podcast.repertoire[contentKeyPage.podcast.repertoire.length - 1].titles[0]);
        });
        test('Titles should contain the enumerable members inherited from podcast type (check code)' +
            ' + 1', function() {
            assert.equal("content.landingpages.podcast.test.code",
                contentKeyPage.podcast.repertoire[contentKeyPage.podcast.repertoire.length - 1].titles[1]);
        });
        test('Test getKeyListCount() updates properly after new elements are added', function() {
            assert.equal(baseNum + 5, contentKeyPage.podcast.getKeyListCount());
        });
        test('Test getKeyListCount() updates properly after elements are removed', function() {
            assert.equal(baseNum, contentKeyPage.podcast.getKeyListCount());
        });

    });
});