/**
 * Fix gulp's error handling
 * See: https://github.com/gulpjs/gulp/issues/71
 */

let gulp = require('gulp')

var origSrc = gulp.src
gulp.src = function () {
  return fixPipe(origSrc.apply(this, arguments))
}

function fixPipe(stream) {
  var origPipe = stream.pipe
  stream.pipe = function (dest) {
    arguments[0] = dest.on('error', function (error) {
      var nextStreams = dest._nextStreams
      if (nextStreams) {
        nextStreams.forEach(function (nextStream) {
          nextStream.emit('error', error)
        })
      } else if (dest.listeners('error').length === 1) {
        throw error
      }
    })
    var nextStream = fixPipe(origPipe.apply(this, arguments))
    ;(this._nextStreams || (this._nextStreams = [])).push(nextStream)
    return nextStream
  }
  return stream
}
