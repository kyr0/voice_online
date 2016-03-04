About
=====

When this project is complete it will be a nice way to practice pitch agnostic musical instruments for free.
Voice, violin, brass, woodwind etc.. Offers precise pitch detection from A1 - A7 with tested accuracy of 
.5-cent in real time. 
 
To build:
==================================
    
    1. Install Git (OSX Only: install XCode command line tools along with git)
        - OSX Only: simply type 'git' on the command line and follow instructions)
    2. Install Node:  ** see package.json for exact version required
        - OSX, http://howtonode.org/how-to-install-nodejs)
        - Linux, https://gist.github.com/isaacs/579814
    3. Install dependencies for Paper.js:
        - OSX Only: Install Homebrew and then `$ brew install cairo pango`
        - Linux: see paper.js documentation https://www.npmjs.com/package/paper
    4. From the project directory run `npm install`

To watch/run all tests after every change:
==================================
    
    1. Run `$ grunt`
    
To generate a coverage report
==================================
    
    1. Run `$ grunt coverage`
    
    