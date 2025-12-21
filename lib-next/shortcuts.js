// Drum pattern shortcuts and common patterns
const { pattern } = require('./pattern')
const { note } = require('./midi')

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
    kick({ pattern: 'x-------x-------', ...options, drumMap }),
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

module.exports = {
  // Individual drums
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
  combineTracks
}
