const R = require('ramda')
const lengths = require('../lib/lengths')

module.exports = R.curryN(4, play)

function play(chordNotes, options, count, _length, state) {
  options.spread = 5
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
      _msg.futureSpp = state.spp + options.spread * _i
      _msg.note =  n
      _msg.length = length
      state.actions.push(_msg)
    }
  })
  return state
}
