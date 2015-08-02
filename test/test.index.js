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
        test('getKeyList() should return an array of length getKeyListCount()', function() {
            contentKeyPage.podcast.getKeyListCount();
            //assert.equal(true, Array.isArray(contentKeyPage.podcast.getKeyList()));
        });
        test('.createPodcast should add an array of strings to repertoire.titles with a length of getEnumerableCount()' +
            ' + 1', function() {
            contentKeyPage.podcast.createPodcast("test");
            assert.equal("content.landingpages.podcast.test",
                contentKeyPage.podcast.repertoire[contentKeyPage.podcast.repertoire.length - 1].titles[0]);
            assert.equal(contentKeyPage.podcast.getEnumerableCount() + 1,
                contentKeyPage.podcast.repertoire[contentKeyPage.podcast.repertoire.length - 1].titles.length);
        });

    });
});