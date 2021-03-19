const R = require('ramda')
const Subdivision = require('./subdivision')

const mod = (meter, subdivision, operator, state) => {
  let length = Subdivision(meter, subdivision)
  if (state.spp % length === 0) {
    let count = state.spp / length
    operator(count, length, state)
  }
  return state
}

module.exports = R.curryN(4, mod)
