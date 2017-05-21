/**
 * BrowserSync tasks
 */

let objectPath = require('object-path')
let extend = require('extend')
let server = require('browser-sync').create()
let lazypipe = require('lazypipe')
let gulpif = require('gulp-if')

module.exports = function (gulpConfig) {
  /**
   * Default browsersync config
   */
  let browsersyncConfig = extend({
    server: {
      baseDir: gulpConfig.buildDir
    }
  }, objectPath.get(gulpConfig, 'browsersync'))

  /**
   * Stream files to the server
   */
  let streamToServer = lazypipe()
    .pipe(function () {
      return gulpif(gulpConfig.isWatching, server.stream())
    })

  /**
   * Reload files on the server
   */
  let reloadServer = lazypipe()
    .pipe(function () {
      return gulpif(gulpConfig.isWatching, server.reload())
    })

  /**
   * Start the browsersync server
   */
  function startServer () {
    gulpConfig.isWatching = true
    server.init(browsersyncConfig)
  }

  // Public (will be turned into gulp tasks)
  return {
    config: browsersyncConfig,
    server, // This is so other tasks can reference the created browsersync server instance
    pipes: {
      streamToServer,
      reloadServer
    },
    tasks: {
      startServer
    }
  }
}
