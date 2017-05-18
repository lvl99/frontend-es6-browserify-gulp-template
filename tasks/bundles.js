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
let watchify = require('watchify')
let babelify = require('babelify')
let streamify = require('gulp-streamify')
let source = require('vinyl-source-stream')
let browsersyncServer = require('./browsersync')._server
let jsTasks = require('./js')

/**
 * The generated bundlers
 */
let bundlers = {}

module.exports = function (gulpConfig) {
  /**
   * Default bundles config
   */
  let bundlesConfig = extend({
    bundles: [],
    useWatchify: false
  }, objectPath.get(gulpConfig, 'bundles'))

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
        extensions: ['.es6'],
        debug: true
      },
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

    // Only if watching
    if (gulpConfig.isWatching || bundlesConfig.useWatchify || useWatchify) {
      this.bundler = watchify(browserify(this.settings.browserify).transform(babelify), this.settings.watchify)
    } else {
      this.bundler = browserify(this.settings.browserify).transform(babelify)
    }

    /**
     * Package the browserify bundle
     */
    this.bundle = () => {
      gutil.log(`Bundling ${this.settings.name}...`)
      return this.bundler.bundle()
        .on('error', gutil.log.bind(gutil, `Browserify: error detected in bundle ${this.settings.name}, aborting bundling...`))
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

    if (!bundleConfigs.length) {
      for (let i = 0; i < bundleConfigs.length; i++) {
        let newBundler = new Bundler(bundleConfigs[i], gulpConfig.isWatching || bundlesConfig.useWatchify)
        if (newBundler) {
          bundlers[newBundler.settings.name] = newBundler
          gutil.log(`Generated bundler ${newBundler.settings.name}`)
        }
      }
      if (bundlers.length) {
        gutil.log(`Generated ${bundlers.length} bundlers`)
      }
    }
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: bundlesConfig,
    generateBundlers
  }
}
