const R = require('ramda')
const lengths = require('../lib/lengths')

const mod = ([beatsPerBar, noteLength], operator, state) => {
  let base = beatsPerBar * lengths[noteLength]
  if (state.spp % base === 0) {
    let _length = lengths[noteLength]
    operator(1, _length, state)
  }
  return state
}

module.exports = R.curryN(3, mod)
