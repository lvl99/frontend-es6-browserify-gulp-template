/**
 * Compile LESS files
 */

let gulp = require('gulp')
let gulpif = require('gulp-if')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')
let less = require('gulp-less')
let autoprefixer = require('gulp-autoprefixer')

module.exports = function (gulpConfig) {
  // Need to put these here
  let cssPipes = require('./css')(gulpConfig).pipes

  /**
   * Default LESS config
   */
  let lessConfig = extend(true, {
    watchSrc: ['./src/less/**/*.less'],
    compileLess: {
      src: ['./src/less/*.less'],
      dest: path.join(gulpConfig.buildDir, 'css'),
      less: {},
      autoprefixer: {
        browsers: ['last 2 versions', '> 1%'],
        cascade: true
      }
    }
  }, objectPath.get(gulpConfig, 'less'))

  /**
   * Compile LESS files to CSS
   */
  function compileLess () {
    return gulp.src(lessConfig.compileLess.src)
      .pipe(less(lessConfig.compileLess.less))
      .pipe(autoprefixer(lessConfig.compileLess.autoprefixer))
      .pipe(gulp.dest(lessConfig.compileLess.dest))
      .pipe(gulpif(gulpConfig.env !== 'development', cssPipes.minifyCSS()))
  }

  // Public (will be turned into gulp tasks)
  return {
    config: lessConfig,
    tasks: {
      compileLess
    }
  }
}
