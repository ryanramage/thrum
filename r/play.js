const R = require('ramda')
const lengths = require('../lib/lengths')

// Main export - handles both with and without options
module.exports = function(...args) {
  // Called with options: play(options, notes, count, length, state)
  if (args.length === 5 || (args.length >= 2 && isOptionsObject(args[0]))) {
    return R.curryN(5, playWithOptions)(...args)
  }
  
  // Called without options: play(notes, count, length, state)
  return R.curryN(4, playWithoutOptions)(...args)
}

function isOptionsObject(arg) {
  return typeof arg === 'object' && 
         !Array.isArray(arg) && 
         arg !== null &&
         (!arg.octave || typeof arg.octave !== 'function') &&
         (arg.length !== undefined || arg.velocity !== undefined || arg.channel !== undefined)
}

function playWithoutOptions(notes, count, length, state) {
  return playWithOptions({}, notes, count, length, state)
}

function playWithOptions(options, notes, count, length, state) {
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
  _msg.length = options.length || length || 96
  _msg.velocity = options.velocity || 100

  if (options.channel) _msg.channel = options.channel

  state.actions.push(_msg)
  return state
}
