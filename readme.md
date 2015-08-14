About
=====

When this project is complete it will be a nice way to practice pitch agnostic musical instruments for free.
Voice, violin, brass, woodwind etc.. 

Techniques and best practices related to Development / QA used in this project:

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
        - to install git on OSX, simply type 'git' on the command line and follow instructions)
    2. Install Node: v0.12.7 (OSX) or v0.10.25** (Ubuntu) 
        - OSX, http://howtonode.org/how-to-install-nodejs)
        - Linux, https://github.com/joyent/node/wiki/installing-node.js-via-package-manager
    2.5 Linux only: you will need to update package.json before building and change 
        the version to "node": "0.10.25"
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