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

var Filesystem = require('asar/lib/filesystem');
var disk = require('asar/lib/disk');

var glob = require('glob');

// begin monkey-patch asar/lib/disk to accept callbacks
var pickle = require('asar/node_modules/chromium-pickle');

var writeFileListToStream = function(out, list, cb) {
  if (list.length === 0) {
    out.end();
    if('function' === typeof cb) {
      cb(null);
    }
    return;
  }

  var src = fs.createReadStream(list[0]);
  src.on('end', writeFileListToStream.bind(this, out, list.slice(1), cb));
  src.pipe(out, { end: false });
};

// monkey-patched to accept callback
disk.writeFilesystem = function(dest, filesystem, files, cb) {
  var headerPickle = pickle.createEmpty();
  headerPickle.writeString(JSON.stringify(filesystem.header));
  var headerBuf = headerPickle.toBuffer();

  var sizePickle = pickle.createEmpty();
  sizePickle.writeUInt32(headerBuf.length);
  var sizeBuf = sizePickle.toBuffer();

  var out = fs.createWriteStream(dest);
  out.write(sizeBuf);
  out.write(headerBuf, writeFileListToStream.bind(this, out, files, cb));
};
// end monkey-patch asar/lib/disk to accept callbacks

function generateAsarArchive(srcPath, destFile, cb) {
  glob('**/*', {cwd: srcPath}, function(err, entries) {
    if(err) { return cb(err); }
    var filesystem = new Filesystem(srcPath);
    var files = [];
    var i, file, stat;

    for(i in entries) {
      file = path.join(process.cwd(), srcPath, entries[i]);
      stat = fs.lstatSync(file);
      if(stat.isDirectory()) {
        filesystem.insertDirectoy(file);
      }
      else if(stat.isSymbolicLink()) {
        filesystem.insertLink(file, stat);
      }
      else {
        filesystem.insertFile(file, stat);
        files.push(file);
      }
    }

    disk.writeFilesystem(destFile, filesystem, files, function() {
      cb(null);
    });
  });
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

    this.files.forEach(function(f) {
      var dest = path.join(process.cwd(), f.dest);
      
      // to create the dir if necessary we're creating an empty file.
      grunt.file.write(dest, '');
      
      generateAsarArchive(f.src[0], dest, function(){eachDone(f);});
    });
  });
};
