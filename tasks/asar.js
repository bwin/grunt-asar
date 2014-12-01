/*
 * grunt-asar
 * https://github.com/bwin/grunt-asar
 *
 * Copyright (c) 2014 Benjamin Winkler (bwin)
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

var asar = require('asar');

module.exports = function(grunt) {
  grunt.registerMultiTask('asar', 'Generate atom-shell asar packages.', function() {
    // default options
    var options = this.options({
    //  bare: false,
    });

    var target = this.target;
    var done = this.async();

    var filesLeft = this.files.length;
    var eachDone = function(f) {
      grunt.log.writeln('File ' + f.dest + ' created from ' + f.src[0]);
      if(--filesLeft == 0) {
        done();
      }
    };

    this.files.forEach(function(f) {
      var dest = path.join(process.cwd(), f.dest);
      
      // to create the dir if necessary we're creating an empty file.
      grunt.file.write(dest, '');
      
      asar.createPackage(f.src[0], dest, function(){eachDone(f);});
    });
  });
};
