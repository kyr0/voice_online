"use strict";
//TODO -- 1) write up the unit tests 2) hook up the search function 3) UI tests with selenium

(function() {
    /* I wanted to create the list programmatically to make the example I sent
         more interesting than regex-ing through an array.
         Hence the following. It's a bit overkill to generating a content key.
         But, I wanted to show how I test, and it was fun. Thanks!
    */

    // Content is the root of the object hierarchy
    var content = {toString: function(){return "content";}};
    module.exports.content = content;

    // landingpages inherits from content
    var landingpages = Object.create(content, {toString: {
        value: function(){return content.toString() + ".landingpages";}}});
    module.exports.landingpages = landingpages;

    // podcast inherits from landingpages and provides functions to help keep her babies kangaroo style
    var podcast = Object.create(landingpages, {
        // the 4 common elements to every podcast are members below
        code: {value: "code", enumerable: true},
        offer: {value: "offer", enumerable: true},
        partner: {value: "partner", enumerable: true},
        products: {value: "products", enumerable: true},
        // we'll store the instanced podcasts in the repertoire array
        repertoire: {value: []},

        // createPodcast takes the new podcast name, creates a podcast instance
        // and pushes it into the member array 'repertoire'.
        createPodcast: {value:
            function (castTitle) {
                var myMommy = this;
                this.repertoire.push(Object.create(myMommy, {
                    titles: {
                        value: (function(){
                            // create array with content titles
                            var memberKey = [myMommy.toString() + "." + castTitle];
                            for (var member in myMommy) {
                                if (myMommy.hasOwnProperty(member)) {
                                    if (member.toString() !== "toString") {
                                        memberKey.push(memberKey[0] + "." + member);
                                    }
                                }
                            }
                            return memberKey;
                        }())
                    },
                    toString: {
                        value: function(){
                            return this.titles.toString();
                        }
                    }
                }));
            }
        },
        removePodcast: {value:
            function (castTitle) {

            }
        },
        // getKeyList returns an array of key strings based on the current repertoire
        getKeyList: {value:
            function (){
                var keyList = [this.toString()];
                for (var i = 0; i < this.repertoire.length; i++) {
                    for (var j = 0; j < this.repertoire[i].titles.length; j++){
                        keyList.push(this.repertoire[i].titles[j]);
                    }
                }
                return keyList;
            }
        },
        getEnumerableCount: {value:
            function(){
                var count = 0;
                for (var member in this) {
                    if (this.hasOwnProperty(member)) {
                        count++;
                    }
                }
                count--; // toString is an extra enumerable, remove it before returning
                return count;
            }
        },
        getKeyListCount: {value:
            function(){
                return this.getKeyList().length;
            }
        },
        toString: {value: function(){return landingpages.toString() + ".podcast";}}
    });
    module.exports.podcast = podcast;

    var podcastTitles = ['android','brainson','flitetest','ijustine','kipkay','techquickie'];
    module.exports.podcastTitles = podcastTitles;

    //add the titles to the repertoire
    for (var h = 0; h < podcastTitles.length; h++){
        podcast.createPodcast(podcastTitles[h]);
    }





    // test_GetKeyListReturnsArrayOfCorrectLength  (empty, add one, add3, remove 1, add new member)

    // test we can access each individual element of the list
    //for (var k = 0; k < podcast.getKeyList().length; k++){
    //    console.log(podcast.getKeyList()[k] + "\n");
    //}

    // test we're getting the list as an array
    //console.log(podcast.getKeyList());


})();