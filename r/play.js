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
    if (typeof notes === 'object' && notes.octave && typeof notes.octave === 'function') {
    notes = notes.octave(4) //
    let i = count % notes.length
    _msg.note =  notes[i] // an array
  } if (typeof notes === 'function') {
    let i = count % notes.length
    _msg.note = notes(i)
  } else if (typeof notes === 'string') _msg.note =  notes
  else {
    let i = count % notes.length
    _msg.note =  notes[i] // an array
  }
  _msg.length = options.length || length

  if (options.velocity) _msg.velocity = options.velocity


  state.actions.push(_msg)
  return state
}
