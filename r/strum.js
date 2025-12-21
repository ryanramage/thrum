const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(4, play)

function play(options, chordNotes, count, _length, state) {
  if (!state) {
    // we got empty options, shuffle
    state = _length
    _length = count
    count = chordNotes
    chordNotes = options
    options = {}
  }

  // Handle string input as chord name shorthand
  if (typeof chordNotes === 'string') {
    const chord = require('../lib/chord')
    const chordObj = chord(chordNotes)
    chordNotes = chordObj.octave(options.octave || 4)
  }

  let spread = 3
  if (typeof options.spread === 'number') spread = options.spread
  
  let length = options.length || _length || 96 // default to quarter note
  
  chordNotes.forEach((n, _i) => {
    if (_i === 0) {
      let _msg = { to: 'toMidi' }
      _msg.note = n
      _msg.length = length
      _msg.velocity = options.velocity || 100 // default velocity
      if (options.channel !== undefined) _msg.channel = options.channel
      state.actions.push(_msg)
    } else {
      // schedule a note in the future
      let _msg = { to: 'toMidi' }
      if (spread > 0) _msg.futureSpp = state.spp + spread * _i
      _msg.note = n
      _msg.length = length
      _msg.velocity = options.velocity || 100 // default velocity
      if (options.channel !== undefined) _msg.channel = options.channel
      state.actions.push(_msg)
    }
  })
  return state
}
