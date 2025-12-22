const { song, track, arrangement, tonal, bassline, ccRamp, ccLFO } = require('../index')

// ============================================================================
// FUNKY BASS COMPOSITION: "Groove Machine"
// ============================================================================
// A punchy, syncopated bassline with dynamic sections
// 
// Structure:
// - Intro (4 bars): Sparse, building anticipation
// - Verse/Chorus (8 bars): Full groove with syncopation
// - Bridge (4 bars): Breakdown with filter sweeps
// - Finale (4 bars): High energy climax
//
// CC Mappings (Channel 0):
// - CC 74: Filter Cutoff (0-127)
// - CC 71: Filter Resonance (0-127)
// - CC 91: Reverb (0-127)
// ============================================================================

// Convert 0-1 range to MIDI CC 0-127
const toCC = (value) => Math.floor(value * 127)

// Bass notes in E minor pentatonic (funky key!)
const bassNotes = {
  root: tonal.midi('E2'),      // Root
  fourth: tonal.midi('A2'),    // Fourth
  fifth: tonal.midi('B2'),     // Fifth
  octave: tonal.midi('E3'),    // Octave
  seventh: tonal.midi('D3'),   // Seventh
  third: tonal.midi('G2')      // Minor third
}

// ============================================================================
// INITIALIZATION: Set starting CC values
// ============================================================================

const initCC = track('init-cc',
  (state) => {
    if (state.absoluteTick === 0) {
      return {
        actions: [
          { type: 'cc', controller: 74, value: toCC(0.3), channel: 0 }, // Filter Cutoff
          { type: 'cc', controller: 71, value: toCC(0.2), channel: 0 }, // Resonance
          { type: 'cc', controller: 91, value: toCC(0.1), channel: 0 }  // Reverb
        ]
      }
    }
    return { actions: [] }
  }
)

// ============================================================================
// SECTION 1: INTRO (Bars 0-3) - Sparse, teasing the groove
// ============================================================================

const introBassPart = track('intro-bass',
  bassline(
    [
      bassNotes.root,
      bassNotes.root,
      bassNotes.fourth,
      bassNotes.root
    ],
    'x-----x---x-----', // Sparse rhythm
    {
      velocity: 90,
      length: 36,
      channel: 0
    }
  )
)

const introFilter = track('intro-filter',
  ccRamp(74, toCC(0.3), toCC(0.5), 4, {
    channel: 0,
    resolution: 24,
    loop: false
  })
)

