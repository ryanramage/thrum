// Frequency = Subdivision | Note | string | Hertz;

const R = require('ramda')
const lengths = require('../lib/lengths')

const mod = (periodFrequency, sampleFrequency, operator, state) => {
  if (state.spp % frequency === 0) {
    let _length = 1
    operator(1, _length, state)
  }
  return state
}

module.exports = R.curryN(3, mod)
