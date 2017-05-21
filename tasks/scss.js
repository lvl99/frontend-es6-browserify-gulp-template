/**
 * Compile SCSS files
 */

let gulp = require('gulp')
let gulpif = require('gulp-if')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')
let scss = require('gulp-sass')

module.exports = function (gulpConfig) {
  // Task dependencies
  let cssPipes = require('./css')(gulpConfig).pipes
  let serverPipes = require('./browsersync')(gulpConfig).pipes

  /**
   * Default SCSS config
   */
  let scssConfig = extend(true, {
    watchSrc: ['./src/{sass,scss}/**/*.{scss,sass}'],
    compileSCSS: {
      src: ['./src/{sass,scss}/*.{sass,scss}'],
      dest: path.join(gulpConfig.buildDir, 'css'),
      scss: {}
    }
  }, objectPath.get(gulpConfig, 'scss'))

  /**
   * Compile SCSS files to CSS
   */
  function compileSCSS () {
    return gulp.src(scssConfig.compileSCSS.src)
      .pipe(scss(scssConfig.compileSCSS.scss))
      .pipe(cssPipes.postProcessCSS())
      .pipe(gulp.dest(scssConfig.compileSCSS.dest))
      // Minify
      .pipe(gulpif(gulpConfig.env !== 'development', cssPipes.minifyCSS()))
      .pipe(gulpif(gulpConfig.env !== 'development', gulp.dest(scssConfig.compileSCSS.dest)))
      // Update file on browser/server
      .pipe(serverPipes.streamToServer())
  }

  // Public (will be turned into gulp tasks)
  return {
    config: scssConfig,
    tasks: {
      compileSCSS
    }
  }
}
