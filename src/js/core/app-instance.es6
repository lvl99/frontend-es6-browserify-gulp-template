/**
 * App Instance
 */

let { $, extend, console } = require('@app/common/utils')

module.exports = function AppInstance (options) {
  /**
   * App settings
   */
  this.settings = extend({
    // Default config
  }, options)

  // Do all the app initialisation
  this.init = () => {
    console.log('Why hello, World. ❤️ from the console.')
  }
}
