/*
 * helper-lib
 * http://github.com/assemble/helper-lib
 */
module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Configuration to be run (and then tested).

    // Run mocha tests.
    mochaTest: {
      files: ['test/**/*_test.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      helpers: ['src/**/*.js']
    },

    // Clean test files before building or re-testing.
    clean: {
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // By default, build templates using helpers and run all tests.
  grunt.registerTask('default',  ['jshint']);
};
