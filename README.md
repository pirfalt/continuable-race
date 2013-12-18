# continuable-race

Race continuables against each other. Returns a new continuable that results
in the value of whatever continuable gets a value or error first.

Like Promise.race() for continuables

## `race`
`var race = require('continuable-race')`
race(...continuables)(function (err, val) {
  // Use whatever continuable that finished first
})

## Example
```
var fs = require('fs')
var race = require('continuable-race')

var timeout = function (cb) {
	setTimeout(function () {
		cb(new Error('Timeout'))
	}, 100)
}

var file = function (cb) {
  fs.readFile(__dirname + '/race.js', cb)
}

race(file, timeout)(function (err, val) {
	if (err) return console.error(err)

	// Will only happend if the file were read in under 100 ms
	console.log(val.toString())
})
```

Will be far more useful for callbacks to network resonses or any other resonse
with unreliable resonse time, but it's an easy example.
