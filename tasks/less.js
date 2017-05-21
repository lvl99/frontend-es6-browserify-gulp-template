/**
 * Compile LESS files
 */

let gulp = require('gulp')
let gulpif = require('gulp-if')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')
let less = require('gulp-less')

module.exports = function (gulpConfig) {
  // Task dependencies
  let cssPipes = require('./css')(gulpConfig).pipes
  let serverPipes = require('./browsersync')(gulpConfig).pipes

  /**
   * Default LESS config
   */
  let lessConfig = extend(true, {
    watchSrc: ['./src/less/**/*.less'],
    compileLess: {
      src: ['./src/less/*.less'],
      dest: path.join(gulpConfig.buildDir, 'css'),
      less: {}
    }
  }, objectPath.get(gulpConfig, 'less'))

  /**
   * Compile LESS files to CSS
   */
  function compileLess () {
    return gulp.src(lessConfig.compileLess.src)
      .pipe(less(objectPath.get(lessConfig, 'compileLess.less')))
      .pipe(cssPipes.postProcessCSS())
      .pipe(gulp.dest(lessConfig.compileLess.dest))
      // Minify
      .pipe(gulpif(gulpConfig.env !== 'development', cssPipes.minifyCSS()))
      .pipe(gulpif(gulpConfig.env !== 'development', gulp.dest(lessConfig.compileLess.dest)))
      // Update file on browser/server
      .pipe(serverPipes.streamToServer())
  }

  // Public (will be turned into gulp tasks)
  return {
    config: lessConfig,
    tasks: {
      compileLess
    }
  }
}
