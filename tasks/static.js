/**
 * Static assets tasks
 */

let gulp = require('gulp')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')

module.exports = function (gulpConfig) {
  // Task dependencies
  let buildPipes = require('./build')(gulpConfig).pipes

  /**
   * Default assets config
   */
  let staticConfig = extend({
    src: [path.join(gulpConfig.staticDir, '**/*')],
    dest: gulpConfig.buildDir,
    watchSrc: [path.join(gulpConfig.staticDir, '**/*')]
  }, objectPath.get(gulpConfig, 'assets'))

  /**
   * Copy static assets to build
   */
  function copyStatic () {
    return gulp.src(staticConfig.src)
      .pipe(buildPipes.copyToBuild())
  }

  // Public (will be turned into gulp tasks)
  return {
    config: staticConfig,
    tasks: {
      copyStatic
    }
  }
}
