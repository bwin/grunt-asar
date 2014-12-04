'use strict';

var grunt = require('grunt');
var chai = require('chai');
//chai.use(require('chai-fs'));
var expect = chai.expect;

describe('grunt-asar', function() {
  
  it('should create archive from directory', function() {
    var actual = grunt.file.read('tmp/basic_test.asar');
    var expected = grunt.file.read('test/expected/basic_test.asar');
    return expect(actual).to.equal(expected);
  });

  it('should create archive from directory with file-patterns', function() {
    var actual = grunt.file.read('tmp/expand_test.asar');
    var expected = grunt.file.read('test/expected/expand_test.asar');
    return expect(actual).to.equal(expected);
  });

});
