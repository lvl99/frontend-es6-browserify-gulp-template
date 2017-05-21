/**
 * Generic build tasks
 */

let gulp = require('gulp')
let path = require('path')
let del = require('del')
let gulpif = require('gulp-if')
let changed = require('gulp-changed')
let lazypipe = require('lazypipe')

module.exports = function (gulpConfig) {
  // Task dependencies
  let serverPipes = require('./browsersync')(gulpConfig).pipes

  /**
   * Clean the build directory
   */
  function cleanBuild () {
    // Ignore .gitkeep file but delete everything else
    del.sync([`!${path.join(gulpConfig.buildDir, '.gitkeep')}`,
      path.join(gulpConfig.buildDir, '*')])
  }

  /**
   * Copy files to build
   */
  let copyToBuild = lazypipe()
    .pipe(changed, gulpConfig.buildDir)
    .pipe(gulp.dest, gulpConfig.buildDir)
    .pipe(serverPipes.streamToServer)

  // Public (will be turned into gulp tasks)
  return {
    pipes: {
      copyToBuild
    },
    tasks: {
      cleanBuild
    }
  }
}
