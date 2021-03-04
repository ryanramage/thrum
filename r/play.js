const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(3, play)

function play(notes, count, length, state) {
  let _msg = { to: 'toMidi' }
  let i = count % notes.length
  _msg.note =  notes[i]
  _msg.length = length
  state.actions.push(_msg)
  return state
}
