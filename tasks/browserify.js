/**
 * Bundling JS code with Browserify and Babel
 */

let gulp = require('gulp')
let gutil = require('gulp-util')
let gulpif = require('gulp-if')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')
let browserify = require('browserify')
let pkgify = require('pkgify')
let watchify = require('watchify')
let babelify = require('babelify')
let streamify = require('gulp-streamify')
let source = require('vinyl-source-stream')
let chalk = require('chalk')
let browsersyncServer = require('./browsersync')._server
let jsTasks = require('./js')

/**
 * The generated bundlers
 */
let bundlers = {}

/**
 * Nicer browserify errors
 * Adapted from https://gist.github.com/Fishrock123/8ea81dad3197c2f84366
 */
function outputError(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(`${chalk.red(err.name)}: ${chalk.yellow(err.fileName)}: Line ${chalk.magenta(err.lineNumber)} & Column ${chalk.magenta(err.columnNumber || err.column)}: ${chalk.blue(err.description)}`)
  } else {
    // Browserify error
    gutil.log(`${chalk.red(err.name)}: ${chalk.yellow(err.message)}`)
  }
  // this.emit('end')
}

module.exports = function (gulpConfig) {
  /**
   * Default bundles config
   */
  let bundlesConfig = extend({
    bundles: {},
    useWatchify: false
  }, objectPath.get(gulpConfig, 'browserify'))

  /**
   * Create a browserify-managed bundle
   * @param {Object} options
   * @param {Boolean} useWatchify
   * @return {Bundler}
   */
  function Bundler (options, useWatchify) {
    // Default settings
    this.settings = extend(true, {
      name: undefined,
      src: undefined,
      dest: undefined,
      browserify: {
        entries: undefined,
        cache: {},
        packageCache: {},
        extensions: ['.js', '.es6'],
        debug: true
      },
      remapify: undefined,
      watchify: {
        poll: true
      }
    }, options)

    // Get path and file names
    this.src = path.dirname(this.settings.src)
    // this.srcFile = path.basename(this.settings.src)
    this.dest = path.dirname(this.settings.dest)
    this.destFile = path.basename(this.settings.dest)

    // Set the default bundle name to the name of the dest file
    if (!this.settings.name) {
      this.settings.name = this.destFile
    }

    // Set the default browserify.entries value
    if (!this.settings.browserify.entries) {
      this.settings.browserify.entries = [this.settings.src]
    }

    // Create the browserify bundler (with Babel transforms)
    this.bundler = browserify(this.settings.browserify).transform(pkgify).transform(babelify)

    // Allow remapping of paths (a.k.a. path aliases) via pkgify
    // if (this.settings.pkgify && this.settings.pkgify.length) {
    //   this.bundler.transform(pkgify)
    // }

    // Do babel transform
    // this.bundler.transform(babelify)

    // Use watchify
    if (gulpConfig.isWatching || bundlesConfig.useWatchify || useWatchify) {
      this.bundler = watchify(this.bundler, this.settings.watchify)
    }

    /**
     * Package the browserify bundle
     */
    this.bundle = () => {
      gutil.log(`Bundling ${this.settings.name}...`)
      return this.bundler.bundle()
        .on('error', outputError)
        .pipe(source(this.destFile))
        .pipe(gulp.dest(this.dest))
        .pipe(gulpif(gulpConfig.env === 'production', streamify(jsTasks.minifyJS())))
        .pipe(gulpif(gulpConfig.env === 'production', gulp.dest(this.dest)))
        .pipe(gulpif(browsersyncServer && gulpConfig.isWatching || bundlesConfig.useWatchify || useWatchify, browsersyncServer.stream()))
    }

    // Events
    if (gulpConfig.isWatching || bundlesConfig.useWatchify || useWatchify) {
      this.bundler.on('update', () => {
        this.bundle()
      })
    }

    // Use the gulp-util log function for any Browserify status logs
    this.bundler.on('log', gutil.log)

    // Bundle on first run
    this.bundle()
  }

  /**
   * Generate the custom bundlers for each bundle
   */
  function generateBundlers () {
    let bundleConfigs = bundlesConfig.bundles

    for (let bundleName in bundleConfigs) {
      try {
        let newBundler = new Bundler(bundleConfigs[bundleName], gulpConfig.isWatching || bundlesConfig.useWatchify)
        bundlers[bundleName] = newBundler
        gutil.log(`Generated bundler ${newBundler.settings.name}`)
      } catch (e) {}
    }

    if (bundlers.length) {
      gutil.log(`Generated ${bundlers.length} bundlers`)
    }
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: bundlesConfig,
    generateBundlers
  }
}
