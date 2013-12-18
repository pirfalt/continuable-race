var test = require('tape')
var cont = require('continuable')
var race = require('../race')

function delay(cont, time) {
  return function delayed(cb) {
    setTimeout(function () {
      cont(cb)
    }, time)
  }
}


var cv = cont.of('instant')
var ci = function (cb) {
  setImmediate(function () { cb(null, 'immediate') })
}
var ct = delay(cont.of('delayed(100)'), 100)

test('Same turn vs Immediate', function (t) {
  t.plan(2)

  race(cv, ci)(function (e,v) {
    t.equal(v, 'instant', 'Same turn is faster than immediate')
  })

  race(ct, cv)(function (e,v) {
    t.equal(v, 'instant', 'Argument order does not matter')
  })
})

test('Immediate vs timeout(100)', function (t) {
  t.plan(2)

  race(ci, ct)(function (e,v) {
    t.equal(v, 'immediate', 'Immediate is faster than timeout')
  })
  race(ct, ci)(function (e,v) {
    t.equal(v, 'immediate', 'Argument order does not matter')
  })
})

test('timeout(200) vs timeout(100)', function (t) {
  t.plan(2)

  race(delay(cont.of('delayed(200)'), 200), ct)(function (e,v) {
    t.equal(v, 'delayed(100)', 'Timeout 100 vs timeout 200')
  })
  race(ct, delay(cont.of('delayed(200)'), 200))(function (e,v) {
    t.equal(v, 'delayed(100)', 'Argument order does not matter')
  })
})

test('Instant vs Instant', function (t) {
  t.plan(1)

  race(cont.of('first'), cont.of('second'))(function (e,v) {
    t.equal(v, 'first', 'If more than one are done in same turn, order does matter')
  })
})

test('Variable arguments length', function (t) {
  t.plan(2)

  race(cv, ci, ct)(function (e,v) {
    t.equal(v, 'instant', '3 arguments')
  })

  race(cv, ci, ct, cont.of('4:th'))(function (e,v) {
    t.equal(v, 'instant', '4 arguments')
  })
})

test('Array argument', function (t) {
  t.plan(1)

  race([cv, ci, ct])(function (e,v) {
    t.equal(v, 'instant', 'Array argument')
  })
})