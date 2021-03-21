const R = require('ramda')
const Subdivision = require('./subdivision')

const mod = (meter, subdivision, operator, state) => {
  let length = 0
  let offset = 0
  if (typeof subdivision === 'string') {
    length = Subdivision(meter, subdivision)
  }
  if (typeof subdivision === 'object') {
    length = Subdivision(meter, subdivision.period)
    if (subdivision.offset) offset = Subdivision(meter, subdivision.offset)
  }
  if (state.spp % length === offset) {
    let count = Math.floor(state.spp / length)
    operator(count, length, state)
  }
  return state
}

module.exports = R.curryN(4, mod)
