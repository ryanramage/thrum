const { song, track, pattern, midi, arp, chordProgression, ccRamp, ccLFO, ccCurve, arrangement } = require('../index')

// ============================================================================
// PIANO SYNTH COMPOSITION: "Luminescence"
// ============================================================================
// A sweeping ambient/melodic piece showcasing CC automation and arpeggiation
// 
// CC Mappings (Channel 1):
// - CC 18: Brightness (0-127)
// - CC 19: Time (0-127)
// - CC 16: Resonance (0-127)
// - CC 17: FX (0-127)
// ============================================================================

// Convert 0-1 range to MIDI CC 0-127
const toCC = (value) => Math.floor(value * 127)

// Chord progression: Am - F - C - G (in C major)
const chords = {
  Am: [57, 60, 64, 69],  // A3, C4, E4, A4
  F:  [53, 57, 60, 65],  // F3, A3, C4, F4
  C:  [48, 52, 55, 60],  // C3, E3, G3, C4
  G:  [55, 59, 62, 67]   // G3, B3, D4, G4
}

// Melody notes (C major scale, higher octave)
const melodyNotes = [72, 74, 76, 77, 79, 81, 83, 84] // C5 to C6

// ============================================================================
// SECTION 1: INTRO (Bars 0-3) - Sparse, mysterious
// ============================================================================

const introArp = track('intro-arp',
  arp(chords.Am, 'x---x-----x-----', {
    direction: 'up',
    velocity: 50,
    length: 48,
    channel: 0
  })
)

const introBrightness = track('intro-brightness',
  ccRamp(18, toCC(0.2), toCC(0.35), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const introResonance = track('intro-resonance',
  ccRamp(16, toCC(0.1), toCC(0.3), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const introTime = track('intro-time',
  ccRamp(19, toCC(0.6), toCC(0.5), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const introFX = track('intro-fx',
  ccRamp(17, toCC(0.3), toCC(1), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 2: DEVELOPMENT (Bars 4-7) - Building energy
// ============================================================================

const devChordProg = track('dev-chords',
  chordProgression(
    [chords.Am, chords.F, chords.C, chords.G],
    'x---------------',
    {
      barsPerChord: 1,
      velocity: 65,
      length: 96,
      channel: 0,
      spread: 12
    }
  )
)

const devArp = track('dev-arp',
  arp(chords.Am, 'x-x-x-x-x-x-x-x-', {
    direction: 'updown',
    velocity: 60,
    length: 36,
    channel: 0
  })
)

const devMelody = track('dev-melody',
  pattern('x-------x-------').play((state) => {
    const melodyIndex = Math.floor(state.bar / 1) % melodyNotes.length
    return midi.note(melodyNotes[melodyIndex], {
      velocity: 70,
      length: 72,
      channel: 0
    })(state)
  })
)

const devBrightness = track('dev-brightness',
  ccRamp(18, toCC(0.35), toCC(0.65), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const devResonance = track('dev-resonance',
  ccLFO(16, 2, 30, {
    channel: 0,
    center: toCC(0.5),
    resolution: 24,
    waveform: 'sine'
  })
)

const devTime = track('dev-time',
  ccRamp(19, toCC(0.5), toCC(1), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const devFX = track('dev-fx',
  ccRamp(17, toCC(0.4), toCC(0.5), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 3: CLIMAX (Bars 8-11) - Full expression
// ============================================================================

const climaxChords = track('climax-chords',
  chordProgression(
    [chords.Am, chords.F, chords.C, chords.G],
    'x-------x-------',
    {
      barsPerChord: 1,
      velocity: 85,
      length: 96,
      channel: 0,
      spread: 8
    }
  )
)

const climaxArp = track('climax-arp',
  arp([57, 60, 64, 69, 72], 'xxxxxxxxxxxxxxxx', {
    direction: 'updown',
    velocity: 75,
    length: 24,
    channel: 0
  })
)

const climaxMelody = track('climax-melody',
  pattern('x---x---x-x-x---').play((state) => {
    const melodySequence = [79, 81, 84, 81, 79, 76, 74, 72]
    const melodyIndex = Math.floor((state.bar * 4 + state.beat) / 2) % melodySequence.length
    return midi.note(melodySequence[melodyIndex], {
      velocity: 90,
      length: 48,
      channel: 0
    })(state)
  })
)

const climaxBrightness = track('climax-brightness',
  ccCurve(18, [toCC(0.65), toCC(0.85), toCC(0.9), toCC(0.85), toCC(0.7)], 4, {
    channel: 0,
    resolution: 24,
    loop: false
  })
)

const climaxResonance = track('climax-resonance',
  ccLFO(16, 1, 40, {
    channel: 0,
    center: toCC(0.7),
    resolution: 24,
    waveform: 'sine'
  })
)

const climaxTime = track('climax-time',
  ccRamp(19, toCC(0.4), toCC(0.3), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const climaxFX = track('climax-fx',
  ccRamp(17, toCC(0.5), toCC(0.7), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 4: OUTRO (Bars 12-15) - Decay and ambience
// ============================================================================

const outroArp = track('outro-arp',
  arp(chords.C, 'x-----x-------x-', {
    direction: 'down',
    velocity: 45,
    length: 72,
    channel: 0
  })
)

const outroChords = track('outro-chords',
  pattern('x---------------').play((state) => {
    if (state.bar === 0) {
      return midi.chord(chords.C, {
        velocity: 50,
        length: 192,
        channel: 0,
        spread: 24
      })(state)
    }
    return { actions: [] }
  })
)

const outroBrightness = track('outro-brightness',
  ccRamp(18, toCC(0.7), toCC(0.2), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const outroResonance = track('outro-resonance',
  ccRamp(16, toCC(0.7), toCC(0.2), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const outroTime = track('outro-time',
  ccRamp(19, toCC(0.3), toCC(0.8), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const outroFX = track('outro-fx',
  ccRamp(17, toCC(0.7), toCC(0.9), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// ARRANGEMENT
// ============================================================================

const composition = arrangement([
  // Intro: Sparse arpeggios, low brightness
  [4, 'intro', [
    introArp,
    introBrightness,
    introResonance,
    introTime,
    introFX
  ]],
  
  // Development: Add melody and chord progression
  [4, 'development', [
    devChordProg,
    devArp,
    devMelody,
    devBrightness,
    devResonance,
    devTime,
    devFX
  ]],
  
  // Climax: Full expression
  [4, 'climax', [
    climaxChords,
    climaxArp,
    climaxMelody,
    climaxBrightness,
    climaxResonance,
    climaxTime,
    climaxFX
  ]],
  
  // Outro: Decay to ambience
  [4, 'outro', [
    outroArp,
    outroChords,
    outroBrightness,
    outroResonance,
    outroTime,
    outroFX
  ]]
])

// ============================================================================
// EXPORT SONG
// ============================================================================

module.exports = song.create([
  track('composition', composition)
], {
  tempo: 85,
  meter: [4, 4]
})
