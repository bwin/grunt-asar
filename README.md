# grunt-asar

[![build status](http://img.shields.io/travis/bwin/grunt-asar/master.svg?style=flat-square)](https://travis-ci.org/bwin/grunt-asar)
[![dependencies](http://img.shields.io/david/bwin/grunt-asar.svg?style=flat-square)](https://david-dm.org/bwin/grunt-asar)
[![npm version](http://img.shields.io/npm/v/grunt-asar.svg?style=flat-square)](https://npmjs.org/package/grunt-asar)

> Grunt plugin to generate atom-shell asar packages.

This exposes just the most basic functionality at the moment. Convert a whole directory into an [asar](https://github.com/atom/asar) archive. Symbolic links are currently not tested.

Now supports grunt file expansion.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asar --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asar');
```

## The "asar" task

### Overview
In your project's Gruntfile, add a section named `asar` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asar: {
    your_target: {
      // Target-specific file lists and/or options go here.
      files: {
        // Your simple dir-to-file mappings go here
        // 'archivename.asar': ['some/path'],
      },
    },
    your_advanced_target: {
      // Your expanding patterns go like this
      // cwd: 'some/path',
      // src: ['**/*'],
      // expand: true,
      // dest: 'archivename.asar'
    },
  },
});
```

### Usage Examples

```js
grunt.initConfig({
  asar: {
    all: { // target
      files: {
        'app.asar': ['app/'],
        'modules.asar': ['node_modules/'],
      },
    },
  },
});
```

The same example with targets for each archive.

```js
grunt.initConfig({
  asar: {
    app: { // target
      files: {
        'app.asar': ['app/'],
      },
    },
    modules: { // target
      files: {
        'modules.asar': ['node_modules/'],
      },
    },
  },
});
```

You can also use grunt file expansion to filter.

```js
grunt.initConfig({
  asar: {
    my_app: {
      cwd: 'some/path',
      // Skip png's and the folder 'dir1' and its contents.
      src: ['**/*', '!**/*.png', '!dir1', '!dir1/**/*'],
      expand: true,
      dest: 'my_app.asar'
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
