const rc = require('rc')
const { List } = require('immutable')
const SongState = require('./r/SongState')
const tick = require('./r/tick')

exports.midi = require('./lib/midi')
exports.Tonal = require('@tonaljs/tonal')
exports.pattern = require('./r/pattern')
exports.play = require('./r/play')
exports.strumChord = require('./r/strumChord')
exports.transpose = require('./r/transpose')
exports.bars = require('./r/bars')

process.once('SIGUSR2', function () {
  console.log('SHUT IT DOWN')
  process.kill(process.pid, 'SIGUSR2');
});

exports.setup = (options) => rc('thrum', options)

exports.tick = (tickExpression) => {
  exports.connect(exports.setup(), {toMidi: exports.toMidi}, tickExpression)
}

exports.connect = (config, dispatchers, initialState, tickExpression) => {
  if (!tickExpression && typeof initialState === 'function') {
    tickExpression = initialState
    initialState = SongState.set({spp: 0, userState: {}, actions: []})
  }

  let lastState = initialState
  let futureActions = List([])

  let onClock = (spp, outputs) => {
    let thisState = SongState.set({...lastState, spp, actions: []})
    // clear any future actions. eg: scheduled midi off notes
    futureActions = exports.dispatchMemoActions(spp, futureActions, thisState, {midi: outputs})
    lastState = tickExpression(thisState)
    futureActions = futureActions.concat(exports.dispatch(dispatchers, spp, lastState.actions, {midi: outputs}))
  }

  let onMidi = (msg, outputs) => {
    // console.log('midi received', msg) // do another reducer
  }

  let onStop = (midi) => {
    // clear all notes
    futureActions.forEach(fa => {
      let msg = fa.msg
      if (!msg) return
      let output = msg.output || Object.keys(midi)[0]
      let channel = msg.channel || 0
      let port = midi[output]
      if (!port) return
      port.allNotesOff(channel)
      port.allSoundOff(channel)
    })
  }

  exports.midi(config, onClock, onMidi, onStop)
}

// returns a list of memo (future actions)
exports.dispatch = (dispatchers, spp, actions, context) => {
  return List([]).withMutations(futureActions => {
    if (!actions) actions = []
    actions.forEach(a => {
      let to = null
      let msg = null
      if (Array.isArray(a)) {
        to = a[0]
        msg = a[1]
      } else if (a.futureSpp) {
        let futureSpp = a.futureSpp
        delete a.futureSpp
        futureActions.concat({ spp: futureSpp, name: 'midiOn', msg: a })
      } else {
        to = 'toMidi'
        msg = a
      }
      if (!to) return
      let fn = dispatchers[to]
      if (!fn) return
      let fa = fn.call(null, spp, msg, context)
      if (fa) futureActions.concat(fa)
      return true
    })
    return futureActions
  })
}

exports.toMidi = (spp, msg, context) => {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  let velocity = msg.velocity || 127
  let length = msg.length || lengths['8n']
  if (typeof length === 'string') length = lengths[length]
  if (length < 1) length = 1
  port.noteOn(channel, msg.note, velocity) // request an acutal midi note
  let offSpp = spp + length
  return {spp: offSpp, name: 'midiOff', msg} // schedule a midi off note
}

exports.midiOff = (spp, msg, context) => {
  let midi = context.midi
  let output = msg.output || Object.keys(midi)[0]
  let channel = msg.channel || 0

  let port = midi[output]
  if (!port) return
  let velocity = msg.velocity || 127
  port.noteOff(channel, msg.note)
}


exports.dispatchMemoActions = (spp, futureActions, state, context) => {
  return futureActions.filter(action => {
    if (action.spp !== spp) return true
    if (action.name === 'midiOff') exports.midiOff(spp, action.msg, context)
    if (action.name === 'midiOn') {
      state.actions.push(action.msg)
    }
    return false // so filter works
  })
}
