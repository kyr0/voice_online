About
=====

When this project is complete it will be a nice way to practice pitch agnostic musical instruments for free.
Voice, violin, brass, woodwind etc.. 

Tuner demo: adapted from Chris Wilson's Pitch Detect tuner, this improved tuner offers precise pitch detection
 from A1 - A7 with tested accuracy of .5-cent in real time. Also filters out background noise reliably and fixes a 
 number of rendering glitches and performance issues.
 
**Demo Path:** ./spikes/pratice_tuner/tuner.html

**Original:** https://webaudiodemos.appspot.com/pitchdetect/

**Techniques and best practices related to Development / QA demonstrated by this project:**

 * Unit testing with Mocha.js / TDD on client and NodeUnit on the server
 * Build automation using jake.js
 * Linting with JSHint
 * Deployment scripting with Grunt.js
 * Semantic versioning with semver.js
 * Shell scripting (jake.sh)

Other components used: browserify, shelljs, underscore, phantomjs, grunt-strip-code

To build, lint, and run all tests:
==================================
    
**At this time only OSX & Ubuntu Linux are officially supported**

    1. Install Git (OSX Only: install XCode command line tools along with git)
        - OSX Only: simply type 'git' on the command line and follow instructions)
    2. Install Node:  ** see package.json for exact version required
        - OSX, http://howtonode.org/how-to-install-nodejs)
        - Linux, https://gist.github.com/isaacs/579814
    3. type './jake.sh' and relax 
    
**To list the available tasks:**
 
    './jake.sh -T'
