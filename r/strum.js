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

  console.log(options, chordNotes, count, _length)
  let spread = 3
  if (typeof options.spread === 'number') spread = options.spread
  let length = options.length || _length
  chordNotes.forEach((n, _i) => {
    if (_i === 0) {
      let _msg = { to: 'toMidi' }
      _msg.note =  n
      _msg.length = length
      state.actions.push(_msg)
    } else {
      // schedule a note in the future
      let _msg = { to: 'toMidi' }
      if (spread > 0) _msg.futureSpp = state.spp + spread * _i
      _msg.note =  n
      _msg.length = length
      state.actions.push(_msg)
    }
  })
  return state
}
