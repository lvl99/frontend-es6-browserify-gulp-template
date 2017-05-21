/**
 * Generic JS Tasks
 */

let objectPath = require('object-path')
let extend = require('extend')
let lazypipe = require('lazypipe')
let gulpif = require('gulp-if')
let rename = require('gulp-rename')
let concat = require('gulp-concat')
let sourcemaps = require('gulp-sourcemaps')
let uglify = require('gulp-uglify')

module.exports = function (gulpConfig) {
  /**
   * Default JS config
   */
  let jsConfig = extend({
    minifyJS: {
      uglify: {},
      rename: {
        extname: '.min.js'
      }
    },
    concatJS: {
      destFile: undefined
    }
  }, objectPath.get(gulpConfig, 'js'))

  /**
   * Minify JS files using lazypipe
   */
  let minifyJS = lazypipe()
    .pipe(function() {
      return gulpif(gulpConfig.env !== 'production', sourcemaps.init())
    })
    .pipe(uglify, objectPath.get(jsConfig, 'minifyJS.uglify'))
    .pipe(rename, objectPath.get(jsConfig, 'minifyJS.rename'))
    .pipe(function () {
      return gulpif(gulpConfig.env !== 'production', sourcemaps.write({
        loadMaps: true
      }))
    })

  /**
   * Concat JS files using lazypipe
   */
  let concatJS = lazypipe()
    .pipe(concat, objectPath.get(jsConfig, 'concatJS.destFile'))

  // Public (will be turned into gulp tasks)
  return {
    config: jsConfig,
    pipes: {
      minifyJS,
      concatJS
    }
  }
}
