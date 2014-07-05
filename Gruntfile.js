module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '.',
                    keepalive: true
                }
            }
        },
        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask('default', ['connect']);
};


