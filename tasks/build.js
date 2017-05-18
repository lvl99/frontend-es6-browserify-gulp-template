/**
 * Generic build tasks
 */

let gulp = require('gulp')
let path = require('path')
let del = require('del')

module.exports = function (gulpConfig) {
  /**
   * Clean the build directory
   */
  function cleanBuild () {
    // Ignore .gitkeep file but delete everything else
    del.sync([`!${path.join(gulpConfig.buildDir, '.gitkeep')}`,
      path.join(gulpConfig.buildDir, '*')])
  }

  // Public (will be turned into gulp tasks)
  return {
    cleanBuild
  }
}
