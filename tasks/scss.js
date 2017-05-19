/**
 * Compile SCSS files
 */

let gulp = require('gulp')
let gulpif = require('gulp-if')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')
let scss = require('gulp-sass')
let autoprefixer = require('gulp-autoprefixer')

module.exports = function (gulpConfig) {
  // Need to put this here so it has access to the gulpConfig
  let cssTasks = require('./css')(gulpConfig)

  /**
   * Default SCSS config
   */
  let scssConfig = extend(true, {
    watchSrc: ['./src/{sass,scss}/**/*.{scss,sass}'],
    compileSCSS: {
      src: ['./src/{sass,scss}/*.{sass,scss}'],
      dest: path.join(gulpConfig.buildDir, 'css'),
      scss: {},
      autoprefixer: {
        browsers: ['last 2 versions', '> 1%'],
        cascade: true
      }
    }
  }, objectPath.get(gulpConfig, 'scss'))

  /**
   * Compile SCSS files to CSS
   */
  function compileSCSS () {
    return gulp.src(scssConfig.compileSCSS.src)
      .pipe(scss(scssConfig.compileSCSS.scss))
      .pipe(autoprefixer(scssConfig.compileSCSS.autoprefixer))
      .pipe(gulp.dest(scssConfig.compileSCSS.dest))
      .pipe(gulpif(gulpConfig.env !== 'development', cssTasks.minifyCSS()))
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: scssConfig,
    compileSCSS
  }
}
