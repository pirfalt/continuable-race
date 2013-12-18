var fs = require('fs')
var race = require('./race')

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
