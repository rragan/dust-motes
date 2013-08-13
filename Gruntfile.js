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
    simplemocha: {
      options: {
	  globals:['should'],
	  timeout: 3000,
	  ignoreLeaks: false,
	  ui: 'bdd',
  	  reporter: 'tap'
        },
	all: {src: ['test/**/*.js'] }
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
  grunt.loadNpmTasks('grunt-simple-mocha');

  // By default, build templates using helpers and run all tests.
  grunt.registerTask('jshint',  ['jshint']);
  grunt.registerTask('test',  ['simplemocha']);
};
