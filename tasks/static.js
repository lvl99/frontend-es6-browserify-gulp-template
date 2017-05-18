/**
 * Static assets tasks
 */

let gulp = require('gulp')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')

module.exports = function (gulpConfig) {
  /**
   * Default assets config
   */
  let staticConfig = extend({
    src: [path.join(gulpConfig.staticDir, '**/*')],
    dest: gulpConfig.buildDir
  }, objectPath.get(gulpConfig, 'assets'))

  /**
   * Copy static assets to build
   */
  function copyStatic () {
    return gulp.src(staticConfig.src)
      .pipe(gulp.dest(path.join(staticConfig.dest)))
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: staticConfig,
    copyStatic
  }
}
