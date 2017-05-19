/**
 * Common utilities (and their instances)
 */

let $ = require('jquery')
let extend = $.extend // Shorthand
let objectPath = require('object-path')
let consts = require('@app/common/constants')

/**
 * No operation
 */
function noop () {}

/**
 * In case the console doesn't exist, make a dummy object so `console.log` calls don't fail
 */
function consolePolyfill () {
  // Use window console (if debug is enabled and the console object exists)
  if (consts.debug && (console || objectPath.has(window, 'console'))) {
    return console || window.console

  // Give an object with correct properties but with function that does nothing
  } else {
    return {
      clear: noop,
      count: noop,
      debug: noop,
      error: noop,
      group: noop,
      info: noop,
      log: noop,
      table: noop,
      time: noop,
      timeEnd: noop,
      trace: noop,
      warn: noop
    }
  }
}

module.exports = {
  $,
  extend,
  objectPath,
  console: consolePolyfill(),
  noop
}
