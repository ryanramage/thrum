const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(5, play)

function play(options, notes, count, length, state) {
  // Detect if we're being called with (note, count, length, state) - options omitted
  // This happens when play is partially applied like: play('C4') then called with (count, length, state)
  if (typeof options === 'string' && typeof notes === 'number' && typeof count === 'number' && typeof length === 'object') {
    state = length
    length = count
    count = notes
    notes = options
    options = {}
  }
  // Detect if we're being called with (function, count, length, state) - options omitted
  else if (typeof options === 'function' && typeof notes === 'number' && typeof count === 'number' && typeof length === 'object') {
    state = length
    length = count
    count = notes
    notes = options
    options = {}
  }
  // Detect if we're being called with (array, count, length, state) - options omitted
  else if (Array.isArray(options) && typeof notes === 'number' && typeof count === 'number' && typeof length === 'object') {
    state = length
    length = count
    count = notes
    notes = options
    options = {}
  }
  // Detect if we're being called with (chord object, count, length, state) - options omitted
  else if (typeof options === 'object' && options.octave && typeof options.octave === 'function' && typeof notes === 'number' && typeof count === 'number' && typeof length === 'object') {
    state = length
    length = count
    count = notes
    notes = options
    options = {}
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
