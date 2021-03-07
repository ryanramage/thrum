const R = require('ramda')
const lengths = require('../lib/lengths')
const Tonal = require('@tonaljs/tonal')

module.exports = R.curryN(5, modulate)

function modulate(subdivision, actionsFilter, transformations, emitter, state) {
  emitter(state)
  // transpose all the notes
  state.actions = state.actions.map(a => {
    if (!actionFilter(a)) return a
    le
    let a_ = R.evolve(transformations)
  })
  return state
}
