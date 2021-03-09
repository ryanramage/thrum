const rc = require('rc')
const tick = require('./r/tick')
const toMidi = require('./lib/toMidi')

// the most used helpers
exports.bars = require('./r/bars')
exports.pattern = require('./r/pattern')
exports.play = require('./r/play')
exports.strum = require('./r/strum')({}) // a strum, use defaults
exports.strumO = require('./r/strum')
exports.transpose = require('./r/transpose')
exports.Tonal = require('@tonaljs/tonal')

// exporting more the manual setup
exports.setup = (options) => rc('thrum', options)
exports.connect = require('./lib/connect')

// the main entry into thrum for most people
exports.tick = (tickExpression) => {
  exports.connect(exports.setup(), {toMidi}, tickExpression)
}
