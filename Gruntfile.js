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
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },
        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['clean', 'nodeunit']);
    grunt.registerTask('default', ['connect']);
};


