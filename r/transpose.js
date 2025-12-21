const R = require('ramda')
const expression = require('../r/expression.js')
const Tonal = require('@tonaljs/tonal')

module.exports = R.curryN(2, transpose)

function transpose(interval, exp, _state) {
  // Handle curried case where _state is not provided
  if (!_state) {
    return (state) => transpose(interval, exp, state)
  }
  
  let state = expression(exp, _state)
  // transpose all the notes
  state.actions = state.actions.map(a => {
    if (!a.note) return a
    return {
      ...a,
      note: Tonal.Note.transpose(a.note, interval)
    }
  })
  return state
}
