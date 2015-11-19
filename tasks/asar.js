/*
 * grunt-asar
 * https://github.com/bwin/grunt-asar
 *
 * Copyright (c) 2014 Benjamin Winkler (bwin)
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs');

var asar = require('asar');
var Filesystem = require('asar/lib/filesystem');
var disk = require('asar/lib/disk');
var mkdirp = require('mkdirp');

var glob = require('glob');

function generateAsarArchiveFromFiles(basepath, filenames, destFile, cb) {
  var filesystem = new Filesystem(basepath);
  var files = [];
  var i, file, stat, filename;

  for(i in filenames) {
    filename = filenames[i];
    if('object' === typeof filename) {
      filename = filename.src[0];
    }
    file = path.join(process.cwd(), filename);
    stat = fs.lstatSync(file);
    if(stat.isDirectory()) {
      filesystem.insertDirectory(file, false);
    }
    else if(stat.isSymbolicLink()) {
      filesystem.insertLink(file, stat);
    }
    else {
      filesystem.insertFile(file, false, stat);
      files.push({
        filename: file,
        unpack: false
      });
    }
  }

  mkdirp(path.dirname(destFile), function(error) {
    if (error) {
      return callback(error);
    }
    disk.writeFilesystem(destFile, filesystem, files, function() {
      cb(null);
    });
  });
}

function generateAsarArchive(srcPath, destFile, cb) {
  glob(''+srcPath+'/**/*', {}, function(err, entries) {
    if(err) { return cb(err); }
    generateAsarArchiveFromFiles(srcPath, entries, destFile, cb);
  });
  //asar.createPackage(srcPath, destFile, cb);
}

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
      if(--filesLeft === 0) {
        done();
      }
    };

    if(this.data.expand) {
      var dest = this.data.dest;
      grunt.file.write(dest, '');
      generateAsarArchiveFromFiles(this.data.cwd, this.files, this.data.dest, function() {
        grunt.log.writeln('File ' + dest + ' created.');
        done();
      });
    }
    else {
      this.files.forEach(function(f) {
        var dest = path.join(process.cwd(), f.dest);
        
        // to create the dir if necessary we're creating an empty file.
        grunt.file.write(dest, '');
        
        generateAsarArchive(f.src[0], dest, function(){eachDone(f);});
      });
    }
  });
};
