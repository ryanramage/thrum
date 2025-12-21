const R = require('ramda')
const lengths = require('../lib/lengths')

// Export a smart wrapper that handles both 4 and 5 argument cases
module.exports = function(...args) {
  // If first arg looks like options object (not a note/function/array/chord)
  if (args.length >= 2 && typeof args[0] === 'object' && !Array.isArray(args[0]) && 
      (!args[0].octave || typeof args[0].octave !== 'function')) {
    return R.curryN(5, play)(...args)
  }
  // Otherwise, shift args and add empty options
  return R.curryN(4, (notes, count, length, state) => {
    return play({}, notes, count, length, state)
  })(...args)
}

function play(options, notes, count, length, state) {
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
