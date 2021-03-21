const rc = require('rc')
const toMidi = require('./lib/toMidi')
const toCC = require('./lib/toCC')


const thrum = {}

// meter functions
thrum.bars = require('./r/bars')
thrum.length = require('./r/length')
thrum.repeat = require('./r/repeat')
thrum.lfo = require('./r/lfo')
thrum.subdivision = require('./r/subdivision')
thrum.ramp = require('./r/ramp')

// non-meter
thrum.pattern = require('./r/pattern')
thrum.play = require('./r/play')
thrum.strum = require('./r/strum')
thrum.transpose = require('./r/transpose')
thrum.Tonal = require('@tonaljs/tonal')
thrum.frequency = require('./r/frequency')
thrum.cc = require('./r/cc')
thrum.chord = require('./lib/chord')

// exporting more the manual setup
thrum.setup = (options) => rc('thrum', options)
thrum.connect = require('./lib/connect')

// the main entry into thrum for most people
thrum.tick = (tickExpression) => {
  thrum.connect(thrum.setup(), {toMidi, toCC}, tickExpression)
}

thrum.meter = (meter, noteLength) => {
  if (typeof meter === 'number') { // if user provides two strings instead of one array
    meter = [meter, noteLength]
  }

  // bind the meter functions
  const boundThrum = thrum
  boundThrum.bars = thrum.bars(meter)
  boundThrum.length = thrum.length(meter)
  boundThrum.repeat = thrum.repeat(meter)
  boundThrum.lfo = thrum.lfo(meter)
  boundThrum.subdivision = thrum.subdivision(meter)
  boundThrum.ramp = thrum.ramp(meter)
  return boundThrum
}

module.exports = thrum
