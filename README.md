# grunt-asar

> Grunt plugin to generate atom-shell asar packages.

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
        // Your file mappings go here
        // Currently only a single directory can be used as file-src.
        // 'archivename.asar': ['some/path'],
      },
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
