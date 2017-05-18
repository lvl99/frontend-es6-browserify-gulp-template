// @TODO

let gulp = require('gulp')
let jest = require('gulp-jest').default
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')

module.exports = function (gulpConfig) {
  /**
   * Default Jest Config
   */
  let jestConfig = extend(true, {
    runTests: {
      src: path.join(gulpConfig.testsDir, '**/*.js'),
      jest: {
        browser: true,
        moduleFileExtensions: ['js', 'es6'],
        transform: {
          '^.+\\.es6?$': 'babel-jest'
        },
        verbose: true
      }
    }
  }, objectPath.get(gulpConfig, 'jest'))

  /**
   * Run all the tests
   */
  function runTests () {
    return gulp.src(jestConfig.runTests.src)
      .pipe(jest(jestConfig.runTests.jest))
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: jestConfig,
    runTests
  }
}
