const { song, track, pattern, midi, chordProgression, ccRamp, ccLFO, ccCurve, arrangement } = require('../index')

// ============================================================================
// AMBIENT PAD COMPOSITION: "Slow Drift"
// ============================================================================
// A meditative ambient piece with very slow chord evolution and gradual
// parameter changes over long periods.
// 
// CC Mappings (Channel 1):
// - CC 71: Resonance (0-127) - Standard filter resonance
// - CC 74: Brightness/Cutoff (0-127) - Standard filter cutoff
// - CC 80: Decay Time (0-127) - ADSR Decay
// - CC 81: Sustain Level (0-127) - ADSR Sustain
// - CC 82: Release Time (0-127) - ADSR Release
// - CC 91: Reverb Depth (0-127) - Standard reverb send
// - CC 93: Chorus Depth (0-127) - Standard chorus send
// ============================================================================

// Convert 0-1 range to MIDI CC 0-127
const toCC = (value) => Math.floor(value * 127)

// Very slow chord progression - ambient voicings with extensions
const chords = {
  // Cmaj9: C E G B D (root position, wide voicing)
  Cmaj9: [36, 52, 55, 59, 62, 71],
  
  // Am11: A C E G B D (suspended, ethereal)
  Am11: [33, 48, 52, 55, 59, 62],
  
  // Fmaj7#11: F A C E B (lydian color)
  Fmaj7sharp11: [29, 45, 48, 52, 59, 64],
  
  // Gsus2: G A D (open, spacious)
  Gsus2: [31, 43, 50, 55, 62, 67],
  
  // Dm9: D F A C E (minor color with extension)
  Dm9: [26, 41, 45, 48, 52, 64],
  
  // Em7: E G B D (simple, grounding)
  Em7: [28, 43, 47, 50, 55, 62]
}

// ============================================================================
// INITIALIZATION: Reset CC values to known starting points
// ============================================================================

const initCC = track('init-cc',
  (state) => {
    // Only send on the very first tick
    if (state.absoluteTick === 0) {
      return {
        actions: [
          midi.cc(71, toCC(0.2), { channel: 0 })(state), // Resonance
          midi.cc(74, toCC(0.1), { channel: 0 })(state), // Brightness
          midi.cc(80, toCC(0.7), { channel: 0 })(state), // Decay
          midi.cc(81, toCC(0.8), { channel: 0 })(state), // Sustain
          midi.cc(82, toCC(0.75), { channel: 0 })(state), // Release
          midi.cc(91, toCC(0.5), { channel: 0 })(state), // Reverb
          midi.cc(93, toCC(0.1), { channel: 0 })(state)  // Chorus
        ]
      }
    }
    return { actions: [] }
  }
)

// ============================================================================
// SECTION 1: EMERGENCE (Bars 0-15) - Very slow fade in
// ============================================================================

const emergenceChords = track('emergence-chords',
  chordProgression(
    [chords.Cmaj9, chords.Am11, chords.Fmaj7sharp11, chords.Gsus2],
    {
      barsPerChord: 4,
      velocity: 40,
      length: 384, // 4 bars long
      channel: 0,
      spread: 48 // Very slow spread
    }
  )
)

// Very slow brightness fade in over 16 bars
const emergenceBrightness = track('emergence-brightness',
  ccRamp(74, toCC(0.1), toCC(0.35), 16, {
    channel: 0,
    resolution: 96, // Update every bar
    loop: false
  })
)

