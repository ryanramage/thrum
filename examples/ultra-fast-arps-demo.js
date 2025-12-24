const { song, track, pattern, midi, tonal } = require('../index')

// Define chord progressions using tonal note names
const chords = {
  'Cmaj7': ['C4', 'E4', 'G4', 'B4'],
  'Am7': ['A3', 'C4', 'E4', 'G4'],  
  'Fmaj7': ['F3', 'A3', 'C4', 'E4'],
  'G7': ['G3', 'B3', 'D4', 'F4']
}

// Helper function to add swing timing
function swingPattern(basePattern, swingAmount = 0.1) {
  return (state) => {
    const actions = []
    const position = state.tick + (state.beat * 24) + (state.bar * 96)
    
    // Apply swing on off-beats (odd subdivisions)
    const isOffBeat = Math.floor(position / 1.5) % 2 === 1
    const delay = isOffBeat ? swingAmount * 24 : 0
    
    const result = basePattern(state)
    if (result && result.actions) {
      result.actions.forEach(action => {
        if (action && typeof action === 'object') {
          actions.push({
            ...action,
            delay: (action.delay || 0) + delay
          })
        }
      })
    }
    
    return { actions }
  }
}

// Ultra-fast arp with note spread and velocity variation
function ultraFastArp(notes, options = {}) {
  const speed = options.speed || 'sixtyfourth'
  const spread = options.spread || 0
  const velocityRange = options.velocityRange || [80, 120]
  const channel = options.channel || 0
  
  return pattern('xxxxxxxxxxxxxxxx', speed).play((state) => {
    // Use absoluteTick to create a consistent note index
    const noteIndex = Math.floor(state.absoluteTick / 1.5)
    const noteName = notes[noteIndex % notes.length]
    const octaveSpread = Math.floor(noteIndex / notes.length) * spread
    const velocity = velocityRange[0] + 
      Math.floor(Math.random() * (velocityRange[1] - velocityRange[0]))
    
    // Convert note name to MIDI and add octave spread
    const midiNote = tonal.midi(noteName) + octaveSpread
    
    // Clamp MIDI note to valid range (0-127)
    const finalNote = Math.max(0, Math.min(127, midiNote))
    
    return midi.note(finalNote, {
      velocity,
      length: 6,
      channel
    })
  })
}

// Polyrhythmic fast arps with different speeds
function polyArps(chordName, options = {}) {
  const baseNotes = chords[chordName] || chords['Cmaj7']
  // Create higher octave versions by adding 1 to octave number
  const higherNotes = baseNotes.map(note => {
    const octave = parseInt(note.slice(-1))
    const noteName = note.slice(0, -1)
    return noteName + (octave + 1)
  })
  
  return {
    // Main ultra-fast arp
    fastArp: ultraFastArp(baseNotes, {
      speed: 'sixtyfourth',
      spread: 6,
      velocityRange: [90, 110],
      channel: 0
    }),
    
    // Counter arp at 32nd notes with different voicing
    counterArp: ultraFastArp(higherNotes, {
      speed: 'thirtysecond', 
      spread: -6,
      velocityRange: [70, 90],
      channel: 1
    }),
    
    // Sparse accent arp at 16th notes
    accentArp: pattern('x---x---x---x---', 'sixteenth').play((state) => {
      const noteName = baseNotes[state.bar % baseNotes.length]
      const midiNote = tonal.midi(noteName) + 24
      return midi.note(midiNote, {
        velocity: 127,
        length: 12,
        channel: 2
      })
    })
  }
}

// Create the song with multiple arp layers
const song1 = song.create([
  // Main chord progression with ultra-fast arps
  track('Fast Arps', (state) => {
    const chordNames = ['Cmaj7', 'Am7', 'Fmaj7', 'G7']
    const currentChord = chordNames[Math.floor(state.bar / 2) % chordNames.length]
    
    const arps = polyArps(currentChord)
    const actions = []
    
    // Execute each arp track
    Object.values(arps).forEach(arpTrack => {
      const result = arpTrack(state)
      if (result && result.actions) {
        actions.push(...result.actions)
      }
    })
    
    return { actions }
  }),
  
  // Add some swing to a secondary arp layer
  track('Swing Arps', swingPattern(
    pattern('x-x-x-x-x-x-x-x-', 'thirtysecond').play((state) => {
      const pentatonic = ['C4', 'D4', 'F4', 'G4', 'A4'] // C pentatonic
      const noteName = pentatonic[(state.absoluteTick / 3) % pentatonic.length]
      const midiNote = tonal.midi(noteName) + 12 // Add octave
      
      return midi.note(midiNote, {
        velocity: 60 + Math.sin(state.absoluteTick * 0.1) * 20,
        length: 8,
        channel: 2
      })
    }),
    0.15 // Swing amount
  )),
  
  // Rhythmic variation with different patterns
  track('Pattern Variations', (state) => {
    const patterns = [
      'xxxxxxxxxxxxxxxx', // All 64th notes
      'x-x-x-x-x-x-x-x-', // Every other 64th
      'x--x--x--x--x--x', // Triplet feel
      'x---x---x---x---'  // 16th notes
    ]
    
    const currentPattern = patterns[state.bar % patterns.length]
    const arpTrack = pattern(currentPattern, 'sixtyfourth').play((state) => {
      // Use tonal note names for C major scale
      const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
      const noteIndex = Math.floor(state.absoluteTick / 1.5) % scale.length
      const noteName = scale[noteIndex]
      const midiNote = tonal.midi(noteName) + 24 // Add octave
      
      return midi.note(midiNote, {
        velocity: 85,
        length: 4,
        channel: 3
      })
    })
    
    return arpTrack(state)
  }),
  
  // Bass line to anchor the chaos
  track('Bass', pattern('x---x---x---x---').play((state) => {
    const bassNotes = ['C2', 'C2', 'A1', 'D2'] // Bass notes
    const noteName = bassNotes[Math.floor(state.bar / 2) % bassNotes.length]
    const midiNote = tonal.midi(noteName)
    
    return midi.note(midiNote, {
      velocity: 100,
      length: 40,
      channel: 4
    })
  }))
], {
  tempo: 140,
  meter: [4, 4]
})

module.exports = song1
