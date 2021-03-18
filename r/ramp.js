// Frequency = Subdivision | Note | string | Hertz;
const R = require('ramda')
const Subdivision = require('./subdivision')

// t - float between 0-1. a start of range, b end of range
const interpolate = function (t, a, b) { return a * (1 - t) + b * t }

const mod = ([beatsPerBar, noteLength], period, sample, waveType, lowVal, hiVal, operator, state) => {
  let periodSubdivision = Subdivision([beatsPerBar, noteLength], period)
  let sampleSubdivision = Subdivision([beatsPerBar, noteLength], sample)

  // only calculate if we are on the sample beat
  if (state.spp % sampleSubdivision === 0) {
    let i = state.spp % periodSubdivision
    let t = (i % periodSubdivision) / periodSubdivision
    let val = Math.round(interpolate(t, lowVal, hiVal))
    console.log(t, val)
  }
  return state
}

module.exports = R.curryN(8, mod)
