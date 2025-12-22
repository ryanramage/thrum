// Drum pattern shortcuts and common patterns
const { pattern } = require('./pattern')
const { note, cc, chord } = require('./midi')

// Default General MIDI drum mapping
const DEFAULT_DRUM_MAP = {
  kick: 'C1',
  snare: 'D1',
  clap: 'D#1',
  rimshot: 'C#1',
  closedHat: 'F#1',
  openHat: 'A#1',
  crash: 'C#2',
  ride: 'D#2',
  tom1: 'F1',
  tom2: 'A1',
  tom3: 'C2'
}

// Create a drum shortcut function that returns a track function
function createDrumShortcut(defaultPattern, defaultNote, drumMap = DEFAULT_DRUM_MAP) {
  return (options = {}) => {
    const patternStr = options.pattern || defaultPattern
    const noteValue = options.note || defaultNote
    const velocity = options.velocity !== undefined ? options.velocity : 100
    const length = options.length !== undefined ? options.length : 24
    const channel = options.channel !== undefined ? options.channel : 9 // MIDI channel 10 (0-indexed as 9)
    
    // Return a track function
    return pattern(patternStr).play((state) => 
      note(noteValue, { velocity, length, channel })(state)
    )
  }
}

// Individual drum shortcuts
function kick(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('x---x---x---x---', drumMap.kick, drumMap)(options)
}

function snare(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('----x-------x---', drumMap.snare, drumMap)(options)
}

function clap(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('----x-------x---', drumMap.clap, drumMap)(options)
}

function closedHat(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('x-x-x-x-x-x-x-x-', drumMap.closedHat, drumMap)(options)
}

function openHat(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('--x---x---x---x-', drumMap.openHat, drumMap)(options)
}

function crash(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('x---------------', drumMap.crash, drumMap)(options)
}

function ride(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('x-x-x-x-x-x-x-x-', drumMap.ride, drumMap)(options)
}

function rimshot(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  return createDrumShortcut('--x---x---x---x-', drumMap.rimshot, drumMap)(options)
}

// Helper to combine multiple track functions into one
function combineTracks(tracks) {
  return (state) => {
    const allActions = []
    
    tracks.forEach(track => {
      const result = track(state)
      if (result && result.actions) {
        allActions.push(...result.actions)
      }
    })
    
    return { actions: allActions }
  }
}

