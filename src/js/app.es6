/**
 * App
 */

let { $ } = require('@app/common/utils')
let AppInstance = require('@app/core/app-instance')

/**
 * Instantiate the app
 */
let App = new AppInstance({
  // App settings go here
})

/**
 * Fire on jQuery ready
 */
$(App.init)

module.exports = App
