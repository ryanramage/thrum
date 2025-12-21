const rc = require('rc')
const toMidi = require('./lib/toMidi')
const toCC = require('./lib/toCC')
const SongState = require('./r/songState')
const _tick = require('./r/tick')

const thrum = {}

// meter functions
thrum.bars = require('./r/bars')
thrum.length = require('./r/length')
thrum.repeat = require('./r/repeat')
thrum.lfo = require('./r/lfo')
thrum.subdivision = require('./r/subdivision')

// non-meter
thrum.pattern = require('./r/pattern')
thrum.play = require('./r/play')
thrum.strum = require('./r/strum')
thrum.transpose = require('./r/transpose')
thrum.Tonal = require('@tonaljs/tonal')
thrum.cc = require('./r/cc')
thrum.chord = require('./lib/chord')

// exporting more the manual setup
thrum.setup = (options) => rc('thrum', options)
thrum.connect = require('./lib/connect')

// the main entry into thrum for most people
thrum.tick = (tickExpression, options) => thrum.connect(thrum.setup(options), {toMidi, toCC}, tickExpression)

// Helper for testing - executes expressions and returns state
thrum.test = (expressions, options = {}) => {
  const spp = options.spp !== undefined ? options.spp : 0
  const userState = options.userState || {}
  const initialState = SongState.set({spp, userState, actions: []})
  const result = _tick(expressions, initialState)
  return {
    actions: result.actions,
    userState: result.userState,
    spp: result.spp,
    state: result
  }
}

// Helper for creating a song instance with internal state management
thrum.create = (options = {}) => {
  let currentState = SongState.set({
    spp: options.spp || 0,
    userState: options.userState || {},
    actions: []
  })

  return {
    tick: (expressions) => {
      currentState = _tick(expressions, currentState)
      return {
        actions: currentState.actions,
        userState: currentState.userState,
        spp: currentState.spp
      }
    },
    advance: (amount = 1) => {
      currentState = SongState.set({
        ...currentState,
        spp: currentState.spp + amount,
        actions: []
      })
    },
    reset: () => {
      currentState = SongState.set({
        spp: 0,
        userState: {},
        actions: []
      })
    },
    getState: () => currentState,
    setState: (newState) => {
      currentState = SongState.set(newState)
    }
  }
}

thrum.meter = (meter, noteLength) => {
  if (typeof meter === 'number') { // if user provides two strings instead of one array
    meter = [meter, noteLength]
  }

  // bind the meter functions
  const boundThrum = thrum
  boundThrum.bars = thrum.bars(meter)
  boundThrum.length = thrum.length(meter)
  boundThrum.repeat = thrum.repeat(meter)
  boundThrum.lfo = thrum.lfo(meter)
  boundThrum.subdivision = thrum.subdivision(meter)
  
  // Add shortcuts
  const shortcuts = require('./r/shortcuts')(meter)
  Object.assign(boundThrum, shortcuts)
  
  return boundThrum
}

module.exports = thrum
