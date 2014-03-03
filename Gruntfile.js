module.exports = function(grunt) {

    // Initialize the grunt configuration
    grunt.initConfig({
        // Import the package configuration
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            bootstrap: {
                files: [
                    {
                        cwd: 'bower_components/bootstrap/dist/js/',
                        src: '*.min.js',
                        dest: 'js/lib/',
                        filter: 'isFile',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap/dist/css/',
                        src: '*.min.css',
                        dest: 'css/',
                        filter: 'isFile',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap/dist/fonts',
                        src: '**',
                        dest: 'fonts/',
                        filter: 'isFile',
                        expand: true
                    }
                ]
            },

            fontawesome: {
                files: [
                    {
                        cwd: 'bower_components/font-awesome/fonts',
                        src: '**.*',
                        dest: 'fonts/',
                        filter: 'isFile',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/font-awesome/css',
                        src: '**.min.css',
                        dest: 'css/',
                        filter: 'isFile',
                        expand: true
                    }
                ]
            },

            jquery: {
                src: 'bower_components/jquery/dist/jquery.min.js',
                dest: 'js/lib/jquery.min.js'
            },

            d3: {
                src: 'bower_components/d3/d3.min.js',
                dest: 'js/lib/d3.min.js'
            },

            underscore: {
                src: 'bower_components/underscore/underscore.js',
                dest: 'js/lib/underscore.js'
            }

        },

        less: {
            dashboard: {
                options: {
                    paths: ['css'],
                    cleancss: true
                },
                files: {
                    'css/pty.css': 'less/pty.less',
                    'css/index.css': 'less/index.less'
                }
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            pty: {
                files: ['src/pty.js'],
                tasks: ['less']
            }
        }


    });

    // Enable the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Tasks
    grunt.registerTask('build', ['copy', 'less']);
    grunt.registerTask('dist', ['build']);
    grunt.registerTask('default', ['build']);


};