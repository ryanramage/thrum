const rc = require('rc')
const { List } = require('immutable')
exports.midi = require('./lib/midi')
const lengths = require('./lib/lengths')
exports.ops = require('./lib/operators')
exports.patterns = require('./lib/patterns')
exports.clip = exports.patterns.clip

process.once('SIGUSR2', function () {
  console.log('SHUT IT DOWN')
  process.kill(process.pid, 'SIGUSR2');
});

exports.setup = (options) => rc('thrum', options)

exports.tick = (tick) => {
  if (Array.isArray(tick)) {
    const items = tick
    tick = function (input, actions) { items.forEach(item => item(input, actions)) }
  }

  exports.connect(exports.setup(), {toMidi: exports.toMidi}, tick)
}

exports.connect = (config, dispatchers, initialState, onClockFunction) => {
  if (!onClockFunction && typeof initialState === 'function') {
    onClockFunction = initialState
    initialState = {}
  }

  let lastState = initialState
  let futureActions = List([])

  let onClock = (spp, outputs) => {
    // clear any future actions. eg: scheduled midi off notes
    futureActions = exports.dispatchMemoActions(spp, futureActions, {midi: outputs})

    List([]).withMutations(userActions => { // userActions is an immutable list that will accumulate actions
      onClockFunction({state: lastState, spp}, userActions)
        futureActions = futureActions.concat(exports.dispatch(dispatchers, spp, userActions, {}, {midi: outputs}))
    })
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

exports.bars = ({state, spp}, baseTimeSignature, structureArray) => {
  let nextSPP = 0
  let [beatsPerBar, noteLength] = baseTimeSignature
  let byStartSPP = structureArray.map(part => {
    let [barCount, barFunc] = part
    nextSPP = nextSPP + (barCount * (beatsPerBar * lengths[noteLength]))
    let thisBarStartSPP = nextSPP - 1
    return [thisBarStartSPP, barFunc]
  })

  for (var i = 0; i < byStartSPP.length; i++) {
    let [thisBarStartSPP, barFunc] = byStartSPP[i]
    if (spp <= thisBarStartSPP) return barFunc({state, spp})
  }
  return {state, actions: []} // no bars. just default
}

// returns a list of memo (future actions)
exports.dispatch = (dispatchers, spp, actions, state, context) => {
  return List([]).withMutations(futureActions => {
    if (!actions) actions = []
    actions.forEach(a => {
      let to = null
      let msg = null
      if (Array.isArray(a)) {
        to = a[0]
        msg = a[1]
      } else {
        to = 'toMidi'
        msg = a
      }
      if (!to) return
      let fn = dispatchers[to]
      if (!fn) return
      let fa = fn.call(null, spp, msg, state, context)
      if (fa) futureActions.concat(fa)
      return true
    })
    return futureActions
  })
}

exports.toMidi = (spp, msg, state, context) => {
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

exports.onBeat = (spp, name) => {
  let base = lengths[name]
  return (spp % base === 0)
}

exports.dispatchMemoActions = (spp, futureActions, context) => {
  return futureActions.filter(action => {
    if (action.spp !== spp) return true
    if (action.name === 'midiOff') exports.midiOff(spp, action.msg, context)
    return false // so filter works
  })
}
