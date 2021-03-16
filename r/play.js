const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(4, play)

function play(options, notes, count, length, state) {
  // not sure how to model this properly, so for now
  if (!state) {
    // we got empty options, shuffle
    state = length
    length = count
    count = notes
    notes = options
    options = {}
  }
  let _msg = { to: 'toMidi' }
  let i = count % notes.length
  if (typeof notes === 'string') _msg.note =  notes
  else _msg.note =  notes[i]
  _msg.length = options.length || length

  if (options.velocity) _msg.velocity = options.velocity

  console.log(_msg)

  state.actions.push(_msg)
  return state
}
