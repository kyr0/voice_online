/**
 * Created by jaboing on 2015-08-07.
 */
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.initConfig({
        strip_code: {
            options: {
                start_comment : "start-test-code",
                end_comment : "end-test-code"
            },
            your_target: {
                // Target-specific file lists and/or options go here.
            },
        },
    });

};