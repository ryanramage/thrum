const lengths = require('../lib/lengths')

// Helper to detect if first arg is an options object
function isOptionsObject(arg) {
  return typeof arg === 'object' && 
         !Array.isArray(arg) && 
         arg !== null &&
         (!arg.octave || typeof arg.octave !== 'function') &&
         (arg.length !== undefined || arg.velocity !== undefined || arg.channel !== undefined)
}

// Main export - simple function that handles all cases
module.exports = function play(arg1, arg2, arg3, arg4, arg5) {
  let options, notes, count, length, state
  
  // Detect calling pattern based on arguments
  if (arg5 !== undefined) {
    // 5 arguments: play(options, notes, count, length, state)
    options = arg1
    notes = arg2
    count = arg3
    length = arg4
    state = arg5
  } else if (arg4 !== undefined) {
    // 4 arguments: play(notes, count, length, state)
    options = {}
    notes = arg1
    count = arg2
    length = arg3
    state = arg4
  } else if (arg3 !== undefined) {
    // 3 arguments: partially applied, return a function
    // This handles: play(notes, count, length) => (state) => ...
    return function(state) {
      return play(arg1, arg2, arg3, state)
    }
  } else if (arg2 !== undefined) {
    // 2 arguments: check if first is options
    if (isOptionsObject(arg1)) {
      // play(options, notes) => (count, length, state) => ...
      return function(count, length, state) {
        return play(arg1, arg2, count, length, state)
      }
    } else {
      // play(notes, count) => (length, state) => ...
      return function(length, state) {
        return play(arg1, arg2, length, state)
      }
    }
  } else if (arg1 !== undefined) {
    // 1 argument: partially applied, return a function
    // This handles: play(notes) => (count, length, state) => ...
    return function(count, length, state) {
      return play(arg1, count, length, state)
    }
  } else {
    // No arguments: return the function itself
    return play
  }
  
  // Now execute the actual play logic
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
