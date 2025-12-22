// Main API exports for Thrum
const song = require('./lib/song')
const { pattern, euclidean } = require('./lib/pattern')
const midi = require('./lib/midi')
const structure = require('./lib/structure')
const { track, group, arrangement } = require('./lib/track')
const simulator = require('./lib/simulator')
const { State } = require('./lib/state')
const shortcuts = require('./lib/shortcuts')

// External dependencies
const Tonal = require('@tonaljs/tonal')
const JZZ = require('jzz')

// Tonal helper functions for more concise usage
const tonal = {
  // Get chord notes as MIDI numbers for a specific octave
  chord: (chordName, octave = 4) => {
    return Tonal.Chord.get(chordName).notes.map(note => Tonal.Note.midi(`${note}${octave}`))
  },
  
  // Get scale notes as MIDI numbers
  scale: (scaleName) => {
    return Tonal.Scale.get(scaleName).notes.map(note => Tonal.Note.midi(note))
  },
  
  // Convert note name to MIDI number
  midi: (noteName) => {
    return Tonal.Note.midi(noteName)
  },
  
  // Get chord with custom voicing (spread across octaves)
  voicing: (chordName, octaves) => {
    const notes = Tonal.Chord.get(chordName).notes
    return notes.map((note, i) => Tonal.Note.midi(`${note}${octaves[i] || octaves[0]}`))
  }
}

module.exports = {
  song,
  pattern,
  euclidean,
  midi,
  structure,
  track,
  group,
  arrangement,
  simulator,
  State,
  shortcuts,
  
  // External dependencies
  Tonal,
  JZZ,
  
  // Tonal helpers
  tonal,
  
  // Convenience exports from shortcuts for easier access
  arp: shortcuts.arp,
  chordProgression: shortcuts.chordProgression,
  bassline: shortcuts.bassline,
  ccAt: shortcuts.ccAt,
  ccRamp: shortcuts.ccRamp,
  ccLFO: shortcuts.ccLFO,
  ccCurve: shortcuts.ccCurve,
  
  // Drum shortcuts
  kick: shortcuts.kick,
  snare: shortcuts.snare,
  clap: shortcuts.clap,
  closedHat: shortcuts.closedHat,
  openHat: shortcuts.openHat,
  crash: shortcuts.crash,
  ride: shortcuts.ride,
  rimshot: shortcuts.rimshot,
  
  // Genre patterns
  fourOnFloor: shortcuts.fourOnFloor,
  house: shortcuts.house,
  techno: shortcuts.techno,
  breakbeat: shortcuts.breakbeat,
  dnb: shortcuts.dnb,
  trap: shortcuts.trap,
  reggaeton: shortcuts.reggaeton,
  
  // Utilities
  createDrumMap: shortcuts.createDrumMap,
  DEFAULT_DRUM_MAP: shortcuts.DEFAULT_DRUM_MAP,
  combineTracks: shortcuts.combineTracks
}
