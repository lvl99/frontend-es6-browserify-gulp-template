# Build boilerplate for developing ES6 JS apps

By Matt Scheurich <matt@blacksmith.studio>

This boilerplate is just a starting point for developing and building ES6 JavaScript apps.

It utilises Node.JS and `npm`, relying on `gulp`, `browserify` and `babel`. It supports an active development workflow
with `browser-sync`, which means you can code and have it automatically refreshing in the browser.

Optionally I've included basic tasks for `less` and `scss` and there's some other basic `js` and `css` tasks that enable
minification and concatenation.

There are some other ideas at play, namely using third-party vendor code as globals and how to include that into the
build structure as well. For this `browserify-shim` is required, especially if you need traditional node-like `require`
behaviour on vendor code that don't support CommonJS modules.

Some people prefer Webpack, but I still really like Browserify. Admittedly this structure is complex, but build tasks
and folder layouts are really quite opinionated and sometimes need to cover a lot of bases. Consider this one of many
opinions!

I hope this helps you to create your own successful app and build structure.


## Structure

```
  + build/                    # All compiled files get put here
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
  |    ...
  + tasks/                    # I've split up the gulpfile.js into separate files for a more maintainable codebase
  + tests/                    # Folder to collect all the automated tests for the JS code
    gulpfile.js               # The gulp controller which collates all the tasks files
    package.json              # NPM package definition, plus some extra configuration options (see `gulpConfig`)
```

## Conventions

Since ES6 is significantly different to ES5 and doesn't work in a lot of browsers, I like to name the frontend JS ES6
files as `.es6` instead of `.js`. The benefit is that Babel already supports this naming convention, plus it is explicit
as to what the file is, and separates it from third-party vendor files which are 99.9% compiled (and/or minified) ES5
`.js` files.


## Gulp Config

There is a `gulpConfig` object in the `package.json`, which allows you to configure the build from one central point,
however this shouldn't be completely relied on to solve all your build configuration. It's probable you may need to
extend or modify the existing task files to support your apps specific needs.


## Third-party vendor plugins

Third-party (otherwise known as "vendor") plugins all vary with their structure and support of modules. Some just want
to attach to a global `jQuery` object, others have `cjs` or other such CommonJS/other modulular compatible versions
available.

When you can't `import`/`require` third-party stuff into the JS, or there are extra assets and things which are
required, you may want to just upload the whole vendor folder, or cherry-pick what you need for your app's purposes.

For the vendor scripts which require certain variables, using Browserify wouldn't necessarily expose the `jQuery` object
(or some scripts look for the `$` and not the `jQuery` variable) so using `browserify-shim` can help.


## Tests

Because it's always good to test! I've included Jest if you want to use it.


## Tips

1. Babel lets you do `import`/`export` keywords. This is great for readability, but Node.JS doesn't really support
   and still relies on `require` and `module.exports`. Having the two separate types is supported and since the frontend
   app code will be transpiled to a flat JS which relies on a polyfill of `require`, it's at your discretion how you want
   to do things.

2. You can extend Babel with the numerous plugins at your disposal. Need `async`/`await`? Just include it and specify
   it in your `package.json` like you normally would.
