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
    //console.log(content.toString());

    // landingpages inherits from content
    var landingpages = Object.create(content, {toString: {
        value: function(){return content.toString() + ".landingpages";}}});
    //console.log(landingpages.toString());

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
                var myString = this.toString();
                this.repertoire.push(Object.create(this, {
                    // this toString is a bit heavy since it returns an array with
                    // permutations of the inheritance chain + common podcast members
                    toString: {
                        value: function(){
                            // initialize array with toString of no members
                            var membersToString = [myString + "." + castTitle];
                            for (var member in this) {
                                //console.log(member.toString());
                                if (member.toString() !== "toString") {
                                    membersToString.push(membersToString[0] + "." + member);
                                }
                            }
                            return membersToString;
                        }
                    }
                }));
            }
        },

        // getKeyList returns an array of key strings based on the current repertoire
        getKeyList: {value:
            function (){
                var keyList = [this.toString()];
                for (var i = 0; i < this.repertoire.length; i++) {
                    for (var j = 0; j < this.repertoire[i].toString().length; j++){
                        keyList.push(this.repertoire[i].toString()[j]);
                    }
                    //keyList.push(this.repertoire[i].toString());
                }
                return keyList;
            }
        },

        toString: {value: function(){return landingpages.toString() + ".podcast";}}
    });

    //console.log(podcast.toString());

    //test_PodcastMembersArePresent
    //console.log(podcast.code + podcast.offer + podcast.partner + podcast.products);

    ////test_IndividualPodcastToStringMethodIsAccurate
    //podcast.createPodcast("android");
    //console.log(podcast.repertoire[0].toString());

    ////test_PodcastParentMembersArePresentInChildren
    //podcast.createPodcast("android");
    //console.log(podcast.repertoire[0].code);

    //test_AddNewValidMemberToPodCast

    //test_AddNewStrangeMemberToPodcast

    //test_EmptyRepertoireReturnsOnlyPodcastContainerString
    // - prereq, zero rep, should return arrlen = 1 and ["content.landingpages.podcast"]
    //console.log(podcast.getKeyList());

    //test_GetKeyListHasCorrectChildStrings
    //podcast.createPodcast("android");
    //console.log(podcast.getKeyList());

    // test_GetKeyListReturnsArrayOfCorrectLength  (empty, add one, add3, remove 1, add new member)

    var podcastTitles = ['android','brainson','flitetest','ijustine','kipkay','techquickie'];
    //add the titles to the repertoire
    for (var h = 0; h < podcastTitles.length; h++){
        podcast.createPodcast(podcastTitles[h]);
    }


    for (var k = 0; k < podcast.getKeyList().length; k++){
        console.log(podcast.getKeyList()[k] + "\n");
    }

    console.log(podcast.getKeyList());


})();