/**
 * Gulp file for building templates
 */

let gulp = require('gulp')
let objectPath = require('object-path')
let extend = require('extend')
let runSequence = require('run-sequence').use(gulp)

// Gulp config
let pkg = require('./package.json')
let _gulpConfig = objectPath.get(pkg, 'gulpConfig') || {}
let gulpConfig = extend({
  _root: __dirname,
  env: process.env.NODE_ENV,
  srcDir: './src',
  buildDir: './build',
  staticDir: './static',
  testsDir: './tests'
}, _gulpConfig)

// Get/initialise the tasks (separated into individual files to make this gulpfile.js easier to manage) and
// auto-generate gulp tasks
let tasks = {
  browsersync: require('./tasks/browsersync')(gulpConfig),
  static: require('./tasks/static')(gulpConfig),
  build: require('./tasks/build')(gulpConfig),
  css: require('./tasks/css')(gulpConfig),
  js: require('./tasks/js')(gulpConfig),
  vendors: require('./tasks/vendors')(gulpConfig),
  browserify: require('./tasks/browserify')(gulpConfig),
  less: require('./tasks/less')(gulpConfig),
  scss: require('./tasks/scss')(gulpConfig),
  jest: require('./tasks/jest')(gulpConfig)
}
for (let taskGroupName in tasks) {
  if (tasks.hasOwnProperty(taskGroupName)) {
    for (let taskName in tasks[taskGroupName]) {
      // Omit any task property that starts with an "_"
      if (!/^_/.test(taskName) && tasks[taskGroupName].hasOwnProperty(taskName)) {
        gulp.task(taskName, tasks[taskGroupName][taskName])
      }
    }
  }
}

// Task Recipes
// -- Default
gulp.task('default', ['build'])

// -- Build
gulp.task('build', function () {
  return runSequence(['cleanBuild', 'copyStatic', 'processVendors'], ['compileLess'], ['generateBundlers'])
})

// -- Build (Development)
gulp.task('build:development', function () {
  gulpConfig.env = 'development'
  return runSequence('build')
})

// -- Build (Staging)
gulp.task('build:staging', function () {
  gulpConfig.env = 'staging'
  return runSequence('build')
})

// -- Build (Production)
gulp.task('build:production', function () {
  gulpConfig.env = 'production'
  return runSequence('build')
})

// -- Serve
gulp.task('serve', ['startServer', 'watch'])

// -- Serve (Development)
gulp.task('serve:development', function () {
  gulpConfig.env = 'development'
  gulpConfig.isWatching = true
  return runSequence('serve', 'build')
})

// -- Build (Staging)
gulp.task('serve:staging', function () {
  gulpConfig.env = 'staging'
  gulpConfig.isWatching = true
  return runSequence('serve', 'build')
})

// -- Build (Production)
gulp.task('serve:production', function () {
  gulpConfig.env = 'production'
  gulpConfig.isWatching = true
  return runSequence('serve', 'build')
})

// -- Watch
gulp.task('watch', function () {
  gulpConfig.isWatching = true

  // gulp.watch('./path/to/watch/file', ['taskToAction'])
  gulp.watch(tasks.less._config.watchSrc, ['compileLess'])
  gulp.watch(tasks.scss._config.watchSrc, ['compileSCSS'])
})
