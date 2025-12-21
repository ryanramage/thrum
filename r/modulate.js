const R = require('ramda')
const lengths = require('../lib/lengths')
const Tonal = require('@tonaljs/tonal')

module.exports = R.curryN(5, modulate)

function modulate(subdivision, actionsFilter, transformations, emitter, state) {
  // First, let the emitter add actions to state
  emitter(state)
  
  // Then transform the actions that match the filter
  state.actions = state.actions.map(a => {
    if (!actionsFilter(a)) return a
    // Apply transformations using Ramda's evolve
    return R.evolve(transformations, a)
  })
  
  return state
}
