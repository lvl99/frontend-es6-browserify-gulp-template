# Build template for developing ES6 JS apps

By Matt Scheurich [matt@lvl99.com](mailto:matt@lvl99.com)

This template is just a starting point for developing and building ES6 JavaScript apps. It's not going to fit your app,
but it is what I've started creating for myself as a base starting point after doing many different projects many
different ways, but with the same essential components.

It utilises Node.JS and `npm`, relying on `gulp`, `browserify` and `babel`. It supports an active development workflow
with `browser-sync`, which means you can code and have it automatically refreshed in the browser.

Optionally I've included basic tasks for `less` and `scss` and there's some other basic `js` and `css` tasks that enable
minification and concatenation which are run with `lazypipe`.

There are some other ideas at play, namely using third-party vendor code as globals and how to include that into the
build structure as well (notable for WordPress theme and plugin development). For this `browserify-shim` is required,
especially if you need traditional node-like `require` behaviour to interop with vendor code that doesn't support
CommonJS modules.

Some people prefer Webpack and its magic, but I still really like Browserify and having some direct control. Build tasks
and folder layouts are really quite opinionated and sometimes need to cover a lot of bases and may not include solutions
adequate for your conditions. Consider this one of many opinions!

I hope this helps you to create your own successful app and build structure.


## Structure

```
  + build/                    # All compiled files for deployment get put here
  |  + css/
  |  + images/
  |  + js/
  |  + vendors/               # Third-party vendor files go here (ones which won't be transformed, but may be compiled)
  |  |  + fancybox/
  |  |  + swiper/
  |  |    ...
  |    ...
  + src/                      # All your source files go here (ones that will be transformed/compiled/etc.)
  |  + images/
  |  + js/
  |  + less/
  |    ...
  + static/                   # Static files (images, etc.) which will get copied to the build directory
  |  + images/
  |  - index.html
  |    ...
  + tasks/                    # I've split up the gulpfile.js into separate files for a more maintainable codebase
  + tests/                    # Folder to collect all the automated tests for the JS code
  + vendors/                  # Holds third-party vendor files which then get integrated into the build 
    gulpfile.js               # The gulp controller which collates all the tasks files
    package.json              # NPM package definition, plus some extra configuration options (see `gulpConfig`)
```


## Why?

1. Write in modern ES6 JavaScript and transpile to ES5 JS for browser compatibility
2. Compile and package modular JS code into bundles
3. Use CSS preprocessors (LESS and SCSS) to compile CSS bundles and cross-browser compatibility (`autoprefixer`)
4. Minify and concatenate JS and CSS bundles and third-party vendor code into as few files as possible to reduce
loading time


## Conventions

#### ES6 JavaScript file extensions

Since ES6 is significantly different to ES5 and doesn't work in a lot of browsers, I like to name the frontend JS ES6
files as `.es6` instead of `.js`. The benefit is that Babel already supports this naming convention, plus it is explicit
as to what the file is, and separates it from third-party vendor files which are 99.9% compiled (and/or minified) ES5
`.js` files.


#### Tasks

Tasks (either single or sets of related tasks) have been split into separate files. This is done to manage the build
runner codebase better, as well as make the build runner more modular, i.e. only `require` what you need. This means the
`gulpfile.js` is purely about the order of tasks (otherwise known as "task recipes" -- completely arbitrary name) rather
than what each task does.

Each task file should follow the same structure:

```ecmascript 6
  /**
   * My cool task 
   */

  let gulp = require('gulp')
  let extend = require('extend')
  let objectPath = require('object-path')
  // blah blah blah...
  
  // Single export which is a function that takes the gulpConfig object
  module.exports = function (gulpConfig) {
    /**
     * You could set up default config values for this task (or shared values for this set of tasks) 
     */
    let setConfig = extend({
      // Default values...
    }, objectPath.get(gulpConfig, 'setName'))
    
    /**
     * A single task to perform 
     */
    function singleTaskName () {
      // Your task code goes here
      // gulp.src(...)
      //   .pipe(gulp.dest(...))
    }
    
    // The return value is a basic object with the task configuration and the task method itself
    // This means you could change the config and other tasks can include this task method
    return {
      _config: setConfig,
      taskName
    }
  }
```

When you come to integrating your task module into the `gulpfile.js`, you can require the task file then set each task
method as a `gulp.task` manually, or require it in the `tasks` object for it to have all its public task methods
automatically added to `gulp`.


## Gulp Config

There is a `gulpConfig` object in the `package.json` which allows you to configure the build from one central point,
however this shouldn't be completely relied on to solve all your build configuration.

It's probable you may need to extend or modify the `gulpConfig` in the `gulpfile.js`, or you can set or extend each
separate task file configs to support your app's specific needs.

As such, there is 'convention over configuration' at play and the `package.json` based configuration will solve your
needs if you have nothing more or less to do than what is included in this template.


## Stuff to be careful about

* Requiring too many `npm` packages may bloat your app JS code. Ensure everything included is necessary and required
for your app development, and be aware of package dependencies. If your JS code compiles and minifies to >1MB then
you're doing it wrong!

* Set `gulpConfig.env` to `development`, `staging` or `production` to affect minification and sourcemap generation. 

| Feature         | `development` | `staging` | `production` |
|-----------------|---------------|-----------|--------------|
| Minification    |      No       |    Yes    |     Yes      |
| Source Maps     |      Yes      |    Yes    |     No       |

* Support for `import`/`export` on Node.JS is tentative and not entirely reliable. Don't use it in task code (and I'd
  recommend not using it in app code too, just for consistency).

* If one task file relies on another task file, then require the dependent task file inside the exported function:
```ecmascript 6
  module.exports = function (gulpConfig) {
    let otherTaskFile = require('./otherTaskFile')(gulpConfig)
    // ... your task code
  }
```

## Third-party vendor plugins

Third-party (otherwise known as "vendor") plugins all vary with their structure and support of modules. Some just want
to attach to a global `jQuery` object, others have `cjs` or other such CommonJS/other module compatible versions available.

When you can't `import`/`require` third-party stuff into the JS, or there are extra assets and things which are
required, you may want to just upload the whole vendor folder, or cherry-pick what you need for your app's purposes.

For the vendor scripts which require certain variables, using Browserify wouldn't necessarily expose the `jQuery` object
(or some scripts look for the `$` and not the `jQuery` variable) so using `browserify-shim` can help.

Personally I prefer third-party vendor plugins managed with `npm` (or `bower`), but if you have some proprietary code or
otherwise (or some vendor plugins have other assets, like images), you can include it and manage its integration in the
build with the vendors tasks.


## Tests

Because it's always good to test! I've included Jest if you want to use it.


## Tips

1. Babel lets you do `import`/`export` keywords. This is great for readability, but Node.JS doesn't really support
   and still relies on `require` and `module.exports`. Having the two separate types is supported and since the frontend
   app code will be transpiled to a flat JS which relies on a polyfill of `require`, it's at your discretion how you want
   to do things.

2. You can extend Babel with the numerous plugins at your disposal. Need `async`/`await`? Just include it and specify
   it in your `package.json` like you normally would.

3. @TODO (heh heh)


## Todo

* Test, test, test, and fix any bugs/errors


## License

Copyright 2017 Matt Scheurich

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
