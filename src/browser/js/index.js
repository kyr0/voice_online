/**
 * Created by jaboing on 2015-08-02.
 */
"use strict";

(function() {

    var contentKey = require("./contentKey.js");

    window.checkInputThenWrite = function (){
        //document.getElementById("contextKeyInput").value = '["content.landingpages.podcasts"]';
        var invalidInputMsg = 'Input must have the following format: ["contextKey"]';
        var userInput = document.getElementById("contextKeyInput").value;
        console.log(userInput);
        if (userInput[0] !== "[" || userInput[userInput.length - 1] !== ']' ||
            userInput[1] !== '"' || userInput[userInput.length - 2] !== '"') {
            alert(invalidInputMsg);
        }

        userInput = userInput.slice(2, userInput.length - 2);
        if (contentKey.podcast.pathExists(userInput)){
            console.log("Found path: " + userInput);
            writeList(userInput);
        }

    };

    var writeList = function (userInput) {
        var containers = contentKey.podcast.splitPath(userInput);
        console.log(containers);
        var listDiv = document.getElementById('list');
        var listDivText = "<br><br>";
        var counter = 0;
        // some recursive fun to generate the list
        var writeListItem = function (){
            listDivText += '<br><br><ul><br><br><li>' + containers[counter];
            counter++;
            if (counter < containers.length) {
                writeListItem();
            }
            listDivText += '</li><br><br></ul><br><br>';
        };
        writeListItem();
        listDiv.innerHTML = listDivText + "<br><br>";
    };

})();