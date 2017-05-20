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
  env: process.env.NODE_ENV || 'production',
  srcDir: './src',
  buildDir: './build',
  staticDir: './static',
  testsDir: './tests'
}, _gulpConfig)

// Get and initialise the tasks (separated into individual files to make this gulpfile.js easier to manage) with the
// gulpConfig object and auto-generate gulp tasks to use in task recipes.
// The order is very important. Put tasks which rely on other tasks further down the order
let tasks = {
  browsersync: require('./tasks/browsersync')(gulpConfig),
  static: require('./tasks/static')(gulpConfig),
  build: require('./tasks/build')(gulpConfig),
  css: require('./tasks/css')(gulpConfig),
  js: require('./tasks/js')(gulpConfig),
  vendors: require('./tasks/vendors')(gulpConfig),
  browserify: require('./tasks/browserify')(gulpConfig),
  less: require('./tasks/less')(gulpConfig),
  scss: require('./tasks/scss')(gulpConfig)
}
for (let setName in tasks) {
  if (tasks.hasOwnProperty(setName) && tasks[setName].hasOwnProperty('tasks')) {
    for (let taskName in tasks[setName].tasks) {
      if (tasks[setName].tasks.hasOwnProperty(taskName)) {
        gulp.task(`${setName}.${taskName}`, tasks[setName].tasks[taskName])
      }
    }
  }
}

// Task Recipes
// -- Default
gulp.task('default', ['build'])

// -- Build
gulp.task('build', function () {
  return runSequence('build.cleanBuild', ['static.copyStatic', 'vendors.processVendors'], ['less.compileLess', 'browserify.generateBundlers'])
})

// -- Build (autodetect environment)
gulp.task('build:autodetect', function () {
  return runSequence(`build:${process.env.NODE_ENV || 'production'}`)
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
gulp.task('serve', ['browsersync.startServer', 'watch'])

// -- Serve (autodetect environment)
gulp.task('serve:autodetect', function () {
  return runSequence(`serve:${process.env.NODE_ENV || 'production'}`)
})

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

  gulp.watch(tasks.static.config.watchSrc, ['static.copyStatic'])
  gulp.watch(tasks.less.config.watchSrc, ['less.compileLess'])
  gulp.watch(tasks.scss.config.watchSrc, ['scss.compileSCSS'])
})
