/**
 * BrowserSync tasks
 */

let objectPath = require('object-path')
let extend = require('extend')
let server = require('browser-sync').create()

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
   * Start the browsersync server
   */
  function startServer () {
    gulpConfig.isWatching = true
    server.init(browsersyncConfig)
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: browsersyncConfig,
    _server: server, // This is so other tasks can reference the created browsersync server instance
    startServer
  }
}
