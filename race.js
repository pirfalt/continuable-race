// Race continuables against each other. Returns a new continuable
// that results in the value of whatever continuable gets a value or
// error first.

var slice = Array.prototype.slice
module.exports = race

// race := ([...Continuable<Any>]) => Continuable<Any>
function race(conts) {
  var pending = true
  conts = Array.isArray(conts)
    ? conts
    : slice.call(arguments)

  return function racedContinuation(cb) {
    conts.forEach(function (cont) {
      cont(function (err, val) {
        if (pending) {
          pending = false
          cb(err, val)
        }
      })
    })
  }
}