// Resonance slowly rising
const emergenceResonance = track('emergence-resonance',
  ccRamp(71, toCC(0.2), toCC(0.4), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Very long decay time
const emergenceDecay = track('emergence-decay',
  ccRamp(80, toCC(0.7), toCC(0.85), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// High sustain level
const emergenceSustain = track('emergence-sustain',
  ccRamp(81, toCC(0.8), toCC(0.9), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Very long release
const emergenceRelease = track('emergence-release',
  ccRamp(82, toCC(0.75), toCC(0.9), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Reverb depth increasing
const emergenceReverb = track('emergence-reverb',
  ccRamp(91, toCC(0.5), toCC(0.8), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Subtle chorus
const emergenceChorus = track('emergence-chorus',
  ccRamp(93, toCC(0.1), toCC(0.3), 16, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// ============================================================================
// SECTION 2: DRIFT (Bars 16-47) - Slow evolution with subtle movement
// ============================================================================

const driftChords = track('drift-chords',
  chordProgression(
    [chords.Cmaj9, chords.Am11, chords.Fmaj7sharp11, chords.Gsus2, chords.Dm9, chords.Em7],
    {
      barsPerChord: 4,
      velocity: 50,
      length: 384,
      channel: 0,
      spread: 36
    }
  )
)

// Additional harmonic layer - very sparse high notes
const driftHarmonics = track('drift-harmonics',
  pattern('x---------------').play((state) => {
    // Only play every 8 bars
    if (state.bar % 8 === 0) {
      const harmonicNotes = [84, 88, 91, 95] // High C, E, G, B
      const noteIndex = Math.floor(state.bar / 8) % harmonicNotes.length
      return midi.note(harmonicNotes[noteIndex], {
        velocity: 35,
        length: 768, // 8 bars
        channel: 0
      })(state)
    }
    return { actions: [] }
  })
)

// Very slow LFO on brightness
const driftBrightness = track('drift-brightness',
  ccLFO(74, 16, 25, {
    channel: 0,
    center: toCC(0.45),
    resolution: 96,
    waveform: 'sine'
  })
)

// Slow resonance curve
const driftResonance = track('drift-resonance',
  ccCurve(71, [
    toCC(0.4), toCC(0.5), toCC(0.6), toCC(0.55), 
    toCC(0.5), toCC(0.45), toCC(0.5), toCC(0.55)
  ], 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Decay time subtle variation
const driftDecay = track('drift-decay',
  ccLFO(80, 12, 15, {
    channel: 0,
    center: toCC(0.85),
    resolution: 96,
    waveform: 'triangle'
  })
)

// Sustain stays high
const driftSustain = track('drift-sustain',
  ccRamp(81, toCC(0.9), toCC(0.88), 32, {
    channel: 0,
    resolution: 192, // Every 2 bars
    loop: false
  })
)

// Release time stays long
const driftRelease = track('drift-release',
  ccRamp(82, toCC(0.9), toCC(0.92), 32, {
    channel: 0,
    resolution: 192,
    loop: false
  })
)

// Reverb depth with slow LFO
const driftReverb = track('drift-reverb',
  ccLFO(91, 20, 20, {
    channel: 0,
    center: toCC(0.75),
    resolution: 96,
    waveform: 'sine'
  })
)

// Chorus depth subtle movement
const driftChorus = track('drift-chorus',
  ccLFO(93, 16, 15, {
    channel: 0,
    center: toCC(0.25),
    resolution: 96,
    waveform: 'sine'
  })
)

// ============================================================================
// SECTION 3: EXPANSION (Bars 48-79) - Richer harmonies, more movement
// ============================================================================

const expansionChords = track('expansion-chords',
  chordProgression(
    [chords.Cmaj9, chords.Am11, chords.Fmaj7sharp11, chords.Gsus2, chords.Dm9, chords.Em7],
    {
      barsPerChord: 4,
      velocity: 60,
      length: 384,
      channel: 0,
      spread: 24
    }
  )
)

// Mid-range harmonic layer
const expansionMidHarmonics = track('expansion-mid-harmonics',
  pattern('x---------------').play((state) => {
    // Play every 4 bars
    if (state.bar % 4 === 0) {
      const midNotes = [67, 71, 74, 76] // G, B, D, E
      const noteIndex = Math.floor(state.bar / 4) % midNotes.length
      return midi.note(midNotes[noteIndex], {
        velocity: 45,
        length: 384, // 4 bars
        channel: 0
      })(state)
    }
    return { actions: [] }
  })
)

// High harmonic layer - more frequent
const expansionHighHarmonics = track('expansion-high-harmonics',
  pattern('x---------------').play((state) => {
    // Play every 6 bars
    if (state.bar % 6 === 0) {
      const highNotes = [88, 91, 95, 98] // E, G, B, D
      const noteIndex = Math.floor(state.bar / 6) % highNotes.length
      return midi.note(highNotes[noteIndex], {
        velocity: 38,
        length: 576, // 6 bars
        channel: 0
      })(state)
    }
    return { actions: [] }
  })
)

// Brightness opens up more
const expansionBrightness = track('expansion-brightness',
  ccCurve(74, [
    toCC(0.45), toCC(0.55), toCC(0.65), toCC(0.7),
    toCC(0.65), toCC(0.6), toCC(0.55), toCC(0.5)
  ], 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Resonance increases
const expansionResonance = track('expansion-resonance',
  ccRamp(71, toCC(0.55), toCC(0.7), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Decay time slightly shorter for more definition
const expansionDecay = track('expansion-decay',
  ccRamp(80, toCC(0.85), toCC(0.75), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Sustain still high
const expansionSustain = track('expansion-sustain',
  ccRamp(81, toCC(0.88), toCC(0.85), 32, {
    channel: 0,
    resolution: 192,
    loop: false
  })
)

// Release time stays long
const expansionRelease = track('expansion-release',
  ccRamp(82, toCC(0.92), toCC(0.9), 32, {
    channel: 0,
    resolution: 192,
    loop: false
  })
)

// Reverb depth peaks
const expansionReverb = track('expansion-reverb',
  ccRamp(91, toCC(0.75), toCC(0.9), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Chorus depth increases
const expansionChorus = track('expansion-chorus',
  ccRamp(93, toCC(0.25), toCC(0.4), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// ============================================================================
// SECTION 4: DISSOLUTION (Bars 80-111) - Slow fade to silence
// ============================================================================

const dissolutionChords = track('dissolution-chords',
  chordProgression(
    [chords.Gsus2, chords.Fmaj7sharp11, chords.Am11, chords.Cmaj9],
    {
      barsPerChord: 4,
      velocity: 45,
      length: 384,
      channel: 0,
      spread: 60 // Very slow spread again
    }
  )
)

// Sparse high notes fading
const dissolutionHarmonics = track('dissolution-harmonics',
  pattern('x---------------').play((state) => {
    // Only play every 8 bars
    if (state.bar % 8 === 0) {
      const harmonicNotes = [95, 91, 88, 84] // Descending
      const noteIndex = Math.floor(state.bar / 8) % harmonicNotes.length
      const velocity = 40 - (noteIndex * 5) // Fade out
      return midi.note(harmonicNotes[noteIndex], {
        velocity: Math.max(20, velocity),
        length: 768, // 8 bars
        channel: 0
      })(state)
    }
    return { actions: [] }
  })
)

// Brightness slowly closing
const dissolutionBrightness = track('dissolution-brightness',
  ccRamp(74, toCC(0.5), toCC(0.15), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Resonance decreasing
const dissolutionResonance = track('dissolution-resonance',
  ccRamp(71, toCC(0.7), toCC(0.3), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Decay time getting longer again
const dissolutionDecay = track('dissolution-decay',
  ccRamp(80, toCC(0.75), toCC(0.9), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Sustain decreasing
const dissolutionSustain = track('dissolution-sustain',
  ccRamp(81, toCC(0.85), toCC(0.7), 32, {
    channel: 0,
    resolution: 192,
    loop: false
  })
)

// Release time getting very long
const dissolutionRelease = track('dissolution-release',
  ccRamp(82, toCC(0.9), toCC(1.0), 32, {
    channel: 0,
    resolution: 192,
    loop: false
  })
)

// Reverb depth staying high
const dissolutionReverb = track('dissolution-reverb',
  ccRamp(91, toCC(0.9), toCC(0.95), 32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// Chorus depth fading
const dissolutionChorus = track('dissolution-chorus',
  ccRamp(93, toCC(0.4), toCC(0.2),32, {
    channel: 0,
    resolution: 96,
    loop: false
  })
)

// ============================================================================
// ARRANGEMENT
// ============================================================================

const composition = arrangement([
  // Emergence: Very slow fade in (16 bars)
  [16, 'emergence', [
    emergenceChords,
    emergenceBrightness,
    emergenceResonance,
    emergenceDecay,
    emergenceSustain,
    emergenceRelease,
    emergenceReverb,
    emergenceChorus
  ]],
  
  // Drift: Slow evolution with subtle movement (32 bars)
  [32, 'drift', [
    driftChords,
    driftHarmonics,
    driftBrightness,
    driftResonance,
    driftDecay,
    driftSustain,
    driftRelease,
    driftReverb,
    driftChorus
  ]],
  
  // Expansion: Richer harmonies, more movement (32 bars)
  [32, 'expansion', [
    expansionChords,
    expansionMidHarmonics,
    expansionHighHarmonics,
    expansionBrightness,
    expansionResonance,
    expansionDecay,
    expansionSustain,
    expansionRelease,
    expansionReverb,
    expansionChorus
  ]],
  
  // Dissolution: Slow fade to silence (32 bars)
  [32, 'dissolution', [
    dissolutionChords,
    dissolutionHarmonics,
    dissolutionBrightness,
    dissolutionResonance,
    dissolutionDecay,
    dissolutionSustain,
    dissolutionRelease,
    dissolutionReverb,
    dissolutionChorus
  ]]
])

// ============================================================================
// EXPORT SONG
// ============================================================================

module.exports = song.create([
  initCC,
  track('composition', composition)
], {
  tempo: 60, // Very slow tempo for ambient feel
  meter: [4, 4]
})
