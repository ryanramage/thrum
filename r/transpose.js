const R = require('ramda')
const expression = require('./expression')
const Tonal = require('@tonaljs/tonal')
const SongState = require('./songState')

module.exports = R.curryN(2, transpose)

function transpose(interval, exp, _state) {
  // Handle curried case where _state is not provided
  if (!_state) {
    return (state) => transpose(interval, exp, state)
  }
  
  // Create a temporary state to capture actions from the inner expression
  let tempState = SongState.set({
    spp: _state.spp,
    userState: _state.userState,
    actions: []
  })
  
  // Execute the inner expression with the temp state
  tempState = expression(exp, tempState)
  
  // Transpose all the notes in the captured actions
  let transposedActions = tempState.actions.map(a => {
    if (!a.note) return a
    let transposed = Tonal.Note.transpose(a.note, interval)
    return {...a, note: transposed}
  })
  
  // Add transposed actions to the original state
  transposedActions.forEach(a => _state.actions.push(a))
  
  // Return the original state with updated actions
  return SongState.set({
    spp: _state.spp,
    userState: tempState.userState,
    actions: _state.actions
  })
}
