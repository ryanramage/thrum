const R = require('ramda')
const Subdivision = require('./subdivision')
const { sine, sawtooth } = require('periodic-function')

// The general one-line formula to linearly rescale data values having observed min and max into a new arbitrary range min' to max' is
// newvalue= (max'-min')/(max-min)*(value-max)+max'
const scale = (min, max, min_, max_, n) => (max_ - min_) / (max - min) * (n - max) + max
const interpolate = function (t, a, b) { return a * (1 - t) + b * t }
const waveTypes = {
  sine: (t) => scale(-1, 1, 0, 1, sine(t, -0.25)),  // so it starts at 0
  sawtooth: (t) => scale(-1, 1, 0, 1, sawtooth(t, true))
}


const mod = ([beatsPerBar, noteLength], period, sample, waveType, lowVal, hiVal, operator, state) => {
  let periodSubdivision = Subdivision([beatsPerBar, noteLength], period)
  let sampleSubdivision = Subdivision([beatsPerBar, noteLength], sample)

  // only calculate if we are on the sample beat
  if (state.spp % sampleSubdivision === 0) {
    let i = state.spp % periodSubdivision
    let t = (i % periodSubdivision) / periodSubdivision
    let fn = waveTypes[waveType]
    if (!fn) return
    let raw = fn(t)

    let value = Math.round(interpolate(raw, lowVal, hiVal))
    operator(t, value, state)
  }
  return state
}

module.exports = R.curryN(8, mod)
