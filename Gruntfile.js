/*
 * grunt-asar
 * https://github.com/bwin/grunt-asar
 *
 * Copyright (c) 2014 Benjamin Winkler (bwin)
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    asar: {
      basic_test: {
        options: {
        },
        files: {
          'tmp/basic_test.asar': ['test/fixtures/']
        }
      },

      expand_test: {
        cwd: 'test/fixtures',
        src: ['**/*', '!**/*.png', '!dir1', '!dir1/**/*'],
        expand: true,
        dest: 'tmp/expand_test.asar'
      }

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/*.js'],
      },
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asar', 'mochaTest']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
