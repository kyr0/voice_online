#!/usr/bin/env bash

[ ! -f node_modules/.bin/jake ] && echo "Building npm modules:" && npm rebuild
node_modules/.bin/jake -f build/scripts/build.jakefile.js $*