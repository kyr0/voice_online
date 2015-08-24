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
 * End to end tests using Jasmine, Protractor, Selenium for both Angular & non-Angular sites
 * Page Object pattern example in test/e2e/pageModules
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
    2. Install Node: v0.12.7  ** this exact version is required
        - OSX, http://howtonode.org/how-to-install-nodejs)
        - Linux, https://gist.github.com/isaacs/579814
    3. Install Java Development Kit
    4. type './jake.sh' and relax 
    
**To list the available tasks:**
 
    './jake.sh -T'

Example page for Little Bits:
=============================

    The easiest way is to open ./src/browser/index.html directly in the browser

    Alternatively:
    1. In the console activate the local server './jake.sh startBServer'
    2. In your browser of choice go to - http://localhost:9000/

    > Implementation code is in ./src/browser
    > Test code is in ./test

Troubleshooting:
================

For some reason, **on Linux only**, the initial build fails and the traceback states chromedriver is missing, try the following:

    1. run './jake.sh killWD', this kills any currently running instance of the selenium standalone server
    2. run './jake.sh startWDServer', this will check if the binaries are up-to-date and re-download them if not
    3. When it completes you will need to manually ctrl-C to quit the process, though the server will continue to run
    3. re-run './jake.sh' or './jake.sh e2eOnly' and the tests should work
    
    TODO: remove this build quirk from Linux