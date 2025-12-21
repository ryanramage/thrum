const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(5, play)

function play(options, notes, count, length, state) {
  // Handle different calling patterns
  if (!state) {
    // Called as play(note, count, length, state) - options omitted
    if (typeof options === 'string' && typeof notes === 'number' && typeof count === 'number' && typeof length === 'object') {
      state = length
      length = count
      count = notes
      notes = options
      options = {}
    } else {
      // Called as play({}, note, count, length) - missing state
      // This shouldn't happen with curryN(5), but keep for safety
      state = length
      length = count
      count = notes
      notes = options
      options = {}
    }
  }
  
  let _msg = { to: 'toMidi' }
  if (typeof notes === 'object' && notes.octave && typeof notes.octave === 'function') {
    notes = notes.octave(4)
    let i = count % notes.length
    _msg.note = notes[i]
  } else if (typeof notes === 'function') {
    let i = count % notes.length
    _msg.note = notes(i)
  } else if (typeof notes === 'string') {
    _msg.note = notes
  } else {
    let i = count % notes.length
    _msg.note = notes[i]
  }
  
  // Smart defaults
  _msg.length = options.length || length || 96 // default to quarter note (96 ticks)
  _msg.velocity = options.velocity || 100 // default velocity

  if (options.velocity) _msg.velocity = options.velocity
  if (options.channel) _msg.channel = options.channel

  state.actions.push(_msg)
  return state
}