// Genre-specific pattern collections - return a single combined track function
function fourOnFloor(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ ...options, drumMap }),
    snare({ ...options, drumMap }),
    closedHat({ ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function house(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ pattern: 'x---x---x---x---', ...options, drumMap }),
    snare({ pattern: '----x-------x---', ...options, drumMap }),
    closedHat({ pattern: 'x-x-x-x-x-x-x-x-', ...options, drumMap }),
    openHat({ pattern: '--x---x---x---x-', ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function techno(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ pattern: 'x---x---x---x---', ...options, drumMap }),
    snare({ pattern: '----x-------x---', velocity: 90, ...options, drumMap }),
    closedHat({ pattern: 'xxxxxxxxxxxxxxxx', velocity: 80, ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function breakbeat(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ pattern: 'x-----x-x-------', ...options, drumMap }),
    snare({ pattern: '----x-------x---', ...options, drumMap }),
    closedHat({ pattern: 'x-x-x-x-x-x-x-x-', velocity: 70, ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function dnb(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({  pattern: 'x-------x-------', ...options, drumMap }),
    snare({ pattern: '----x-------x---', velocity: 110, ...options, drumMap }),
    closedHat({ pattern: 'xxxxxxxxxxxxxxxx', velocity: 60, ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function trap(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ pattern: 'x---x---x-x-----', ...options, drumMap }),
    snare({ pattern: '----x-------x---', ...options, drumMap }),
    closedHat({ pattern: 'x-x-x-x-x-x-x-x-', velocity: 70, ...options, drumMap }),
    openHat({ pattern: '--x---x---x---x-', velocity: 90, ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

function reggaeton(options = {}) {
  const drumMap = options.drumMap || DEFAULT_DRUM_MAP
  
  const tracks = [
    kick({ pattern: 'x---x---x---x---', ...options, drumMap }),
    snare({ pattern: '------x-------x-', ...options, drumMap }),
    rimshot({ pattern: '--x-------x-----', velocity: 80, ...options, drumMap }),
    closedHat({ pattern: 'x-x-x-x-x-x-x-x-', velocity: 60, ...options, drumMap })
  ]
  
  return combineTracks(tracks)
}

// Utility to create custom drum maps
function createDrumMap(mapping) {
  return { ...DEFAULT_DRUM_MAP, ...mapping }
}

// ============================================================================
// MELODIC / HARMONIC HELPERS
// ============================================================================

/**
 * Create an arpeggiator that cycles through notes
 * @param {Array} notes - Array of MIDI note numbers
 * @param {string} patternStr - Pattern string (e.g., 'x-x-x-x-x-x-x-x-')
 * @param {Object} options - Options (direction, velocity, length, channel)
 * @returns {Function} Track function
 */
function arp(notes, patternStr, options = {}) {
  const direction = options.direction || 'up' // 'up', 'down', 'updown', 'random'
  const velocity = options.velocity !== undefined ? options.velocity : 100
  const length = options.length !== undefined ? options.length : 24
  const channel = options.channel !== undefined ? options.channel : 0
  
  let stepCount = 0
  
  return pattern(patternStr).play((state) => {
    const noteCount = notes.length
    let noteIndex = 0
    
    // Calculate which note to play based on direction
    switch (direction) {
      case 'up':
        noteIndex = stepCount % noteCount
        break
      case 'down':
        noteIndex = (noteCount - 1) - (stepCount % noteCount)
        break
      case 'updown':
        const cycle = (noteCount - 1) * 2
        const pos = stepCount % cycle
        noteIndex = pos < noteCount ? pos : cycle - pos
        break
      case 'random':
        noteIndex = Math.floor(Math.random() * noteCount)
        break
      default:
        noteIndex = stepCount % noteCount
    }
    
    stepCount++
    
    return note(notes[noteIndex], { velocity, length, channel })(state)
  })
}

/**
 * Create a chord progression that cycles through chords
 * @param {Array} chords - Array of chord arrays (e.g., [[60, 64, 67], [62, 65, 69]])
 * @param {string|Object} patternStrOrOptions - Pattern string for when chords play, or options object if pattern is omitted
 * @param {Object} options - Options (velocity, length, channel, spread, barsPerChord)
 * @returns {Function} Track function
 */
function chordProgression(chords, patternStrOrOptions, options = {}) {
  // Handle optional pattern parameter
  let patternStr = null
  let opts = options
  
  if (typeof patternStrOrOptions === 'string') {
    patternStr = patternStrOrOptions
  } else {
    // Pattern omitted, first param after chords is options
    opts = patternStrOrOptions || {}
  }
  
  const barsPerChord = opts.barsPerChord !== undefined ? opts.barsPerChord : 1
  
  // If pattern is provided, use it with smart triggering
  if (patternStr) {
    return pattern(patternStr).play((state) => {
      // Only trigger if we're at the start of a new chord section
      const chordIndex = Math.floor(state.bar / barsPerChord) % chords.length
      const barInChordSection = state.bar % barsPerChord
      
      // Only play on the first bar of each chord section
      if (barInChordSection === 0) {
        return chord(chords[chordIndex], opts)(state)
      }
      
      return { actions: [] }
    })
  }
  
  // No pattern provided - trigger only on chord changes
  return (state) => {
    const chordIndex = Math.floor(state.bar / barsPerChord) % chords.length
    const barInChordSection = state.bar % barsPerChord
    
    // Only trigger on first tick of first beat of first bar in chord section
    if (barInChordSection === 0 && state.beat === 0 && state.tick === 0) {
      return chord(chords[chordIndex], opts)(state)
    }
    
    return { actions: [] }
  }
}

// ============================================================================
// CC AUTOMATION HELPERS
// ============================================================================

/**
 * Send a CC message at specific positions in the bar
 * @param {number} controller - CC controller number
 * @param {number} value - CC value (0-127)
 * @param {string} patternStr - Pattern string for when to send CC
 * @param {Object} options - Options (channel)
 * @returns {Function} Track function
 */
function ccAt(controller, value, patternStr, options = {}) {
  const channel = options.channel !== undefined ? options.channel : 0
  
  return pattern(patternStr).play((state) => {
    return cc(controller, value, { channel })(state)
  })
}

/**
 * Smoothly ramp a CC value over time
 * @param {number} controller - CC controller number
 * @param {number} startValue - Starting value (0-127)
 * @param {number} endValue - Ending value (0-127)
 * @param {number} bars - Number of bars for the ramp
 * @param {Object} options - Options (channel, resolution, loop)
 * @returns {Function} Track function
 */
function ccRamp(controller, startValue, endValue, bars, options = {}) {
  const channel = options.channel !== undefined ? options.channel : 0
  const resolution = options.resolution !== undefined ? options.resolution : 24 // ticks between updates
  const loop = options.loop !== undefined ? options.loop : true
  
  return (state) => {
    const totalTicks = bars * 96
    const currentTick = loop ? (state.absoluteTick % totalTicks) : Math.min(state.absoluteTick, totalTicks - 1)
    
    // Only send CC at resolution intervals
    if (currentTick % resolution !== 0) {
      return { actions: [] }
    }
    
    const progress = currentTick / totalTicks
    const value = Math.floor(startValue + (endValue - startValue) * progress)
    
    return { actions: [cc(controller, value, { channel })(state)] }
  }
}

/**
 * Oscillate a CC value using an LFO
 * @param {number} controller - CC controller number
 * @param {number} rate - Rate in bars (e.g., 2 = one cycle every 2 bars)
 * @param {number} depth - Depth of modulation (0-127)
 * @param {Object} options - Options (channel, center, resolution, waveform)
 * @returns {Function} Track function
 */
function ccLFO(controller, rate, depth, options = {}) {
  const channel = options.channel !== undefined ? options.channel : 0
  const center = options.center !== undefined ? options.center : 64
  const resolution = options.resolution !== undefined ? options.resolution : 24
  const waveform = options.waveform || 'sine' // 'sine', 'triangle', 'square', 'saw'
  
  return (state) => {
    // Only send CC at resolution intervals
    if (state.absoluteTick % resolution !== 0) {
      return { actions: [] }
    }
    
    const totalTicks = rate * 96
    const phase = (state.absoluteTick % totalTicks) / totalTicks
    let modulation = 0
    
    switch (waveform) {
      case 'sine':
        modulation = Math.sin(phase * Math.PI * 2)
        break
      case 'triangle':
        modulation = phase < 0.5 ? (phase * 4 - 1) : (3 - phase * 4)
        break
      case 'square':
        modulation = phase < 0.5 ? 1 : -1
        break
      case 'saw':
        modulation = phase * 2 - 1
        break
      default:
        modulation = Math.sin(phase * Math.PI * 2)
    }
    
    const value = Math.floor(center + modulation * depth / 2)
    const clampedValue = Math.max(0, Math.min(127, value))
    
    return { actions: [cc(controller, clampedValue, { channel })(state)] }
  }
}

/**
 * Create a CC curve from an array of values
 * @param {number} controller -  CC controller number
 * @param {Array} values - Array of CC values to interpolate between
 * @param {number} bars - Total bars for the curve
 * @param {Object} options - Options (channel, resolution, loop)
 * @returns {Function} Track function
 */
function ccCurve(controller, values, bars, options = {}) {
  const channel = options.channel !== undefined ? options.channel : 0
  const resolution = options.resolution !== undefined ? options.resolution : 24
  const loop = options.loop !== undefined ? options.loop : true
  
  return (state) => {
    const totalTicks = bars * 96
    const currentTick = loop ? (state.absoluteTick % totalTicks) : Math.min(state.absoluteTick, totalTicks - 1)
    
    // Only send CC at resolution intervals
    if (currentTick % resolution !== 0) {
      return { actions: [] }
    }
    
    const progress = currentTick / totalTicks
    const position = progress * (values.length - 1)
    const index = Math.floor(position)
    const fraction = position - index
    
    // Interpolate between values
    const value1 = values[index]
    const value2 = values[Math.min(index + 1, values.length - 1)]
    const value = Math.floor(value1 + (value2 - value1) * fraction)
    
    return { actions: [cc(controller, value, { channel })(state)] }
  }
}

module.exports = {
  //  Individual drums
  kick,
  snare,
  clap,
  closedHat,
  openHat,
  crash,
  ride,
  rimshot,
  
  // Genre patterns
  fourOnFloor,
  house,
  techno,
  breakbeat,
  dnb,
  trap,
  reggaeton,
  
  // Utilities
  createDrumMap,
  DEFAULT_DRUM_MAP,
  combineTracks,
  
  // Melodic/Harmonic helpers
  arp,
  chordProgression,
  
  // CC Automation helpers
  ccAt,
  ccRamp,
  ccLFO,
  ccCurve
}