const introReverb = track('intro-reverb',
  ccRamp(91, toCC(0.1), toCC(0.3), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 2: VERSE/CHORUS (Bars 4-11) - Full funky groove
// ============================================================================

const verseBassPart = track('verse-bass',
  bassline(
    [
      bassNotes.root,
      bassNotes.octave,
      bassNotes.root,
      bassNotes.fifth,
      bassNotes.root,
      bassNotes.fourth,
      bassNotes.root,
      bassNotes.seventh
    ],
    'x-x-x---x-x-x-x-', // Syncopated 16th note funk pattern
    {
      velocity: 105,
      length: 18,
      channel: 0,
      accentPattern: 'x-------x-------', // Accent on 1 and 3
      accentVelocity: 120
    }
  )
)

// Add ghost notes for extra funk
const verseGhostNotes = track('verse-ghost',
  bassline(
    [bassNotes.root],
    '--x---x---x---x-', // Ghost notes between main hits
    {
      velocity: 60,
      length: 12,
      channel: 0
    }
  )
)

const verseFilter = track('verse-filter',
  ccLFO(74, 2, 25, {
    channel: 0,
    center: toCC(0.6),
    resolution: 12,
    waveform: 'sine'
  })
)

const verseResonance = track('verse-resonance',
  ccRamp(71, toCC(0.2), toCC(0.4), 8, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

const verseReverb = track('verse-reverb',
  ccRamp(91, toCC(0.3), toCC(0.2), 8, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 3: BRIDGE (Bars 12-15) - Breakdown with filter sweeps
// ============================================================================

const bridgeBassPart = track('bridge-bass',
  bassline(
    [
      bassNotes.root,
      bassNotes.third,
      bassNotes.fourth,
      bassNotes.fifth
    ],
    'x-------x-------', // Sparse, on the 1 and 3
    {
      velocity: 95,
      length: 72,
      channel: 0,
      slide: true,
      slideLength: 18
    }
  )
)

// Add sustained notes for atmosphere
const bridgeSustain = track('bridge-sustain',
  (state) => {
    // Play a sustained root note at the start of each bar
    if (state.beat === 0 && state.tick === 0) {
      return {
        actions: [{
          type: 'note',
          note: bassNotes.octave,
          velocity: 70,
          length: 96,
          channel: 0
        }]
      }
    }
    return { actions: [] }
  }
)

const bridgeFilter = track('bridge-filter',
  ccRamp(74, toCC(0.6), toCC(0.9), 4, {
    channel: 0,
    resolution: 12,
    loop: false
  })
)

const bridgeResonance = track('bridge-resonance',
  ccRamp(71, toCC(0.4), toCC(0.7), 4, {
    channel: 0,
    resolution: 24,
    loop: false
  })
)

const bridgeReverb = track('bridge-reverb',
  ccRamp(91, toCC(0.2), toCC(0.5), 4, {
    channel: 0,
    resolution: 48,
    loop: false
  })
)

// ============================================================================
// SECTION 4: FINALE (Bars 16-19) - High energy climax
// ============================================================================

const finaleBassPart = track('finale-bass',
  bassline(
    [
      bassNotes.root,
      bassNotes.octave,
      bassNotes.fifth,
      bassNotes.octave,
      bassNotes.root,
      bassNotes.fourth,
      bassNotes.fifth,
      bassNotes.seventh,
      bassNotes.root,
      bassNotes.octave,
      bassNotes.root,
      bassNotes.fifth,
      bassNotes.root,
      bassNotes.fourth,
      bassNotes.root,
      bassNotes.root
    ],
    'xxxxxxxxxxxxxxxx', // 16th note madness!
    {
      velocity: 110,
      length: 12,
      channel: 0,
      accentPattern: 'x---x---x---x---', // Accent every 4th note
      accentVelocity: 127
    }
  )
)

// Add octave jumps for excitement
const finaleOctaves = track('finale-octaves',
  bassline(
    [bassNotes.octave, bassNotes.octave + 12],
    'x-------x-------',
    {
      velocity: 115,
      length: 48,
      channel: 0
    }
  )
)

const finaleFilter = track('finale-filter',
  ccLFO(74, 1, 35, {
    channel: 0,
    center: toCC(0.75),
    resolution: 6,
    waveform: 'sine'
  })
)

const finaleResonance = track('finale-resonance',
  ccLFO(71, 0.5, 30, {
    channel: 0,
    center: toCC(0.6),
    resolution: 12,
    waveform: 'triangle'
  })
)

const finaleReverb = track('finale-reverb',
  ccRamp(91, toCC(0.5), toCC(0.7), 4, {
    channel: 0,
    resolution: 24,
    loop: false
  })
)

// ============================================================================
// ARRANGEMENT
// ============================================================================

const composition = arrangement([
  // Intro: Sparse and teasing
  [4, 'intro', [
    introBassPart,
    introFilter,
    introReverb
  ]],
  
  // Verse/Chorus: Full funky groove
  [8, 'verse', [
    verseBassPart,
    verseGhostNotes,
    verseFilter,
    verseResonance,
    verseReverb
  ]],
  
  // Bridge: Breakdown with filter sweeps
  [4, 'bridge', [
    bridgeBassPart,
    bridgeSustain,
    bridgeFilter,
    bridgeResonance,
    bridgeReverb
  ]],
  
  // Finale: High energy climax
  [4, 'finale', [
    finaleBassPart,
    finaleOctaves,
    finaleFilter,
    finaleResonance,
    finaleReverb
  ]]
])

// ============================================================================
// EXPORT SONG
// ============================================================================

module.exports = song.create([
  initCC,
  track('composition', composition)
], {
  tempo: 110,
  meter: [4, 4]
})
