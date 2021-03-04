const R = require('ramda')
const lengths = require('../lib/lengths')
const Tonal = require('@tonaljs/tonal')
console.log(Tonal.Note)

module.exports = R.curryN(3, transpose)

function transpose(interval, emitter, state) {
  console.log('do transpose')
  emitter(state)
  console.log('da state', state)
  // transpose all the notes
  state.actions.forEach(a => {
    if (a.to !== 'toMidi') return
    if (!a.note) return
    a.note = Tonal.Note.transpose(a.note, interval)
  })
  return state
}
