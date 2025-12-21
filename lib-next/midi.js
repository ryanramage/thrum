// MIDI helpers for notes, chords, and CC

function note(noteValue, options = {}) {
  return (state) => {
    const velocity = options.velocity !== undefined ? options.velocity : 100
    const length = options.length !== undefined ? options.length : 24
    const channel = options.channel !== undefined ? options.channel : 0
    
    return {
      type: 'note',
      note: noteValue,
      velocity,
      length,
      channel
    }
  }
}

function chord(notes, options = {}) {
  return (state) => {
    const velocity = options.velocity !== undefined ? options.velocity : 100
    const length = options.length !== undefined ? options.length : 24
    const channel = options.channel !== undefined ? options.channel : 0
    const spread = options.spread !== undefined ? options.spread : 0
    
    return notes.map((noteValue, i) => ({
      type: 'note',
      note: noteValue,
      velocity,
      length,
      channel,
      delay: i * spread
    }))
  }
}

function cc(controller, value, options = {}) {
  return (state) => {
    const channel = options.channel !== undefined ? options.channel : 0
    
    return {
      type: 'cc',
      controller,
      value,
      channel
    }
  }
}

module.exports = {
  note,
  chord,
  cc
}
