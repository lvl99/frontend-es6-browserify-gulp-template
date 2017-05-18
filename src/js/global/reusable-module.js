/**
 * Favourite
 *
 * @param wrapper
 * @constructor
 */

function Favourite (wrapper) {
  this.wrapper = wrapper
  this.init()
  this.event()
}

/**
 * initialise the favourite module
 */
Favourite.prototype.init = function () {
  console.log(this.wrapper)
}

module.exports = Favourite
