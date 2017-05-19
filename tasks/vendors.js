/**
 * Process vendor files
 */

let gulp = require('gulp')
let gutil = require('gulp-util')
let del = require('del')
let path = require('path')
let objectPath = require('object-path')
let extend = require('extend')

module.exports = function (gulpConfig) {
  /**
   * Default vendors config
   */
  let vendorsConfig = extend({
    dest: path.join(gulpConfig.buildDir, 'vendors'),
    vendors: {
      // swiper: {
      //   src: './node_modules/swiper/dist/**/*',
      //   dest: './build/vendors/swiper'
      // },
      // fancybox: {
      //   src: './node_modules/@fancyapps/fancybox/dist/**/*',
      //   // tasks: (lazypipe()
      //   //   .pipe(...)),
      //   dest: './build/vendors/fancybox'
      // }
    }
  }, objectPath.get(gulpConfig, 'vendors'))

  /**
   * Process a vendor config object
   */
  function processVendorConfig (vendorConfig, vendorConfigName) {
    if (typeof vendorConfig === 'object' && vendorConfig) {
      // Process the config object which has a src property
      if (objectPath.has(vendorConfig, 'src')) {
        gutil.log(`Processing vendor config for ${vendorConfigName}`)

        // Set default vendor dest folder
        if (!objectPath.has(vendorConfig, 'dest')) {
          vendorConfig.dest = path.join(vendorsConfig.dest, vendorConfigName)
        }

        // Additional tasks to process on the vendor files
        if (objectPath.has(vendorConfig, 'tasks') && vendorConfig.tasks) {
          gulp.src(vendorConfig.src)
            .pipe(vendorConfig.tasks())
            .pipe(gulp.dest(vendorConfig.dest))

          // Simple clone
        } else {
          gulp.src(vendorConfig.src)
            .pipe(gulp.dest(vendorConfig.dest))
        }

        // Process any other object (assume collection of configs)
      } else {
        if (typeof vendorConfig === 'object') {
          for (let configPropName in vendorConfig) {
            if (objectPath.has(vendorConfig, configPropName)) {
              processVendorConfig(vendorConfig[configPropName], (vendorConfigName ? vendorConfigName + '.' + configPropName : configPropName))
            }
          }
        }
      }
    }
  }

  /**
   * Process all the vendor configs given in the config object
   */
  function processVendors () {
    gutil.log(`Cleaning ${vendorsConfig.dest}...`)

    // Delete the contents of the vendors folder
    del.sync([vendorsConfig.dest + '/*'])

    // Process all the vendors
    processVendorConfig(vendorsConfig.vendors)
  }

  // Public (will be turned into gulp tasks)
  return {
    _config: vendorsConfig,
    processVendors
  }
}
