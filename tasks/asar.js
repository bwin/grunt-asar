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
var chalk = require('chalk');
var async = require('async');
var asar = require('asar');
var Filesystem = require('asar/lib/filesystem');
var disk = require('asar/lib/disk');
var mkdirp = require('mkdirp');

module.exports = function(grunt) {
  grunt.registerMultiTask('asar', 'Generate atom-shell asar packages.', function() {
    // default options
    var options = this.options({
      //  bare: false,
    });

    var done = this.async();
    var filesByAsar = {};

    // Organize the files by the asar archive they relate to
    this.files.forEach(function (filePair) {
      // filePair.dest represents the name of the asar archive to create
      var destinationAsarFilePath = path.join(process.cwd(), filePair.dest);
      if (filePair.orig && filePair.orig.dest) {
        destinationAsarFilePath = path.join(process.cwd(), filePair.orig.dest);
      }

      filesByAsar[destinationAsarFilePath] = filesByAsar[destinationAsarFilePath] || [];
      filePair.src.forEach(function (src) {
        filesByAsar[destinationAsarFilePath].push(src);
      });
    });

    async.forEachOf(filesByAsar, function (files, asarFilePath, callback) {
      var directories = {};
      var dirname;
      var asarFiles = [];
      var filesystem = new Filesystem('.');
      var stat;
      var shouldUnpack;

      function insertDirectory(directory) {
        // Recursively ensure directory tree exists in the asar archive
        var parent = path.dirname(directory);
        if (parent && parent !== '.' && !directories[parent]) {
          insertDirectory(parent);
        }
        grunt.verbose.writeln('  Inserting Dir  ' + chalk.cyan(directory));
        filesystem.insertDirectory(directory, false);
        directories[directory] = true;
      }

      grunt.verbose.writeln('Creating ' + chalk.cyan(asarFilePath));

      files.forEach(function (src) {
        stat = fs.lstatSync(src);

        if (stat.isDirectory()) {
          insertDirectory(src);
        } else if (stat.isSymbolicLink()) {
          grunt.verbose.writeln('  Inserting Link ' + chalk.cyan(src));
          filesystem.insertLink(src, stat);
        } else {
          // Asar filesystem expects a directory to be added before files for that directory can be added
          dirname = path.dirname(src);
          if (!directories[dirname]) {
            insertDirectory(dirname);
          }

          shouldUnpack = options.unpack && grunt.file.isMatch(options.unpack, src);
          grunt.verbose.writeln('  Inserting File ' + (shouldUnpack ? '(Unpacked) ': '') + chalk.cyan(src));
          asarFiles.push({
            filename: src,
            unpack: shouldUnpack
          });

          filesystem.insertFile(src, shouldUnpack, stat);
        }
      });

      mkdirp(path.dirname(asarFilePath), function(err) {
        if (err) {
          return callback(err);
        }

        disk.writeFilesystem(asarFilePath, filesystem, asarFiles, function(err) {
          if (err) {
            return callback(err);
          }

          grunt.log.writeln('Created ' + chalk.cyan(asarFilePath));
          return callback();
        });
      });
    }, function (err) {
      return done(err);
    });
  });
};
