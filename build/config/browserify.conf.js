// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

// Configuration options for JSHint. Change this to match your preferences.

(function() {
	"use strict";

	exports.pathList = [
		// spike bundles
        './spikes/paper/js/lesson.js -o ./spikes/paper/js/lesson.bundle.js',
		'./spikes/practice_tuner/js/tuner.js -o ./spikes/practice_tuner/js/tuner.bundle.js',
		'./spikes/canvas/scripts/canvas.js -o ./spikes/canvas/scripts/canvas.bundle.js',
		'./spikes/pitch/js/getBuffersFromTones.js -o ./spikes/pitch/js/getBuffersFromTones.bundle.js',
		'./spikes/pitch/js/drive_mpm.js -o ./spikes/pitch/js/drive_mpm.bundle.js',
		'./spikes/pitch/js/drive_webAudio.js -o ./spikes/pitch/js/drive_webAudio.bundle.js',
		// the real deal, not spikes
		'./src/client/js/main.js -o ./src/client/js/main.bundle.js'
	];


}());