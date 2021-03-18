const rc = require('rc')
const toMidi = require('./lib/toMidi')
const toCC = require('./lib/toCC')

// the most used helpers
exports.bars = require('./r/bars')
exports.pattern = require('./r/pattern')
exports.play = require('./r/play')
exports.strum = require('./r/strum')
exports.transpose = require('./r/transpose')
exports.subdivision = require('./r/subdivision')
exports.Tonal = require('@tonaljs/tonal')
exports.mod = require('./r/mod')
exports.frequency = require('./r/frequency')
exports.ramp = require('./r/ramp')
exports.lfo = require('./r/lfo')
exports.cc = require('./r/cc')

// exporting more the manual setup
exports.setup = (options) => rc('thrum', options)
exports.connect = require('./lib/connect')

// the main entry into thrum for most people
exports.tick = (tickExpression) => {
  exports.connect(exports.setup(), {toMidi, toCC}, tickExpression)
}
