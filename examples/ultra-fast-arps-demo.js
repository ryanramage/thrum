const { song, track, pattern, midi, tonal } = require('../index')

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
  
  let noteIndex = 0
  
  return pattern('xxxxxxxxxxxxxxxx', speed).play((state) => {
    const note = notes[noteIndex % notes.length]
    const octaveSpread = Math.floor(noteIndex / notes.length) * spread
    const velocity = velocityRange[0] + 
      Math.floor(Math.random() * (velocityRange[1] - velocityRange[0]))
    
    noteIndex++
    
    return midi.note(note + octaveSpread, {
      velocity,
      length: 6,
      channel: 0
    })
  })
}

// Polyrhythmic fast arps with different speeds
function polyArps(chordName, options = {}) {
  const baseNotes = tonal.chord(chordName, 4)
  
  return [
    // Main ultra-fast arp
    ultraFastArp(baseNotes, {
      speed: 'sixtyfourth',
      spread: 12,
      velocityRange: [90, 110]
    }),
    
    // Counter arp at 32nd notes with different voicing
    ultraFastArp(tonal.chord(chordName, 5), {
      speed: 'thirtysecond', 
      spread: -12,
      velocityRange: [70, 90]
    }),
    
    // Sparse accent arp at 16th notes
    pattern('x---x---x---x---', 'sixteenth').play((state) => {
      const note = baseNotes[state.bar % baseNotes.length]
      return midi.note(note + 24, {
        velocity: 127,
        length: 12,
        channel: 1
      })
    })
  ]
}

// Create the song with multiple arp layers
const song1 = song.create([
  // Main chord progression with ultra-fast arps
  track('Fast Arps', (state) => {
    const chords = ['Cmaj7', 'Am7', 'Fmaj7', 'G7']
    const currentChord = chords[Math.floor(state.bar / 2) % chords.length]
    
    const arpTracks = polyArps(currentChord)
    const actions = []
    
    arpTracks.forEach(arpTrack => {
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
      const pentatonic = [60, 62, 65, 67, 69] // C pentatonic
      const note = pentatonic[(state.absoluteTick / 3) % pentatonic.length]
      
      return midi.note(note + 12, {
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
      const scale = tonal.scale('C major')
      const note = scale[(state.absoluteTick / 1.5) % scale.length]
      
      return midi.note(tonal.midi(note + '6'), {
        velocity: 85,
        length: 4,
        channel: 3
      })
    })
    
    return arpTrack(state)
  }),
  
  // Bass line to anchor the chaos
  track('Bass', pattern('x---x---x---x---').play((state) => {
    const bassNotes = [36, 36, 33, 38] // C, C, A, D
    const note = bassNotes[Math.floor(state.bar / 2) % bassNotes.length]
    
    return midi.note(note, {
      velocity: 100,
      length: 48,
      channel: 4
    })
  }))
], {
  tempo: 140,
  meter: [4, 4]
})

module.exports = song1
