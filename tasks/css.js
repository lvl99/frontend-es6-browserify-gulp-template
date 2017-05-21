/**
 * Generic CSS Tasks
 */

let objectPath = require('object-path')
let extend = require('extend')
let lazypipe = require('lazypipe')
let gulpif = require('gulp-if')
let rename = require('gulp-rename')
let concat = require('gulp-concat')
let sourcemaps = require('gulp-sourcemaps')
let uglifycss = require('gulp-uglifycss')

module.exports = function (gulpConfig) {
  /**
   * Default CSS config
   */
  let cssConfig = extend(true, {
    minifyCSS: {
      uglify: {},
      rename: {
        extname: '.min.css'
      }
    },
    concatCSS: {
      destFile: undefined
    }
  }, objectPath.get(gulpConfig, 'css'))

  /**
   * Minify CSS files (using lazypipe)
   */
  let minifyCSS = lazypipe()
    .pipe(function () {
      return gulpif(gulpConfig.env !== 'production', sourcemaps.init)
    })
    .pipe(uglifycss, objectPath.get(cssConfig, 'minifyCSS.uglify'))
    .pipe(rename, objectPath.get(cssConfig, 'minifyCSS.rename'))
    .pipe(function () {
      return gulpif(gulpConfig.env !== 'production', sourcemaps.write({
        loadMaps: true
      }))
    })

  /**
   * Concat CSS files (using lazypipe)
   */
  let concatCSS = lazypipe()
    .pipe(concat, objectPath.get(cssConfig, 'concatCSS.destFile'))

  // Public (will be turned into gulp tasks)
  return {
    config: cssConfig,
    pipes: {
      minifyCSS,
      concatCSS
    }
  }
}
